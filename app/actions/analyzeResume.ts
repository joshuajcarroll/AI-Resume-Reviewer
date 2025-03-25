"use server";

import OpenAI from "openai";
import { extractTextFromResume } from "./extractText";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function analyzeResume(fileName: string, jobDescription: string): Promise<string> {
  try {
    // Step 1: Extract text using Textract
    const resumeText = await extractTextFromResume(fileName);
    if (!resumeText || resumeText.startsWith("Error")) {
      return "Failed to extract text from resume.";
    }

    // Step 2: Send extracted text to OpenAI for analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a professional resume analyst. Compare the resume against the provided job description and suggest improvements." },
        { role: "user", content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}` },
      ],
    });

    return response.choices[0]?.message?.content ?? "No feedback available.";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "Error analyzing resume.";
  }
}
