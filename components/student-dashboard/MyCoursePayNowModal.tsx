"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSession } from "next-auth/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { PaymentMethod, StudentMyCourse, getElPaymentMethods, CourseDuePaymentRequests } from "@/apiServices/studentDashboardService";

interface MyCourseCardProps {
    course: StudentMyCourse;
    isUpdatedCourse: boolean;
    setIsUpdatedCourse: React.Dispatch<React.SetStateAction<boolean>>;
}

type FormData = {
    paid_amount: string;
    payment_method: string;
    payment_number: string;
    transaction_id: string;
    comment: string;
};

const MyCoursePayNowModal = ({ course, isUpdatedCourse, setIsUpdatedCourse }: MyCourseCardProps) => {
    const { data: session } = useSession();
    const token = session?.accessToken as string;

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>();

    const selectedPaymentMethodId = watch("payment_method");
    const selectedPaymentMethod = paymentMethods.find((pm) => String(pm.id) === selectedPaymentMethodId);
    const hideNumberFields = selectedPaymentMethod
        ? ["cash", "pay later", "bkash"].some((k) => selectedPaymentMethod.name.toLowerCase().includes(k))
        : false;

    useEffect(() => {
        if (hideNumberFields) {
            setValue("payment_number", "");
            setValue("transaction_id", "");
        }
    }, [hideNumberFields, setValue]);
    
    useEffect(() => {
        if (open) {
            reset({
                paid_amount: String(course?.course?.due_amount ?? ""),
                payment_method: "",
                payment_number: "",
                transaction_id: "",
                comment: "",
            });
            setApiErrors({});
        }
    }, [course, open, reset]);

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const res = await getElPaymentMethods();
                if (!res || !res.success || !res.data) {
                    console.warn("No payment methods data found.");
                    setPaymentMethods([]);
                    return;
                }
                if (res?.success) {
                    setPaymentMethods(res?.data || []);
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error("Error fetching payment methods:", error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        if (open && paymentMethods.length === 0) {
            fetchPaymentMethods();
        }
    }, [open, paymentMethods.length]);

    const onSubmit = async (data: FormData) => {
        if (!token) return;
        setApiErrors({});
        setIsSubmitting(true);

        const payload = {
            enrollment_id: course?.course?.enrollment_id || 0,
            paid_amount: Number(data.paid_amount),
            payment_method: Number(data.payment_method),
            payment_number: data.payment_number,
            transaction_id: data.transaction_id,
            comment: data.comment,
        };

        try {
            const res = await CourseDuePaymentRequests(payload, token as string);
            if (res.success) {
                const bkashUrl = (res.data as any)?.bkash_url;
                if (bkashUrl) {
                    window.location.href = bkashUrl;
                    return;
                }
                setIsUpdatedCourse(!isUpdatedCourse);
                setOpen(false);
                reset();
            } else if (res.errors) {
                setApiErrors(res.errors);
            } else {
                setApiErrors({ global: [res.message || "Something went wrong"] });
            }
        } catch (error: unknown) {
             if (error instanceof Error) {
                 console.error("Payment Submission failed: ", error.message);
                 setApiErrors({ global: [error.message] });
             } 
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        disabled={course?.course?.payment_status === 0}
                        variant="secondary"
                        className=" "
                    >
                        {course?.course?.payment_status === 0
                            ? "Payment Pending"
                            : "Pay Now"}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Payment</DialogTitle>
                        <DialogDescription className="flex flex-col gap-1 text-secondary">
                            <span className="font-semibold">Enrollment ID: {course?.course?.enrollment_id}</span>
                            <span className="font-semibold">Course Price: {course?.course?.price} ৳</span>
                            <span className="font-semibold">Paid Amount: {course?.course?.total_paid} ৳</span>
                            <span className="font-semibold">Due amount:{" "}{course?.course?.due_amount} ৳</span>
                        </DialogDescription>
                    </DialogHeader>

                    {apiErrors.global && (
                        <div className="text-red-500 text-sm font-medium">{apiErrors.global[0]}</div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4 pt-0">
                            <div className="grid gap-2">
                                <Label htmlFor="paid_amount">Payment Amount *</Label>
                                <Input
                                    id="paid_amount"
                                    type="number"
                                    step="0.01"
                                    placeholder="Enter payment amount"
                                    {...register("paid_amount", { required: "Payment amount is required" })}
                                />
                                {errors.paid_amount && <span className="text-xs text-red-500">{errors.paid_amount.message}</span>}
                                {apiErrors?.paid_amount && <span className="text-xs text-red-500">{apiErrors.paid_amount[0]}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label>Payment Method *</Label>
                                <Controller
                                    name="payment_method"
                                    control={control}
                                    rules={{ required: "Payment method is required" }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value || undefined} defaultValue={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Payment Method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {!loading && paymentMethods?.length > 0 ? (
                                                    paymentMethods
                                                        ?.filter((pm) => !pm.name.toLowerCase().includes("pay later"))
                                                        .map((pm) => (
                                                            <SelectItem key={pm.id} value={String(pm.id)}>
                                                                {pm.name}
                                                            </SelectItem>
                                                        ))
                                                ) : (
                                                    <SelectItem value="bkash" disabled>
                                                        {loading ? "Loading..." : "No Payment Method Found"}
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.payment_method && <span className="text-xs text-red-500">{errors.payment_method.message}</span>}
                                {apiErrors?.payment_method && <span className="text-xs text-red-500">{apiErrors.payment_method[0]}</span>}
                            </div>
                            {!hideNumberFields && (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="payment_number">Payment Number *</Label>
                                        <Input
                                            id="payment_number"
                                            type="text"
                                            placeholder="Enter payment number"
                                            {...register("payment_number", { required: !hideNumberFields && "Payment number is required" })}
                                        />
                                        {errors.payment_number && <span className="text-xs text-red-500">{errors.payment_number.message}</span>}
                                        {apiErrors?.payment_number && <span className="text-xs text-red-500">{apiErrors.payment_number[0]}</span>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="transaction_id">Transaction Number *</Label>
                                        <Input
                                            id="transaction_id"
                                            type="text"
                                            placeholder="Enter transaction number"
                                            {...register("transaction_id", { required: !hideNumberFields && "Transaction number is required" })}
                                        />
                                        {errors.transaction_id && <span className="text-xs text-red-500">{errors.transaction_id.message}</span>}
                                        {apiErrors?.transaction_id && <span className="text-xs text-red-500">{apiErrors.transaction_id[0]}</span>}
                                    </div>
                                </>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="comment">Comment</Label>
                                <Textarea
                                    id="comment"
                                    placeholder="Add any additional notes..."
                                    {...register("comment")}
                                />
                                {apiErrors?.comment && <span className="text-xs text-red-500">{apiErrors.comment[0]}</span>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-[#11b059] hover:bg-[#0e954b] text-white">
                                {isSubmitting ? "Submitting..." : "Create Payment"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default MyCoursePayNowModal