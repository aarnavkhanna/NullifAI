import type { VercelRequest, VercelResponse } from "@vercel/node"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { email } = req.body as { email?: string }

  if (!email || !email.includes("@") || !email.includes(".")) {
    return res.status(400).json({ error: "Invalid email address" })
  }

  const notifyEmail = process.env.NOTIFY_EMAIL
  const sheetsWebhook = process.env.SHEETS_WEBHOOK_URL
  const timestamp = new Date().toUTCString()

  const errors: string[] = []

  // 1. Send founder notification email (works with restricted key)
  if (notifyEmail) {
    try {
      await resend.emails.send({
        from: "NullifAI Waitlist <onboarding@resend.dev>",
        to: notifyEmail,
        subject: `New waitlist signup: ${email}`,
        html: `
          <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0a0a0a;color:#fff;border-radius:12px;">
            <p style="margin:0 0 4px;font-size:12px;color:#555;letter-spacing:0.1em;text-transform:uppercase;">NullifAI · Waitlist</p>
            <h2 style="margin:0 0 24px;font-size:22px;font-weight:700;">New signup</h2>
            <div style="background:#141414;border:1px solid #222;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
              <p style="margin:0;font-size:16px;font-weight:600;color:#fff;">${email}</p>
            </div>
            <p style="margin:0;color:#444;font-size:12px;">${timestamp}</p>
          </div>
        `,
      })
    } catch (err) {
      console.error("Notification email error:", err)
      errors.push("notification")
    }
  }

  // 2. Send confirmation email to the user
  try {
    await resend.emails.send({
      from: "NullifAI <onboarding@resend.dev>",
      to: email,
      subject: "You're on the NullifAI waitlist",
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0a0a0a;color:#fff;border-radius:12px;">
          <p style="margin:0 0 4px;font-size:12px;color:#555;letter-spacing:0.1em;text-transform:uppercase;">NullifAI</p>
          <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;">You're on the list.</h2>
          <p style="margin:0 0 24px;color:#888;font-size:15px;line-height:1.6;">
            We're building synthetic AI communities that stress-test your product before you build it.
            You'll be among the first to access it.
          </p>
          <p style="margin:0;color:#444;font-size:12px;">— The NullifAI team</p>
        </div>
      `,
    })
  } catch (err) {
    console.error("Confirmation email error:", err)
    errors.push("confirmation")
  }

  // 3. Append to Google Sheet (optional — only runs if SHEETS_WEBHOOK_URL is set)
  if (sheetsWebhook) {
    try {
      await fetch(sheetsWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, timestamp }),
      })
    } catch (err) {
      console.error("Sheets webhook error:", err)
      errors.push("sheets")
    }
  }

  // Return success even if secondary steps failed
  // (user is signed up as long as at least one channel works)
  return res.status(200).json({ ok: true })
}
