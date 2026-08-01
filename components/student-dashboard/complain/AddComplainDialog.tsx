"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createStudentComplain } from "@/apiServices/studentComplainService";

interface AddComplainFormValues {
  title: string;
  description: string;
}

interface AddComplainDialogProps {
  onSuccess?: () => void;
}

export default function AddComplainDialog({
  onSuccess,
}: AddComplainDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<AddComplainFormValues>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = (values: AddComplainFormValues) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);

        const res = await createStudentComplain(formData);

        if (!res.success) {
          if (res.errors) {
            Object.entries(res.errors).forEach(([field, messages]) => {
              const errorMessage = Array.isArray(messages)
                ? messages[0]
                : messages;
              if (field === "title" || field === "description") {
                setError(field as keyof AddComplainFormValues, {
                  type: "server",
                  message: errorMessage,
                });
              }
            });
          }
          toast.error(res.message || "Failed to submit complain");
          return;
        }

        toast.success(res.message || "Complain created successfully");
        reset();
        setOpen(false);
        if (onSuccess) {
          onSuccess();
        } else {
          router.refresh();
        }
      } catch (error: unknown) {
        console.error("Submit Complain Error:", error);
        if (error instanceof Error) {
          toast.error(error.message || "An unexpected error occurred");
        } else {
          toast.error("An unexpected error occurred while submitting complain");
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          Add Complain
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Submit a Complain
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter complain title (e.g. Video buffering issue)"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Describe your issue in detail..."
              {...register("description")}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit Complain"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
