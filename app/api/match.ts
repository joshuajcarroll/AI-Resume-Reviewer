import { NextRequest, NextResponse } from "next/server";
import { matchResumeToJob } from "@/lib/openai"; // Adjust import path if needed

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse JSON from request body
    const { resumeText, jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Both resumeText and jobDescription are required." },
        { status: 400 }
      );
    }

    const matchResult = await matchResumeToJob(resumeText, jobDescription);
    
    return NextResponse.json({ matchResult }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
