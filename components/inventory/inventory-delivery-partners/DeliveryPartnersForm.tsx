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
import { useEffect } from "react";
import { createDeliveryPartner, updateDeliveryPartner, DeliveryPartner } from "@/apiServices/inventoryDeliveryPartnersService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeliveryPartnersFormProps {
    title: string;
    partner?: DeliveryPartner;
}

interface FormValues {
    name: string;
    contact: string;
    email: string;
    description: string;
    address: string;
    status: string;
}

export default function DeliveryPartnersForm({
    title,
    partner,
}: DeliveryPartnersFormProps) {
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
            name: "",
            contact: "",
            email: "",
            description: "",
            address: "",
            status: "1",
        },
    });

    useEffect(() => {
        if (partner) {
            reset({
                name: partner.name || "",
                contact: partner.contact || "",
                email: partner.email || "",
                description: partner.description || "",
                address: partner.address || "",
                status: partner.status?.toString() || "1",
            });
        }
    }, [partner, reset]);

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                formData.append(key, value);
            }
        });

        try {
            const res = partner
                ? await updateDeliveryPartner(Number(partner.id), formData)
                : await createDeliveryPartner(formData);
                
            if (res.success) {
                reset();
                toast.success(res.message || "Delivery partner saved successfully!");
                router.push("/inventory/inventory-delivery-partners");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save delivery partner");
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
                    toast.error(res.message || "Failed to save delivery partner");
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter delivery partner name" {...register("name", { required: "Name is required" })} />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Contact */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Contact<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter contact number" {...register("contact", { required: "Contact is required" })} />
                        {errors.contact && <p className="text-sm text-red-500 mt-1">{errors.contact.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input type="email" placeholder="Enter email address" {...register("email")} />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
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
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <Textarea placeholder="Enter address" {...register("address")} rows={3} />
                        {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea placeholder="Enter description" {...register("description")} rows={4} />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-lg cursor-pointer">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="text-white px-8 rounded-lg cursor-pointer">
                        {isSubmitting ? "Submitting..." : partner ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
