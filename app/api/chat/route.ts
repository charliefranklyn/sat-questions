import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM = `You are an expert SAT tutor helping Charlie, a high school student.

Charlie's context:
- Starting score: 1050
- Current score: ~1180
- Target score: 1400
- Week 6 of a 14-week study plan

Your role:
- Answer questions about SAT Math (Algebra, Advanced Math, Problem-Solving, Geometry) and SAT Reading & Writing (Craft & Structure, Information & Ideas, Conventions, Expression of Ideas)
- Give clear, step-by-step explanations
- Use concrete examples to illustrate concepts
- Keep responses focused and concise — students lose focus with long walls of text
- When showing equations or steps, number them clearly
- If a student makes an error, explain exactly why it's wrong before showing the correct approach
- Encourage and be positive, but stay focused on the content`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: SYSTEM,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
  });

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
