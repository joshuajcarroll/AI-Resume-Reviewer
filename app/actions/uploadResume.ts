"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import prisma from "@/lib/prisma";
import { extractTextFromResume } from "@/lib/textract";
import { analyzeResume } from "@/lib/openai";

const s3 = new S3Client({ region: "us-east-1" });

interface UploadResponse {
  success?: boolean;
  error?: string;
  fileUrl?: string;
  feedback?: string;
}

export async function uploadResume(formData: FormData): Promise<UploadResponse> {
  const file = formData.get("resume") as File | null;
  if (!file) return { error: "No file provided" };

  try {
    const fileBuffer = await file.arrayBuffer();
    const fileName = `resumes/${file.name}`;

    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    }));

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    const extractedText = await extractTextFromResume(fileUrl);
    const feedback = await analyzeResume(extractedText);

    await prisma.resume.create({
      data: { userEmail: "test@example.com", fileUrl, extractedText, feedback },
    });

    return { success: true, fileUrl, feedback };
  } catch (error) {
    return { error: "Upload failed. Please try again later." };
  }
}
