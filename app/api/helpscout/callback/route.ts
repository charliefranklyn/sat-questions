import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return new Response("No code returned from HelpScout", { status: 400 });
  }

  const res = await fetch("https://api.helpscout.net/v2/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.HELPSCOUT_CLIENT_ID!,
      client_secret: process.env.HELPSCOUT_CLIENT_SECRET!,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return new Response(JSON.stringify(data, null, 2), {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new Response(
    `<html><body style="font-family:monospace;padding:40px">
      <h2>✅ HelpScout connected!</h2>
      <p>Add these to your <code>.env.local</code>:</p>
      <pre style="background:#f1f5f9;padding:16px;border-radius:8px">
HELPSCOUT_ACCESS_TOKEN=${data.access_token}
HELPSCOUT_REFRESH_TOKEN=${data.refresh_token ?? "n/a"}
      </pre>
      <p style="color:#64748b">You can now close this tab and delete the <code>app/api/helpscout/</code> folder.</p>
    </body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
