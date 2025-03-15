"use client"; // Add this directive at the top

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Fetch uploaded resumes and job descriptions from Supabase or your backend
    const fetchData = async () => {
      try {
        const responseResumes = await fetch("/api/resumes"); // Adjust with your real endpoint
        const resumesData = await responseResumes.json();
        setResumes(resumesData);

        const responseJobDescriptions = await fetch("/api/jobDescriptions"); // Adjust with your real endpoint
        const jobDescriptionsData = await responseJobDescriptions.json();
        setJobDescriptions(jobDescriptionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleMatchResumeToJob = async (resumeText: string, jobDescription: string) => {
    try {
      const response = await fetch("/api/matchResumeToJob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
        }),
      });

      const data = await response.json();
      setFeedback(data.matchResult);
    } catch (error) {
      console.error("Error matching resume to job:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Dashboard</h1>

        {/* Uploaded Resumes Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Uploaded Resumes</h2>
          {resumes.length === 0 ? (
            <p className="text-gray-600">No resumes uploaded yet.</p>
          ) : (
            <ul className="space-y-4">
              {resumes.map((resume: any) => (
                <li key={resume.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="text-gray-700">{resume.fileUrl}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Job Descriptions Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Descriptions</h2>
          {jobDescriptions.length === 0 ? (
            <p className="text-gray-600">No job descriptions available.</p>
          ) : (
            <ul className="space-y-4">
              {jobDescriptions.map((job: any) => (
                <li key={job.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="text-gray-700">{job.description}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Resume to Job Match Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resume to Job Match</h2>
          {resumes.length > 0 && jobDescriptions.length > 0 ? (
            <div className="space-y-4">
              {resumes.map((resume: any) => (
                <div key={resume.id}>
                  {jobDescriptions.map((job: any) => (
                    <div key={job.id} className="bg-white p-4 rounded-lg shadow-sm mb-4">
                      <button
                        onClick={() =>
                          handleMatchResumeToJob(resume.fileUrl, job.description)
                        }
                        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                      >
                        Match Resume with Job
                      </button>
                      {feedback && (
                        <div className="mt-4">
                          <p className="font-semibold text-gray-800">Match Feedback:</p>
                          <p className="text-gray-600">{feedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Upload resumes and job descriptions to get started.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
