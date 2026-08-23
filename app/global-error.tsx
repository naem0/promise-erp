"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import "@/app/globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught an exception:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
        <div className="bg-destructive/10 text-destructive p-4 rounded-full mb-4">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Critical System Error</h2>
        <p className="text-muted-foreground max-w-md mb-6 text-center">
          An unexpected application error occurred. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
