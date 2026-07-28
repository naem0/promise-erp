"use client";

import { Controller, useFieldArray, useForm, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import {
  createRequisition,
  updateRequisition,
  Requisition,
  RequisitionInput,
} from "@/apiServices/requisitionsService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  PackageSearch,
  Trash2,
  ArrowLeft,
  ShoppingCart,
  CircleDollarSign,
  Search,
  Minus,
  Plus,
  ClipboardList,
  User,
  Briefcase,
  Building2,
  Wrench,
  AlertTriangle,
  ArrowLeftRight,
  Sparkles,
  X,
  Image as ImageIcon,
} from "lucide-react";
import BranchSearchSelect from "@/components/common/BranchSearchSelect";
import { ProductItem } from "@/apiServices/inventoryItemsService";
import { UserProfile } from "@/apiServices/auth/profileService";
import { Room } from "@/apiServices/inventoryRoomsService";

// =======================
// Types
// =======================

interface RequisitionItemFormRow {
  product_id: string;
  price: string;
  quantity: string;
  reason_for_requirement: string;
  expected_date: string;
  room_id: string;
}

interface AmountFile {
  fileName: string;
  fileData: string;
}

interface AmountItemFormRow {
  amount_requested: string;
  amount_reason: string;
  amount_expected_date: string;
  docs?: AmountFile[];
}

interface FormValues {
  type: string; // "1" = Item-based, "2" = Amount-based
  requisition_condition: string;
  branch_from: string;
  branch_to?: string;
  description: string;
  remarks: string;
  items: RequisitionItemFormRow[];
  amount: AmountItemFormRow[];
}


interface RequisitionsFormProps {
  title: string;
  requisition?: Requisition;
  products?: ProductItem[];
  currentUser?: UserProfile;
  rooms?: Room[];
}

// =======================
// Condition options
// =======================

// All 4 conditions — shown for both type 1 and type 2
const ALL_CONDITION_OPTIONS = [
  { value: "1", label: "New", Icon: Sparkles },
  { value: "2", label: "Repair", Icon: Wrench },
  { value: "3", label: "Damage", Icon: AlertTriangle },
  { value: "4", label: "Transfer", Icon: ArrowLeftRight },
];

// Shared active style — green for all (matches screenshot)
const ACTIVE_CLASS = "bg-green-50 border-green-500 text-green-700";

const isImageFile = (url?: string) => {
  if (!url) return false;
  return url.startsWith("data:image/") || /\.(jpeg|jpg|gif|png|webp)($|\?)/i.test(url);
};

const processFile = (file: File): Promise<AmountFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ fileName: file.name, fileData: reader.result as string });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// =======================
// Component
// =======================

