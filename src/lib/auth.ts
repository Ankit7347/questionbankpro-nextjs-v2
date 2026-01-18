// src/lib/auth.ts

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/mongoose/User.schema";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const email =
          typeof credentials.email === "string"
            ? credentials.email
            : null;

        const password =
          typeof credentials.password === "string"
            ? credentials.password
            : null;

        if (!email || !password) return null;

        await dbConnect();

        const user = await User.findOne({
          email,
          isDeleted: false,
        })
          .select(
            "uuid name email role uiMode passwordHash"
          )
          .lean();

        if (!user) return null;

        const valid = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!valid) return null;

        return {
          id: user.uuid,
          name: user.name,
          email: user.email,
          role: user.role,
          uiMode: user.uiMode,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
        token.uiMode = user.uiMode;
      }
      return token;
    },

    async session({ session, token }) {
      if (!token.id || !token.role || !token.uiMode) {
        throw new Error("Invalid session token");
      }

      session.user.id = token.id;
      session.user.name = token.name ?? "";
      session.user.role = token.role;
      session.user.uiMode = token.uiMode;

      return session;
    },
  },
});
