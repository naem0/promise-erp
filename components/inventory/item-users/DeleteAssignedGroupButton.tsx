"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { deleteUserProductGroups } from "@/apiServices/inventoryItemUsersService";

interface DeleteAssignedGroupButtonProps {
    userId: number;
    groupId: number;
    className?: string;
}

type ApiResponse = {
    success: boolean;
    message: string;
    code: number;
    data?: unknown;
};

const DeleteAssignedGroupButton = ({ userId, groupId, className }: DeleteAssignedGroupButtonProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            try {
                const res: ApiResponse = await deleteUserProductGroups(userId, [groupId]);

                if (res.success) {
                    toast.success(res.message || "Product group assignments deleted successfully");
                    router.refresh();
                } else {
                    toast.error(res.message || "Delete failed");
                }
            } catch (error: unknown) {
                console.error("Product group assignments delete failed:", error);
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("An unknown error occurred while deleting group assignment");
                }
            }
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    className={`text-red-600 hover:text-red-800 flex items-center justify-start px-2 cursor-pointer ${className || ""}`}
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Spinner className="h-4 w-4 mr-2" /> Deleting...
                        </>
                    ) : (
                        <>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Group
                        </>
                    )}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. All product assignments belonging to this group will be permanently deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending} className="cursor-pointer">
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction asChild className="bg-red-600 hover:bg-red-700 text-white border-0">
                        <Button
                            onClick={handleDelete}
                            variant="destructive"
                            disabled={isPending}
                            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...
                                </>
                            ) : (
                                "Yes, Delete"
                            )}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteAssignedGroupButton;
