// "use client";

// import { useSession, signOut } from "next-auth/react";
// import { useEffect, useRef } from "react";

// export default function SessionWatcher() {
//   const { data: session, status } = useSession();
//   const isSigningOutRef = useRef(false);

//   useEffect(() => {
//     if (status !== "authenticated" || isSigningOutRef.current) {
//       return;
//     }

//     const isAuthPage =
//       typeof window !== "undefined" &&
//       ["/login", "/register"].includes(window.location.pathname);

//     if (isAuthPage) {
//       return;
//     }

//     if (session?.error === "AccessTokenExpired") {
//       console.warn("Session expired. Logging out...");
//       isSigningOutRef.current = true;
//       signOut({ callbackUrl: "/login" });
//       return;
//     }

//     if (session?.user && !session?.accessToken) {
//       console.warn("No access token found. Logging out...");
//       isSigningOutRef.current = true;
//       signOut({ callbackUrl: "/login" });
//     }
//   }, [status, session?.error, session?.accessToken, session?.user]);

//   return null;
// }

"use client";

import { useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";

export default function SessionWatcher() {
  const { data: session } = useSession();
  const signingOutRef = useRef(false);

  useEffect(() => {
    if (signingOutRef.current) return;

    if (
      typeof window !== "undefined" &&
      ["/login", "/register"].includes(window.location.pathname)
    ) {
      return;
    }

    if (session?.error === "AccessTokenExpired") {
      signingOutRef.current = true;

      signOut({
        callbackUrl: "/login",
      });
    }
  }, [session?.error]);

  return null;
}
