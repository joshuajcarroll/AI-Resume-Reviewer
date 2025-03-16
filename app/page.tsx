"use client";

//import { useState } from "react";
import ResumeUploader from "./components/ResumeUploader";

export default function Home() {
  /*const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setResume(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!resume || !jobDescription) {
      setMessage("Please upload a resume and enter a job description.");
      return;
    }

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Upload successful!");
      } else {
        setMessage(data.error || "❌ Upload failed. Please try again.");
      }
    } catch {
      setMessage("⚠️ An error occurred. Please try again.");
    } finally {
      setUploading(false);
    }
  };*/

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <ResumeUploader />
    </main>
  );
}
