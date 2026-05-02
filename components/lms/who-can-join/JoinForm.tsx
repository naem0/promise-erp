"use client";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createJoin, updateJoin, JoinType } from "@/apiServices/joinService";

interface JoinFormProps {
  title: string;
  join?: JoinType;
}

interface FormValues {
  title: string;
  status: string;
}

export default function JoinForm({ title, join }: JoinFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: join?.title || "",
      status: join?.status?.toString() || "1",
    },
  });

  const submitHandler = async (values: FormValues) => {
    const payload = {
      title: values.title.trim(),
      status: Number(values.status),
    };

    try {
      let res;
      if (join) {
        res = await updateJoin(join.id, payload);
      } else {
        res = await createJoin(payload);
      }

      if (res.success) {
        toast.success(res.message || "Join saved successfully!");
        reset();
        router.push("/lms/who-can-join");
        return;
      }

      if (res.errors) {
        toast.error(res.message || "Validation failed");

        Object.entries(res.errors).forEach(([field, messages]) => {
          const errorMessage = Array.isArray(messages)
            ? messages[0]
            : messages;

          setError(field as keyof FormValues, {
            type: "server",
            message: errorMessage as string,
          });
        });
      } else {
        toast.error(res.message || "Failed to save join");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error(error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-background flex items-start justify-center py-10 px-4">
      <div className="w-full bg-card border rounded-2xl p-10 shadow-md">
        <div className="flex items-center justify-start gap-2 mb-8">
          <Button variant="secondary" onClick={() => router.back()} className="cursor-pointer">
            <span>
              Go Back
            </span>
          </Button>
          <h2 className="text-2xl font-semibold ">
            {title}
          </h2>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Title
            </label>
            <Input
              placeholder="Enter title"
              {...register("title")}
              className="h-11"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Status
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="0">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              {isSubmitting
                ? "Submitting..."
                : join
                  ? "Update Join"
                  : "Add Join"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
