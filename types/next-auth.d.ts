// types/next-auth.d.ts 
import "next-auth"
import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image: string
      roles: string[];
      permissions?: string[];
    } & DefaultSession["user"]
    accessToken: string
    expiresAt: string
    error?: string
  }

  interface User {
    id: string
    name: string
    email: string
    image: string
    roles: string[];
    permissions?: string[];
    accessToken: string
    expiresAt: string
    error?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name: string
    email: string
    image: string
    roles: string[];
    permissions?: string[];
    accessToken: string
    expiresAt: string
    error?: string
  }
}