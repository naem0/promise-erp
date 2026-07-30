"use client";

import { useTransition } from "react";
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
import { deleteCrmStatus } from "@/apiServices/crmStatusesService";

interface DeleteLeadStatusButtonProps {
    id: number;
}

type ApiResponse = {
    success: boolean;
    message: string;
    code: number;
    data?: unknown;
};

const DeleteLeadStatusButton = ({ id }: DeleteLeadStatusButtonProps) => {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            try {
                const res = await deleteCrmStatus(id);

                if (res?.success) {
                    toast.success(res.message || "Lead status deleted successfully");
                } else {
                    toast.error(res?.message || "Delete failed");
                }
            } catch (error: unknown) {
                console.error("Lead status delete failed:", error);
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("An unknown error occurred while deleting lead status");
                }
            }
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-800 flex items-center justify-start w-full px-2"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Spinner className="h-4 w-4 mr-2" /> Deleting...
                        </>
                    ) : (
                        <>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </>
                    )}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This lead status record will be permanently deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

                    <AlertDialogAction asChild>
                        <Button
                            onClick={handleDelete}
                            variant="destructive"
                            disabled={isPending}
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

export default DeleteLeadStatusButton;
