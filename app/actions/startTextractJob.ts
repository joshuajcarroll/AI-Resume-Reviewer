"use server";

import { TextractClient, StartDocumentTextDetectionCommand } from "@aws-sdk/client-textract";

const textract = new TextractClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function startTextractJob(s3FileUrl: string): Promise<string> {
  try {
    const command = new StartDocumentTextDetectionCommand({
      DocumentLocation: { S3Object: { Bucket: process.env.AWS_S3_BUCKET_NAME!, Name: s3FileUrl } },
    });

    const response = await textract.send(command);
    
    if (!response.JobId) throw new Error("Failed to start Textract job.");

    return response.JobId;
  } catch (error) {
    console.error("Textract Job Start Error:", error);
    throw new Error("Failed to start text extraction.");
  }
}
