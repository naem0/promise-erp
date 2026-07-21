"use client";

import { useEffect } from "react";
import { useForm, Controller, useFieldArray, Path } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PlusCircle, Trash2, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  updateProductStock,
  type StockUpdatePayload,
  type ProductItem,
} from "@/apiServices/inventoryItemsService";
import { Room } from "@/apiServices/inventoryRoomsService";
import BranchSearchSelect from "@/components/common/BranchSearchSelect";
import ProductSearchSelect from "@/components/common/ProductSearchSelect";
import RoomSearchSelect from "@/components/common/RoomSearchSelect";

// =========================================
// Types
// =========================================

interface ProductRow {
  product_id: string;
  stock_qty: number;
}

interface FormValues {
  branch_id: string;
  room_id: string;
  is_store: "0" | "1";
  products: ProductRow[];
}

interface StockUpdateFormProps {
  rooms: Room[];
  products: ProductItem[];
}

// =========================================
// Component
// =========================================

export default function StockUpdateForm({
  rooms,
  products,
}: StockUpdateFormProps) {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      branch_id: "",
      room_id: "",
      is_store: "0",
      products: [{ product_id: "", stock_qty: 0 }],
    },
  });

  // Ensure form is completely reset when visiting this page
  useEffect(() => {
    reset();
  }, [reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const selectedBranchId = watch("branch_id");
  const watchedProducts = watch("products");

  const filteredRooms = rooms.filter(
    (room) => room.branch?.id?.toString() === selectedBranchId,
  );

  const selectedProductIds = watchedProducts.map((p) => p.product_id).filter(Boolean);

  useEffect(() => {
    reset((prev) => ({ ...prev, room_id: "" }));
  }, [selectedBranchId, reset]);

  const submitHandler = async (values: FormValues) => {
    const validProducts = values.products.filter(
      (p) => p.product_id && Number(p.stock_qty) > 0,
    );

    const payload: StockUpdatePayload = {
      branch_id: Number(values.branch_id),
      room_id: Number(values.room_id),
      is_store: Number(values.is_store),
      products: validProducts.map((p) => ({
        product_id: Number(p.product_id),
        stock_qty: Number(p.stock_qty),
      })),
    };

    try {
      const res = await updateProductStock(payload);

      if (res.success) {
        reset();
        toast.success(res.message || "Stock updated successfully!");
        router.push("/inventory/inventory-items");
      } else {
        if (res.errors) {
          toast.error(res.message || "Failed to update stock.");
          Object.entries(res.errors).forEach(([field, messages]) => {
            const errorMessage = Array.isArray(messages)
              ? messages[0]
              : messages;
            
            setError(field as Path<FormValues>, {
              type: "server",
              message: errorMessage as string,
            });
          });
        } else {
          toast.error(res.message || "Failed to update stock.");
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
        Stock Update
      </h2>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        {/* ── Branch / Room / Store ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          {/* Branch */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Branch<span className="text-red-500">*</span>
            </label>
            <Controller
              name="branch_id"
              control={control}
              render={({ field }) => (
                <BranchSearchSelect
                  value={field.value}
                  onValueChange={(val) => field.onChange(val ?? "")}
                  placeholder="Select branch"
                />
              )}
            />
            {errors.branch_id && (
              <p className="text-sm text-red-500 mt-1">{errors.branch_id.message}</p>
            )}
          </div>

          {/* Room */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Room<span className="text-red-500">*</span>
            </label>
            <Controller
              name="room_id"
              control={control}
              render={({ field }) => (
                <RoomSearchSelect
                  rooms={rooms}
                  branchId={selectedBranchId}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!selectedBranchId}
                  placeholder={
                    selectedBranchId ? "Select room" : "Select branch first"
                  }
                  className="w-full"
                />
              )}
            />
            {errors.room_id && (
              <p className="text-sm text-red-500 mt-1">{errors.room_id.message}</p>
            )}
          </div>

          {/* Store Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Store Type<span className="text-red-500">*</span>
            </label>
            <Controller
              name="is_store"
              control={control}
              render={({ field }) => (
                <Select  value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select store type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Store</SelectItem>
                    <SelectItem value="1">Store</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* ── Product Rows ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">
              Products<span className="text-red-500">*</span>
            </label>
            <Button
              type="button"
              size="sm"
              onClick={() => append({ product_id: "", stock_qty: 0 })}
              className="cursor-pointer"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Product
            </Button>
          </div>

          {/* Rows */}
          {fields.map((field, index) => {
            const currentProductId = watchedProducts[index]?.product_id;
            const selectedProduct = products.find(
              (p) => p.id.toString() === currentProductId,
            );

            return (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_160px_44px] gap-3 p-3 rounded-lg border bg-slate-50/50 items-start"
              >
                {/* Product Select */}
                <div>
                  <label className="block text-xs text-slate-500 mb-1 md:hidden">Product</label>
                  <Controller
                    name={`products.${index}.product_id`}
                    control={control}
                    render={({ field: f }) => (
                      <ProductSearchSelect
                        products={products}
                        value={f.value}
                        onValueChange={f.onChange}
                        placeholder="Select product"
                        disabledProductIds={selectedProductIds.filter(
                          (id) => id !== currentProductId
                        )}
                      />
                    )}
                  />
                  {/* Current stock hint */}
                  {selectedProduct && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-1.5 px-1">
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent font-medium px-2 py-0"
                      >
                        Current stock: {selectedProduct.stock ?? 0} {selectedProduct.unit_name}
                      </Badge>
                      {selectedProduct.model && (
                        <Badge
                          variant="outline"
                          className="text-[10px] text-slate-500 border-slate-200 font-normal px-2 py-0"
                        >
                          Model: {selectedProduct.model}
                        </Badge>
                      )}
                    </div>
                  )}
                  {errors.products?.[index]?.product_id && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.products[index]?.product_id?.message}
                    </p>
                  )}
                </div>

                {/* Qty */}
                <div>
                  <label className="block text-xs text-slate-500 mb-1 md:hidden">Qty to Add</label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="bg-white"
                    {...register(`products.${index}.stock_qty`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.products?.[index]?.stock_qty && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.products[index]?.stock_qty?.message}
                    </p>
                  )}
                </div>

                {/* Remove */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (fields.length > 1) remove(index);
                    else toast.error("At least one product row is required.");
                  }}
                  className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                  title="Remove row"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}

        </div>

        {/* ── Actions ── */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="rounded-lg cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="text-white px-8 rounded-lg cursor-pointer"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <PackagePlus className="h-4 w-4 mr-2" />
                Update Stock
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
