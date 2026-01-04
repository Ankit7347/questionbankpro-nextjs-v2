import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { User as AuthUser } from "next-auth";
import bcrypt from "bcryptjs";
import mongoose, { Model } from "mongoose";
import dbConnect from "@/lib/mongodb";

// Ensure schema is registered once
import "@/models/mongoose/User.schema";

/**
 * Minimal shape of User document we actually use.
 * (No DTOs, no shared UserType)
 */
interface DbUser {
  uuid: string;
  name: string;
  email: string;
  role: string;
  passwordHash: string;
  isDeleted: boolean;
}

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

      async authorize(
          credentials
        ): Promise<AuthUser | null> {
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

          const UserModel = mongoose.model<DbUser>("User");

          const user = await UserModel.findOne({
            email,
            isDeleted: false,
          }).lean<DbUser | null>();

          if (!user) return null;

          const isValid = await bcrypt.compare(
            password,
            user.passwordHash
          );

          if (!isValid) return null;

          return {
            id: user.uuid,
            name: user.name,
            email: user.email,
          };
        }

    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
