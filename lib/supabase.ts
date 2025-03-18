import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getResumes(userId: string) {
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userId);

  if (error) console.error(error);
  return data;
}
