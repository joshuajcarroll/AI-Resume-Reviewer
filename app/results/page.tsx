'use client'

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Define an interface for the analysis data structure
interface ResumeAnalysisData {
  score: number;
  keySkills: string[];
  recommendations: string[];
}

const ResultsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeAnalysis = searchParams.get("resumeAnalysis"); // Assumes resume analysis data is passed via query params

  const [analysisData, setAnalysisData] = useState<ResumeAnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching results from an API based on the query param
  useEffect(() => {
    if (resumeAnalysis) {
      setLoading(true);
      setError(null);
      // In a real scenario, you would fetch the analysis result based on an ID or other identifier.
      // Example API call:
      // fetch(`/api/results?analysisId=${resumeAnalysis}`)
      //   .then(response => response.json())
      //   .then(data => {
      //     setAnalysisData(data);
      //     setLoading(false);
      //   })
      //   .catch(err => {
      //     setError("Failed to fetch analysis data.");
      //     setLoading(false);
      //   });

      // Mock result for demonstration purposes:
      setTimeout(() => {
        setAnalysisData({
          score: 85,
          keySkills: ["JavaScript", "React", "Node.js", "CSS"],
          recommendations: [
            "Add more relevant experience related to front-end development.",
            "Consider updating skills section with React Hooks expertise."
          ]
        });
        setLoading(false);
      }, 2000); // Mock API delay
    }
  }, [resumeAnalysis]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold text-center text-gray-800">Analyzing Resume...</h1>
          <p className="text-gray-500 text-center">Please wait while we analyze your resume and job description.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold text-center text-gray-800">Error</h1>
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800">Resume Analysis Results</h1>
        <p className="text-gray-500 text-center mb-6">Here are the detailed results of your resume analysis:</p>

        {analysisData && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Score: {analysisData.score}%</h2>
              <p className="text-gray-500">This score represents how well your resume aligns with the job description provided.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">Key Skills Matched:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {analysisData.keySkills.map((skill, index) => (
                  <li key={index} className="text-gray-700">{skill}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">Recommendations:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {analysisData.recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-700">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")} // Redirect back to home page or reset page
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;