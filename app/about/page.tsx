"use client"; // Marking this as a client-side component

import React from "react";

const About = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">About Us</h1>
        <p className="text-gray-600 text-center mb-6">
          Welcome to the AI Resume Analyzer! Our platform leverages artificial intelligence to help job seekers improve their resumes by analyzing their documents against job descriptions.
        </p>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
            <p className="text-gray-700">
              Our mission is to empower job seekers by providing them with detailed insights into their resumes and how well they align with the job descriptions they are interested in. We aim to help candidates stand out in a competitive job market.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800">How It Works</h2>
            <p className="text-gray-700">
              Simply upload your resume, paste the job description you&apos;re interested in, and let our AI analyze both. You&apos;ll receive a score based on the relevance of your resume to the job description, along with key skills and suggestions for improvement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
            <p className="text-gray-700">
              We would love to hear from you! If you have any questions, feedback, or need support, please reach out to us at{" "}
              <a href="mailto:support@airesumeanalyzer.com" className="text-blue-600 hover:underline">
                support@airesumeanalyzer.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800">Meet the Team</h2>
            <p className="text-gray-700">
              Our team consists of passionate professionals in AI, web development, and design, all working towards making job applications easier and more effective for everyone.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
