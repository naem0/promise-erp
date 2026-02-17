"use client";

import { EnrollmentDetail } from "@/apiServices/enrollmentService";
import {
    createPayment,
} from "@/apiServices/paymentHistoryService";
import {
    PAYMENT_STATUS_PENDING,
    PAYMENT_STATUS_PAID,
    PAYMENT_STATUS_REFUNDED,
    PAYMENT_METHOD_BKASH,
    PAYMENT_METHOD_ROCKET,
    PAYMENT_METHOD_NAGAD,
    PAYMENT_METHOD_PAYLATER,
    PAYMENT_METHOD_CASH,
} from "@/apiServices/paymentConstants";
import EnrollmentStatusDropdown from "./EnrollmentStatusDropdown";
import PaymentHistoryStatusDropdown from "./PaymentHistoryStatusDropdown";
import ErrorComponent from "@/components/common/ErrorComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";

interface InfoRowProps {
    label: string;
    value?: string | number | null;
    className?: string;
}

const InfoRow = ({ label, value, className }: InfoRowProps) => (
    <div className={`flex items-center justify-between text-sm ${className || ""}`}>
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-right">
            {typeof value === 'object' && value !== null ? "N/A" : (value ?? "N/A")}
        </span>
    </div>
);

interface EnrollmentDetailsProps {
    enrollment?: EnrollmentDetail | null;
    errorMessage?: string;
}

interface PaymentFormValues {
    paid_amount: string;
    payment_method: string;
    payment_status: string;
    comment: string;
}

const formatCurrency = (amount?: number | null) =>
    amount !== undefined && amount !== null
        ? `${Number(amount).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} ৳`
        : "N/A";

