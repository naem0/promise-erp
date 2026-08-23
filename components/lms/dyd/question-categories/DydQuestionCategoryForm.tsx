"use client";

import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import {
  createDydQuestionCategory,
  updateDydQuestionCategory,
  DydQuestionCategory,
} from "@/apiServices/dydQuestionCategoryService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DydQuestionCategoryFormProps {
  title: string;
  item?: DydQuestionCategory;
}

interface FormValues {
  name: string;
  type: string;
  status: string;
}

export default function DydQuestionCategoryForm({
  title,
  item,
}: DydQuestionCategoryFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      type: "1",
      status: "1",
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        name: item.name || "",
        type: item.type ? item.type.toString() : "1",
        status: item.status !== undefined && item.status !== null ? item.status.toString() : "1",
      });
    }
  }, [item, reset]);

  const submitHandler = async (values: FormValues) => {
    const payload = {
      name: values.name,
      type: Number(values.type),
      status: Number(values.status),
    };

    try {
      const res = item
        ? await updateDydQuestionCategory(item.id, payload)
        : await createDydQuestionCategory(payload);

      if (res?.success) {
        reset();
        toast.success(res.message || "Category saved successfully!");
        router.push("/lms/dyd/question-categories");
      } else {
        if (res?.errors) {
          toast.error(res.message || "Failed to save category");
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
          toast.error(res?.message || "Failed to save category");
        }
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
    <div className="bg-card border rounded-2xl p-4 sm:p-6 shadow-sm max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.back()}
          className="cursor-pointer"
        >
          Go Back
        </Button>
        <span>{title}</span>
      </h2>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Category Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5 text-slate-700">
              Category Name<span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter category name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700">
              Question Type<span className="text-red-500">*</span>
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  key={field.value}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Mcq</SelectItem>
                    <SelectItem value="2">Short question</SelectItem>
                    <SelectItem value="3">Written</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700">
              Status
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  key={field.value}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="0">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="rounded-lg cursor-pointer w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white px-8 rounded-lg cursor-pointer w-full sm:w-auto"
          >
            {isSubmitting ? "Submitting..." : item ? "Update Category" : "Add Category"}
          </Button>
        </div>
      </form>
    </div>
  );
}
