"use client";

import { useState } from "react";
import { uploadResume } from "@/app/actions/uploadResume";
import { startTextractJob } from "../actions/startTextractJob";
import { checkTextractJob } from "@/app/actions/checkTextractJob";
import { uploadJobDescription } from "@/app/actions/uploadJobDescription";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResumeUploader() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setResume(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!resume || !jobDescription) {
      setProgress("Please upload a resume and enter a job description.");
      return;
    }

    setUploading(true);
    setProgress("Uploading resume...");

    const formData = new FormData();
    formData.append("resume", resume);

    // Upload resume
    const uploadResult = await uploadResume(formData);
    if (!uploadResult.success) {
      setProgress("❌ Upload failed.");
      setUploading(false);
      return;
    }

    setProgress("✅ Resume uploaded! Retrieving user ID...");

    // Get user ID from Supabase auth
    const { data: user, error: authError } = await supabase.auth.getUser();
    if (authError || !user?.user) {
      setProgress("❌ Failed to retrieve user.");
      setUploading(false);
      return;
    }

    const userId = user.user.id; // Ensure we have a valid user ID

    setProgress("📄 Saving job description...");

    // Upload job description separately
    const jobUploadResult = await uploadJobDescription(jobDescription, userId);
    if (!jobUploadResult.success) {
      setProgress("❌ Failed to save job description.");
      setUploading(false);
      return;
    }

    setProgress("✅ Job description saved! Starting text extraction...");

    // Start AWS Textract processing
    if (!uploadResult.fileName) {
      setProgress("❌ Upload failed. File name is missing.");
      setUploading(false);
      return;
    }

    const jobId = await startTextractJob(uploadResult.fileName);
    setProgress("📄 Processing document...");

    let jobStatus = "IN_PROGRESS";
    while (jobStatus === "IN_PROGRESS") {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const jobResult = await checkTextractJob(jobId);
      jobStatus = jobResult.status || "FAILED";

      if (jobStatus === "SUCCEEDED") {
        setExtractedText(jobResult.extractedText);
        setProgress("✅ Text extraction complete!");
      } else if (jobStatus === "FAILED") {
        setProgress("❌ Extraction failed.");
        break;
      }
    }

    setUploading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800">AI Resume Analyzer</h1>
        <p className="text-gray-500 text-center">Upload your resume and compare it with a job description.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Resume (PDF/DOCX)</label>
            <input 
              type="file" 
              accept=".pdf,.docx" 
              onChange={handleResumeChange} 
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Description</label>
            <textarea
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 h-32"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? "Processing..." : "Analyze Resume"}
          </button>
        </form>

        {progress && <p className="mt-4 text-center font-medium">{progress}</p>}

        {extractedText && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold">Extracted Text</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{extractedText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
