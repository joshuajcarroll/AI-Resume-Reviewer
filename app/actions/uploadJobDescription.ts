"use server";

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function uploadJobDescription(jobDescription: string, userId: string) {
  try {
    // Insert job description into Supabase
    const { data, error } = await supabase
      .from("job_descriptions")
      .insert([{ description: jobDescription, user_id: userId }]);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, jobId: data[0].id};
  } catch (error) {
    console.error("Error uploading job description:", error);
    return { success: false, error: "❌ Failed to upload job description." };
  }
}
