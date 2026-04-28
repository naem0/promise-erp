"use client";

import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil } from "lucide-react";
import PermissionGuard from "@/components/auth/PermissionGuard";
import Link from "next/link";

interface LeadHistoryActionProps {
    leadId: number;
    leadName: string;
}

const LeadHistoryAction = ({ leadId, leadName }: LeadHistoryActionProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Badge
                    variant="default"
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer select-none"
                >
                    Action
                </Badge>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="center">
                <PermissionGuard requiredPermission="create-lead-histories">
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/crm/leads-history/${leadId}/manage`}
                            className="flex items-center cursor-pointer w-full"
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Add Call Log
                        </Link>
                    </DropdownMenuItem>
                </PermissionGuard>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LeadHistoryAction;
