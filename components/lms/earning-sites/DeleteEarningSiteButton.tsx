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
import { deleteEarningSite } from "@/apiServices/earningSiteService";

interface DeleteEarningSiteButtonProps {
    id: number;
}

type ApiResponse = {
    success: boolean;
    message: string;
    code: number;
    data?: unknown;
};

const DeleteEarningSiteButton = ({ id }: DeleteEarningSiteButtonProps) => {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            try {
                const res: ApiResponse = await deleteEarningSite(id);

                if (res.success) {
                    toast.success(res.message || "Earning site deleted successfully");
                } else {
                    toast.error(res.message || "Delete failed");
                }
            } catch (error: unknown) {
                console.error("Earning site delete failed:", error);
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("An unknown error occurred while deleting earning site");
                }
            }
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-800 flex items-center justify-start w-full px-2 cursor-pointer"
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
                        This action cannot be undone. This earning site will be permanently deleted.
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

export default DeleteEarningSiteButton;
