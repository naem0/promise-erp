"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import CourseSearchSelect from "@/components/common/CourseSearchSelect";
import { createEnrollment } from "@/apiServices/enrollmentService";
import { ClassSchedule } from "@/apiServices/classSchedulesService";
import { getLeadEnrollmentInfo } from "@/apiServices/crmLeadActivitiesService";
import { getElPaymentMethods, PaymentMethod } from "@/apiServices/studentDashboardService";
import {
  PAYMENT_STATUS_PENDING,
  PAYMENT_STATUS_PAID,
} from "@/apiServices/paymentConstants";
import {
  ENROLLMENT_STATUS_PENDING,
  ENROLLMENT_STATUS_ACTIVE,
} from "@/apiServices/enrollmentConstants";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Student {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

interface Batch {
  id: number;
  name: string;
  price: number | null;
  discount: number | null;
  discount_type: string | null;
  after_discount: number | string | null;
  total_enrolled?: number | null;
  duration?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_online?: number;
  branch?: {
    id: number;
    name: string;
  };
  course?: {
    id: number;
    title: string;
  };
}

interface Course {
  id: number;
  title: string;
}

interface CreateEnrollmentFormProps {
  students: Student[];
  batches: Batch[];
  classSchedules?: ClassSchedule[];
}

interface FormValues {
  user_id: string;
  batch_id: string;
  course_id: string;
  is_online: string;
  class_schedule_id: string;
  status: string;
  payment_method: string;
  payment_status: string;
  payment_amount: string;
  discount_amount: string;
  payment_reference: string;
}

export default function CreateEnrollmentForm({
  students: initialStudents,
  batches: initialBatches,
  classSchedules = [],
}: CreateEnrollmentFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const leadIdParam = searchParams.get("lead_id");

  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [courseId, setCourseId] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      user_id: "",
      batch_id: "",
      course_id: "",
      is_online: "1",
      class_schedule_id: "",
      status: ENROLLMENT_STATUS_ACTIVE.toString(),
      payment_method: "",
      payment_status: PAYMENT_STATUS_PENDING.toString(),
      payment_amount: "",
      discount_amount: "",
      payment_reference: "",
    },
  });

  const batchId = watch("batch_id");
  const paymentAmount = watch("payment_amount");
  const additionalDiscount = watch("discount_amount");

  // Fetch payment methods dynamically
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const res = await getElPaymentMethods();
        if (res?.success && res?.data) {
          setPaymentMethods(res?.data);
          // Dynamically find and select "Cash" payment method
          const cashMethod = res.data.find(
            (method: PaymentMethod) => method?.name?.toLowerCase() === "cash"
          );
          if (cashMethod) {
            setValue("payment_method", cashMethod.id.toString());
          }
        }
      } catch (error: unknown) {
        console.error("Error fetching payment methods:", error);
      }
    };
    fetchPaymentMethods();
  }, [setValue]);

  // Sync state when initialStudents changes
  useEffect(() => {
    setStudents((prev) => {
      const customStudents = prev.filter((ps) => !initialStudents.some((is) => is.id === ps.id));
      return [...customStudents, ...initialStudents];
    });
  }, [initialStudents]);

  // Fetch and populate lead info if lead_id is present
  useEffect(() => {
    const fetchLeadInfo = async () => {
      if (!leadIdParam) return;
      try {
        const res = await getLeadEnrollmentInfo(Number(leadIdParam));
        if (res?.success && res?.data) {
          const leadData = res?.data;
          let targetStudentId = "";

          if (leadData?.student_id) {
            const exists = students.find((s) => s.id === leadData.student_id);
            if (!exists) {
              const newStudent: Student = {
                id: leadData.student_id,
                name: leadData.name,
                email: leadData.email,
                phone: leadData.phone,
              };
              setStudents((prev) => [newStudent, ...prev]);
            }
            targetStudentId = leadData.student_id.toString();
          } else {
            // Find by phone or email
            const matched = students.find(
              (s) =>
                (leadData.phone && s.phone === leadData.phone) ||
                (leadData.email && s.email?.toLowerCase() === leadData.email.toLowerCase())
            );
            if (matched) {
              targetStudentId = matched.id.toString();
            } else {
              toast.error("Lead is not registered as a student yet. Please register them first.");
            }
          }

          if (targetStudentId) {
            setValue("user_id", targetStudentId);
          }

          if (leadData?.course_id) {
            handleCourseChange(leadData?.course_id.toString());
            if (leadData?.batch_id) {
              setTimeout(() => {
                setValue("batch_id", leadData?.batch_id!.toString());
              }, 50);
            }
          }
          toast.success("Lead enrollment info loaded successfully!");
        } else {
          toast.error(res?.message || "Failed to load lead enrollment info");
        }
      } catch (error: unknown) {
        console.error("Error loading lead info:", error);
        toast.error("Error loading lead enrollment info");
      }
    };
    fetchLeadInfo();
  }, [leadIdParam]);

  // Filter batches by course
  const filteredBatches = courseId
    ? initialBatches.filter((batch) => batch.course?.id === Number(courseId))
    : initialBatches;

  // Prepare options for Combobox
  const studentOptions = (students || []).map((student) => ({
    value: student?.id?.toString() || "",
    label: student ? `${student.name || "N/A"}${student.email ? ` (${student.email})` : ""}${student.phone ? ` - ${student.phone}` : ""}` : "Unknown Student",
  }));

  const batchOptions = (filteredBatches || []).map((batch) => ({
    value: batch?.id?.toString() || "",
    label: batch ? `${batch.name || "N/A"}${batch.course ? ` - ${batch.course.title}` : ""}` : "Unknown Batch",
  }));

  // Update selected batch when batch_id changes
  useEffect(() => {
    if (batchId) {
      const batch = initialBatches.find((b) => b.id.toString() === batchId);
      if (batch) {
        setSelectedBatch(batch);
        if (batch.is_online !== undefined) {
          setValue("is_online", batch.is_online.toString());
        }
        // Auto-fill payment_amount with after_discount or price
        const baseAmount = batch.after_discount ? Number(batch.after_discount) : (batch.price || 0);
        if (baseAmount > 0) {
          // If discount_amount exists, subtract it from base amount
          const currentDiscount = additionalDiscount ? Number(additionalDiscount) : 0;
          const finalAmount = Math.max(0, baseAmount - currentDiscount);
          setValue("payment_amount", finalAmount.toFixed(2));
        }
      } else {
        setSelectedBatch(null);
      }
    } else {
      setSelectedBatch(null);
    }
  }, [batchId, initialBatches, setValue, additionalDiscount]);

  // Auto-update payment_amount when discount_amount changes
  useEffect(() => {
    if (selectedBatch && additionalDiscount) {
      const baseAmount = selectedBatch.after_discount ? Number(selectedBatch.after_discount) : (selectedBatch.price || 0);
      const discount = Number(additionalDiscount);
      const finalAmount = Math.max(0, baseAmount - discount);
      setValue("payment_amount", finalAmount.toFixed(2));
    } else if (selectedBatch && !additionalDiscount) {
      // If discount is removed, reset to base amount
      const baseAmount = selectedBatch.after_discount ? Number(selectedBatch.after_discount) : (selectedBatch.price || 0);
      if (baseAmount > 0) {
        setValue("payment_amount", baseAmount.toFixed(2));
      }
    }
  }, [additionalDiscount, selectedBatch, setValue]);

  const handleCourseChange = (value: string | null) => {
    const val = value || "";
    setCourseId(val);
    setValue("course_id", val);
    setValue("batch_id", "");
    setSelectedBatch(null);
    clearErrors("course_id");
    clearErrors("batch_id");
  };

  const handleBatchChange = (value: string | null) => {
    setValue("batch_id", value || "");
    clearErrors("batch_id");
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await createEnrollment({
        user_id: Number(values.user_id),
        batch_id: Number(values.batch_id),
        is_online: values.is_online !== "" ? Number(values.is_online) : undefined,
        class_schedule_id: values.class_schedule_id ? Number(values.class_schedule_id) : undefined,
        status: Number(values.status),
        payment_method: Number(values.payment_method),
        payment_status: Number(values.payment_status),
        payment_amount: values.payment_amount ? Number(values.payment_amount) : undefined,
        discount_amount: values.discount_amount ? Number(values.discount_amount) : undefined,
        payment_reference: values.payment_reference || undefined,
      });

      if (res.success) {
        toast.success(res.message || "Enrollment created successfully!");
        router.push("/lms/enrollments");
        reset();
      } else {
        toast.error(res.message || "Failed to create enrollment");
        if (res.errors) {
          Object.entries(res.errors).forEach(([field, messages]) => {
            const errorMessage = Array.isArray(messages) ? messages[0] : messages;
            const formField = field === "payment_method_id" ? "payment_method" : field;
            setError(formField as keyof FormValues, { type: "server", message: errorMessage as string });
          });
        }
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create enrollment");
      }
    }
  };

  // Calculate batch discount amount
  const calculateDiscountAmount = (batch: Batch): number => {
    if (!batch.price || !batch.discount) return 0;
    if (batch.discount_type === "percentage") {
      return (batch.price * batch.discount) / 100;
    }
    return batch.discount;
  };

  const discountAmount = selectedBatch ? calculateDiscountAmount(selectedBatch) : 0;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/lms/enrollments" className="flex items-center gap-2 py-2">
          <ArrowLeft className="h-4 w-4" />
          Back to enrollments
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Create Enrollment</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Enrollment</CardTitle>
          <CardDescription>Create a new enrollment for a student. Pricing will be automatically calculated from the batch.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              clearErrors();
              handleSubmit(onSubmit)(e);
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Selection with Combobox */}
              <div className="space-y-2">
                <Label htmlFor="user_id">
                  Student <span className="text-red-500">*</span>
                </Label>
                <Combobox
                  options={studentOptions}
                  value={watch("user_id")}
                  onValueChange={(value) => {
                    setValue("user_id", value || "");
                    clearErrors("user_id");
                  }}
                  placeholder="Select student..."
                  searchPlaceholder="Search student by name, email, or phone..."
                  emptyMessage="No students found"
                  disabled={isSubmitting}
                />
                {errors.user_id && (
                  <p className="text-sm text-red-500">{errors.user_id.message}</p>
                )}
              </div>

              {/* Course Selection with SearchSelect */}
              <div className="space-y-2">
                <Label htmlFor="course_id">Course</Label>
                <CourseSearchSelect
                  value={courseId}
                  onValueChange={handleCourseChange}
                  placeholder="Select course (optional)..."
                />
                {errors.course_id && (
                  <p className="text-sm text-red-500">{errors.course_id.message}</p>
                )}
              </div>


              {/* Batch Selection with Combobox */}
              <div className="space-y-2">
                <Label htmlFor="batch_id">
                  Batch <span className="text-red-500">*</span>
                </Label>
                <Combobox
                  options={batchOptions}
                  value={watch("batch_id")}
                  onValueChange={handleBatchChange}
                  placeholder={courseId ? "Select batch..." : "Select course first"}
                  searchPlaceholder="Search batch..."
                  emptyMessage={courseId ? "No batches found for this course" : "Please select a course first"}
                  disabled={isSubmitting || (!courseId && filteredBatches.length === 0)}
                />
                {errors.batch_id && (
                  <p className="text-sm text-red-500">{errors.batch_id.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(value) => {
                    setValue("status", value);
                    clearErrors("status");
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ENROLLMENT_STATUS_PENDING.toString()}>Pending</SelectItem>
                    <SelectItem value={ENROLLMENT_STATUS_ACTIVE.toString()}>Active</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status.message}</p>
                )}
              </div>

              {/* Enrollment Mode */}
              <div className="space-y-2">
                <Label htmlFor="is_online">
                  Enrollment Mode <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("is_online")}
                  onValueChange={(value) => {
                    setValue("is_online", value);
                    clearErrors("is_online");
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="is_online" className="w-full">
                    <SelectValue placeholder="Select mode..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Online</SelectItem>
                    <SelectItem value="0">Offline</SelectItem>
                  </SelectContent>
                </Select>
                {errors.is_online && (
                  <p className="text-sm text-red-500">{errors.is_online.message}</p>
                )}
              </div>

              {/* Class Schedule (Timing) */}
              <div className="space-y-2">
                <Label htmlFor="class_schedule_id">Class Schedule (Timing)</Label>
                <Select
                  value={watch("class_schedule_id")}
                  onValueChange={(value) => {
                    setValue("class_schedule_id", value);
                    clearErrors("class_schedule_id");
                  }}
                  disabled={isSubmitting || classSchedules.length === 0}
                >
                  <SelectTrigger id="class_schedule_id" className="w-full">
                    <SelectValue placeholder="Select class schedule..." />
                  </SelectTrigger>
                  <SelectContent>
                    {classSchedules.length > 0 ? (
                      classSchedules.map((schedule) => (
                        <SelectItem key={schedule.id} value={schedule.id.toString()}>
                          {schedule.title} ({schedule.start_time} - {schedule.end_time})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No active schedules available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.class_schedule_id && (
                  <p className="text-sm text-red-500">{errors.class_schedule_id.message}</p>
                )}
              </div>

              {/* Batch Info Display */}
              {selectedBatch && (
                <div className="md:col-span-2 space-y-2 p-4 bg-muted rounded-lg">
                  <Label className="text-sm font-semibold">Batch Information</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    {/* Pricing Section */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Original Price:</span>
                        <span className="font-medium">৳{selectedBatch.price?.toFixed(2) || "0.00"}</span>
                      </div>
                      {selectedBatch.discount && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Discount ({selectedBatch.discount_type === "percentage" ? `${selectedBatch.discount}%` : "৳" + selectedBatch.discount}):
                          </span>
                          <span className="font-medium text-red-600">-৳{discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      {additionalDiscount && Number(additionalDiscount) > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Additional Discount:</span>
                          <span className="font-medium text-red-600">-৳{Number(additionalDiscount).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-1 border-t">
                        <span className="font-semibold">Final Amount:</span>
                        <span className="font-bold text-primary">
                          ৳{(() => {
                            const baseAmount = selectedBatch.after_discount ? Number(selectedBatch.after_discount) : (selectedBatch.price || 0);
                            const addDiscount = additionalDiscount ? Number(additionalDiscount) : 0;
                            return Math.max(0, baseAmount - addDiscount).toFixed(2);
                          })()}
                        </span>
                      </div>
                    </div>

                    {/* Batch Details Section */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Enrolled:</span>
                        <span className="font-medium">{selectedBatch.total_enrolled ?? 0} students</span>
                      </div>
                      {selectedBatch.duration && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium">{selectedBatch.duration}</span>
                        </div>
                      )}
                      {selectedBatch.start_date && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Start Date:</span>
                          <span className="font-medium">{selectedBatch.start_date}</span>
                        </div>
                      )}
                      {selectedBatch.end_date && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">End Date:</span>
                          <span className="font-medium">{selectedBatch.end_date}</span>
                        </div>
                      )}
                      {selectedBatch.branch && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Branch:</span>
                          <span className="font-medium">{selectedBatch.branch.name}</span>
                        </div>
                      )}
                      {selectedBatch.is_online !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">
                            {selectedBatch.is_online === 1 ? (
                              <span className="text-teal-600">Online</span>
                            ) : (
                              <span className="text-orange-600">Offline</span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method <span className="text-red-500">*</span></Label>
                <Select
                  value={watch("payment_method")}
                  onValueChange={(value) => {
                    setValue("payment_method", value);
                    clearErrors("payment_method");
                  }}
                  disabled={isSubmitting || paymentMethods.length === 0}
                >
                  <SelectTrigger id="payment_method" className="w-full">
                    <SelectValue placeholder={"Select Payment Method"} />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      paymentMethods?.length > 0 ? (
                        paymentMethods?.map((method) => (
                          <SelectItem key={method?.id} value={method?.id?.toString()}>
                            {method?.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No Payment Methods Available</SelectItem>
                      )
                    }
                  </SelectContent>
                </Select>
                {errors.payment_method && (
                  <p className="text-sm text-red-500">{errors.payment_method.message}</p>
                )}
              </div>

              {/* Payment Status */}
              <div className="space-y-2">
                <Label htmlFor="payment_status">Payment Status</Label>
                <Select
                  value={watch("payment_status")}
                  onValueChange={(value) => {
                    setValue("payment_status", value);
                    clearErrors("payment_status");
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="payment_status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PAYMENT_STATUS_PENDING.toString()}>Pending</SelectItem>
                    <SelectItem value={PAYMENT_STATUS_PAID.toString()}>Paid</SelectItem>
                  </SelectContent>
                </Select>
                {errors.payment_status && (
                  <p className="text-sm text-red-500">{errors.payment_status.message}</p>
                )}
              </div>
              {/* Discount Amount */}
              <div className="space-y-2">
                <Label htmlFor="discount_amount">Additional Discount</Label>
                <Input
                  id="discount_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("discount_amount")}
                  disabled={isSubmitting}
                />
                {errors.discount_amount && (
                  <p className="text-sm text-red-500">{errors.discount_amount.message}</p>
                )}
              </div>

              {/* Payment Amount */}
              <div className="space-y-2">
                <Label htmlFor="payment_amount">Payment Amount</Label>
                <Input
                  id="payment_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("payment_amount")}
                  disabled={isSubmitting}
                />
                {errors.payment_amount && (
                  <p className="text-sm text-red-500">{errors.payment_amount.message}</p>
                )}
              </div>


            </div>

            {/* Payment Reference */}
            <div className="space-y-2">
              <Label htmlFor="payment_reference">Payment Reference</Label>
              <Input
                id="payment_reference"
                type="text"
                placeholder="Transaction ID / Reference"
                {...register("payment_reference")}
                disabled={isSubmitting}
              />
              {errors.payment_reference && (
                <p className="text-sm text-red-500">{errors.payment_reference.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/lms/enrollments")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Enrollment"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
