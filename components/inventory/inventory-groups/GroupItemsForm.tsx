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
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { createGroupItem, updateGroupItem, GroupItem, GroupItemDetailProduct } from "@/apiServices/inventoryGroupItemsService";
import { getProductItems, ProductItem } from "@/apiServices/inventoryItemsService";
import { ProductCategory } from "@/apiServices/inventoryCategoriesService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { X, Search, Package, Info, Check } from "lucide-react";
import Image from "next/image";

interface GroupItemsFormProps {
    title: string;
    item?: GroupItem;
    categories?: ProductCategory[];
    productsList?: ProductItem[]; // Initial listing for fallback suggestions
}

interface FormValues {
    name: string;
    barcode: string;
    category_id: string;
    status: string;
}

interface SelectedProductState {
    id: number;
    name: string;
    quantity: number;
    details?: string;
    category_name?: string ;
    image?: string | null;
    model?: string;
}

export default function GroupItemsForm({
    title,
    item,
    categories = [],
    productsList = [],
}: GroupItemsFormProps) {
    const router = useRouter();
    const [selectedProducts, setSelectedProducts] = useState<SelectedProductState[]>([]);
    
    // Live Autocomplete States
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<ProductItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

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
            barcode: "",
            category_id: "",
            status: "1",
        },
    });

    useEffect(() => {
        if (item) {
            const catId = item.category_id || item.category?.id || "";
            reset({
                name: item.name || "",
                barcode: item.barcode || "",
                category_id: catId.toString() || "",
                status: item.status?.toString() || "1",
            });

            const rawList = item.items_list || item.items || item.products || item.details;
            if (rawList && Array.isArray(rawList)) {
                setSelectedProducts(
                    (rawList as GroupItemDetailProduct[]).map(prod => {
                        const prodId = prod.product_id || prod.id;
                        
                        const fullProduct = productsList.find(p => String(p.id) === String(prodId));

                        const prodName = prod.product_name || prod.name || fullProduct?.name || "";
                        const qty = prod.quantity || prod.pivot?.quantity || 1;
                        const details = prod.details || prod.pivot?.details || "";
                        return {
                            id: Number(prodId),
                            name: prodName,
                            quantity: Number(qty),
                            details: String(details),
                            category_name: fullProduct?.category_name || prod.category_name || item.category_name || "",
                            image: fullProduct?.image || prod.image || null,
                            model: fullProduct?.model || prod.model || "",
                        };
                    })
                );
            }
        } else {
            reset({
                name: "",
                barcode: "",
                category_id: "",
                status: "1",
            });
            setSelectedProducts([]);
        }
    }, [item, reset]);

    // Populate initial dropdown results from categories pre-fetched products list
    useEffect(() => {
        if (productsList && productsList.length > 0) {
            setSearchResults(productsList.slice(0, 10));
        }
    }, [productsList]);

    // Live search debounced API hook
    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            if (productsList && productsList.length > 0) {
                setSearchResults(productsList.slice(0, 10));
            } else {
                setSearchResults([]);
            }
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await getProductItems({ search: searchQuery, per_page: 20 });
                if (res && res.success && res.data?.products) {
                    setSearchResults(res.data.products);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error("Live search query error:", error);
            } finally {
                setIsSearching(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, productsList]);

    const handleSelectProduct = (prod: ProductItem) => {
        const prodId = prod.id;
        const isAdded = selectedProducts.some(p => p.id === prodId);
        
        if (isAdded) {
            handleRemoveProduct(prodId);
            return;
        }

        setSelectedProducts([
            ...selectedProducts, 
            { 
                id: prod.id, 
                name: prod.name, 
                quantity: 1, // Default to 1 unit
                details: "", // Default to empty string notes
                category_name: prod.category_name,
                image: prod.image,
                model: prod.model,
            }
        ]);
        
        setSearchQuery(""); // Clear search bar instantly for rapid additions
        setShowDropdown(false);
        toast.success(`${prod.name} added. Configure quantity and details below.`);
    };

    const handleRemoveProduct = (id: number) => {
        setSelectedProducts(selectedProducts.filter(p => p.id !== id));
        toast.success("Product removed from group.");
    };

    const handleUpdateQuantity = (id: number, val: string) => {
        const qty = Number(val);
        if (isNaN(qty) || qty < 1) return;
        setSelectedProducts(prev => 
            prev.map(p => p.id === id ? { ...p, quantity: qty } : p)
        );
    };

    const handleUpdateDetails = (id: number, val: string) => {
        setSelectedProducts(prev => 
            prev.map(p => p.id === id ? { ...p, details: val } : p)
        );
    };

    const submitHandler = async (values: FormValues) => {
        const productIds = selectedProducts.map(p => p.id);
        const detailedItems = selectedProducts.map(p => ({
            product_id: p.id,
            quantity: p.quantity,
            details: p.details || ""
        }));
        
        const payload = {
            id: item ? Number(item.id) : undefined,
            name: values.name,
            barcode: values.barcode || undefined,
            category_id: values.category_id && values.category_id.trim() !== "" ? Number(values.category_id.trim()) : null,
            status: Number(values.status),
            products: productIds,
            product_ids: productIds,
            items: detailedItems,
            items_list: detailedItems,
        };

        try {
            const res = item
                ? await updateGroupItem(Number(item.id), payload)
                : await createGroupItem(payload);
                
            if (res.success) {
                reset();
                setSelectedProducts([]);
                toast.success(res.message || "Group item saved successfully!");
                router.push("/inventory/inventory-groups");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save group item");
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
                    toast.error(res.message || "Failed to save group item");
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
                        <label className="block text-sm font-medium mb-1">Name<span className="text-red-500"> *</span></label>
                        <Input placeholder="Enter group item name" {...register("name")} />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
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

                    {/* Barcode */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Barcode</label>
                        <Input placeholder="Enter barcode" {...register("barcode")} />
                        {errors.barcode && <p className="text-sm text-red-500 mt-1">{errors.barcode.message}</p>}
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Category <span className="text-red-500">*</span></label>
                        <Controller
                            name="category_id"
                            control={control}
                            render={({ field }) => (
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        
                                        {
                                            categories.length === 0 ? (
                                                <SelectItem value="0">No categories found</SelectItem>
                                            ) : (
                                                categories.map(c => (
                                                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                                ))
                                            )
                                        }
                                        
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.category_id && <p className="text-sm text-red-500 mt-1">{errors.category_id.message}</p>}
                    </div>

                    {/* Autocomplete Product Search Section */}
                    <div className="md:col-span-2 pt-4 mt-2">
                        <label className="block text-sm font-semibold mb-2 text-slate-800">Add Items to Group</label>
                        
                        {/* Streamlined Autocomplete Container */}
                        <div className="relative w-full">
                            <label className="block text-xs text-slate-500 mb-1">Search & Click to Add Item<span className="text-red-500"> *</span></label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input 
                                    placeholder="Type item name to search..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowDropdown(true);
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                    className="pl-9 h-10"
                                />
                                {isSearching && (
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[10px] text-slate-400 font-mono">
                                        Searching...
                                    </span>
                                )}
                            </div>

                            {/* Floating Autocomplete Suggestions Dropdown */}
                            {showDropdown && searchResults.length > 0 && (
                                <div className="absolute left-0 right-0 z-50 mt-1 max-h-65 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl divide-y divide-slate-100">
                                    {searchResults.map((prod) => {
                                        const isAdded = selectedProducts.some(p => p.id === prod.id);
                                        return (
                                            <div
                                                key={prod.id}
                                                onClick={() => handleSelectProduct(prod)}
                                                className={`px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm flex justify-between items-center transition ${
                                                    isAdded ? "bg-blue-50/40 text-primary hover:bg-blue-50/60" : ""
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {/* Selection Indicator */}
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200 ${
                                                        isAdded 
                                                            ? "bg-primary border-primary text-white scale-100 shadow-sm" 
                                                            : "border-slate-300 bg-white"
                                                    }`}>
                                                        {isAdded && <Check className="w-3.5 h-3.5 stroke-3" />}
                                                    </div>

                                                    {/* Product Image Thumbnail */}
                                                    <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                                                        {prod.image ? (
                                                            <Image src={prod.image} alt={prod.name} width={36} height={36} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package className="w-4 h-4 text-slate-300" />
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <span className={`font-medium transition-colors ${
                                                            isAdded ? "text-primary font-semibold" : "text-slate-800"
                                                        }`}>{prod.name}</span>
                                                        {prod.category_name && (
                                                            <span className="text-[10px] text-slate-400 font-medium">
                                                                {prod.category_name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {prod.model && (
                                                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md border ${
                                                        isAdded 
                                                            ? "bg-blue-100/60 border-blue-200 text-blue-700" 
                                                            : "bg-slate-50 border-slate-150 text-slate-400"
                                                    }`}>
                                                        {prod.model}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {showDropdown && searchQuery.trim().length >= 2 && !isSearching && searchResults.length === 0 && (
                                <div className="absolute left-0 right-0 z-50 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-4 text-center text-xs text-slate-400">
                                    No products found matching {searchQuery}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Associated Products Premium Builder Row List */}
                    {selectedProducts.length > 0 ? (
                        <div className="md:col-span-2 space-y-3 mt-2">
                            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                Selected Products 
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 px-2 font-normal">
                                    {selectedProducts.length}
                                </Badge>
                            </h4>
                            
                            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                                {selectedProducts.map((prod) => (
                                    <div 
                                        key={prod.id} 
                                        className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-slate-50/50 transition duration-100 animate-in fade-in zoom-in-95"
                                    >
                                        {/* Product Image Thumbnail */}
                                        <div className="w-12 h-12 relative rounded-xl border border-slate-100 overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center shadow-inner">
                                            {prod.image ? (
                                                <Image src={prod.image} alt={prod.name} width={48} height={48} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-5 h-5 text-slate-300" />
                                            )}
                                        </div>

                                        {/* Product Info Center */}
                                        <div className="flex-1 min-w-[200px]">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">
                                                    {prod.category_name || "Product Item"}
                                                </span>
                                                {prod.model && (
                                                    <Badge variant="outline" className="text-[9px] px-1 py-0 border-slate-200 text-slate-400 font-mono leading-none">
                                                        {prod.model}
                                                    </Badge>
                                                )}
                                            </div>
                                            <h4 className="font-semibold text-slate-800 text-sm leading-snug mt-0.5 truncate" title={prod.name}>
                                                {prod.name}
                                            </h4>
                                        </div>

                                        {/* Dynamic Inline Configuration Fields */}
                                        <div className="flex flex-row items-center gap-3 flex-1 sm:flex-initial w-full sm:w-auto min-w-[280px] lg:min-w-[400px]">
                                            {/* Inline Quantity Input */}
                                            <div className="w-24 shrink-0">
                                                <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Quantity</span>
                                                <Input 
                                                    type="number"
                                                    min="1"
                                                    value={prod.quantity}
                                                    onChange={(e) => handleUpdateQuantity(prod.id, e.target.value)}
                                                    className="h-9 font-mono text-center"
                                                />
                                            </div>

                                            {/* Inline Details/Notes Input */}
                                            <div className="flex-1">
                                                <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Item Details/Notes</span>
                                                <Input 
                                                    placeholder="e.g. Details for item 1"
                                                    value={prod.details || ""}
                                                    onChange={(e) => handleUpdateDetails(prod.id, e.target.value)}
                                                    className="h-9 text-slate-700 text-xs sm:text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Remove Action Button */}
                                        <div className="shrink-0 flex items-center justify-center pl-4 border-l border-slate-100 h-10">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProduct(prod.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition cursor-pointer"
                                                title="Remove product"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="md:col-span-2 border border-dashed rounded-2xl p-6 bg-slate-50/50 text-center text-slate-400 text-sm py-8">
                            No items associated with this group item yet. Use the search input above to query and instantly add items.
                        </div>
                    )}

                    
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
