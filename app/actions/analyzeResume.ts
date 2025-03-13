"use server";

import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY! }));

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
