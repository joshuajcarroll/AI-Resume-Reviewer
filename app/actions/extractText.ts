"use server";

import { TextractClient, StartDocumentTextDetectionCommand, GetDocumentTextDetectionCommand } from "@aws-sdk/client-textract";
import { currentUser } from "@clerk/nextjs/server"; // ✅ Get logged-in user

const textract = new TextractClient({ region: process.env.AWS_REGION! });

export async function extractTextFromResume(fileName: string): Promise<string> {
  try {
    // ✅ Get logged-in user
    const user = await currentUser();
    if (!user) throw new Error("❌ User not authenticated.");

    const userId = user.id;
    const filePath = `resumes/${userId}/${fileName}`; // ✅ Ensure correct file path

    const params = {
      DocumentLocation: {
        S3Object: {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Name: filePath, // ✅ Use the user-specific file path
        },
      },
    };

    const startResponse = await textract.send(new StartDocumentTextDetectionCommand(params));

    const jobId = startResponse.JobId;
    if (!jobId) throw new Error("Failed to start Textract job.");

    // Wait for job completion (polling)
    let jobStatus = "IN_PROGRESS";
    let extractedText = "";

    while (jobStatus === "IN_PROGRESS") {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before polling again
      const result = await textract.send(new GetDocumentTextDetectionCommand({ JobId: jobId }));
      jobStatus = result.JobStatus!;

      if (jobStatus === "SUCCEEDED") {
        extractedText = result.Blocks?.filter((block) => block.BlockType === "LINE")
          .map((block) => block.Text)
          .join("\n") || "";
      }
    }

    if (!extractedText) throw new Error("Failed to extract text.");
    return extractedText;
  } catch (error) {
    console.error("Textract Error:", error);
    return "Error extracting text from resume.";
  }
}
