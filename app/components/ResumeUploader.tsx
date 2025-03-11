"use client";

import { useState } from "react";
import { uploadResume } from "@/app/actions/uploadResume";

export default function ResumeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    const result = await uploadResume(formData);
    if (result.success) setFeedback(result.feedback ?? "");
  }

  return (
    <div className="p-5">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={handleSubmit} className="bg-blue-500 text-white p-2">Upload</button>
      {feedback && <p className="mt-3">{feedback}</p>}
    </div>
  );
}
