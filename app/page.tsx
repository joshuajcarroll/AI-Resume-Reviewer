"use client";

import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState<File | null>(null);
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
    } catch (error) {
      setMessage("⚠️ An error occurred. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
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
            {uploading ? "Uploading..." : "Analyze Resume"}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center font-medium ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
