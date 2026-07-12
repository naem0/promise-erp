// src/lib/auth.ts

import { loginUser } from "@/apiServices/auth/RegisterUser";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, SessionStrategy } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email_or_phone: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email_or_phone || !credentials?.password) {
          return null;
        }

        const data = await loginUser({
          email_or_phone: credentials.email_or_phone,
          password: credentials.password,
        });

        if (!data?.user || !data?.access_token) return null;

        return {
          id: data.user.id.toString(),
          name: data.user.name,
          email: data.user.email,
          image: data.user.profile_image,
          roles: data.user.roles || [],
          // permissions: Array.isArray(data.permissions) ? data.permissions : [],
          accessToken: data.access_token,
          expiresAt: data.expires_at,
        };
      },
    }),
  ],

  callbacks: {
    async jwt(params: any) {
      const { token, user, trigger, session } = params;
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.roles = user.roles;
        token.accessToken = user.accessToken;
        token.expiresAt = user.expiresAt;
      }

      if (trigger === "update" && session?.image) {
        token.image = session.image;
      }

      const expiresAt = token.expiresAt
        ? new Date(token.expiresAt).getTime()
        : null;

      if (expiresAt && Date.now() >= expiresAt) {
        console.warn("Access token expired");

        return {
          ...token,
          accessToken: undefined,
          error: "AccessTokenExpired",
        };
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.roles = token.roles;
      }
      session.accessToken = token.accessToken;
      session.expiresAt = token.expiresAt;
      session.error = token.error;

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
  session: { strategy: "jwt" as SessionStrategy },
};
