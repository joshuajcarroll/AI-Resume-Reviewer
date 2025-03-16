"use server";

import Configuration, { OpenAI } from "openai";
import ChatCompletionRequestMessage from "openai";

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY! });
const openai = new OpenAI(configuration);

export async function analyzeResume(text: string): Promise<string> {
  const messages: ChatCompletionRequestMessage[] = [
    { role: "system", content: "Analyze this resume and suggest improvements." },
    { role: "user", content: text },
  ];

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages,
  });

  return response.data.choices[0]?.message?.content ?? "No feedback available.";
}
