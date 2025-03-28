"use server";

import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase"; // Import Supabase client

export async function signUpUser(username: string, password: string) {
  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  // Check if the username already exists
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("username")
    .eq("username", username)
    .maybeSingle(); // Use .maybeSingle() instead of .single()

  if (fetchError) {
    console.error("Error fetching existing user:", fetchError); // Log the detailed error
    return { error: "Error checking username availability." };
  }

  if (existingUser) {
    return { error: "Username is already taken. Please choose another one." };
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


export async function signInUser(username: string, password: string) {
  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  // Fetch the user from the "users" table
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("username, password")
    .eq("username", username)
    .maybeSingle(); // Use maybeSingle() to handle no rows found

  if (fetchError) {
    console.error("Error fetching user:", fetchError); // Log the error
    return { error: "Error fetching user." };
  }

  if (!user) {
    return { error: "User not found. Please check your username." };
  }

  // Compare the entered password with the hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: "Invalid password. Please try again." };
  }

  // Authentication successful
  return { success: "Login successful!" };
}

