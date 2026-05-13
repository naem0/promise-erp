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
 
interface LeadActivityActionProps {
    leadId: number;
    leadName: string;
}
 
const LeadActivityAction = ({ leadId, leadName }: LeadActivityActionProps) => {
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
                <PermissionGuard requiredPermission="create-lead-activities">
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/crm/lead-activities/${leadId}/manage`}
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
 
export default LeadActivityAction;
