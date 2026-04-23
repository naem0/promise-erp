"use client";

import { useTransition } from "react";
import { Trash } from "lucide-react";
import { deleteContactPage } from "@/apiServices/contactPageAdminService";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteContactPageButtonProps {
    id: number;
}

const DeleteContactPageButton = ({ id }: DeleteContactPageButtonProps) => {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                const response = await deleteContactPage(id);
                if (response.success) {
                    toast.success(response.message || "Contact page deleted successfully.");
                } else {
                    toast.error(response.message || "Failed to delete contact page.");
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                  toast.error(error.message || "An unexpected error occurred.");
                } else {
                  toast.error("An unexpected error occurred.");
                }
            }
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className="flex items-center text-destructive cursor-pointer px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground outline-none transition-colors">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this
                        contact page and remove its data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteContactPageButton;
