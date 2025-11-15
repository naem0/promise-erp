// src/lib/auth.js

import { loginUser } from "@/apiServices/auth/RegisterUser";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, SessionStrategy  } from "next-auth";

export const authOptions:NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const data = await loginUser({
          email: credentials.email,
          password: credentials.password,
        });
        
        if (!data?.user || !data?.access_token) return null;

        return {
          id: data.user.id.toString(),
          name: data.user.name,
          email: data.user.email,
          roles: data.roles,
          permissions: Array.isArray(data.permissions) ? data.permissions : [],
          accessToken: data.access_token,
          expiresAt: data.expires_at,
        };
      },
    }),
  ],

  callbacks: {
    async jwt(params: any) {
      const { token, user } = params;
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.roles = user.roles;
        token.permissions = user.permissions;
        token.accessToken = user.accessToken;
        token.expiresAt = user.expiresAt;
      }

      const now = new Date();
      
      if (token.expiresAt && new Date(token.expiresAt) < now) {
        console.warn("Access token expired");
        return { ...token, accessToken: null };
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.roles = token.roles;
        session.user.permissions = token.permissions;
      }
      session.accessToken = token.accessToken;
      session.expiresAt = token.expiresAt;

      return session;
    },
  },


   // cookies: {
  //   sessionToken: {
  //     name: `__Secure-next-auth.session-token`,
  //     options: {
  //       httpOnly: true, 
  //       sameSite: "lax", 
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
  // },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" as SessionStrategy,},
};
