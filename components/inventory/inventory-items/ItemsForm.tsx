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
import { createProductItem, updateProductItem, ProductItem } from "@/apiServices/inventoryItemsService";
import { ProductCategory } from "@/apiServices/inventoryCategoriesService";
import { Brand } from "@/apiServices/inventoryBrandsService";
import { Unit } from "@/apiServices/inventoryUnitsService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Camera, X } from "lucide-react";
import Image from "next/image";

interface ItemsFormProps {
    title: string;
    item?: ProductItem;
    categories?: ProductCategory[];
    brands?: Brand[];
    units?: Unit[];
}

interface FormValues {
    name: string;
    barcode: string;
    category_id: string;
    brand_id: string;
    unit_id: string;
    model: string;
    purchase_price: string;
    mrp_price: string;
    stock: string;
    description: string;
    specification: string;
    status: string;
    image: FileList | null;
}

export default function ItemsForm({
    title,
    item,
    categories = [],
    brands = [],
    units = [],
}: ItemsFormProps) {
    const router = useRouter();
    const [previewUrl, setPreviewUrl] = useState<string | null>(item?.image || null);
    const [isImageRemoved, setIsImageRemoved] = useState(false);

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
            name: "",
            barcode: "",
            category_id: "",
            brand_id: "",
            unit_id: "",
            model: "",
            purchase_price: "",
            mrp_price: "",
            stock: "",
            description: "",
            specification: "",
            status: "",
            image: null,
        },
    });

    useEffect(() => {
        if (item) {
            reset({
                name: item.name || "",
                barcode: item.barcode || "",
                category_id: item.category_id?.toString() || "",
                brand_id: item.brand_id?.toString() || "",
                unit_id: item.unit_id?.toString() || "",
                model: item.model || "",
                purchase_price: item.purchase_price?.toString() || "",
                mrp_price: item.mrp_price?.toString() || "",
                stock: item.stock?.toString() || "",
                description: item.description || "",
                specification: item.specification || "",
                status: item.status?.toString() || "",
                image: null,
            });
            if (item.image) {
                setPreviewUrl(item.image);
            } else {
                setPreviewUrl(null);
            }
            setIsImageRemoved(false);
        }
    }, [item, reset]);

    const imageFile = watch("image");

    useEffect(() => {
        if (imageFile && imageFile.length > 0) {
            setIsImageRemoved(false);
            const file = imageFile[0];
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [imageFile]);

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (key !== "image" && value !== undefined && value !== null && value !== "") {
                formData.append(key, value as string);
            }
        });

        if (values.image && values.image.length > 0) {
            formData.append("image", values.image[0]);
        } else if (isImageRemoved && item) {
            formData.append("image", "");
        }

        // For method spoofing on update
        if (item) {
            formData.append("_method", "PUT");
        }

        try {
            // Note: API expects POST for both create and update (with method spoofing) as implemented in the service
            const res = item
                ? await updateProductItem(Number(item.id), formData)
                : await createProductItem(formData);

                console.log("res--->",res);

            if (res.success) {
                reset();
                setPreviewUrl(null);
                setIsImageRemoved(false);
                toast.success(res.message || "Product saved successfully!");
                router.push("/inventory/inventory-items");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save product");
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
                    toast.error(res.message || "Failed to save product");
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

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6" encType="multipart/form-data">
                {/* Product Image Preview & Upload */}
                <div className="flex justify-start">
                    <div className="relative">
                        <div className="w-32 h-32 relative overflow-hidden border-2 border-dashed flex items-center justify-center bg-gray-50">
                            <Image
                                src={previewUrl || "/images/placeholder.png"}
                                alt="Product preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <label
                            htmlFor="product-image"
                            className="absolute bottom-1 right-1 bg-green-600 p-2 rounded-full cursor-pointer hover:bg-green-700 transition"
                        >
                            <Camera className="w-4 h-4 text-white" />
                        </label>
                        <input
                            id="product-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            {...register("image")}
                        />

                        {previewUrl && (
                            <Button
                                type="button"
                                className="absolute top-1 left-1 bg-red-600 p-2 rounded-full cursor-pointer hover:bg-red-700 transition"
                                onClick={() => {
                                    setPreviewUrl(null);
                                    setIsImageRemoved(true);
                                    setValue("image", null);
                                    toast.success("Product image removed");
                                }}
                            >
                                <X className="w-4 h-4 text-white" />
                            </Button>
                        )}
                    </div>
                    {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter product name" {...register("name")} />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Barcode */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Barcode</label>
                        <Input placeholder="Enter barcode" {...register("barcode")} />
                        {errors.barcode && <p className="text-sm text-red-500 mt-1">{errors.barcode?.message}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <Controller
                            name="category_id"
                            control={control}
                            render={({ field }) => (
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.category_id && <p className="text-sm text-red-500 mt-1">{errors.category_id.message}</p>}
                    </div>

                    {/* Brand */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Brand</label>
                        <Controller
                            name="brand_id"
                            control={control}
                            render={({ field }) => (
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Brand" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brands?.length > 0 ? (
                                            brands?.map((b) => (
                                                <SelectItem key={b.id} value={b.id.toString()}>
                                                    {b.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="none" disabled>
                                                No Brands Found
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.brand_id && <p className="text-sm text-red-500 mt-1">{errors.brand_id.message}</p>}
                    </div>

                    {/* Unit */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Unit</label>
                        <Controller
                            name="unit_id"
                            control={control}
                            render={({ field }) => (
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            units?.length > 0 ? (
                                                units?.map((u) => (
                                                    <SelectItem key={u.id} value={u.id.toString()}>
                                                        {u.name} ({u.full_name})
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="none" disabled>
                                                    No Units Found
                                                </SelectItem>
                                            )
                                        }
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.unit_id && <p className="text-sm text-red-500 mt-1">{errors.unit_id.message}</p>}
                    </div>

                    {/* Model */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Model</label>
                        <Input placeholder="Enter model" {...register("model")} />
                        {errors.model && <p className="text-sm text-red-500 mt-1">{errors.model.message}</p>}
                    </div>

                    {/* Purchase Price */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Purchase Price</label>
                        <Input type="number" step="0.01" placeholder="0.00" {...register("purchase_price")} />
                        {errors.purchase_price && <p className="text-sm text-red-500 mt-1">{errors.purchase_price.message}</p>}
                    </div>

                    {/* MRP Price */}
                    <div>
                        <label className="block text-sm font-medium mb-1">MRP Price</label>
                        <Input type="number" step="0.01" placeholder="0.00" {...register("mrp_price")} />
                        {errors.mrp_price && <p className="text-sm text-red-500 mt-1">{errors.mrp_price.message}</p>}
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Stock</label>
                        <Input type="number" placeholder="0" {...register("stock")} />
                        {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock.message}</p>}
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



                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea placeholder="Enter description" {...register("description")} rows={3} />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                    </div>

                    {/* Specification */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Specification</label>
                        <Textarea placeholder="Enter specification" {...register("specification")} rows={3} />
                        {errors.specification && <p className="text-sm text-red-500 mt-1">{errors.specification.message}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-lg cursor-pointer">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="text-white px-8 rounded-lg cursor-pointer">
                        {isSubmitting ? "Submitting..." : item ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
