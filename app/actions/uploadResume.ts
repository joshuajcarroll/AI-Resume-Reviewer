"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server"; // ✅ Import currentUser()

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadResume(formData: FormData) {
  // ✅ Get logged-in user from Clerk
  const user = await currentUser();
  if (!user) return { success: false, error: "❌ User not authenticated." };

  const userId = user.id; // ✅ Get the authenticated user's ID

  const file = formData.get("resume") as File;
  if (!file) return { success: false, error: "❌ No file uploaded." };

  const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: "❌ Only PDF or DOCX files are allowed." };
  }

  const fileExtension = file.name.split(".").pop();
  const fileName = `resumes/${userId}/${uuidv4()}.${fileExtension}`; // ✅ Associate file with userId

  try {
    // Convert File to Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: fileName,
        Body: fileBuffer,
        ContentType: file.type,
      })
    );

    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return { success: true, fileName, fileUrl, userId }; // ✅ Return userId for reference
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return { success: false, error: "❌ File upload failed. Please try again." };
  }
}
