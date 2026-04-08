import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

export async function notifySubscribers(subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const allSubs = await db
    .select({ email: subscribers.email })
    .from(subscribers)
    .where(eq(subscribers.confirmed, true));

  if (allSubs.length === 0) return;

  const resend = new Resend(apiKey);
  const emails = allSubs.map((s) => s.email);

  // Resend supports batch sending up to 100 recipients
  // For a small list, send individually to avoid exposing addresses
  for (const email of emails) {
    try {
      await resend.emails.send({
        from: "Reese Frankenfield <noreply@reesefrankenfield.com>",
        to: email,
        subject,
        html,
      });
    } catch (err) {
      console.error(`[notify] Failed to send to ${email}:`, err);
    }
  }
}

export function buildBlogPostEmail(title: string, slug: string, excerpt: string, featuredImage: string | null) {
  return `
    <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
      <div style="background: #0a1628; padding: 24px; border-radius: 12px;">
        <h2 style="color: #f49b11; margin: 0 0 4px;">RF11 New Blog Post</h2>
        ${featuredImage ? `<img src="${featuredImage}" alt="${title}" style="width: 100%; border-radius: 8px; margin: 16px 0;" />` : ""}
        <h3 style="color: #ffffff; margin: 16px 0 8px; font-size: 18px;">${title}</h3>
        <p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 0 0 16px;">${excerpt}</p>
        <p style="text-align: center; margin: 16px 0 0;">
          <a href="https://reesefrankenfield.com/blog/${slug}" style="color: #0a1628; background: #f49b11; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Read More</a>
        </p>
      </div>
    </div>
  `;
}

export function buildResultEmail(track: string, qualifying: number, race1: number, race2: number | null, championship: number) {
  return `
    <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
      <div style="background: #0a1628; padding: 24px; border-radius: 12px;">
        <h2 style="color: #f49b11; margin: 0 0 4px;">RF11 Race Update</h2>
        <p style="color: #9ca3af; margin: 0 0 16px; font-size: 14px;">${track}</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #9ca3af; font-size: 12px; text-transform: uppercase; padding: 8px 12px;">Qualifying</td>
            <td style="color: #26509d; font-weight: bold; font-size: 18px; padding: 8px 12px; text-align: right;">P${qualifying}</td>
          </tr>
          <tr>
            <td style="color: #9ca3af; font-size: 12px; text-transform: uppercase; padding: 8px 12px;">Race 1</td>
            <td style="color: #f49b11; font-weight: bold; font-size: 18px; padding: 8px 12px; text-align: right;">P${race1}</td>
          </tr>
          ${race2 ? `<tr>
            <td style="color: #9ca3af; font-size: 12px; text-transform: uppercase; padding: 8px 12px;">Race 2</td>
            <td style="color: #f49b11; font-weight: bold; font-size: 18px; padding: 8px 12px; text-align: right;">P${race2}</td>
          </tr>` : ""}
          <tr style="border-top: 1px solid #1e293b;">
            <td style="color: #9ca3af; font-size: 12px; text-transform: uppercase; padding: 8px 12px;">Championship</td>
            <td style="color: #ffffff; font-weight: bold; font-size: 18px; padding: 8px 12px; text-align: right;">P${championship}</td>
          </tr>
        </table>
        <p style="color: #6b7280; font-size: 12px; margin: 16px 0 0; text-align: center;">
          <a href="https://reesefrankenfield.com/results" style="color: #f49b11;">View all results</a>
        </p>
      </div>
    </div>
  `;
}
