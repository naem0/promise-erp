"use client";
import { useEffect } from "react";
import { Controller, useForm, useFieldArray, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createBranch, updateBranch, Branch } from "@/apiServices/branchService";
import { Plus, X, Globe } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface District {
    id: number;
    name: string;
}

interface BranchFormProps {
    title: string;
    branch?: Branch;
    districts?: District[];
}

interface SocialLinkFormValue {
    title: string;
    url: string;
}

interface FormValues {
    name: string;
    code: string;
    district_id: string;
    address: string;
    phone: { value: string }[];
    email: { value: string }[];
    google_map: string;
    social_links: SocialLinkFormValue[];
}

const SOCIAL_MEDIA_OPTIONS = [
    "Facebook",
    "Twitter",
    "Instagram",
    "LinkedIn",
    "YouTube",
    "Other",
];

export default function BranchesForm({
    title,
    branch,
    districts = [],
}: BranchFormProps) {
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
            name: branch?.name || "",
            code: branch?.code || "",
            district_id: branch?.district?.id?.toString() || "",
            address: branch?.address || "",
            phone: branch?.phone?.map((p) => ({ value: p })) || [{ value: "" }],
            email: branch?.email?.map((e) => ({ value: e })) || [{ value: "" }],
            google_map: branch?.google_map || "",
            social_links:
                branch?.social_links?.map((s) => ({
                    title: s.title,
                    url: s.url,
                })) || [{ title: "Facebook", url: "" }],
        },
    });

    const {
        fields: phoneFields,
        append: appendPhone,
        remove: removePhone,
    } = useFieldArray({ control, name: "phone" });

    const {
        fields: emailFields,
        append: appendEmail,
        remove: removeEmail,
    } = useFieldArray({ control, name: "email" });

    const {
        fields: socialFields,
        append: appendSocial,
        remove: removeSocial,
    } = useFieldArray({ control, name: "social_links" });

    useEffect(() => {
        if (branch) {
            reset({
                name: branch.name || "",
                code: branch.code || "",
                district_id: branch.district?.id?.toString() || "",
                address: branch.address || "",
                phone: branch.phone?.map((p) => ({ value: p })) || [{ value: "" }],
                email: branch.email?.map((e) => ({ value: e })) || [{ value: "" }],
                google_map: branch.google_map || "",
                social_links:
                    branch.social_links?.map((s) => ({
                        title: s.title,
                        url: s.url,
                    })) || [{ title: "Facebook", url: "" }],
            });
        }
    }, [branch, reset]);

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                if (key === "phone" || key === "email") {
                    const arr = value as { value: string }[];
                    arr.forEach((item) => {
                        if (item.value.trim() !== "") {
                            formData.append(`${key}[]`, item.value.trim());
                        }
                    });
                } else if (key === "social_links") {
                    const links = value as SocialLinkFormValue[];
                    links.forEach((link, index) => {
                        if (link.title && link.url.trim() !== "") {
                            formData.append(`social_links[${index}][title]`, link.title);
                            formData.append(`social_links[${index}][url]`, link.url.trim());
                        }
                    });
                } else {
                    formData.append(key, value as string);
                }
            }
        });

        if (branch) {
            formData.append("_method", "PUT");
        }

        try {
            const res = branch
                ? await updateBranch(String(branch.id), formData)
                : await createBranch(formData);

            if (res.success) {
                reset();
                toast.success(res.message || "Branch saved successfully!");
                router.push("/lms/branches");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save branch");
                    Object.entries(res.errors).forEach(([field, messages]) => {
                        const errorMessage = Array.isArray(messages)
                            ? messages[0]
                            : messages;
                        let targetField = field;
                        // Map Laravel array validation keys (e.g. phone.0) to RHF nested array fields (phone.0.value)
                        if (/^(phone|email)\.\d+$/.test(field)) {
                            targetField = `${field}.value`;
                        }

                        setError(targetField as Path<FormValues>, {
                            type: "server",
                            message: errorMessage as string,
                        });
                    });
                } else {
                    toast.error(res.message || "Failed to save branch");
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
                    {/* Branch Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Branch Name<span className="text-red-500">*</span>
                        </label>
                        <Input placeholder="Enter branch name" {...register("name")} />
                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Branch Code */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Branch Code
                        </label>
                        <Input placeholder="e.g. BR-001" {...register("code")} />
                        {errors.code && (
                            <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>
                        )}
                    </div>

                    {/* District */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            District<span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="district_id"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select District" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {districts.map((district) => (
                                            <SelectItem key={district.id} value={district.id.toString()}>
                                                {district.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.district_id && (
                            <p className="text-sm text-red-500 mt-1">{errors.district_id.message}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <Input placeholder="Enter branch address" {...register("address")} />
                        {errors.address && (
                            <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                        )}
                    </div>

                    {/* Google Map */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Google Map URL</label>
                        <Input placeholder="Google Map link" {...register("google_map")} />
                        {errors.google_map && (
                            <p className="text-sm text-red-500 mt-1">{errors.google_map.message}</p>
                        )}
                    </div>
                </div>

                {/* Phone & Email Dynamic Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Phones */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Phone Numbers</label>
                        <div className="flex flex-col gap-2">
                            {phoneFields.map((field, index) => (
                                <div key={field.id} className="flex flex-col gap-1">
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            placeholder="01XXXXXXXXX"
                                            className={`flex-1 ${errors.phone?.[index]?.value ? "border-red-500" : ""}`}
                                            {...register(`phone.${index}.value` as const)}
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="shrink-0 h-10 w-10"
                                            onClick={() => removePhone(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {errors.phone?.[index]?.value && (
                                        <p className="text-sm text-red-500">{errors.phone[index]?.value?.message}</p>
                                    )}
                                </div>
                            ))}
                            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-fit"
                                onClick={() => appendPhone({ value: "" })}
                            >
                                <Plus className="w-4 h-4 mr-1" /> Add Phone
                            </Button>
                        </div>
                    </div>

                    {/* Emails */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Emails</label>
                        <div className="flex flex-col gap-2">
                            {emailFields.map((field, index) => (
                                <div key={field.id} className="flex flex-col gap-1">
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            type="email"
                                            placeholder="example@mail.com"
                                            className={`flex-1 ${errors.email?.[index]?.value ? "border-red-500" : ""}`}
                                            {...register(`email.${index}.value` as const)}
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="shrink-0 h-10 w-10"
                                            onClick={() => removeEmail(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {errors.email?.[index]?.value && (
                                        <p className="text-sm text-red-500">{errors.email[index]?.value?.message}</p>
                                    )}
                                </div>
                            ))}
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-fit"
                                onClick={() => appendEmail({ value: "" })}
                            >
                                <Plus className="w-4 h-4 mr-1" /> Add Email
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Social Media Links */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        <Globe className="inline w-4 h-4 mr-1" />
                        Social Media Links
                    </label>
                    <div className="flex flex-col gap-3">
                        {socialFields.map((field, index) => (
                            <div key={field.id} className="flex flex-col gap-1">
                                <div className="flex flex-col md:flex-row gap-2 items-start">
                                    <Controller
                                        name={`social_links.${index}.title`}
                                        control={control}
                                        render={({ field: selectField }) => (
                                            <Select value={selectField.value} onValueChange={selectField.onChange}>
                                                <SelectTrigger className="w-full md:w-1/3">
                                                    <SelectValue placeholder="Select Social Media" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SOCIAL_MEDIA_OPTIONS.map((option) => (
                                                        <SelectItem key={option} value={option}>
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    <Input
                                        placeholder="https://facebook.com/branch"
                                        {...register(`social_links.${index}.url` as const)}
                                        className={`flex-1 w-full ${errors.social_links?.[index]?.url ? "border-red-500" : ""}`}
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="shrink-0 h-10 w-10"
                                        onClick={() => removeSocial(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                {errors.social_links?.[index]?.url && (
                                    <p className="text-sm text-red-500">{errors.social_links[index]?.url?.message}</p>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-fit"
                            onClick={() => appendSocial({ title: "", url: "" })}
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add Social Link
                        </Button>
                    </div>
                    {errors.social_links && <p className="text-sm text-red-500 mt-1">{errors.social_links.message}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="rounded-lg border-green-600 text-green-600 cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 rounded-lg cursor-pointer"
                    >
                        {isSubmitting ? "Submitting..." : branch ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
