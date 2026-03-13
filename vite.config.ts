import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { Resend } from "resend"

// Load .env manually for the dev middleware (Vite only exposes VITE_ vars to client)
import { config } from "dotenv"
config()

export default defineConfig({
  plugins: [
    react(),

    // ── Local dev API middleware — mirrors the Vercel serverless function ──
    {
      name: "api-dev-middleware",
      configureServer(server) {
        server.middlewares.use(
          "/api/subscribe",
          async (req: import("http").IncomingMessage, res: import("http").ServerResponse) => {
            if (req.method !== "POST") {
              res.writeHead(405, { "Content-Type": "application/json" })
              res.end(JSON.stringify({ error: "Method not allowed" }))
              return
            }

            let body = ""
            req.on("data", (chunk: Buffer) => { body += chunk.toString() })
            req.on("end", async () => {
              try {
                const { email } = JSON.parse(body) as { email?: string }

                if (!email || !email.includes("@") || !email.includes(".")) {
                  res.writeHead(400, { "Content-Type": "application/json" })
                  res.end(JSON.stringify({ error: "Invalid email" }))
                  return
                }

                const resend = new Resend(process.env.RESEND_API_KEY)
                const notifyEmail = process.env.NOTIFY_EMAIL
                const sheetsWebhook = process.env.SHEETS_WEBHOOK_URL
                const timestamp = new Date().toUTCString()

                // Notification to founder
                if (notifyEmail) {
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
                }

                // Confirmation to user
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

                // Google Sheets webhook (optional)
                if (sheetsWebhook) {
                  await fetch(sheetsWebhook, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, timestamp }),
                  })
                }

                res.writeHead(200, { "Content-Type": "application/json" })
                res.end(JSON.stringify({ ok: true }))
              } catch (err) {
                console.error("[api/subscribe]", err)
                res.writeHead(500, { "Content-Type": "application/json" })
                res.end(JSON.stringify({ error: "Internal error" }))
              }
            })
          }
        )
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
