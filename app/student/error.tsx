"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function StudentPortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Student Portal Error Boundary caught an exception:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-destructive/10 text-destructive p-4 rounded-full mb-4">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Student Portal Error
      </h2>
      <p className="text-muted-foreground max-w-md mb-6">
        An error occurred while loading this page. Please try refreshing or clicking below.
      </p>
      <Button onClick={() => reset()} variant="default">
        Try Again
      </Button>
    </div>
  );
}
