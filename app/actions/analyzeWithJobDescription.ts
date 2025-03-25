"use server";

import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { extractTextFromResume } from "./extractText";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function analyzeWithJobDescription(resumeFileName: string, jobId: string): Promise<string> {
  try {
    // Step 1: Retrieve the job description from Supabase
    const { data, error } = await supabase
      .from("job_descriptions")
      .select("description")
      .eq("id", jobId)
      .single();

    if (error || !data) {
      return "❌ Job description not found.";
    }

    const jobDescription = data.description;

    // Step 2: Extract text from resume
    const resumeText = await extractTextFromResume(resumeFileName);
    if (!resumeText || resumeText.startsWith("Error")) {
      return "❌ Failed to extract text from resume.";
    }

    // Step 3: Send extracted text to OpenAI for analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a professional resume analyst." },
        { role: "user", content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}` },
      ],
    });

    return response.choices[0]?.message?.content ?? "No feedback available.";
  } catch (error) {
    console.error("Error analyzing resume with job description:", error);
    return "❌ Error analyzing resume.";
  }
}
