"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase"; // Import Supabase client
//import { useRouter } from "next/router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  //const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch user by username from Supabase
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("username, password")
        .eq("username", username)
        .single();

      if (fetchError || !user) {
        setError("Invalid username or password.");
        return;
      }

      // Validate password (you should hash and compare server-side)
      // For now, assuming plain-text comparison
      if (password !== user.password) {
        setError("Invalid username or password.");
        return;
      }

      // On successful login
      // router.push("/dashboard"); // Redirect user
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h1>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
