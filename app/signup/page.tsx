"use client";

import { SignUp } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

const Signup = () => {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/login"); // Redirect to login after signing up
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h1>
        <SignUp routing="path" path="/sign-up" />
      </div>
    </div>
  );
};

export default Signup;
