"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  X,
  Search,
  Package,
  Layers,
  Trash2,
  Plus,
  Minus,
  PackageSearch,
  Boxes,
  DoorOpen,
  CheckSquare,
  Square,
  Check,
  RefreshCw,
  Info,
} from "lucide-react";

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
import EmployeeSearchSelect from "@/components/common/EmployeeSearchSelect";
import BranchSearchSelect from "@/components/common/BranchSearchSelect";
import RoomSearchSelect from "@/components/common/RoomSearchSelect";
import { Employee } from "@/apiServices/employeeService";
import {
  getProductItems,
  ProductItem,
} from "@/apiServices/inventoryItemsService";
import {
  createProductAssignment,
  updateProductAssignment,
  getProductAssignmentsByUser,
  ProductAssignment,
  SearchItemResult,
  SearchGroupItemResult,
  searchInventoryItems,
  searchInventoryGroupItems,
} from "@/apiServices/inventoryItemUsersService";
import { cn } from "@/lib/utils";

// ==========================================
// Types & Interfaces
// ==========================================

interface AssignedFormProps {
  title: string;
  assignment?: ProductAssignment;
  defaultUserId?: string;
}

interface FormValues {
  user_id: string;
  branch_id: string;
  room_id: string;
  assigned_date: string;
  returned_date: string;
  status: string;
  note: string;
  items?: string;
}

export interface SelectedItemRow {
  product_id: number;
  name: string;
  barcode?: string | null;
  image?: string | null;
  quantity: number;
  price?: number | string;
  group_item_id?: number | null;
  group_item_name?: string | null;
}

// ==========================================
// Main Component
// ==========================================

