"use client";


import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Plus, Play, Square, Clock } from "lucide-react";
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
  status_id: string;
  note: string;
  time: string;
}

const LeadActivityForm = ({ leadId, lastLeadActivityStatus }: LeadActivityFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      type: "",
      status_id: "",
      note: "",
      time: "",
    },
  });

  const currentStatus = watch("status_id");
  const isDateDisabled = currentStatus === "5" || currentStatus === "6";

  const isFormDisabled = lastLeadActivityStatus === "Enrolled";

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopMicrophone = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, []);

  useEffect(() => {
    if (timerSeconds > 0 || isTimerRunning) {
      setValue("time", formatTime(timerSeconds), { shouldValidate: true });
    }
  }, [timerSeconds, isTimerRunning, setValue]);

  const handleTimerToggle = async () => {
    if (!isTimerRunning) {
      let alreadyGranted = false;
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const status = await navigator.permissions.query({ name: "microphone" as PermissionName });
          if (status.state === "granted") {
            alreadyGranted = true;
          }
        }
      } catch (err) {
        console.warn("Could not query microphone permission status:", err);
      }

      if (typeof window !== "undefined" && window.localStorage) {
        if (window.localStorage.getItem("promise_erp_mic_approved") === "true") {
          alreadyGranted = true;
        }
      }

      if (!alreadyGranted) {
        const allowed = window.confirm(
          '"Promise ERP" Would Like to Access the Microphone\n\nFor tracking and recording call duration, Promise ERP needs access to your microphone.'
        );
        if (!allowed) return;

        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem("promise_erp_mic_approved", "true");
        }
      }

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;
        } else {
          console.warn("getUserMedia is not supported in this browser/context.");
        }
      } catch (err) {
        console.warn("Microphone access error (silently ignored for fallback):", err);
      }

      toast.info("Your Conversation is Being Recorded", {
        icon: "🎙️",
        duration: 3000,
      });
      setIsTimerRunning(true);
    } else {
      stopMicrophone();
      setIsTimerRunning(false);
    }
  };

  const submitHandler = async (values: FormValues) => {
    setIsTimerRunning(false);
    stopMicrophone();
    try {
      const res = await createLeadActivity({
        lead_id: leadId,
        date: isDateDisabled ? "" : values.date,
        type: Number(values.type),
        status_id: Number(values.status_id),
        note: values.note,
        time: values.time,
      });

      if (res.success) {
        toast.success(res.message || "Activity saved successfully");
        reset();
        setTimerSeconds(0);
        if (values.status_id === "5") {
          window.open(`/lms/enrollments/add?lead_id=${leadId}`, "_blank");
        }
        const fromPage = searchParams.get("from_page") || "/crm/lead-activities";
        const backParams = new URLSearchParams(searchParams.toString());
        backParams.delete("from_page");
        router.refresh();
        router.push(`${fromPage}${backParams.toString() ? `?${backParams.toString()}` : ""}`);
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
              className="w-full border-slate-200 focus:ring-primary focus:border-primary"
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
                    <SelectItem value="5">Walkin Visitor</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
            )}
          </div>

          
          <div className="space-y-3 p-4 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden transition-all duration-300 hover:shadow-sm">
            <Label
              htmlFor="time"
              className="text-sm font-semibold text-slate-700 flex justify-between items-center"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" /> Call Duration
              </span>
              {isTimerRunning && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-red-500 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> Recording
                </span>
              )}
            </Label>
            <div className="flex gap-1.5 2xl:gap-3 items-center">
              <div className="relative flex-1 shrink-0">
                <Input
                  id="time"
                  type="text"
                  placeholder="00:00:00"
                  {...register("time")}
                  readOnly={true}
                  className={`w-full font-mono text-xl text-center font-bold tracking-wider py-6 transition-all duration-300 ${isTimerRunning
                      ? "border-red-200 bg-red-50/50 text-red-600 focus:ring-red-500 shadow-inner"
                      : "border-slate-200 focus:ring-blue-500 text-slate-700 shadow-sm"
                    }`}
                  disabled={isDateDisabled || isFormDisabled}
                  required={!isDateDisabled}
                />
              </div>
              <Button
                type="button"
                size="lg"
                variant={isTimerRunning ? "destructive" : "default"}
                onClick={handleTimerToggle}
                disabled={isFormDisabled || isDateDisabled}
                className={`w-24 shrink-0 flex items-center justify-center gap-2 font-semibold h-[52px] transition-all duration-300 ${isTimerRunning
                    ? "bg-red-600 hover:bg-red-700 shadow-md"
                    : "bg-primary/90 hover:bg-primary shadow-md hover:shadow-lg"
                  }`}
              >
                {isTimerRunning ? (
                  <>
                    <Square className="w-5 h-5 fill-current" /> Stop
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" /> Start
                  </>
                )}
              </Button>
            </div>
            {errors.time && (
              <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>
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
              name="status_id"
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
            {errors.status_id && (
              <p className="text-sm text-red-500 mt-1">
                {errors.status_id.message}
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
              className="w-full min-h-[120px] border-slate-200 focus:ring-primary focus:border-primary"
            />
            {errors.note && (
              <p className="text-sm text-red-500 mt-1">{errors.note.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || isFormDisabled || timerSeconds === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
