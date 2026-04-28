import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const BASE_SYSTEM = `You are Acely, a friendly and encouraging AI tutor on EdAccelerator — a selective school exam prep platform.

Keep responses short (2–4 sentences max). Use simple, clear language. Guide without giving away the answer. Be warm and encouraging. Only answer questions about the content on the current slide — politely decline anything unrelated.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json() as {
      messages: { role: "user" | "assistant"; content: string }[];
      context?: string;
    };

    const system = context ? `${BASE_SYSTEM}\n\nCurrent slide context:\n${context}` : BASE_SYSTEM;

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      system,
      messages,
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ content: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ content: "Sorry, I couldn't connect right now. Try again!" }, { status: 500 });
  }
}
