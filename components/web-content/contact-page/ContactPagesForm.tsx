"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
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
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { 
    createContactPage, 
    updateContactPage, 
    ContactPage 
} from "@/apiServices/contactPageAdminService";
import { Camera, X, Plus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ContactPageFormProps {
    title: string;
    contactPage?: ContactPage;
}

interface FormValues {
    page_title: string;
    page_subtitle: string;
    emails: { value: string }[];
    phones: { value: string }[];
    address: string;
    office_hours: string;
    google_map: string;
    meta_title: string;
    meta_description: string;
    schema: string;
    status: string;
    page_banner?: FileList;
}

export default function ContactPagesForm({
    title,
    contactPage,
}: ContactPageFormProps) {
    const [previewBanner, setPreviewBanner] = useState<string | null>(
        contactPage?.page_banner || null
    );
    const [isBannerRemoved, setIsBannerRemoved] = useState(false);
    const [metaTags, setMetaTags] = useState<string[]>(contactPage?.meta_tag || []);
    const [tagInput, setTagInput] = useState("");
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
            page_title: contactPage?.page_title || "",
            page_subtitle: contactPage?.page_subtitle || "",
            emails: contactPage?.email 
                ? contactPage.email.map(v => ({ value: v })) 
                : [{ value: "" }],
            phones: contactPage?.phone 
                ? contactPage.phone.map(v => ({ value: v })) 
                : [{ value: "" }],
            address: contactPage?.address || "",
            office_hours: contactPage?.office_hours || "",
            google_map: contactPage?.google_map || "",
            meta_title: contactPage?.meta_title || "",
            meta_description: contactPage?.meta_description || "",
            schema: contactPage?.schema || "",
            status: contactPage?.status?.toString() || "1",
            page_banner: undefined,
        },
    });

    const { 
        fields: emailFields, 
        append: appendEmail, 
        remove: removeEmail 
    } = useFieldArray({
        control,
        name: "emails"
    });

    const { 
        fields: phoneFields, 
        append: appendPhone, 
        remove: removePhone 
    } = useFieldArray({
        control,
        name: "phones"
    });

    const bannerFile = watch("page_banner");

    useEffect(() => {
        if (bannerFile && bannerFile.length > 0) {
            setIsBannerRemoved(false);
            const file = bannerFile[0];
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => setPreviewBanner(e.target?.result as string);
                reader.readAsDataURL(file);
            }
        }
    }, [bannerFile]);

    const handleAddTag = () => {
        const trimmed = tagInput.trim().replace(/,$/, "");
        if (trimmed && !metaTags.includes(trimmed)) {
            setMetaTags((prev) => [...prev, trimmed]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setMetaTags((prev) => prev.filter((t) => t !== tag));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            handleAddTag();
        }
    };

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();
        
        // Convert array of objects to comma-separated strings
        const emailString = values.emails.map(e => e.value).filter(v => v !== "").join(",");
        const phoneString = values.phones.map(p => p.value).filter(v => v !== "").join(",");

        // Append text fields
        Object.entries(values).forEach(([key, value]) => {
            if (key !== "page_banner" && key !== "emails" && key !== "phones" && value !== undefined && value !== null) {
                formData.append(key, value as string);
            }
        });

        formData.append("email", emailString);
        formData.append("phone", phoneString);

        // Append Meta Tags
        metaTags.forEach((tag) => formData.append("meta_tag[]", tag));

        // Append banner image
        if (values.page_banner && values.page_banner.length > 0) {
            formData.append("page_banner", values.page_banner[0]);
        } else if (isBannerRemoved && contactPage) {
            formData.append("page_banner", "");
        }

        try {
            const res = contactPage
                ? await updateContactPage(Number(contactPage.id), formData)
                : await createContactPage(formData);
                
            console.log("API Response:", res);
            if (res.success) {
                toast.success(res.message || "Contact page saved successfully!");
                router.push("/web-content/contact-page");
                router.refresh(); 
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save contact page");
                    Object.entries(res.errors).forEach(([field, messages]) => {
                        const errorMessage = Array.isArray(messages)
                            ? messages[0]
                            : messages;
                        
                        let fieldName = field;
                        if (field === "email") fieldName = "emails.0.value";
                        if (field === "phone") fieldName = "phones.0.value";

                        setError(fieldName as any, {
                            type: "server",
                            message: errorMessage as string,
                        });
                    });
                } else {
                    toast.error(res.message || "Failed to save contact page");
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
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-0 h-auto">
                    <span className="text-xl">{"<"}</span>
                </Button>
                {title}
            </h2>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                {/* Banner Image Preview & Upload */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Page Banner</label>
                    <div className="flex justify-start">
                        <div className="relative">
                            <div className="w-64 h-32 relative rounded-xl overflow-hidden border-2 border-dashed flex items-center justify-center bg-muted">
                                {previewBanner ? (
                                    <Image
                                        src={previewBanner}
                                        alt="Banner preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                        <Camera className="w-8 h-8" />
                                        <span className="text-xs">Upload Banner</span>
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="page-banner"
                                className="absolute bottom-1 right-1 bg-primary p-2 rounded-full cursor-pointer hover:bg-primary/90 transition shadow-lg"
                            >
                                <Camera className="w-4 h-4 text-primary-foreground" />
                            </label>
                            <input
                                id="page-banner"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                {...register("page_banner")}
                            />

                            {previewBanner && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 left-1 h-8 w-8 rounded-full"
                                    onClick={() => {
                                        setPreviewBanner(null);
                                        setIsBannerRemoved(true);
                                        setValue("page_banner", undefined);
                                        toast.success("Page banner removed");
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                    {errors.page_banner && <p className="text-sm text-red-500 mt-1">{errors.page_banner.message as string}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Page Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Page Title <span className="text-red-500">*</span></label>
                        <Input placeholder="e.g. Contact Us" {...register("page_title")} />
                        {errors.page_title && <p className="text-sm text-red-500 mt-1">{errors.page_title.message}</p>}
                    </div>

                    {/* Page Subtitle */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Page Subtitle</label>
                        <Input placeholder="Enter subtitle" {...register("page_subtitle")} />
                        {errors.page_subtitle && <p className="text-sm text-red-500 mt-1">{errors.page_subtitle.message}</p>}
                    </div>

                    {/* Dynamic Phones */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium">Phone Numbers <span className="text-red-500">*</span></label>
                        {phoneFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-center">
                                <div className="flex-1">
                                    <Input 
                                        placeholder="01XXXXXXXXX" 
                                        {...register(`phones.${index}.value` as const)} 
                                    />
                                    {errors.phones?.[index]?.value && (
                                        <p className="text-xs text-red-500 mt-1">{errors.phones[index]?.value?.message}</p>
                                    )}
                                </div>
                                {phoneFields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="shrink-0 h-10 w-10"
                                        onClick={() => removePhone(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendPhone({ value: "" })}
                            className="bg-white"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add Phone
                        </Button>
                    </div>

                    {/* Dynamic Emails */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium">Emails <span className="text-red-500">*</span></label>
                        {emailFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-center">
                                <div className="flex-1">
                                    <Input 
                                        placeholder="example@mail.com" 
                                        {...register(`emails.${index}.value` as const)} 
                                    />
                                    {errors.emails?.[index]?.value && (
                                        <p className="text-xs text-red-500 mt-1">{errors.emails[index]?.value?.message}</p>
                                    )}
                                </div>
                                {emailFields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="shrink-0 h-10 w-10"
                                        onClick={() => removeEmail(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendEmail({ value: "" })}
                            className="bg-white"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add Email
                        </Button>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Address <span className="text-red-500">*</span></label>
                        <Input placeholder="Enter full address" {...register("address")} />
                        {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
                    </div>

                    {/* Office Hours & Google Map */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Office Hours</label>
                        <Input placeholder="e.g. Mon-Fri, 9am-5pm" {...register("office_hours")} />
                        {errors.office_hours && <p className="text-sm text-red-500 mt-1">{errors.office_hours.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Google Map URL</label>
                        <Input placeholder="https://maps.google.com/..." {...register("google_map")} />
                        {errors.google_map && <p className="text-sm text-red-500 mt-1">{errors.google_map.message}</p>}
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
                                        <SelectItem value="1">Active</SelectItem>
                                        <SelectItem value="0">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
                    </div>

                    {/* SEO Section */}
                    <div className="md:col-span-2 mt-4">
                        <h3 className="text-md font-semibold border-b pb-2 mb-4">SEO & Metadata</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Meta Title</label>
                                <Input placeholder="Enter meta title" {...register("meta_title")} />
                                {errors.meta_title && <p className="text-sm text-red-500 mt-1">{errors.meta_title.message}</p>}
                            </div>

                            {/* Tags Input */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Meta Tags</label>
                                <div className="flex gap-2">
                                    <Input 
                                        placeholder="Type a tag and press Enter or comma..." 
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                    />
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={handleAddTag}
                                        className="shrink-0"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Press Enter or comma to add a tag.</p>
                                
                                {metaTags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {metaTags.map((tag) => (
                                            <Badge 
                                                key={tag} 
                                                variant="secondary" 
                                                className="flex items-center gap-1 cursor-pointer hover:bg-destructive hover:text-white transition"
                                                onClick={() => handleRemoveTag(tag)}
                                            >
                                                {tag}
                                                <X className="h-3 w-3" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Meta Description</label>
                                <Textarea placeholder="Enter meta description" {...register("meta_description")} rows={2} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Schema</label>
                                <Textarea placeholder="Enter JSON-LD schema or other structured data" {...register("schema")} rows={3} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                        {isSubmitting ? "Saving..." : contactPage ? "Update Page" : "Create Page"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
