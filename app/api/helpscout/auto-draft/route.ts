import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const HELPSCOUT_TOKEN = process.env.HELPSCOUT_ACCESS_TOKEN!;
const MAILBOX_ID = 318302;

const STYLE_PROMPT = `You are drafting email replies on behalf of Charlie from EdAccelerator / Select Entry Accelerator — a tutoring company that helps students prepare for selective school entry exams.

Charlie's email style (analysed from 74 real replies):

STRUCTURE:
1. "Hi [First Name]," — always first name, always "Hi", never "Hello" or "Dear"
2. Opening line: "I hope you're well, and thanks for [reaching out / your message / letting us know]." — combine the warmth and acknowledgement in one sentence
3. For problems/refunds/complaints: briefly acknowledge → immediately state the action already taken ("I've gone ahead and..." or "I've now...")
4. One sentence for next steps or a soft CTA if needed
5. Close with: "Warm regards," on one line, then "Charlie" on the next line

TONE:
- Warm but concise — like a friendly founder, not a corporate support agent
- Never pad. Average reply is 60–90 words.
- Never use bullet points or numbered lists
- Exclamation marks: max 1 per email, usually 0
- Contractions used sparingly

COMMON PHRASES TO USE:
- "I've gone ahead and..." / "I've now gone ahead and..."
- "Please feel free to let me know" (for CTA)
- "No worries at all" (for simple acknowledgements)
- "So sorry for the [issue/inconvenience]" (one apology, then action)

Write ONLY the email body. No subject line. No preamble. No commentary after.`;

async function hs(path: string, options: RequestInit = {}) {
  const res = await fetch(`https://api.helpscout.net/v2${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${HELPSCOUT_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok && res.status !== 201) {
    const text = await res.text();
    throw new Error(`HelpScout ${res.status}: ${text}`);
  }
  if (res.status === 201) return null;
  return res.json();
}

async function getCustomerWaitingConversations() {
  const data = await hs(
    `/conversations?mailbox=${MAILBOX_ID}&status=active&pageSize=50`
  );
  const convos = data?._embedded?.conversations ?? [];
  // Only conversations where customer is waiting (no staff reply yet or customer replied last)
  return convos.filter(
    (c: { customerWaitingSince?: { time?: string } }) =>
      c.customerWaitingSince?.time
  );
}

async function getLastCustomerMessage(conversationId: number): Promise<string | null> {
  const data = await hs(`/conversations/${conversationId}/threads`);
  const threads = data?._embedded?.threads ?? [];

  // Find the most recent customer message
  const customerThreads = threads
    .filter(
      (t: { type: string; state?: string; createdBy?: { type: string } }) =>
        t.type === "customer" && t.state === "published"
    )
    .sort(
      (
        a: { createdAt: string },
        b: { createdAt: string }
      ) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  if (!customerThreads.length) return null;

  // Strip HTML tags from body
  const body = customerThreads[0].body ?? "";
  return body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function hasDraftAlready(conversationId: number): Promise<boolean> {
  const data = await hs(`/conversations/${conversationId}/threads`);
  const threads = data?._embedded?.threads ?? [];
  // HelpScout returns draft reply threads with type "message", not "reply"
  return threads.some(
    (t: { type: string; state?: string }) =>
      t.state === "draft"
  );
}

async function generateDraft(
  customerName: string,
  subject: string,
  customerMessage: string
): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    system: [{ type: "text", text: STYLE_PROMPT, cache_control: { type: "ephemeral" } }],
    messages: [
      {
        role: "user",
        content: `Customer name: ${customerName}
Subject: ${subject}
Their message:
${customerMessage}

Draft a reply in Charlie's voice.`,
      },
    ],
  });
  return message.content[0].type === "text" ? message.content[0].text : "";
}

async function pushDraft(
  conversationId: number,
  customerEmail: string,
  draftText: string
) {
  await hs(`/conversations/${conversationId}/reply`, {
    method: "POST",
    body: JSON.stringify({
      text: draftText,
      customer: { email: customerEmail },
      draft: true,
    }),
  });
}

export async function POST() {
  const results: {
    id: number;
    number: number;
    subject: string;
    status: "drafted" | "skipped" | "error";
    reason?: string;
  }[] = [];

  try {
    const conversations = await getCustomerWaitingConversations();

    for (const convo of conversations) {
      const { id, number, subject } = convo;
      const customerEmail =
        convo.primaryCustomer?.email ?? convo.createdBy?.email ?? "";
      const customerFirstName =
        convo.primaryCustomer?.first ?? convo.createdBy?.first ?? "there";

      try {
        // Skip if draft already exists
        const alreadyDrafted = await hasDraftAlready(id);
        if (alreadyDrafted) {
          results.push({ id, number, subject, status: "skipped", reason: "draft already exists" });
          continue;
        }

        const customerMessage = await getLastCustomerMessage(id);
        if (!customerMessage || customerMessage.length < 10) {
          results.push({ id, number, subject, status: "skipped", reason: "no customer message found" });
          continue;
        }

        const draft = await generateDraft(customerFirstName, subject, customerMessage);
        await pushDraft(id, customerEmail, draft);

        results.push({ id, number, subject, status: "drafted" });
      } catch (err) {
        results.push({
          id,
          number,
          subject,
          status: "error",
          reason: String(err),
        });
      }
    }

    return Response.json({
      total: conversations.length,
      drafted: results.filter((r) => r.status === "drafted").length,
      skipped: results.filter((r) => r.status === "skipped").length,
      errors: results.filter((r) => r.status === "error").length,
      results,
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
