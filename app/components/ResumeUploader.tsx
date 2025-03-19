"use client";

import { useState } from "react";
import { uploadResume } from "@/app/actions/uploadResume";
import { analyzeResume } from "@/app/actions/analyzeResume";

export default function ResumeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !jobDescription) {
      setFeedback("Please upload a resume and enter a job description.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    const uploadResponse = await uploadResume(formData);

    if (!uploadResponse.success) {
      setFeedback(`Upload Error: ${uploadResponse.error}`);
      setLoading(false);
      return;
    }

    // Step 3: Analyze extracted text with OpenAI
    const fileName = uploadResponse.fileName ?? "";
    const analysis = await analyzeResume(fileName, jobDescription);
    setFeedback(analysis);
    setLoading(false);
  };

  return (
    <div>
      <h2>Upload Resume for Analysis</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
        <textarea
          placeholder="Paste job description here"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </form>
      {feedback && <div><strong>Feedback:</strong> <p>{feedback}</p></div>}
    </div>
  );
}
