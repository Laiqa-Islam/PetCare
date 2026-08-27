export async function sendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) return { delivered: false, reason: "Email provider not configured" };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });
    return { delivered: response.ok, reason: response.ok ? undefined : await response.text() };
  } catch (error) {
    return { delivered: false, reason: error instanceof Error ? error.message : "Email delivery failed" };
  }
}
