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
import { createFaq, updateFaq, Faq } from "@/apiServices/faqsService";
import RichTextEditor from "../courses/RichTextEditor";

interface FaqFormProps {
  title: string;
  faq?: Faq;
}

interface FormValues {
  question: string;
  answer: string;
  status: string;
  type: string;
}

export default function FaqForm({ title, faq }: FaqFormProps) {
  const router = useRouter();
  const isEdit = !!faq;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      question: faq?.question || "",
      answer: faq?.answer || "",
      status: faq?.status?.toString() || "1",
      type: faq?.type?.toString() || "1",
    },
  });
  const submitHandler = async (values: FormValues) => {
    const payload = {
      question: values.question.trim(),
      answer: values.answer.trim(),
      status: Number(values.status),
      type: Number(values.type),
    };

    try {
      console.log("Submitting FAQ with payload:", payload);
      let res;
      if (faq) {
        res = await updateFaq(faq.id, payload);
      } else {
        res = await createFaq(payload);
      }

      console.log(res);
      if (res.success) {
        toast.success(res.message || "FAQ saved successfully!");
        reset();
        router.push("/lms/faqs");
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
        toast.error(res.message || "Failed to save FAQ");
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
    <div className="bg-card border rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="p-0 h-auto"
        >
          <span className="text-xl">{"<"}</span>
        </Button>
        {title}
      </h2>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        {/* Question */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Question<span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Enter FAQ question"
            {...register("question")}
          />
          {errors.question && (
            <p className="text-sm text-red-500 mt-1">
              {errors.question.message}
            </p>
          )}
        </div>

        {/* Answer */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Answer<span className="text-red-500">*</span>
          </label>
          <Controller
            name="answer"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
          />
          {errors && (
            <>
            <p className="text-sm text-red-500 mt-1">
              {/* {errors.answer.message} */}
            </p>
            {console.log(errors)}
            </>
          )}
        </div>

        {/* Type + Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Type<span className="text-red-500">*</span>
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Course FAQ</SelectItem>
                    <SelectItem value="2">Contact FAQ</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-red-500 mt-1">
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Status<span className="text-red-500">*</span>
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
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
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="rounded-lg border-primary text-green-600"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-8 rounded-lg"
          >
            {isSubmitting ? "Submitting..." : isEdit ? "Update FAQ" : "Add FAQ"}
          </Button>
        </div>
      </form>
    </div>
  );
}

