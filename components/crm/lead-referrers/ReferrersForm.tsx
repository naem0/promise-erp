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
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { CRMReferrer, createCRMReferrer, updateCRMReferrer } from "@/apiServices/crmReferrerService";
import { Branch } from "@/apiServices/branchService";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReferrerFormProps {
    title: string;
    referrer?: CRMReferrer;
    branches?: Branch[];
}

interface FormValues {
    name: string;
    email: string;
    phone: string;
    branch_id: string;
    institute_name: string;
    address: string;
    status: string;
    profile_photo?: FileList;
}

export default function ReferrersForm({
    title,
    referrer,
    branches = [],
}: ReferrerFormProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(
        referrer?.profile_photo || null
    );
    const [isImageRemoved, setIsImageRemoved] = useState(false);
    const router = useRouter();

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
            name: referrer?.name || "",
            email: referrer?.email || "",
            phone: referrer?.phone || "",
            branch_id: referrer
                ? (branches.find(b => b.name === referrer.branch_name)?.id?.toString() || "")
                : "",
            institute_name: referrer?.institute_name || "",
            address: referrer?.address || "",
            status: referrer?.status !== undefined ? referrer?.status.toString() : "1",
            profile_photo: undefined,
        },
    });

    const imageFile = watch("profile_photo");

    useEffect(() => {
        if (imageFile && imageFile.length > 0) {
            setIsImageRemoved(false);
            const file = imageFile[0];
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => setPreviewImage(e.target?.result as string);
                reader.readAsDataURL(file);
            }
        }
    }, [imageFile]);

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("phone", values.phone);

        if (values.email) {
            formData.append("email", values.email);
        }
        if (values.branch_id) {
            formData.append("branch_id", values.branch_id);
        }
        if (values.institute_name) {
            formData.append("institute_name", values.institute_name);
        }
        if (values.address) {
            formData.append("address", values.address);
        }
        formData.append("status", values.status);

        if (values.profile_photo && values.profile_photo.length > 0) {
            formData.append("profile_photo", values.profile_photo[0]);
        } else if (isImageRemoved && referrer) {
            formData.append("profile_photo", "");
        }

        try {
            const res = referrer
                ? await updateCRMReferrer(Number(referrer.id), formData)
                : await createCRMReferrer(formData);

            if (res.success) {
                reset();
                setPreviewImage(null);
                toast.success(res.message || "Referrer saved successfully!");
                router.push("/crm/lead-referrers");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save referrer");
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
                    toast.error(res.message || "Failed to save referrer");
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
                    size="sm"
                    onClick={() => router.back()}
                    className="cursor-pointer"
                >
                    Go Back
                </Button>
                {title}
            </h2>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                {/* Profile Photo Preview & Upload */}
                <div className="flex justify-start">
                    <div className="relative">
                        <div className="w-32 h-32 relative rounded-xl overflow-hidden border-2 border-dashed flex items-center justify-center bg-slate-50">
                            <Image
                                src={previewImage || "/images/placeholder.png"}
                                alt="Profile photo preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <label
                            htmlFor="referrer-photo"
                            className="absolute bottom-1 right-1 bg-green-600 p-2 rounded-full cursor-pointer hover:bg-green-700 transition shadow-md"
                        >
                            <Camera className="w-4 h-4 text-white" />
                        </label>
                        <input
                            id="referrer-photo"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            {...register("profile_photo")}
                        />

                        {previewImage && (
                            <Button
                                type="button"
                                variant="destructive"
                                className="absolute top-1 left-1 p-2 h-auto rounded-full shadow-md"
                                onClick={() => {
                                    setPreviewImage(null);
                                    setIsImageRemoved(true);
                                    setValue("profile_photo", undefined);
                                    toast.success("Profile photo removed");
                                }}
                            >
                                <X className="w-4 h-4 text-white cursor-pointer" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Name<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter referrer name" {...register("name")} />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Phone Number<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter phone number" {...register("phone")} />
                        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Email Address</label>
                        <Input type="email" placeholder="Enter email address" {...register("email")} />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Branch Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Branch Name</label>
                        <Controller
                            name="branch_id"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches?.length === 0 ? (
                                            <SelectItem value="none" disabled>
                                                No branches available
                                            </SelectItem>
                                        ) : (
                                            branches?.map((branch) => (
                                                <SelectItem key={branch.id} value={branch.id.toString()}>
                                                    {branch.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.branch_id && <p className="text-sm text-red-500 mt-1">{errors.branch_id.message}</p>}
                    </div>

                    {/* Institute Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Institute Name</label>
                        <Input placeholder="Enter institute name" {...register("institute_name")} />
                        {errors.institute_name && <p className="text-sm text-red-500 mt-1">{errors.institute_name.message}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Status</label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
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
                        {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 text-slate-700">Address</label>
                        <Textarea placeholder="Enter referrer address" {...register("address")} rows={3} />
                        {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-lg cursor-pointer">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="cursor-pointer text-white">
                        {isSubmitting ? "Submitting..." : referrer ? "Update Referrer" : "Add Referrer"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