export default function AssignedForm({
  title,
  assignment,
  defaultUserId,
}: AssignedFormProps) {
  const router = useRouter();
  const isEdit = !!assignment;

  // Form & Selection States
  const [activeSearchTab, setActiveSearchTab] = useState<"individual" | "group">("individual");
  const [selectedItems, setSelectedItems] = useState<SelectedItemRow[]>([]);
  const [existingAssignments, setExistingAssignments] = useState<ProductAssignment[]>([]);
  const [defaultRoom, setDefaultRoom] = useState<{ id: number; name: string } | null>(null);

  // Room Products States
  const [roomProducts, setRoomProducts] = useState<ProductItem[]>([]);
  const [isLoadingRoomProducts, setIsLoadingRoomProducts] = useState(false);
  const [roomProductSearch, setRoomProductSearch] = useState("");

  // Autocomplete Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [itemSearchResults, setItemSearchResults] = useState<SearchItemResult[]>([]);
  const [groupSearchResults, setGroupSearchResults] = useState<SearchGroupItemResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      user_id: "",
      branch_id: "",
      room_id: "",
      assigned_date: new Date().toISOString().split("T")[0],
      returned_date: "",
      status: "1",
      note: "",
    },
  });

  const watchedUserId = watch("user_id");
  const watchedBranchId = watch("branch_id");
  const watchedRoomId = watch("room_id");
  const watchedStatus = watch("status");

  // Initialize form in Edit mode or with default user
  useEffect(() => {
    if (assignment) {
      reset({
        user_id: assignment.user_id ? String(assignment.user_id) : "",
        branch_id: assignment.branch_id ? String(assignment.branch_id) : "",
        room_id: assignment.room_id ? String(assignment.room_id) : "",
        assigned_date: assignment.assigned_date
          ? assignment.assigned_date.split("T")[0]
          : new Date().toISOString().split("T")[0],
        returned_date: assignment.returned_date
          ? assignment.returned_date.split("T")[0]
          : "",
        status: String(assignment.status ?? "1"),
        note: assignment.note || "",
      });

      setSelectedItems([
        {
          product_id: assignment.product_id,
          name: assignment.product_name,
          quantity: assignment.quantity || 1,
          group_item_id: assignment.group_item_id || null,
          group_item_name: assignment.group_item_name || null,
        },
      ]);
    } else if (defaultUserId) {
      reset((prev) => ({ ...prev, user_id: defaultUserId }));
    }
  }, [assignment, defaultUserId, reset]);

  // Load existing assigned items when an employee is selected
  useEffect(() => {
    const uId = watchedUserId
      ? Number(watchedUserId)
      : defaultUserId
        ? Number(defaultUserId)
        : null;

    if (uId && !isEdit) {
      getProductAssignmentsByUser(uId)
        .then((res) => {
          if (res?.data?.assignments) {
            const items: ProductAssignment[] = [];
            res.data.assignments.forEach((entry) => {
              if (entry.type === "single" && entry.item) items.push(entry.item);
              else if (entry.type === "group" && entry.items) items.push(...entry.items);
            });
            setExistingAssignments(items);

            if (items.length > 0 && items[0].room_id && items[0].room_name) {
              const r = { id: items[0].room_id, name: items[0].room_name };
              setDefaultRoom(r);
              if (!watch("room_id")) {
                reset((prev) => ({ ...prev, room_id: String(r.id) }));
              }
            }
          }
        })
        .catch(() => setExistingAssignments([]));
    } else if (!uId) {
      setExistingAssignments([]);
      setDefaultRoom(null);
    }
  }, [watchedUserId, defaultUserId, isEdit, reset, watch]);

  // Handle Employee selection change
  const handleEmployeeChange = (emp: Employee | null) => {
    const branchId = emp?.main_branch_id || emp?.branches?.[0]?.id;
    if (branchId && !watchedBranchId) {
      setValue("branch_id", String(branchId));
    }
  };

  // Fetch Room Products when Branch & Room are both selected
  useEffect(() => {
    if (!watchedBranchId || !watchedRoomId || isEdit) {
      setRoomProducts([]);
      return;
    }

    let isMounted = true;
    setIsLoadingRoomProducts(true);

    getProductItems({
      branch_id: Number(watchedBranchId),
      room_id: Number(watchedRoomId),
      per_page: 100,
    })
      .then((res) => {
        if (!isMounted) return;
        if (res?.success && res?.data?.products) {
          setRoomProducts(res.data.products);
        } else {
          setRoomProducts([]);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to fetch room items:", err);
        setRoomProducts([]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingRoomProducts(false);
      });

    return () => {
      isMounted = false;
    };
  }, [watchedBranchId, watchedRoomId, isEdit]);

  // Filtered Room Products based on local search input
  const filteredRoomProducts = useMemo(() => {
    if (!roomProductSearch.trim()) return roomProducts;
    const q = roomProductSearch.toLowerCase().trim();
    return roomProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.toLowerCase().includes(q)) ||
        (p.model && p.model.toLowerCase().includes(q)) ||
        (p.category_name && p.category_name.toLowerCase().includes(q)) ||
        (p.brand_name && p.brand_name.toLowerCase().includes(q))
    );
  }, [roomProducts, roomProductSearch]);

  // Check if a single product is selected in selectedItems
  const isProductSelected = (productId: number) => {
    return selectedItems.some(
      (item) => item.product_id === productId && !item.group_item_id
    );
  };

  // Toggle single product checkbox from room products
  const handleToggleProduct = (product: ProductItem) => {
    const isSelected = isProductSelected(product.id);

    if (isSelected) {
      setSelectedItems((prev) =>
        prev.filter((p) => !(p.product_id === product.id && !p.group_item_id))
      );
      toast.info(`Removed ${product.name}`);
    } else {
      setSelectedItems((prev) => [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          barcode: product.barcode || null,
          image: product.image || null,
          quantity: 1,
          price: product.mrp_price || product.purchase_price || 0,
          group_item_id: null,
          group_item_name: null,
        },
      ]);
      clearErrors("items");
      toast.success(`Added ${product.name}`);
    }
  };

  // Toggle Select All / Deselect All filtered room products
  const allFilteredSelected =
    filteredRoomProducts.length > 0 &&
    filteredRoomProducts.every((p) => isProductSelected(p.id));

  const handleToggleSelectAllRoomProducts = () => {
    if (allFilteredSelected) {
      const idsToRemove = new Set(filteredRoomProducts.map((p) => p.id));
      setSelectedItems((prev) =>
        prev.filter((p) => p.group_item_id || !idsToRemove.has(p.product_id))
      );
      toast.info("Deselected room items.");
    } else {
      const newItemsToAdd: SelectedItemRow[] = [];
      filteredRoomProducts.forEach((p) => {
        if (!isProductSelected(p.id)) {
          newItemsToAdd.push({
            product_id: p.id,
            name: p.name,
            barcode: p.barcode || null,
            image: p.image || null,
            quantity: 1,
            price: p.mrp_price || p.purchase_price || 0,
            group_item_id: null,
            group_item_name: null,
          });
        }
      });
      setSelectedItems((prev) => [...prev, ...newItemsToAdd]);
      if (newItemsToAdd.length > 0) clearErrors("items");
      toast.success(`Added ${newItemsToAdd.length} items from room.`);
    }
  };

  // Debounced search for items / group items
  useEffect(() => {
    if (searchQuery.trim().length < 1) {
      setItemSearchResults([]);
      setGroupSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        if (activeSearchTab === "individual") {
          const res = await searchInventoryItems(searchQuery.trim(), 20);
          setItemSearchResults(res?.success && res.data ? res.data : []);
        } else {
          const res = await searchInventoryGroupItems(searchQuery.trim(), 20);
          setGroupSearchResults(res?.success && res.data ? res.data : []);
        }
      } catch (error) {
        console.error("Search query error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, activeSearchTab]);

  // Add individual product to selection (via manual search)
  const handleSelectProduct = (prod: SearchItemResult) => {
    const existingIndex = selectedItems.findIndex(
      (p) => p.product_id === prod.id && !p.group_item_id
    );

    if (existingIndex > -1) {
      setSelectedItems((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      toast.info(`Increased quantity for ${prod.name}`);
    } else {
      setSelectedItems((prev) => [
        ...prev,
        {
          product_id: prod.id,
          name: prod.name,
          barcode: prod.barcode || null,
          image: prod.image || null,
          quantity: 1,
          price: prod.price || 0,
          group_item_id: null,
          group_item_name: null,
        },
      ]);
      toast.success(`${prod.name} added`);
    }

    clearErrors("items");
    setSearchQuery("");
    setShowDropdown(false);
  };

  // Add group package items to selection
  const handleSelectGroupItem = (group: SearchGroupItemResult) => {
    if (!group.details || group.details.length === 0) {
      toast.error(`Group "${group.name}" has no items associated with it.`);
      return;
    }

    const newGroupItems: SelectedItemRow[] = group.details.map((d) => ({
      product_id: d.product_id,
      name: d.product_name,
      barcode: d.barcode || null,
      image: d.image || null,
      quantity: Number(d.quantity) || 1,
      price: d.unit_price || 0,
      group_item_id: group.id,
      group_item_name: group.name,
    }));

    setSelectedItems((prev) => [...prev, ...newGroupItems]);
    clearErrors("items");
    toast.success(`Group "${group.name}" added (${newGroupItems.length} items).`);
    setSearchQuery("");
    setShowDropdown(false);
  };

  // Modify selection helpers
  const handleRemoveItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRemoveGroup = (groupId: number) => {
    setSelectedItems((prev) => prev.filter((p) => p.group_item_id !== groupId));
    toast.info("Group items removed.");
  };

  const handleClearAll = () => {
    setSelectedItems([]);
    toast.info("All items cleared.");
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return;
    setSelectedItems((prev) =>
      prev.map((p, idx) => (idx === index ? { ...p, quantity: newQty } : p))
    );
  };

  // Form Submit Handler
  const submitHandler = async (values: FormValues) => {
    try {
      if (isEdit) {
        // Edit Mode: Update single assignment
        const firstProduct = selectedItems[0];
        const payload = {
          quantity: Number(firstProduct?.quantity || 1),
          branch_id: values.branch_id ? Number(values.branch_id) : null,
          room_id: values.room_id ? Number(values.room_id) : null,
          status: Number(values.status || 1),
          assigned_date: values.assigned_date,
          returned_date:
            values.status === "2"
              ? values.returned_date || new Date().toISOString().split("T")[0]
              : null,
          note: values.note || undefined,
        };

        const res = await updateProductAssignment(Number(assignment!.id), payload);

        if (res?.success) {
          toast.success(res.message || "Assigned Item updated successfully!");
          router.push("/inventory/item-users");
          router.refresh();
        } else {
          if (res?.errors) {
            toast.error(res.message || "Failed to update assigned item");
            Object.entries(res.errors).forEach(([field, messages]) => {
              const errorMessage = Array.isArray(messages) ? messages[0] : messages;
              setError(field as keyof FormValues, {
                type: "server",
                message: errorMessage as string,
              });
            });
          } else {
            toast.error(res?.message || "Failed to update assigned item");
          }
        }
      } else {
        // Create Mode: Assign multiple items
        const payload = {
          user_id: values.user_id ? Number(values.user_id) : (undefined as unknown as number),
          assigned_date: values.assigned_date,
          branch_id: values.branch_id ? Number(values.branch_id) : null,
          room_id: values.room_id ? Number(values.room_id) : null,
          note: values.note || undefined,
          items: selectedItems.map((p) => ({
            product_id: p.product_id,
            quantity: p.quantity,
            group_item_id: p.group_item_id || null,
          })),
        };

        const res = await createProductAssignment(payload);

        if (res?.success) {
          reset();
          setSelectedItems([]);
          toast.success(res.message || "Items assigned successfully!");
          router.push("/inventory/item-users");
          router.refresh();
        } else {
          if (res?.errors) {
            toast.error(res.message || "Failed to assign items");
            Object.entries(res.errors).forEach(([field, messages]) => {
              const errorMessage = Array.isArray(messages) ? messages[0] : messages;
              let targetField = field;
              if (field === "items" || field.startsWith("items.")) {
                targetField = "items";
              }
              setError(targetField as keyof FormValues, {
                type: "server",
                message: errorMessage as string,
              });
            });
          } else {
            toast.error(res?.message || "Failed to assign items");
          }
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

  // Group selected items into group buckets vs individual items
  const { groupPackagesMap, individualItems, totalUnitsCount } = useMemo(() => {
    const groupMap: Record<
      number,
      { name: string; items: { item: SelectedItemRow; originalIndex: number }[] }
    > = {};
    const individuals: { item: SelectedItemRow; originalIndex: number }[] = [];

    selectedItems.forEach((item, index) => {
      if (item.group_item_id) {
        const gid = item.group_item_id;
        if (!groupMap[gid]) {
          groupMap[gid] = {
            name: item.group_item_name || `Group #${gid}`,
            items: [],
          };
        }
        groupMap[gid].items.push({ item, originalIndex: index });
      } else {
        individuals.push({ item, originalIndex: index });
      }
    });

    const units = selectedItems.reduce((acc, curr) => acc + curr.quantity, 0);

    return {
      groupPackagesMap: groupMap,
      individualItems: individuals,
      totalUnitsCount: units,
    };
  }, [selectedItems]);

  const groupIds = Object.keys(groupPackagesMap).map(Number);

  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <h2 className="text-xl font-semibold mb-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.back()}
            className="cursor-pointer"
          >
            Go Back
          </Button>
          {title}
        </div>
      </h2>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        {/* Section 1: Assignment Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          {/* 1. Branch */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Branch
            </label>
            <Controller
              name="branch_id"
              control={control}
              render={({ field }) => (
                <BranchSearchSelect
                  value={field.value || ""}
                  onValueChange={(val) => {
                    field.onChange(val || "");
                    clearErrors("branch_id");
                    setValue("room_id", "");
                    setValue("user_id", "");
                  }}
                  placeholder="Select Branch"
                  className="w-full"
                />
              )}
            />
            {errors.branch_id && (
              <p className="text-sm text-red-500 mt-1">{errors.branch_id.message}</p>
            )}
          </div>

          {/* 2. Room */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Room
            </label>
            <Controller
              name="room_id"
              control={control}
              render={({ field }) => (
                <RoomSearchSelect
                  key={`room-${watchedBranchId}`}
                  value={field.value || ""}
                  onValueChange={(val) => {
                    field.onChange(val || "");
                    clearErrors("room_id");
                  }}
                  rooms={
                    assignment?.room_id && assignment?.room_name
                      ? [
                        {
                          id: Number(assignment.room_id),
                          name: assignment.room_name,
                          room_no: "",
                          is_store: 0,
                          status: 1,
                          status_text: "Active",
                          branch: { id: 0, name: "" },
                        },
                      ]
                      : defaultRoom
                        ? [
                          {
                            id: Number(defaultRoom.id),
                            name: defaultRoom.name,
                            room_no: "",
                            is_store: 0,
                            status: 1,
                            status_text: "Active",
                            branch: { id: 0, name: "" },
                          },
                        ]
                        : undefined
                  }
                  placeholder="Select Room"
                  branchId={watchedBranchId || undefined}
                  className="w-full"
                />
              )}
            />
            {errors.room_id && (
              <p className="text-sm text-red-500 mt-1">{errors.room_id.message}</p>
            )}
          </div>

          {/* 3. Employee (User) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Employee
            </label>
            {isEdit ? (
              <div className="p-2.5 rounded-md bg-slate-50 border text-sm text-slate-800 font-medium">
                {assignment?.employee_name}
              </div>
            ) : (
              <Controller
                name="user_id"
                control={control}
                render={({ field }) => (
                  <EmployeeSearchSelect
                    key={`emp-${watchedBranchId}`}
                    value={field.value || ""}
                    onValueChange={(val) => {
                      field.onChange(val || "");
                      clearErrors("user_id");
                    }}
                    onEmployeeChange={handleEmployeeChange}
                    branchId={watchedBranchId || undefined}
                    placeholder="Select Employee"
                    className="w-full"
                  />
                )}
              />
            )}
            {errors.user_id && (
              <p className="text-sm text-red-500 mt-1">{errors.user_id.message}</p>
            )}
          </div>

          {/* 4. Assigned Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Assigned Date
            </label>
            <Input
              type="date"
              {...register("assigned_date", {
                onChange: () => clearErrors("assigned_date"),
              })}
            />
            {errors.assigned_date && (
              <p className="text-sm text-red-500 mt-1">{errors.assigned_date.message}</p>
            )}
          </div>

          {/* Status (Edit Mode) */}
          {isEdit && (
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
                      <SelectItem value="0">Inactive</SelectItem>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="2">Repair</SelectItem>
                      <SelectItem value="3">Damaged</SelectItem>
                      <SelectItem value="4">Transferred</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
              )}
            </div>
          )}

          {/* Returned Date (Edit Mode) */}
          {isEdit && watchedStatus === "2" && (
            <div>
              <label className="block text-sm font-medium mb-1">Returned Date</label>
              <Input type="date" {...register("returned_date")} />
              {errors.returned_date && (
                <p className="text-sm text-red-500 mt-1">{errors.returned_date.message}</p>
              )}
            </div>
          )}

          {/* Description / Remarks */}
          <div className="md:col-span-2 lg:col-span-4">
            <label className="block text-sm font-medium mb-1">
              Description / Remarks
            </label>
            <Textarea
              placeholder="Type assignment remarks or description..."
              {...register("note")}
              rows={2}
            />
            {errors.note && (
              <p className="text-sm text-red-500 mt-1">{errors.note.message}</p>
            )}
          </div>
        </div>

        {/* Existing Assigned Items Preview */}
        {!isEdit && existingAssignments.length > 0 && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <PackageSearch className="w-4 h-4 text-slate-700" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Currently Assigned Items to this Employee
                </h4>
              </div>
              <Badge variant="secondary" className="bg-slate-200/80 text-slate-700 text-xs font-medium">
                {existingAssignments.length} {existingAssignments.length === 1 ? "Item" : "Items"} already assigned
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {existingAssignments.map((item, idx) => (
                <div
                  key={`existing-${item.id}-${idx}`}
                  className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200/80 text-xs shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    <Image
                      src={(item.image && typeof item.image === "string" && item.image.trim() !== "") ? item.image : "/images/placeholder.png"}
                      alt={item.product_name}
                      width={40}
                      height={40}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate" title={item.product_name}>
                      {item.product_name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      Qty: <span className="font-medium text-slate-700">{item.quantity}</span>
                      {item.room_name ? ` • ${item.room_name}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Room Products Direct Selection */}
        {!isEdit && (
          <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100/80 border border-blue-200 flex items-center justify-center text-blue-700">
                  <DoorOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    Available Items in Selected Room
                    {watchedBranchId && watchedRoomId && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs font-semibold">
                        {roomProducts.length} {roomProducts.length === 1 ? "Item" : "Item"}
                      </Badge>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {watchedBranchId && watchedRoomId
                      ? "Select Items below with checkboxes to assign them to this employee"
                      : "Please select Branch and Room above to load room inventory Items"}
                  </p>
                </div>
              </div>

              {watchedBranchId && watchedRoomId && roomProducts.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Search inside room products */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Filter room items..."
                      value={roomProductSearch}
                      onChange={(e) => setRoomProductSearch(e.target.value)}
                      className="h-8 pl-8 pr-2 text-xs w-48 sm:w-56 bg-white"
                    />
                    {roomProductSearch && (
                      <button
                        type="button"
                        onClick={() => setRoomProductSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Select All Toggle */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleToggleSelectAllRoomProducts}
                    className="h-8 text-xs bg-white hover:bg-slate-100 cursor-pointer flex items-center gap-1.5"
                  >
                    {allFilteredSelected ? (
                      <>
                        <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                        Deselect All
                      </>
                    ) : (
                      <>
                        <Square className="w-3.5 h-3.5 text-slate-500" />
                        Select All ({filteredRoomProducts.length})
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Room Products Content */}
            {!watchedBranchId || !watchedRoomId ? (
              <div className="py-6 px-4 text-center border border-dashed border-slate-200 rounded-xl bg-white/60">
                <Boxes className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-70" />
                <p className="text-xs text-slate-600 font-medium">
                  Select a <span className="font-semibold text-slate-800">Branch</span> and <span className="font-semibold text-slate-800">Room</span> above to load inventory items located there.
                </p>
              </div>
            ) : isLoadingRoomProducts ? (
              <div className="py-8 text-center bg-white rounded-xl border border-slate-200/80">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                <p className="text-xs text-slate-500">Loading items in room...</p>
              </div>
            ) : filteredRoomProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
                {filteredRoomProducts.map((prod) => {
                  const isSelected = isProductSelected(prod.id);
                  return (
                    <div
                      key={`room-prod-${prod.id}`}
                      onClick={() => handleToggleProduct(prod)}
                      className={cn(
                        "p-3 rounded-xl border transition-all duration-150 cursor-pointer flex items-start gap-2.5 bg-white hover:border-blue-300 hover:shadow-xs select-none",
                        isSelected
                          ? "border-blue-500 bg-blue-50/40 ring-1 ring-blue-400/40"
                          : "border-slate-200/90 hover:bg-slate-50/50"
                      )}
                    >
                      {/* Checkbox */}
                      <div className="pt-0.5 shrink-0">
                        <div
                          className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-slate-300 bg-white"
                          )}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      {/* Product Thumbnail */}
                      <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center mt-0.5">
                        <Image
                          src={(prod.image && typeof prod.image === "string" && prod.image.trim() !== "") ? prod.image : "/images/placeholder.png"}
                          alt={prod.name}
                          width={40}
                          height={40}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        {/* Title & Top-Right Stock + Add Status in single row */}
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={cn(
                              "text-xs font-bold truncate leading-tight flex-1",
                              isSelected ? "text-blue-950" : "text-slate-900"
                            )}
                            title={prod.name}
                          >
                            {prod.name}
                          </h4>

                          {/* Right Side Top: Stock Badge & Add Indicator (Single Row) */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] text-slate-500 font-medium">
                              Stock:{" "}
                              <span
                                className={cn(
                                  "font-bold",
                                  (prod.stock ?? 0) > 0
                                    ? "text-emerald-600"
                                    : "text-amber-600"
                                )}
                              >
                                {prod.stock ?? 0}
                              </span>
                            </span>
                            {isSelected ? (
                              <span className="text-[9px] font-bold text-blue-700 bg-blue-100/90 px-1.5 py-0.2 rounded border border-blue-200">
                                Added
                              </span>
                            ) : (
                              <span className="text-[9px] text-slate-400 hover:text-blue-600">
                                + Click to add
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Fields Stacked Vertically */}
                        <div className="flex flex-col gap-0.5 text-[11px] text-slate-600 mt-1">
                          {prod.barcode && (
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-slate-400 font-medium text-[10.5px]">Barcode:</span>
                              <span className="font-mono text-slate-800 font-semibold text-[10.5px] truncate">{prod.barcode}</span>
                            </div>
                          )}
                          {prod.category_name && (
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-slate-400 font-medium text-[10.5px]">Category:</span>
                              <span className="text-slate-700 font-medium text-[10.5px] truncate">{prod.category_name}</span>
                            </div>
                          )}
                          {prod.brand_name && (
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-slate-400 font-medium text-[10.5px]">Brand:</span>
                              <span className="text-slate-700 font-medium text-[10.5px] truncate">{prod.brand_name}</span>
                            </div>
                          )}
                          {prod.model && (
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-slate-400 font-medium text-[10.5px]">Model:</span>
                              <span className="text-slate-700 font-medium text-[10.5px] truncate">{prod.model}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 bg-amber-50/70 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left shadow-2xs">
                <div className="p-3 rounded-xl bg-amber-100 text-amber-800 shrink-0 shadow-2xs">
                  <Info className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-bold text-amber-950">
                    {roomProductSearch
                      ? `No items found matching "${roomProductSearch}" in this room`
                      : "No items currently available in this room"}
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    No items were found directly in this room. Please use the search bar below to search and assign <strong className="text-amber-950 font-semibold">Individual Items</strong> or <strong className="text-amber-950 font-semibold">Group Items</strong> manually.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 2: Assigned Items & Packages */}
        <div className="pt-2">
          <div className="flex items-center justify-between pb-3 mb-4 border-b flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-slate-800">
                Assigned Individual & Group Items <span className="text-red-500"> *</span>
              </h3>
              {selectedItems.length > 0 && (
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs font-normal">
                  {selectedItems.length} items ({totalUnitsCount} units)
                </Badge>
              )}
            </div>

            {/* Switcher Tabs & Clear All */}
            <div className="flex items-center gap-3">
              {!isEdit && (
                <div className="flex items-center bg-gray-100 border border-gray-200 rounded-full p-1 gap-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSearchTab("individual");
                      setSearchQuery("");
                    }}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${activeSearchTab === "individual"
                        ? "bg-white text-slate-900 shadow-sm border border-gray-200 font-semibold"
                        : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    <Package className="h-3.5 w-3.5 text-blue-600" />
                    Individual Items
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSearchTab("group");
                      setSearchQuery("");
                    }}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${activeSearchTab === "group"
                        ? "bg-white text-slate-900 shadow-sm border border-gray-200 font-semibold"
                        : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    <Layers className="h-3.5 w-3.5 text-purple-600" />
                    Group Items
                  </button>
                </div>
              )}

              {!isEdit && selectedItems.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs h-8 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Search Bar with live dropdown (Create Mode) */}
          {isEdit && errors.items && (
            <p className="text-sm text-red-500 mb-3">{errors.items.message}</p>
          )}

          {!isEdit && (
            <div className="relative z-10 mb-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  placeholder={
                    activeSearchTab === "individual"
                      ? "Search Individual Items by name or barcode..."
                      : "Search Group Items by name or barcode..."
                  }
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="pl-9 pr-8 h-10"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSearchQuery("");
                      setItemSearchResults([]);
                      setGroupSearchResults([]);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-sm transition cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : isSearching ? (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[10px] text-slate-400 font-mono">
                    Searching...
                  </span>
                ) : null}
              </div>

              {errors.items && (
                <p className="text-sm text-red-500 mt-1.5">{errors.items.message}</p>
              )}

              {/* Autocomplete Dropdown */}
              {showDropdown && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                  {activeSearchTab === "individual" ? (
                    itemSearchResults.length > 0 ? (
                      <ul className="py-1.5 divide-y divide-gray-100">
                        {itemSearchResults.map((prod) => (
                          <li key={prod.id}>
                            <button
                              type="button"
                              onClick={() => handleSelectProduct(prod)}
                              className="w-full text-left px-4 py-2.5 hover:bg-blue-50/60 transition-colors flex items-center justify-between cursor-pointer"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center">
                                  <Image
                                    src={(prod.image && typeof prod.image === "string" && prod.image.trim() !== "") ? prod.image : "/images/placeholder.png"}
                                    alt={prod.name}
                                    width={40}
                                    height={40}
                                    unoptimized
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="font-medium text-sm text-slate-800 truncate">{prod.name}</div>
                                  <div className="text-xs text-slate-400 mt-0.5">
                                    {prod.barcode ? `Barcode: ${prod.barcode}` : "No Barcode"}
                                  </div>
                                </div>
                              </div>
                              <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs font-normal shrink-0 ml-2">
                                + Add Item
                              </Badge>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      !isSearching && (
                        <div className="p-4 text-center text-xs text-slate-400">
                          No results found matching &quot;{searchQuery}&quot;
                        </div>
                      )
                    )
                  ) : groupSearchResults.length > 0 ? (
                    <ul className="py-1.5 divide-y divide-gray-100">
                      {groupSearchResults.map((grp) => (
                        <li key={grp.id}>
                          <button
                            type="button"
                            onClick={() => handleSelectGroupItem(grp)}
                            className="w-full text-left px-4 py-2.5 hover:bg-purple-50/60 transition-colors flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-purple-200 shrink-0 bg-purple-50 flex items-center justify-center">
                                <Image
                                  src={(grp.image && typeof grp.image === "string" && grp.image.trim() !== "") ? grp.image : "/images/placeholder.png"}
                                  alt={grp.name}
                                  width={40}
                                  height={40}
                                  unoptimized
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm text-purple-950 truncate">{grp.name}</div>
                                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                                  {grp.barcode && <span>Barcode: {grp.barcode}</span>}
                                  <span className="text-purple-600 font-medium">
                                    ({grp.details?.length || 0} items included)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs font-normal shrink-0 ml-2">
                              + Add Group
                            </Badge>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    !isSearching && (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No results found matching &quot;{searchQuery}&quot;
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {/* Selected Items List Container */}
          <div className="space-y-4">
            {/* Group Items Sections */}
            {groupIds.map((gid) => {
              const groupData = groupPackagesMap[gid];
              return (
                <div
                  key={`pkg-${gid}`}
                  className="border border-purple-200/80 rounded-2xl overflow-hidden bg-white shadow-2xs"
                >
                  <div className="flex items-center gap-3 px-5 py-3.5 bg-linear-to-r from-purple-50 via-purple-50/70 to-purple-50/20 border-b border-purple-100">
                    <div className="w-8 h-8 shrink-0 bg-purple-100 border border-purple-200 rounded-lg flex items-center justify-center">
                      <Layers className="h-4 w-4 text-purple-700" />
                    </div>
                    <div className="flex-1 min-w-0 flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-sm font-bold text-purple-950">{groupData.name}</h3>
                      <span className="text-[11px] font-semibold bg-purple-100/90 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200/80">
                        {groupData.items.length} {groupData.items.length === 1 ? "Item" : "Items"} included
                      </span>
                    </div>
                    {!isEdit && (
                      <button
                        type="button"
                        onClick={() => handleRemoveGroup(gid)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition shrink-0 cursor-pointer"
                        title="Remove Group"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50/30 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    {groupData.items.map(({ item, originalIndex }) => (
                      <SelectedItemRowComponent
                        key={`pkg-item-${item.product_id}-${originalIndex}`}
                        item={item}
                        originalIndex={originalIndex}
                        isEdit={isEdit}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Individual Items Section */}
            {individualItems.length > 0 && (
              <div className="border border-blue-200/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
                <div className="flex items-center gap-3 px-5 py-3.5 bg-linear-to-r from-blue-50/90 via-blue-50/60 to-slate-50/30 border-b border-blue-100">
                  <div className="w-8 h-8 shrink-0 bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center">
                    <Package className="h-4 w-4 text-blue-700" />
                  </div>
                  <div className="flex-1 min-w-0 flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900">Individual Items</h3>
                    <span className="text-[11px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200/80">
                      {individualItems.length} {individualItems.length === 1 ? "Item" : "Items"}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/30 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {individualItems.map(({ item, originalIndex }) => (
                    <SelectedItemRowComponent
                      key={`ind-${item.product_id}-${originalIndex}`}
                      item={item}
                      originalIndex={originalIndex}
                      isEdit={isEdit}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemoveItem={handleRemoveItem}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {selectedItems.length === 0 && (
              <div className="border border-dashed border-gray-200 rounded-2xl p-8 bg-gray-50/50 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto text-slate-400 shadow-2xs">
                  <PackageSearch className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-700">No items selected</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Select available items from the room above using checkboxes, or search individual and group items.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
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
            {isSubmitting
              ? "Submitting..."
              : isEdit
                ? "Update Assigned Items"
                : "Assign Items"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// Sub-Component: Selected Item Row
// ==========================================

interface SelectedItemRowProps {
  item: SelectedItemRow;
  originalIndex: number;
  isEdit: boolean;
  onUpdateQuantity: (index: number, qty: number) => void;
  onRemoveItem: (index: number) => void;
}

function SelectedItemRowComponent({
  item,
  originalIndex,
  isEdit,
  onUpdateQuantity,
  onRemoveItem,
}: SelectedItemRowProps) {
  return (
    <div className="p-2.5 bg-white border border-slate-200/90 rounded-xl flex items-center justify-between gap-2 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all">
      {/* Left Part: Thumbnail + Name + Barcode */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center">
          <Image
            src={(item.image && typeof item.image === "string" && item.image.trim() !== "") ? item.image : "/images/placeholder.png"}
            alt={item.name}
            width={40}
            height={40}
            unoptimized
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-slate-800 text-xs truncate leading-tight" title={item.name}>
            {item.name}
          </h4>
          {item.barcode && (
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
              <span className="text-slate-400">Barcode:</span> {item.barcode}
            </p>
          )}
        </div>
      </div>

      {/* Right Part: Quantity Controller + Red Cross Button (Side by side on top) */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => onUpdateQuantity(originalIndex, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-1 px-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <Minus className="w-3 h-3" />
          </button>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) =>
              onUpdateQuantity(originalIndex, parseInt(e.target.value) || 1)
            }
            className="w-8 text-center text-xs font-mono font-bold bg-transparent outline-none py-0.5 text-slate-800"
          />
          <button
            type="button"
            onClick={() => onUpdateQuantity(originalIndex, item.quantity + 1)}
            className="p-1 px-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition cursor-pointer"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {!isEdit && (
          <button
            type="button"
            onClick={() => onRemoveItem(originalIndex)}
            className="p-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200/80 transition shrink-0 cursor-pointer"
            title="Remove item"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
}
