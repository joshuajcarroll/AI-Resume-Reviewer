"use client";

import { useRouter } from "next/navigation";
import { SignIn, useClerk } from "@clerk/nextjs";

const Login = () => {
  const router = useRouter();
  const { user } = useClerk();

  if (user) {
    router.push("/"); // Redirect if already logged in
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h1>
        <SignIn redirectUrl="/" />
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
