"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { createLeadActivity } from "@/apiServices/crmLeadActivitiesService";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";

interface LeadActivityFormProps {
  leadId: number;
  lastLeadActivityStatus?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormValues {
  date: string;
  type: string;
  status: string;
  note: string;
}

const LeadActivityForm = ({ leadId, lastLeadActivityStatus }: LeadActivityFormProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      type: "",
      status: "",
      note: "",
    },
  });

  const currentStatus = watch("status");
  const isDateDisabled = currentStatus === "5" || currentStatus === "6";

  const isFormDisabled = lastLeadActivityStatus === "Enrolled";

  const submitHandler = async (values: FormValues) => {
    try {
      const res = await createLeadActivity({
        lead_id: leadId,
        date: isDateDisabled ? "" : values.date,
        type: Number(values.type),
        status: Number(values.status),
        note: values.note,
      });

      if (res.success) {
        toast.success(res.message || "Activity saved successfully");
        reset();
        router.push("/crm/lead-activities");
        router.refresh();
      } else {
        if (res.errors) {
          toast.error(res.message || "Failed to save activity");
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
          toast.error(res.message || "Failed to save activity");
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
    <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Plus className="w-5 h-5 text-green-600" />
        <h3 className="text-xl font-semibold text-slate-800">
          Add Activity Log
        </h3>
      </div>
      <div className={isFormDisabled ? "pointer-events-none opacity-50" : ""}>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="next_date"
              className="text-sm font-medium text-slate-700"
            >
              Next Date
            </Label>
            <Input
              id="next_date"
              type="date"
              {...register("date")}
              className="w-full border-slate-200 focus:ring-green-500 focus:border-green-500"
              disabled={isDateDisabled || isFormDisabled}
              required={!isDateDisabled}
            />
            {errors.date && (
              <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
            )}
          </div>

          {/*type * integer  1: Call, 2: Message*/}
          <div>
            <Label
              htmlFor="interaction_type"
              className="text-sm font-medium text-slate-700"
            >
              Interaction Type
            </Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isFormDisabled}>
                  <SelectTrigger className="w-full border-slate-200">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Call</SelectItem>
                    <SelectItem value="2">Message</SelectItem>
                    <SelectItem value="3">Email</SelectItem>
                    <SelectItem value="4">Whatsapp</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="call_result"
              className="text-sm font-medium text-slate-700"
            >
              Status
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isFormDisabled}>
                  <SelectTrigger className="w-full border-slate-200">
                    <SelectValue placeholder="Select Result" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="1">New</SelectItem> */}
                    <SelectItem value="2">Busy</SelectItem>
                    <SelectItem value="3">Interested</SelectItem>
                    <SelectItem value="4">Follow Up</SelectItem>
                    <SelectItem value="5">Enrolled</SelectItem>
                    <SelectItem value="6">Cancelled</SelectItem>
                    <SelectItem value="7">Not Received</SelectItem>
                    <SelectItem value="8">Call Rejected</SelectItem>
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

          <div className="space-y-2">
            <Label
              htmlFor="note"
              className="text-sm font-medium text-slate-700"
            >
              Note
            </Label>
            <Textarea
              id="note"
              placeholder="Enter Activity Notes...."
              {...register("note")}
              disabled={isFormDisabled}
              className="w-full min-h-[120px] border-slate-200 focus:ring-green-500 focus:border-green-500"
            />
            {errors.note && (
              <p className="text-sm text-red-500 mt-1">{errors.note.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || isFormDisabled}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? "Saving..." : "Save Activity"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadActivityForm;
