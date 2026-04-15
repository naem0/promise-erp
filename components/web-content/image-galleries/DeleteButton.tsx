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
import { deleteImageGallery, SingleImageGalleryResponse } from "@/apiServices/homePageAdminService";
interface DeleteButtonProps {
    id: number;
}

const DeleteButton = ({ id }: DeleteButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
    
    const handleDelete = () => {
    startTransition(async () => {
      try { 
        const res: SingleImageGalleryResponse = await deleteImageGallery(id);
        if (res.success) {
            toast.success(res.message || "Image gallery deleted successfully");
            router.refresh();
        }
        else {
            toast.error(res.message || "Delete failed");
        }
      } catch (error: unknown) {
        console.error("Image gallery delete failed:", error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred while deleting image gallery");
        }
      } 
    });
  };
    return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
            variant="ghost"
            className="text-red-600 hover:text-red-800 flex items-center cursor-pointer"
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
            This action cannot be undone. The image gallery will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className=" cursor-pointer" disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
                onClick={handleDelete}
                variant="destructive"
                disabled={isPending}
                className="cursor-pointer"
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
}   ;

export default DeleteButton;
