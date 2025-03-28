"use server";

import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase"; // Import Supabase client

export async function signUpUser(username: string, password: string) {
  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  // Check if the username already exists
  const { data: existingUser, error: userCheckError } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .single();

  if (userCheckError) {
    return { error: userCheckError.message || "Failed to check username." };
  }

  if (existingUser) {
    return { error: "Username is already taken." };
  }

  // Hash the password before storing it
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert the user into the "users" table in Supabase
  const { error } = await supabase.from("users").insert([
    { username, password: hashedPassword },
  ]);

  if (error) {
    return { error: error.message || "Signup failed. Please try again." };
  }

  return { success: "Signup successful! You can now log in." };
}
