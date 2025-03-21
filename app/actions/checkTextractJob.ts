"use server";

import { TextractClient, GetDocumentTextDetectionCommand } from "@aws-sdk/client-textract";

const textract = new TextractClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function checkTextractJob(jobId: string) {
  try {
    const command = new GetDocumentTextDetectionCommand({ JobId: jobId });
    const response = await textract.send(command);

    return {
      status: response.JobStatus,
      extractedText: response.Blocks?.map((block) => block.Text).join(" ") || "",
    };
  } catch (error) {
    console.error("Textract Job Status Error:", error);
    return { status: "FAILED", extractedText: "" };
  }
}
