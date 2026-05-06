"use client";
import CourseSearchSelect from "@/components/common/CourseSearchSelect";
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
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CRMLead, createCRMLead, updateCRMLead } from "@/apiServices/crmLeadsService";
import { Course } from "@/apiServices/courseService";
import { CRMCategory } from "@/apiServices/crmCategoryService";
import { Branch } from "@/apiServices/branchService";

interface CRMLeadsFormProps {
    title: string;
    lead?: CRMLead;
    courses?: Course[];
    categories?: CRMCategory[];
    branches?: Branch[];
}

interface FormValues {
    name: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    referrer_name: string;
    referrer_phone: string;
    course_id: string;
    course_type: string;
    shift: string;
    status: string;
    source: string;
    category_id: string;
    branch_id: string;
    notes: string;
}

export default function CRMLeadsForm({
    title,
    lead,
    categories = [],
    branches = []
}: CRMLeadsFormProps) {
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
            name: lead?.name || "",
            phone: lead?.phone || "",
            whatsapp: lead?.whatsapp || "",
            email: lead?.email || "",
            address: lead?.address || "",
            referrer_name: lead?.referrer_name || "",
            referrer_phone: lead?.referrer_phone || "",
            course_id: lead?.course?.id?.toString() || "",
            course_type: lead?.course_type?.toString() || "1",
            shift: lead?.shift?.toString() || "1",
            status: lead?.status?.toString() || "1",
            source: lead?.source?.id?.toString() || "1",
            category_id: lead?.category?.id?.toString() || "",
            branch_id: lead?.branch?.id?.toString() || "",
            notes: lead?.notes || "",
        },
    });

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                formData.append(key, value as string);
            }
        });

        if (lead) {
            formData.append("_method", "PUT");
        }

        try {
            const res = lead
                ? await updateCRMLead(Number(lead.id), formData)
                : await createCRMLead(formData);

            if (res?.success) {
                reset();
                toast.success(res?.message || "Lead saved successfully!");
                router.push("/crm/leads");
            } else {
                if (res?.errors) {
                    toast.error(res?.message || "Failed to save lead");
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
                    toast.error(res?.message || "Failed to save lead");
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
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Button
                    variant="secondary"
                    onClick={() => router.back()}
                    className="cursor-pointer"
                >
                    <span className="text-sm">Go Back</span>
                </Button>
                {title}
            </h2>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter lead name" {...register("name")} />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Phone Number<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter phone number" {...register("phone")} />
                        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>

                    {/* WhatsApp */}
                    <div>
                        <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
                        <Input placeholder="Enter whatsapp number" {...register("whatsapp")} />
                        {errors.whatsapp && <p className="text-sm text-red-500 mt-1">{errors.whatsapp.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <Input type="email" placeholder="Enter email address" {...register("email")} />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <Input placeholder="Enter address" {...register("address")} />
                        {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
                    </div>

                    {/* Referrer Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Referrer Name</label>
                        <Input placeholder="Enter referrer name" {...register("referrer_name")} />
                        {errors.referrer_name && <p className="text-sm text-red-500 mt-1">{errors.referrer_name.message}</p>}
                    </div>

                    {/* Referrer Phone */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Referrer Phone</label>
                        <Input placeholder="Enter referrer phone" {...register("referrer_phone")} />
                        {errors.referrer_phone && <p className="text-sm text-red-500 mt-1">{errors.referrer_phone.message}</p>}
                    </div>

                    {/* Course */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Course</label>
                        <Controller
                            name="course_id"
                            control={control}
                            render={({ field }) => (
                                <CourseSearchSelect
                                    value={field.value}
                                    onValueChange={(val) => field.onChange(val || "")}
                                    className="w-full"
                                />
                            )}
                        />
                        {errors.course_id && <p className="text-sm text-red-500 mt-1">{errors.course_id.message}</p>}
                    </div>

                    {/* Course Type */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Course Type</label>
                        <Controller
                            name="course_type"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Course Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Online</SelectItem>
                                        <SelectItem value="2">Offline</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.course_type && <p className="text-sm text-red-500 mt-1">{errors.course_type.message}</p>}
                    </div>

                    {/* Shift */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Shift</label>
                        <Controller
                            name="shift"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Shift" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Morning</SelectItem>
                                        <SelectItem value="2">Evening</SelectItem>
                                        <SelectItem value="3">Night</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.shift && <p className="text-sm text-red-500 mt-1">{errors.shift.message}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">New</SelectItem>
                                        <SelectItem value="2">Busy</SelectItem>
                                        <SelectItem value="3">Interested</SelectItem>
                                        <SelectItem value="4">Follow Up</SelectItem>
                                        <SelectItem value="5">Enrolled</SelectItem>
                                        <SelectItem value="6">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
                    </div>

                    {/* Source */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Source</label>
                        <Controller
                            name="source"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Manual</SelectItem>
                                        <SelectItem value="2">Facebook</SelectItem>
                                        <SelectItem value="3">Website</SelectItem>
                                        <SelectItem value="4">API</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.source && <p className="text-sm text-red-500 mt-1">{errors.source.message}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <Controller
                            name="category_id"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.length ? (
                                            categories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="" disabled>
                                                No category found
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.category_id && <p className="text-sm text-red-500 mt-1">{errors.category_id.message}</p>}
                    </div>

                    {/* Branch */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Branch</label>
                        <Controller
                            name="branch_id"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches?.length ? (
                                            branches.map(b => (
                                                <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="" disabled>
                                                No branch found
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.branch_id && <p className="text-sm text-red-500 mt-1">{errors.branch_id.message}</p>}
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <Textarea placeholder="Enter any additional notes" {...register("notes")} rows={4} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 ">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-lg cursor-pointer">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white px-8 rounded-lg cursor-pointer">
                        {isSubmitting ? "Submitting..." : lead ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
