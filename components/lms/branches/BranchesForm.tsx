"use client";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { addBranch, updateBranch, Branch} from "@/apiServices/branchService";
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

    const setFormError = (field: string, message: string) => {
        setError(field as keyof FormValues, { type: "server", message });
    };

    const submitHandler = async (values: FormValues) => {
        const payload = {
            name: values.name,
            code: values.code || undefined,
            district_id: Number(values.district_id),
            address: values.address || undefined,
            phone: values.phone.map((p) => p.value.trim()).filter(Boolean),
            email: values.email.map((e) => e.value.trim()).filter(Boolean),
            google_map: values.google_map || undefined,
            social_links: values.social_links
                .filter((s) => s.title && s.url.trim() !== "")
                .map((s) => ({ title: s.title, url: s.url.trim() })),
        };

        try {
            const res = branch
                ? await updateBranch(String(branch.id), payload)
                : await addBranch(payload);

            if (res.success) {
                reset();
                toast.success(res.message || "Branch saved successfully!");
                router.push("/lms/branches");
            } else if (res.errors) {
                console.log(res.errors);
                Object.entries(res.errors).forEach(([field, messages]) => {
                    if (messages.length > 0) {
                        setFormError(field, messages[0]);
                    }
                });
            } else {
                toast.error(res.message);
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

    console.log(errors);

    return (
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-0 h-auto">
                    <span className="text-xl">{"<"}</span>
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
                        className="rounded-lg border-green-600 text-green-600"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 rounded-lg"
                    >
                        {isSubmitting ? "Submitting..." : branch ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
