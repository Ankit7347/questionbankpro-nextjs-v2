// src/types/next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    uiMode?: "light" | "dark";
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      uiMode: "light" | "dark";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    uiMode: "light" | "dark";
  }
}