export default function RequisitionsForm({
  title,
  requisition,
  products = [],
  currentUser,
  rooms = [],
}: RequisitionsFormProps) {
  const router = useRouter();
  const [activeType, setActiveType] = useState<"1" | "2">(
    requisition ? (String(requisition.type) as "1" | "2") : "1"
  );
  const [productSearch, setProductSearch] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      type: "1",
      requisition_condition: "1",
      branch_to: currentUser?.branches?.[0]?.id?.toString() || "",
      branch_from: currentUser?.branches?.[0]?.id?.toString() || "",
      description: "",
      remarks: "",
      items: [],
      amount: [{ amount_requested: "", amount_reason: "", amount_expected_date: "", docs: [] }],
    },
  });

  const {
    fields: itemFields,
    prepend: prependItem,
    remove: removeItem,
  } = useFieldArray({ control, name: "items" });

  const {
    fields: amountFields,
    append: appendAmountItem,
    remove: removeAmountItem,
  } = useFieldArray({ control, name: "amount" });

  const watchedItems = watch("items");
  const watchedAmountItems = watch("amount");
  const requisitionCondition = watch("requisition_condition");
  const showBranchSelect = activeType === "1" && requisitionCondition === "4";

  // Populate form on edit
  useEffect(() => {
    if (requisition) {
      const type = String(requisition.type) as "1" | "2";
      setActiveType(type);
      let initialAmountItems = [{ amount_requested: "", amount_reason: "", amount_expected_date: "", docs: [] as AmountFile[] }];
      if (requisition.type === 2) {
        const amtItems = requisition.amount_items || requisition.amount;
        if (amtItems && Array.isArray(amtItems) && amtItems.length > 0) {
          initialAmountItems = amtItems.map((item) => ({
            amount_requested: String(item.amount_requested || ""),
            amount_reason: String(item.amount_reason || ""),
            amount_expected_date: item.amount_expected_date ? String(item.amount_expected_date).split("T")[0] : "",
            docs: Array.isArray(item.docs) ? (item.docs as unknown as AmountFile[]) : [],
          }));
        } else if (requisition.amount_requested) {
          initialAmountItems = [{
            amount_requested: String(requisition.amount_requested),
            amount_reason: requisition.amount_reason || "",
            amount_expected_date: requisition.amount_expected_date ? String(requisition.amount_expected_date).split("T")[0] : "",
            docs: []
          }];
        }
      }

      reset({
        type,
        requisition_condition: String(requisition.requisition_condition) || "1",
        branch_from: String(requisition.branch_from?.id || ""),
        branch_to: String(requisition.branch_to?.id || ""),
        description: requisition.description || "",
        remarks: requisition.remarks || "",
        items:
          requisition.items && requisition.items.length > 0
            ? requisition.items.map((item) => ({
              product_id: String(item.product_id),
              price: String(item.price),
              quantity: String(item.quantity),
              reason_for_requirement: item.reason_for_requirement || "",
              expected_date: item.expected_date || "",
              room_id: item.room_id ? String(item.room_id) : (item.room?.id ? String(item.room.id) : "none"),
            }))
            : [],
        amount: initialAmountItems,
      });
    } else if (currentUser) {
      setValue("branch_from", currentUser.branches?.[0]?.id?.toString() || "");
    }
  }, [requisition, currentUser, reset, setValue]);

  // Totals
  const selectedItemsCount = watchedItems.filter((i) => i.product_id).length;
  const estimatedCost =
    activeType === "1"
      ? watchedItems.reduce((acc, item) => {
        return acc + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
      }, 0)
      : watchedAmountItems.reduce((acc, item) => {
        return acc + (parseFloat(item.amount_requested) || 0);
      }, 0);

  // Filtered products
  const filteredProducts =
    productSearch.trim()
      ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
          (p.barcode || "").toLowerCase().includes(productSearch.toLowerCase())
      )
      : products; const submitHandler = async (values: FormValues) => {
        const type = parseInt(values.type);

        const payload: RequisitionInput = {
          type,
          description: values.description || "",
          user_id: currentUser?.id,
          branch_from: values.branch_from ? parseInt(values.branch_from) : undefined,
          branch_to: values.branch_to ? parseInt(values.branch_to) : undefined,
        };

        if (type === 1) {
          payload.requisition_condition = parseInt(values.requisition_condition as string);
          payload.items = values.items
            .filter((item) => item.product_id)
            .map((item) => {
              const mappedItem: {
                product_id: number;
                price: number;
                quantity: number;
                reason_for_requirement?: string;
                expected_date?: string;
                room_id?: number | string;
              } = {
                product_id: parseInt(item.product_id),
                price: parseFloat(item.price) || 0,
                quantity: parseInt(item.quantity) || 1,
              };
              if (item.reason_for_requirement) mappedItem.reason_for_requirement = item.reason_for_requirement;
              if (item.expected_date) mappedItem.expected_date = item.expected_date;
              mappedItem.room_id = item.room_id && item.room_id !== "none" ? parseInt(item.room_id) : "";
              return mappedItem;
            });
        } else {
          payload.requisition_condition = null;
          payload.amount = values.amount
            .filter((item) => item.amount_requested && parseFloat(item.amount_requested) > 0)
            .map((item) => {
              const mappedAmount: {
                amount_requested: number;
                docs: AmountFile[];
                amount_reason?: string;
                amount_expected_date?: string;
              } = {
                amount_requested: parseFloat(item.amount_requested),
                docs: item.docs || [],
              };
              if (item.amount_reason) mappedAmount.amount_reason = item.amount_reason;
              if (item.amount_expected_date) mappedAmount.amount_expected_date = item.amount_expected_date;
              return mappedAmount;
            });
        }

        try {
          const res = requisition
            ? await updateRequisition(Number(requisition.id), payload)
            : await createRequisition(payload);

          if (res.success) {
            toast?.success(res.message || "Requisition saved successfully!");
            reset({
              type: "1",
              requisition_condition: "1",
              branch_from: currentUser?.branches?.[0]?.id?.toString() || "",
              branch_to: currentUser?.branches?.[1]?.id?.toString() || "",
              description: "",
              remarks: "",
              items: [],
              amount: [{ amount_requested: "", amount_reason: "", amount_expected_date: "", docs: [] }],
            });
            setActiveType("1");
            setProductSearch("");
            router.push("/inventory/requisitions");
          } else {
            if (res.errors) {
              toast?.error(res.message || "Failed to save requisition");
              Object.entries(res.errors).forEach(([field, messages]) => {
                const errorMessage = Array.isArray(messages) ? messages[0] : messages;
                let targetField = field;

                // Map backend validation keys to frontend form keys
                if (field === "amount_requested") {
                  targetField = "amount.0.amount_requested";
                } else if (field === "amount_reason") {
                  targetField = "amount.0.amount_reason";
                } else if (field === "amount_expected_date") {
                  targetField = "amount.0.amount_expected_date";
                } else if (field === "items" || field === "amount") {
                  targetField = `${field}.root`;
                }

                setError(targetField as Path<FormValues>, {
                  type: "server",
                  message: String(errorMessage),
                });
              });
            } else {
              toast?.error(res.message || "Failed to save requisition");
            }
          }
        } catch (error: unknown) {
          toast.error(error instanceof Error ? error.message : "An unexpected error occurred.");
          console.error(error);
        }
      };

  return (
    <div className="space-y-0">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold tracking-tight text-slate-800">{title}</h1>
        </div>

        {/* Type toggle pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 border border-gray-200 rounded-full p-1 gap-0.5">
            <button
              type="button"
              onClick={() => { setActiveType("1"); setValue("type", "1"); setValue("requisition_condition", "1"); }}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${activeType === "1"
                  ? "bg-white text-slate-900 shadow-sm border border-gray-200"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <ShoppingCart className="h-4 w-4 text-green-600" />
              Item Requisition
            </button>
            <button
              type="button"
              onClick={() => { setActiveType("2"); setValue("type", "2"); }}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${activeType === "2"
                  ? "bg-white text-slate-900 shadow-sm border border-gray-200"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <CircleDollarSign className="h-4 w-4 text-green-600" />
              Amount Requisition
            </button>
          </div>

        </div>
      </div>

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ===== Left Panel ===== */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
              {/* Panel title */}
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <div className="p-2 bg-green-50 rounded-lg border border-green-100">
                  <PackageSearch className="h-4 w-4 text-green-600" />
                </div>
                <h2 className="text-base font-semibold text-slate-800">Requisition Information</h2>
              </div>


              {/* Applicant Name — read-only from session */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Applicant Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    readOnly
                    value={
                      requisition?.user?.name || currentUser?.name || ""
                    }
                    placeholder="Applicant name"
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-slate-700 focus:outline-none cursor-default"
                  />
                </div>
              </div>

              {/* Designation — read-only from session */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Designation
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    readOnly
                    value={
                      requisition?.user?.designation || ""
                    }
                    placeholder="Designation"
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-slate-700 focus:outline-none cursor-default"
                  />
                </div>
              </div>

              {/* Branch */}
              {showBranchSelect ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Branch</label>
                  <Controller
                    name="branch_from"
                    control={control}
                    render={({ field }) => (
                      <BranchSearchSelect
                        value={field.value}
                        onValueChange={(val) => field.onChange(val || "")}
                        placeholder="Select Branch"
                      />
                    )}
                  />
                  {errors.branch_from && (
                    <p className="text-sm text-red-500 mt-1">{errors.branch_from.message}</p>
                  )}
                  {errors.branch_to && (
                    <p className="text-sm text-red-500 mt-1">{errors.branch_to.message}</p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Branch
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      readOnly
                      value={
                        requisition?.branch_from?.name ||
                        currentUser?.branches?.[0]?.name ||
                        ""
                      }
                      placeholder="Branch"
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-slate-700 focus:outline-none cursor-default"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <Textarea
                  placeholder="Type any description..."
                  {...register("description")}
                  rows={4}
                  className="border-gray-200 rounded-lg resize-none text-sm"
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Upload Invoice/Bill/Voucher — commented out, moved to row-level in Expense Details panel */}

            </div>
          </div>

          {/* ===== Right Panel: Expense Details ===== */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-50 rounded-lg border border-green-100">
                    <ClipboardList className="h-4 w-4 text-green-600" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-800">Expense Details</h2>
                </div>
                {activeType === "1" && selectedItemsCount > 0 && (
                  <span className="text-sm font-medium text-slate-500">
                    {String(selectedItemsCount).padStart(2, "0")} Item Selected
                  </span>
                )}
                {activeType === "2" && (
                  <button
                    type="button"
                    onClick={() => appendAmountItem({ amount_requested: "", amount_reason: "", amount_expected_date: "", docs: [] })}
                    className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Row
                  </button>
                )}
              </div>

              <div className="p-5 space-y-4">
                {/* ===== ITEM-BASED ===== */}
                {activeType === "1" && (
                  <>
                    {/* Requisition Type */}
                    <div className="mb-4">
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Requisition Type
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {ALL_CONDITION_OPTIONS.map(({ value, label, Icon }) => (
                          <Controller
                            key={value}
                            name="requisition_condition"
                            control={control}
                            render={({ field }) => (
                              <button
                                type="button"
                                onClick={() => field.onChange(value)}
                                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${field.value === value
                                    ? ACTIVE_CLASS
                                    : "bg-white border-gray-200 text-slate-600 hover:border-gray-300 hover:bg-gray-50"
                                  }`}
                              >
                                <Icon className="h-4 w-4 shrink-0" />
                                {label}
                              </button>
                            )}
                          />
                        ))}
                      </div>
                      {errors.requisition_condition && (
                        <p className="text-sm text-red-500 mt-1">{errors.requisition_condition.message}</p>
                      )}
                    </div>

                    {/* Search bar (Combobox) to add items */}
                    <div className="relative z-10 mb-4">
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          autoComplete="off"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="Search Expense Item By Name or Barcode"
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-colors [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden"
                        />
                      </div>

                      {/* Dropdown Results */}
                      {productSearch.trim() && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                          {filteredProducts.length > 0 ? (
                            <ul className="py-1.5">
                              {filteredProducts.map((p) => (
                                <li key={p.id}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // Check if already added
                                      if (watchedItems.some((item) => item.product_id === String(p.id))) {
                                        toast.info(`${p.name} is already added`);
                                      } else {
                                        prependItem({
                                          product_id: String(p.id),
                                          price: String(p.mrp_price || 0),
                                          quantity: "1",
                                          reason_for_requirement: "",
                                          expected_date: "",
                                          room_id: "none",
                                        });
                                        // Clear items array error when user adds an item
                                        clearErrors("items");
                                      }
                                      setProductSearch("");
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-green-50 focus:bg-green-50 focus:outline-none transition-colors"
                                  >
                                    <div className="font-medium text-sm text-slate-800">{p.name}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">
                                      {[p.barcode && `Barcode: ${p.barcode}`, p.unit_name && `Unit: ${p.unit_name}`]
                                        .filter(Boolean)
                                        .join(" · ")}
                                    </div>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="px-4 py-3 text-sm text-slate-500 text-center">
                              No products found.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Root-level items error from server */}
                    {errors.items && "root" in errors.items && (errors.items as { root?: { message?: string } }).root?.message && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg mb-2">
                        <span className="text-red-500 text-sm">
                          {(errors.items as { root?: { message?: string } }).root?.message}
                        </span>
                      </div>
                    )}

                    {/* Item cards */}
                    <div className="space-y-3">
                      {itemFields.map((field, index) => {
                        const selectedProduct = products.find(
                          (p) => String(p.id) === watchedItems[index]?.product_id
                        );
                        const unitPrice = parseFloat(watchedItems[index]?.price || "0");
                        const qty = parseInt(watchedItems[index]?.quantity || "1") || 1;
                        const subTotal = unitPrice * qty;

                        return (
                          <div
                            key={field.id}
                            className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_-3px_rgba(0,0,0,0.08)] transition-all duration-300"
                          >
                            {/* ── Product Header Row ── */}
                            <div className="flex items-center gap-3 px-5 py-3 bg-slate-50/70 border-b border-slate-100">
                              {/* Product icon */}
                              <div className="w-8 h-8 shrink-0 bg-green-50 border border-green-100 rounded-lg flex items-center justify-center">
                                <PackageSearch className="h-3.5 w-3.5 text-green-600" />
                              </div>

                              {/* Product Name Display instead of Select */}
                              <div className="flex-1 min-w-0">
                                <input type="hidden" {...register(`items.${index}.product_id`)} />
                                <h3 className="text-sm font-semibold text-slate-800">
                                  {selectedProduct ? selectedProduct.name : "Unknown Product"}
                                </h3>
                                {selectedProduct && (
                                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight font-medium flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                                    {selectedProduct.barcode && (
                                      <>
                                        <span>Barcode: {selectedProduct.barcode}</span>
                                        <span>|</span>
                                      </>
                                    )}
                                    {selectedProduct.unit_name && (
                                      <>
                                        <span>Unit: {selectedProduct.unit_name}</span>
                                        <span>|</span>
                                      </>
                                    )}
                                    <span className="text-slate-800 font-semibold">
                                      Price: ৳{(unitPrice || 0).toLocaleString()}
                                    </span>
                                  </p>
                                )}
                                {errors.items?.[index]?.product_id && (
                                  <p className="text-xs text-red-500 mt-1 font-medium">
                                    {errors.items[index]?.product_id?.message}
                                  </p>
                                )}
                              </div>

                              {/* Remove */}
                              <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="ml-1 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 shrink-0 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            {/* ── Fields Row ── */}
                            <div className="p-5 grid grid-cols-1 gap-4 md:grid-cols-[4fr_2.5fr_2.5fr_2fr_1.5fr] items-end">
                              {/* REASON FOR REQUIREMENT */}
                              <div className="w-full">
                                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                  Reason for Requirement
                                </label>
                                <Input
                                  placeholder="e.g. For Lab 3 Student"
                                  className={`h-9 border-slate-200 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-lg focus:border-green-400 focus:ring-green-400/20 transition-all ${errors.items?.[index]?.reason_for_requirement ? "border-red-400 focus:ring-red-300" : ""
                                    }`}
                                  {...register(`items.${index}.reason_for_requirement`)}
                                />
                                {errors.items?.[index]?.reason_for_requirement && (
                                  <p className="text-[10px] text-red-500 mt-1">
                                    {errors.items[index]?.reason_for_requirement?.message}
                                  </p>
                                )}
                              </div>


                              {/* ROOM / LOCATION */}
                              <div className="w-full">
                                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                  Room / Location
                                </label>
                                <Controller
                                  name={`items.${index}.room_id`}
                                  control={control}
                                  render={({ field }) => (
                                    <Select
                                      onValueChange={field.onChange}
                                      value={field.value || "none"}
                                    >
                                      <SelectTrigger
                                        className={`h-9 border-slate-200 text-xs bg-slate-50/50 hover:bg-slate-100/50 transition-colors rounded-lg text-slate-700 w-full focus:ring-1 focus:ring-green-400 ${errors.items?.[index]?.room_id ? "border-red-400 focus:ring-red-300" : ""
                                          }`}
                                      >
                                        <SelectValue placeholder="Select Room" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {currentUser?.main_branch && rooms && rooms.length > 0 ? (
                                          <>
                                            <SelectItem value="none">Select Room</SelectItem>
                                            {rooms.map((room) => (
                                              <SelectItem key={room.id} value={String(room.id)}>
                                                {room.name} {room.room_no ? `(${room.room_no})` : ""}
                                              </SelectItem>
                                            ))}
                                          </>
                                        ) : (
                                          <SelectItem value="none" disabled>
                                            No room found
                                          </SelectItem>
                                        )}
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                                {errors.items?.[index]?.room_id && (
                                  <p className="text-[10px] text-red-500 mt-1">
                                    {errors.items[index]?.room_id?.message}
                                  </p>
                                )}
                              </div>

                              {/* EXPECTATION DATE */}
                              <div className="w-full">
                                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                  Expectation Date
                                </label>
                                <Input
                                  type="date"
                                  className={`h-9 border-slate-200 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-lg focus:border-green-400 focus:ring-green-400/20 transition-all ${errors.items?.[index]?.expected_date ? "border-red-400 focus:ring-red-300" : ""
                                    }`}
                                  {...register(`items.${index}.expected_date`)}
                                />
                                {errors.items?.[index]?.expected_date && (
                                  <p className="text-[10px] text-red-500 mt-1">
                                    {errors.items[index]?.expected_date?.message}
                                  </p>
                                )}
                              </div>

                              {/* Hidden price input for form submission */}
                              <input type="hidden" {...register(`items.${index}.price`)} />

                              {/* QUANTITY */}
                              <div className="w-full">
                                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                  Quantity
                                </label>
                                <div className="flex items-center bg-slate-50/50 border border-slate-200 rounded-lg h-9 px-1 w-full justify-between">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const cur = parseInt(watchedItems[index]?.quantity || "1") || 1;
                                      if (cur > 1) setValue(`items.${index}.quantity`, String(cur - 1));
                                    }}
                                    className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm border border-transparent hover:border-slate-100 transition-all duration-150 shrink-0 cursor-pointer"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    className="w-12 text-center text-xs bg-transparent border-0 font-semibold text-slate-800 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    {...register(`items.${index}.quantity`)}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const cur = parseInt(watchedItems[index]?.quantity || "1") || 1;
                                      setValue(`items.${index}.quantity`, String(cur + 1));
                                    }}
                                    className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm border border-transparent hover:border-slate-100 transition-all duration-150 shrink-0 cursor-pointer"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                {errors.items?.[index]?.quantity && (
                                  <p className="text-[10px] text-red-500 mt-1">
                                    {errors.items[index]?.quantity?.message}
                                  </p>
                                )}
                              </div>

                              {/* SUB TOTAL */}
                              <div className="w-full">
                                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 text-center">
                                  Sub Total
                                </label>
                                <div className="h-9 flex items-center justify-center px-3 rounded-lg bg-emerald-50/60 border border-emerald-100/80 text-emerald-700 font-bold text-xs shadow-sm w-full">
                                  ৳{subTotal.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* ===== AMOUNT-BASED right panel ===== */}
                {activeType === "2" && (
                  <div className="space-y-4">
                    {/* Root-level amount error from server */}
                    {errors.amount && "root" in errors.amount && (errors.amount as { root?: { message?: string } }).root?.message && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                        <span className="text-red-500 text-sm">
                          {(errors.amount as { root?: { message?: string } }).root?.message}
                        </span>
                      </div>
                    )}
                    {amountFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-end gap-3 p-4 border border-gray-200 rounded-xl bg-white"
                      >
                        {/* Index Box */}
                        <div className="shrink-0 w-10 h-10 border border-green-300 bg-green-50 rounded-lg flex items-center justify-center text-green-700 font-semibold text-sm">
                          #{String(index + 1).padStart(2, "0")}
                        </div>

                        {/* Amount Request */}
                        <div className="w-32 shrink-0">
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            Amount Request<span className="text-red-500 ml-0.5">*</span>
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="e.g. 5000"
                            className={`h-10 text-sm bg-white rounded-lg focus:ring-1 focus:ring-green-400 ${errors.amount?.[index]?.amount_requested
                                ? "border-red-400 focus:ring-red-300"
                                : "border-gray-200"
                              }`}
                            {...register(`amount.${index}.amount_requested`)}
                          />
                          {errors.amount?.[index]?.amount_requested && (
                            <p className="text-[10px] text-red-500 mt-1">
                              {errors.amount[index]?.amount_requested?.message}
                            </p>
                          )}
                        </div>

                        {/* Reason for Requirement */}
                        <div className="flex-1 min-w-0">
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            Reason for Requirement
                          </label>
                          <Input
                            placeholder="e.g. For Lab 3 Student"
                            className={`h-10 border-gray-200 text-sm bg-white rounded-lg focus:ring-1 focus:ring-green-400 w-full ${errors.amount?.[index]?.amount_reason ? "border-red-400 focus:ring-red-300" : ""
                              }`}
                            {...register(`amount.${index}.amount_reason`)}
                          />
                          {errors.amount?.[index]?.amount_reason && (
                            <p className="text-[10px] text-red-500 mt-1">
                              {errors.amount[index]?.amount_reason?.message}
                            </p>
                          )}
                        </div>

                        {/* Expectation Date */}
                        <div className="w-40 shrink-0">
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            Expectation Date
                          </label>
                          <Input
                            type="date"
                            className={`h-10 border-gray-200 text-sm bg-white rounded-lg focus:ring-1 focus:ring-green-400 ${errors.amount?.[index]?.amount_expected_date ? "border-red-400 focus:ring-red-300" : ""
                              }`}
                            {...register(`amount.${index}.amount_expected_date`)}
                          />
                          {errors.amount?.[index]?.amount_expected_date && (
                            <p className="text-[10px] text-red-500 mt-1">
                              {errors.amount[index]?.amount_expected_date?.message}
                            </p>
                          )}
                        </div>

                        {/* Attachment Button */}
                        <div className="shrink-0">
                          <input
                            type="file"
                            id={`amount-file-${index}`}
                            accept="image/*,.pdf"
                            className="hidden"
                            multiple
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length === 0) return;

                              try {
                                const processedFiles = await Promise.all(files.map(processFile));
                                const currentFiles = watchedAmountItems[index]?.docs || [];
                                setValue(`amount.${index}.docs`, [...currentFiles, ...processedFiles]);
                                toast.success("Attachments uploaded successfully.");
                              } catch (err) {
                                toast.error("Failed to process some attachments.");
                              } finally {
                                e.target.value = "";
                              }
                            }}
                          />
                          <div className="flex items-center gap-2 min-h-10">
                            {/* Show only the last uploaded file with a count badge */}
                            {(() => {
                              const files = watchedAmountItems[index]?.docs || [];
                              if (files.length === 0) return null;
                              const lastFile = files[files.length - 1];
                              const count = files.length;
                              return (
                                <div className="relative w-10 h-10 border border-gray-200 rounded-lg overflow-visible shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const w = window.open();
                                      if (w) {
                                        w.document.write(`<iframe src="${lastFile.fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                                      }
                                    }}
                                    className="w-full h-full flex items-center justify-center bg-white rounded-lg overflow-hidden"
                                    title={lastFile.fileName}
                                  >
                                    {isImageFile(lastFile.fileData) ? (
                                      <img
                                        src={lastFile.fileData}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-[9px] font-bold text-green-600 truncate px-0.5">PDF</span>
                                    )}
                                  </button>
                                  {/* Count badge */}
                                  {count > 1 && (
                                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-0.5 bg-green-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm z-20 leading-none">
                                      {count}
                                    </span>
                                  )}
                                  {/* Remove all button */}
                                  <button
                                    type="button"
                                    className=" absolute -bottom-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 shadow-sm transition-colors z-20"
                                    title="Remove all attachments"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setValue(`amount.${index}.docs`, []);
                                      toast.info("All attachments removed.");
                                    }}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              );
                            })()}

                            {/* Upload image icon button */}
                            <button
                              type="button"
                              onClick={() => {
                                document.getElementById(`amount-file-${index}`)?.click();
                              }}
                              className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg border border-dashed border-gray-300 bg-white text-slate-400 hover:bg-green-50 hover:border-green-400 hover:text-green-600 transition-all duration-200"
                              title="Upload Image / Attachment"
                            >
                              <ImageIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Trash */}
                        <div className="shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              removeAmountItem(index);
                              toast.info(`Row #${String(index + 1).padStart(2, "0")} removed.`);
                            }}
                            className="cursor-pointer p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                            disabled={amountFields.length === 1}
                          >
                            <Trash2 className="h-5.5 w-5.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ===== Footer ===== */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-5 text-sm">
                    {activeType === "1" ? (
                      <div>
                        <div className="text-[11px] text-slate-400 font-medium">Total Items</div>
                        <div className="text-xl font-bold text-slate-800">
                          {String(itemFields.length).padStart(2, "0")}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-[11px] text-slate-400 font-medium">Amount Items</div>
                        <div className="text-xl font-bold text-slate-800">
                          {String(amountFields.length).padStart(2, "0")}
                        </div>
                      </div>
                    )}
                    <div className="h-10 w-px bg-gray-200" />
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Estimated Cost</div>
                      <div className="text-xl font-bold text-green-600">
                        ৳{estimatedCost.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="cursor-pointer rounded-lg border-gray-200 text-slate-600 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="cursor-pointer text-white px-6 rounded-lg bg-green-600 hover:bg-green-700 transition-colors"
                    >
                      {isSubmitting ? "Submitting..." : requisition ? "Update Requisition" : "Create Requisition"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
