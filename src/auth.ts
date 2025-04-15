import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { checkValidityAPI } from "./libs/api/checkValidity";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // already validated when called in @libs/auth
        const { email, password } = credentials;
        // authjs middleware edge runtime bypass
        const response = await fetch(`${req.headers.get("origin")}/api/auth/checkValidity`, {
          method: "POST",
          headers: { "Content-Type": "application/json", cookie: req.headers.get("Cookie") || "" },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
          console.error("CheckValidity Unsuccessful", response);
          return null;
        }
        return ((await response.json()) as Awaited<ReturnType<typeof checkValidityAPI>>).data;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token as any;
      return session;
    },
  },
  pages: { signIn: "/login" },
});