export default function EnrollmentDetails({
    enrollment,
    errorMessage,
}: EnrollmentDetailsProps) {
    const router = useRouter();
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        setError,
        reset,
        formState: { errors: formErrors, isSubmitting },
    } = useForm<PaymentFormValues>({
        defaultValues: {
            paid_amount: "",
            payment_method: PAYMENT_METHOD_BKASH.toString(),
            payment_status: PAYMENT_STATUS_PAID.toString(),
            comment: "",
        },
    });

    if (errorMessage) {
        return <ErrorComponent message={errorMessage} />;
    }

    if (!enrollment) {
        return <ErrorComponent message="Enrollment details not found." />;
    }

    const paymentHistories = enrollment.payment_histories ?? [];
    const totalPaid = paymentHistories.reduce(
        (sum, history) =>
            sum + Number(history.payment_details?.paid_amount ?? 0),
        0
    );
    const dueAmount =
        enrollment.due_amount ??
        Math.max((enrollment.final_price ?? 0) - totalPaid, 0);


    const onSubmit = async (values: PaymentFormValues) => {
        if (!values.paid_amount || Number(values.paid_amount) <= 0) {
            toast.error("Please enter a valid payment amount");
            return;
        }

        if (Number(values.paid_amount) > dueAmount) {
            toast.error(`Payment amount cannot exceed due amount of ${formatCurrency(dueAmount)}`);
            return;
        }

        try {
            const res = await createPayment({
                enrollment_id: enrollment!.id,
                paid_amount: Number(values.paid_amount),
                payment_method: Number(values.payment_method),
                payment_status: Number(values.payment_status),
                comment: values.comment || undefined,
            });

            if (res.success) {
                toast.success(res.message || "Payment created successfully");
                setIsPaymentDialogOpen(false);
                reset();
                router.refresh();
            } else {
                toast.error(res.message || "Failed to create payment");
                if (res.errors) {
                    Object.entries(res.errors).forEach(([field, messages]) => {
                        const errorMessage = Array.isArray(messages) ? messages[0] : messages;
                        setError(field as keyof PaymentFormValues, { type: "server", message: errorMessage as string });
                    });
                }
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Failed to create payment");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                    <Link href="/lms/enrollments" className="flex items-center gap-2 py-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to enrollments
                    </Link>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Enrollment Details
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={enrollment.status_label === "Active" ? "default" : "secondary"}>
                        {enrollment.status_label || "N/A"}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Student</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <InfoRow label="Name" value={enrollment.user?.name} />
                        <InfoRow label="Email" value={enrollment.user?.email} />
                        <InfoRow label="Phone" value={enrollment.user?.phone} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Enrollment Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Status</span>
                            <EnrollmentStatusDropdown
                                enrollmentId={enrollment.id}
                                currentStatus={enrollment.status || 0}
                            />
                        </div>
                        <InfoRow label="Course" value={enrollment.batch?.course?.title} />
                        <InfoRow label="Batch" value={enrollment.batch?.name} />
                        <InfoRow label="Enrollment Date" value={enrollment.enrollment_date} />
                        <InfoRow label="Approved By" value={enrollment.approved_by ?? "N/A"} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <InfoRow label="Payment Status" value={enrollment.payment_status_label} />
                        <InfoRow label="Original Price" value={formatCurrency(enrollment.original_price)} />
                        <InfoRow label="Discount" value={formatCurrency(enrollment.discount_amount)} />
                        <InfoRow label="Final Price" value={formatCurrency(enrollment.final_price)} />
                        <InfoRow className="text-primary" label="Total Paid" value={formatCurrency(totalPaid || enrollment.payment_amount)} />
                        <InfoRow className="text-red-500" label="Due Amount" value={formatCurrency(dueAmount)} />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Payment Histories</CardTitle>
                        {dueAmount > 0 && (
                            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add Payment
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={(e) => isSubmitting && e.preventDefault()}>
                                    <DialogHeader>
                                        <DialogTitle>Create New Payment</DialogTitle>
                                        <DialogDescription>
                                            Add a new payment record for this enrollment. Due amount: {formatCurrency(dueAmount)}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="paid_amount">Payment Amount *</Label>
                                            <Input
                                                id="paid_amount"
                                                type="number"
                                                step="1"
                                                min="1"
                                                max={dueAmount}
                                                placeholder="Enter payment amount"
                                                {...register("paid_amount")}
                                                disabled={isSubmitting}
                                            />
                                            {formErrors.paid_amount && (
                                                <p className="text-sm text-red-500">{formErrors.paid_amount.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="payment_method">Payment Method *</Label>
                                            <Controller
                                                name="payment_method"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        disabled={isSubmitting}
                                                    >
                                                        <SelectTrigger id="payment_method" className="w-full">
                                                            <SelectValue placeholder="Select payment method" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={PAYMENT_METHOD_BKASH.toString()}>bKash</SelectItem>
                                                            <SelectItem value={PAYMENT_METHOD_ROCKET.toString()}>Rocket</SelectItem>
                                                            <SelectItem value={PAYMENT_METHOD_NAGAD.toString()}>Nagad</SelectItem>
                                                            <SelectItem value={PAYMENT_METHOD_CASH.toString()}>Cash</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {formErrors.payment_method && (
                                                <p className="text-sm text-red-500">{formErrors.payment_method.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="payment_status">Payment Status *</Label>
                                            <Controller
                                                name="payment_status"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        disabled={isSubmitting}
                                                    >
                                                        <SelectTrigger id="payment_status" className="w-full">
                                                            <SelectValue placeholder="Select payment status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={PAYMENT_STATUS_PAID.toString()}>Paid</SelectItem>
                                                            <SelectItem value={PAYMENT_STATUS_PENDING.toString()}>Pending</SelectItem>
                                                            <SelectItem value={PAYMENT_STATUS_REFUNDED.toString()}>Refunded</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {formErrors.payment_status && (
                                                <p className="text-sm text-red-500">{formErrors.payment_status.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="comment">Comment</Label>
                                            <Textarea
                                                id="comment"
                                                placeholder="Add any additional notes..."
                                                {...register("comment")}
                                                rows={3}
                                                disabled={isSubmitting}
                                            />
                                            {formErrors.comment && (
                                                <p className="text-sm text-red-500">{formErrors.comment.message}</p>
                                            )}
                                        </div>

                                        <DialogFooter className="pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsPaymentDialogOpen(false)}
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={isSubmitting}>
                                                {isSubmitting ? "Creating..." : "Create Payment"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {paymentHistories.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No payment records found.</p>
                    ) : (
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right">Paid</TableHead>
                                        <TableHead className="text-right">Due</TableHead>
                                        <TableHead>Comment</TableHead>
                                        <TableHead>Approved By</TableHead>
                                        {/* <TableHead className="text-center">Action</TableHead> */}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paymentHistories.map((history, index) => {
                                        return (
                                            <TableRow key={history.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{history.payment_details?.payment_method_name ?? "N/A"}</TableCell>
                                                <TableCell>
                                                    <PaymentHistoryStatusDropdown
                                                        paymentHistoryId={history.id}
                                                        currentStatus={history.payment_details?.payment_status_name}
                                                    />
                                                </TableCell>
                                                <TableCell>{history.payment_details?.payment_type_name ?? "N/A"}</TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(history.payment_details?.paid_amount)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(history.payment_details?.due_amount)}
                                                </TableCell>
                                                <TableCell className="max-w-[240px]">
                                                    {history.payment_details?.comment ?? "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {history.approved_by ?? "N/A"}
                                                </TableCell>
                                                {/* <TableCell className="text-center">
                                                    <PaymentHistoryStatusDropdown
                                                        paymentHistoryId={history.id}
                                                        currentStatus={history.payment_details?.payment_status_name}
                                                    />
                                                </TableCell> */}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
