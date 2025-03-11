import multer, { Multer } from "multer";
import AWS from "aws-sdk";
import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

// Extend Next.js API request type to include Multer's file
interface MulterRequest extends NextApiRequest {
  file?: Express.Multer.File;
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL as string, 
  process.env.SUPABASE_KEY as string
);

// Initialize AWS S3 client
const s3 = new AWS.S3({ region: "us-east-1" });
const upload: Multer = multer({ storage: multer.memoryStorage() });

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  upload.single("resume")(req as MulterRequest, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "Upload failed" });
    }

    const file = (req as MulterRequest).file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      const params: AWS.S3.PutObjectRequest = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: `resumes/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype, // ✅ Fixed typo
      };

      // Upload to S3
      const uploadResult = await s3.upload(params).promise();

      // Save the file info to Supabase
      const { error } = await supabase
        .from("resumes")
        .insert([
          {
            userEmail: email,
            fileUrl: uploadResult.Location,
          },
        ]);

      if (error) {
        throw error;
      }

      return res.status(200).json({
        message: "File uploaded successfully",
        url: uploadResult.Location,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}
