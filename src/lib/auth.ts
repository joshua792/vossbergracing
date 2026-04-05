import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import {
  users as usersTable,
  accounts,
  verificationTokens,
} from "@/lib/db/schema";
import { Resend as ResendClient } from "resend";

const allowedEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable,
    accountsTable: accounts,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "Reese Frankenfield <noreply@reesefrankenfield.com>",
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const verifyUrl = new URL(url);
        const baseUrl = `${verifyUrl.protocol}//${verifyUrl.host}`;
        const intermediateUrl = `${baseUrl}/auth/verify?${new URLSearchParams({
          callback: url,
          email,
        })}`;

        const resend = new ResendClient(provider.apiKey);
        await resend.emails.send({
          from: provider.from as string,
          to: email,
          subject: "Sign in to Reese Frankenfield Admin",
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color: #26509d;">Sign in to RF11 Admin</h2>
              <p>Click the button below to sign in.</p>
              <p>
                <a href="${intermediateUrl}"
                   style="display: inline-block; background: #f49b11; color: white;
                          padding: 12px 24px; border-radius: 8px; text-decoration: none;
                          font-weight: 600;">
                  Sign In
                </a>
              </p>
              <p style="color: #666; font-size: 14px;">
                If you didn&apos;t request this email, you can safely ignore it.
              </p>
            </div>
          `,
        });
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 4 * 60 * 60 },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      return allowedEmails.includes(user.email.toLowerCase());
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
