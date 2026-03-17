"use client";

import { useTransition } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { approveReview, SingleReviewResponse } from "@/apiServices/reviewService";

interface ApproveReviewButtonProps {
    id: number;
}

const ApproveReviewButton = ({ id }: ApproveReviewButtonProps) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleApprove = () => {
        startTransition(async () => {
            try {
                const res: SingleReviewResponse = await approveReview(id);

                if (res.success) {
                    toast.success(res.message || "Review approved successfully");
                    router.refresh();
                } else {
                    toast.error(res.message || "Approve failed");
                }
            } catch (error: unknown) {
                console.error("Review approve failed:", error);
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("An unknown error occurred while approving review");
                }
            }
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="text-green-600 hover:text-green-800 flex items-center justify-start w-full px-2"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Spinner className="h-4 w-4 mr-2" /> Approving...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-4 w-4 mr-2" /> Approve
                        </>
                    )}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Approve this review?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will mark the review as approved and make it visible on the platform.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

                    <AlertDialogAction asChild>
                        <Button
                            onClick={handleApprove}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Approving...
                                </>
                            ) : (
                                "Yes, Approve"
                            )}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ApproveReviewButton;
