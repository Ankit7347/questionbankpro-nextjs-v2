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
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day (in seconds)
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          return null;
        }

        await dbConnect();

        const user = await User.findOne({
          email: credentials.email,
          isDeleted: false,
        })
          .select(
            "uuid name email role uiMode passwordHash subExamId courseName"
          )
          .lean();

        if (!user) {
          console.warn("User not found:", credentials.email);
          return null;
        }

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!valid) {
          console.warn("Invalid password for:", credentials.email);
          return null;
        }

        return {
          id: user.uuid,
          name: user.name,
          email: user.email,
          role: user.role,
          uiMode: user.uiMode,
          subExamId: Buffer.isBuffer(user.subExamId)
            ? user.subExamId.toString("hex")
            : user.subExamId?.toString(),
          courseName: user.courseName,
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
        token.subExamId = user.subExamId;
        token.courseName = user.courseName;
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
      session.user.subExamId = token.subExamId;
      session.user.courseName = token.courseName;

      return session;
    },
  },
});
