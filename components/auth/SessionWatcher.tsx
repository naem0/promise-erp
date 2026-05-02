"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

/**
 * SessionWatcher handles automatic logout when the session expires
 * or when the access token becomes invalid.
 */
export default function SessionWatcher() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // 1. Handle explicit session error (from JWT callback)
    if (session?.error === "AccessTokenExpired") {
      console.warn("Session expired. Logging out...");
      signOut({ callbackUrl: "/login" });
      return;
    }

    // 2. Handle missing access token when authenticated
    if (status === "authenticated" && !session?.accessToken) {
        console.warn("No access token found. Logging out...");
        signOut({ callbackUrl: "/login" });
    }
    
  }, [session, status]);

  return null;
}
