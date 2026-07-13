"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchMyPermissions } from "@/apiServices/auth/permissionService";

interface PermissionContextType {
  permissions: string[];
  loading: boolean;
  refreshPermissions: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined,
);

export function PermissionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const [permissions, setPermissions] = useState<string[]>([]);

  const fetchPermissions = async () => {
    if (!token) {
      setPermissions([]);
      return;
    }
    try {
      const response = await fetchMyPermissions(token);
      if (!response || !response?.success || !response?.data) {
        console.warn("No permission data found.");
        return;
      }
      if (response?.success && response?.data) {
        setPermissions(response?.data?.permissions ?? []);
      } else {
        setPermissions([]);
      }
    } catch (error) {
      console.error("fetchPermissions Error:", error);
      setPermissions([]);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.permissions) {
      setPermissions(session?.user?.permissions);
    } else if (status === "unauthenticated") {
      setPermissions([]);
    }
  }, [status, session?.user?.permissions]);

  const loading = status === "loading";

  return (
    <PermissionContext.Provider
      value={{ permissions, loading, refreshPermissions: fetchPermissions }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissionContext() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error(
      "usePermissionContext must be used within a PermissionProvider",
    );
  }
  return context;
}
