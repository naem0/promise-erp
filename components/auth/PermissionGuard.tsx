"use client";

import { usePermission } from "@/hooks/usePermission";
import { ReactNode } from "react";

interface PermissionGuardProps {
    children: ReactNode;
    requiredPermission: string | string[];
    fallback?: ReactNode;
    mode?: "any" | "all";
}

export default function PermissionGuard({
    children,
    requiredPermission,
    fallback = null,
    mode = "all",
}: PermissionGuardProps) {
    const { hasPermission, hasAnyPermission, loading } = usePermission();

    if (loading) {
        return null;
    }

    const hasAccess = Array.isArray(requiredPermission)
        ? mode === "any"
            ? hasAnyPermission(requiredPermission)
            : hasPermission(requiredPermission)
        : hasPermission(requiredPermission);

    if (hasAccess) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}
