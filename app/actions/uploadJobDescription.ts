"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Initialize Supabase client
const supabase = createServerComponentClient({ cookies });

async function getUserId() {
  // Await the cookies() to fetch the current session
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

export async function uploadJobDescription(jobDescription: string) {
  // Get the userId from the authentication context
  const userId = await getUserId();

  // Check if the user is authenticated
  if (!userId) {
    return { success: false, error: "❌ Unauthorized: No user found." };
  }

  try {
    // Insert job description into Supabase
    const { data, error } = await supabase
      .from("job_descriptions")
      .insert([{ description: jobDescription, user_id: userId }]);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, jobId: data[0].id };
  } catch (error) {
    console.error("Error uploading job description:", error);
    return { success: false, error: "❌ Failed to upload job description." };
  }
}
