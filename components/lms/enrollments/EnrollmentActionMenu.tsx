"use client";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { approveEnrollment } from "@/apiServices/enrollmentService";
import { ENROLLMENT_STATUS_ACTIVE } from "@/apiServices/enrollmentConstants";

interface EnrollmentActionMenuProps {
  enrollmentId: number;
  currentStatus?: number;
}

export default function EnrollmentActionMenu({ 
  enrollmentId,
  currentStatus 
}: EnrollmentActionMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleMarkAsActive = () => {
    startTransition(async () => {
      try {
        await approveEnrollment(enrollmentId, {
          status: ENROLLMENT_STATUS_ACTIVE,
        });
        
        toast.success("Enrollment marked as active successfully");
        router.refresh();
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to mark enrollment as active");
        }
      }
    });
  };

  const isAlreadyActive = currentStatus === ENROLLMENT_STATUS_ACTIVE;

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
        <DropdownMenuItem asChild>
          <Link
            href={`/lms/enrollments/${enrollmentId}`}
            className="flex items-center cursor-pointer"
          >
            View Details
          </Link>
        </DropdownMenuItem>
        
        {!isAlreadyActive && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="flex items-center cursor-pointer"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark as Active
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Mark Enrollment as Active?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to mark this enrollment as active? This will change the enrollment status to active.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    onClick={handleMarkAsActive}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Activating...
                      </>
                    ) : (
                      "Yes, Mark as Active"
                    )}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
