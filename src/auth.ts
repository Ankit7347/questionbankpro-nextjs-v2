import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import mongoose, { Model } from "mongoose";
import dbConnect from "@/lib/mongodb";

// Register schema
import "@/models/mongoose/User.schema";

interface DbUser {
  uuid: string;
  name: string;
  email: string;
  role: string;
  uiMode: "light" | "dark";
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

        const UserModel = mongoose.model<DbUser>(
          "User"
        ) as Model<DbUser>;

        const user = await UserModel.findOne({
          email,
          isDeleted: false,
        }).lean<DbUser | null>();

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
        token.role = user.role;
        token.uiMode = user.uiMode;
      }
      return token;
    },

    async session({ session, token }) {
      if (!token.id || !token.role || !token.uiMode) {
        // This should never happen for a valid, logged-in session
        throw new Error("Invalid session token");
      }

      session.user.id = token.id;
      session.user.role = token.role;
      session.user.uiMode = token.uiMode;

      return session;
    }

  },
});
