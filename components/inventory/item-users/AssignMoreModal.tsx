"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PlusCircle,
  Search,
  Package,
  Layers,
  Trash2,
  Plus,
  Minus,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import RoomSearchSelect from "@/components/common/RoomSearchSelect";
import BranchSearchSelect from "@/components/common/BranchSearchSelect";
import {
  createProductAssignment,
  searchInventoryItems,
  searchInventoryGroupItems,
  SearchItemResult,
  SearchGroupItemResult,
} from "@/apiServices/inventoryItemUsersService";
import { getPublicBranchListAll, PublicBranch } from "@/apiServices/branchService";
import { Room } from "@/apiServices/inventoryRoomsService";

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

interface AssignMoreModalProps {
  userId: number;
  employeeName: string;
  employeeEmail?: string;
  employeeId?: string | null;
  profileImage?: string | null;
  branchName?: string | null;
  branchId?: number | string | null;
  defaultRoomId?: number | null;
  defaultRoomName?: string | null;
}

export default function AssignMoreModal({
  userId,
  employeeName,
  employeeEmail,
  employeeId,
  profileImage,
  branchName,
  branchId,
  defaultRoomId,
  defaultRoomName,
}: AssignMoreModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Form states
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    branchId ? String(branchId) : ""
  );
  const [roomId, setRoomId] = useState<string>(
    defaultRoomId ? String(defaultRoomId) : ""
  );
  const [assignedDate, setAssignedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [note, setNote] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectedItemRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search states
  const [activeSearchTab, setActiveSearchTab] = useState<"individual" | "group">("individual");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemSearchResults, setItemSearchResults] = useState<SearchItemResult[]>([]);
  const [groupSearchResults, setGroupSearchResults] = useState<SearchGroupItemResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      const initialBId = branchId ? String(branchId) : "";
      setSelectedBranchId(initialBId);
      setRoomId(defaultRoomId ? String(defaultRoomId) : "");
      setAssignedDate(new Date().toISOString().split("T")[0]);
      setNote("");
      setSelectedItems([]);
      setSearchQuery("");
      setItemSearchResults([]);
      setGroupSearchResults([]);

      // If branchId is not yet available but branchName is present, find branchId by branchName
      if (!initialBId && branchName && branchName !== "—") {
        getPublicBranchListAll()
          .then((res) => {
            if (res?.success) {
              const data = res.data;
              const list: PublicBranch[] = Array.isArray(data)
                ? data
                : Array.isArray((data as { branches?: PublicBranch[] })?.branches)
                ? (data as { branches: PublicBranch[] }).branches
                : [];
              const match = list.find(
                (b) => b.name?.toLowerCase().trim() === branchName.toLowerCase().trim()
              );
              if (match) {
                setSelectedBranchId(String(match.id));
              }
            }
          })
          .catch(() => {});
      }
    }
  }, [open, branchId, branchName, defaultRoomId]);

  // Live search debounce
  useEffect(() => {
    if (searchQuery.trim().length < 1) {
      setItemSearchResults([]);
      setGroupSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        if (activeSearchTab === "individual") {
          const res = await searchInventoryItems(searchQuery.trim(), 20);
          if (res?.success) {
            setItemSearchResults(res?.data || []);
          }
        } else {
          const res = await searchInventoryGroupItems(searchQuery.trim(), 20);
          if (res?.success) {
            setGroupSearchResults(res?.data || []);
          }
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, activeSearchTab]);

  // Add individual item
  const handleAddIndividualItem = (item: SearchItemResult) => {
    setSelectedItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.product_id === item.id && !i.group_item_id
      );
      if (existingIdx >= 0) {
        return prev.map((it, idx) =>
          idx === existingIdx
            ? { ...it, quantity: Number(it.quantity) + 1 }
            : it
        );
      }
      return [
        ...prev,
        {
          product_id: item.id,
          name: item.name,
          barcode: item.barcode,
          image: item.image,
          quantity: 1,
          price: item.price,
          group_item_id: null,
          group_item_name: null,
        },
      ];
    });
    setSearchQuery("");
    setShowDropdown(false);
  };

  // Add entire group item package
  const handleAddGroupItem = (group: SearchGroupItemResult) => {
    if (!group.details || group.details.length === 0) {
      toast.error("This group item has no items configured.");
      return;
    }

    setSelectedItems((prev) => {
      let currentList = [...prev];
      group.details.forEach((d) => {
        const existingIdx = currentList.findIndex(
          (i) => i.product_id === d.product_id && i.group_item_id === group.id
        );
        const qtyToAdd = Number(d.quantity) || 1;
        if (existingIdx >= 0) {
          currentList = currentList.map((it, idx) =>
            idx === existingIdx
              ? { ...it, quantity: Number(it.quantity) + qtyToAdd }
              : it
          );
        } else {
          currentList = [
            ...currentList,
            {
              product_id: d.product_id,
              name: d.product_name,
              barcode: d.barcode,
              image: d.image || group.image,
              quantity: qtyToAdd,
              price: d.unit_price || group.price,
              group_item_id: group.id,
              group_item_name: group.name,
            },
          ];
        }
      });
      return currentList;
    });
    setSearchQuery("");
    setShowDropdown(false);
  };

  // Quantity adjusters
  const handleUpdateQuantity = (idx: number, newQty: number) => {
    if (newQty <= 0) {
      setSelectedItems((prev) => prev.filter((_, i) => i !== idx));
      return;
    }
    setSelectedItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (idx: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      toast.error("Please search and select at least one item or group item.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        user_id: userId,
        assigned_date: assignedDate,
        branch_id: selectedBranchId ? Number(selectedBranchId) : null,
        room_id: roomId ? Number(roomId) : null,
        note: note.trim() || undefined,
        items: selectedItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          group_item_id: item.group_item_id || null,
        })),
      };

      const res = await createProductAssignment(payload);
      if (res?.success) {
        toast.success(res.message || "Items assigned successfully!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to assign items.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalUnits = selectedItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs">
          <PlusCircle className="w-4 h-4 mr-2" />
          Assign More
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-lg font-bold text-slate-900">
            Assign More Items to Employee
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Employee Info Header (Locked Context) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-slate-200 shrink-0 bg-white">
                {profileImage ? (
                  <AvatarImage
                    src={profileImage}
                    alt={employeeName}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-slate-100 flex items-center justify-center p-0">
                  <Image
                    src="/images/profile_avatar.png"
                    alt={employeeName}
                    width={40}
                    height={40}
                    unoptimized
                    className="w-full h-full object-cover rounded-full"
                  />
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-slate-900">
                    {employeeName}
                  </span>
                  {employeeId && (
                    <span className="text-[11px] bg-white text-slate-700 px-2 py-0.5 rounded font-mono font-medium border border-slate-200">
                      ID: {employeeId}
                    </span>
                  )}
                </div>
                {employeeEmail && (
                  <p className="text-xs text-slate-500">{employeeEmail}</p>
                )}
              </div>
            </div>

            {branchName && branchName !== "—" && (
              <Badge variant="outline" className="bg-white text-slate-700 text-xs px-2.5 py-1">
                Branch: {branchName}
              </Badge>
            )}
          </div>

          {/* Form Controls: Branch, Room & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Branch <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <BranchSearchSelect
                value={selectedBranchId}
                onValueChange={(val) => {
                  setSelectedBranchId(val || "");
                  setRoomId("");
                }}
                branches={
                  selectedBranchId && branchName && branchName !== "—"
                    ? [{ id: Number(selectedBranchId), name: branchName }]
                    : branchId && branchName && branchName !== "—"
                    ? [{ id: Number(branchId), name: branchName }]
                    : undefined
                }
                placeholder="Select Branch"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Room <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <RoomSearchSelect
                key={`modal-room-${selectedBranchId}`}
                value={roomId}
                onValueChange={(val) => setRoomId(val || "")}
                rooms={
                  defaultRoomId && defaultRoomName
                    ? [
                        {
                          id: Number(defaultRoomId),
                          name: defaultRoomName,
                          room_no: "",
                          is_store: 0,
                          status: 1,
                          status_text: "Active",
                          branch: { id: 0, name: "" },
                        } as Room,
                      ]
                    : undefined
                }
                branchId={selectedBranchId || undefined}
                placeholder="Search / Select Room"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Assigned Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={assignedDate}
                onChange={(e) => setAssignedDate(e.target.value)}
                required
                className="h-9"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Remarks / Description <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <Input
                placeholder="E.g. Additional equipment requested by department"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          {/* Item Search & Selection Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Select Items to Assign
              </span>

              {/* Tab Selector */}
              <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSearchTab("individual");
                    setSearchQuery("");
                    setShowDropdown(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    activeSearchTab === "individual"
                      ? "bg-white text-slate-900 shadow-2xs font-semibold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  Individual Items
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveSearchTab("group");
                    setSearchQuery("");
                    setShowDropdown(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    activeSearchTab === "group"
                      ? "bg-white text-purple-900 shadow-2xs font-semibold"
                      : "text-slate-500 hover:text-purple-700"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Group Items
                </button>
              </div>
            </div>

            {/* Live Autocomplete Search Input */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder={
                    activeSearchTab === "individual"
                      ? "Type item name or barcode..."
                      : "Type group item name or barcode..."
                  }
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="pl-9 pr-8 h-9 text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setShowDropdown(false);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown List */}
              {showDropdown && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto p-1">
                  {isSearching ? (
                    <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                      Searching inventory...
                    </div>
                  ) : activeSearchTab === "individual" ? (
                    itemSearchResults.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">
                        No individual items found matching &quot;{searchQuery}&quot;
                      </div>
                    ) : (
                      itemSearchResults.map((item) => (
                        <div
                          key={`res-${item.id}`}
                          onClick={() => handleAddIndividualItem(item)}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border-b last:border-0 border-slate-100"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                              <Image
                                src={(item.image && typeof item.image === "string" && item.image.trim() !== "") ? item.image : "/images/placeholder.png"}
                                alt={item.name}
                                width={32}
                                height={32}
                                unoptimized
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {item.name}
                              </p>
                              {item.barcode && (
                                <p className="text-xs text-slate-400 font-mono">
                                  {item.barcode}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200/80 text-[11px] shrink-0">
                            + Add Item
                          </Badge>
                        </div>
                      ))
                    )
                  ) : groupSearchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No group items found matching &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    groupSearchResults.map((group) => (
                      <div
                        key={`res-group-${group.id}`}
                        onClick={() => handleAddGroupItem(group)}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-purple-50/50 cursor-pointer transition-colors border-b last:border-0 border-slate-100"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-md bg-purple-50 border border-purple-200 overflow-hidden shrink-0 flex items-center justify-center">
                            <Layers className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {group.name}
                            </p>
                            <p className="text-xs text-purple-600 font-medium">
                              Group Item ({group.details?.length || 0} items)
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200 text-[11px] shrink-0">
                          + Add Group Item
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected Items List Box */}
            {selectedItems.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedItems.map((item, idx) => (
                  <div
                    key={`sel-${item.product_id}-${item.group_item_id || "single"}-${idx}`}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                        <Image
                          src={(item.image && typeof item.image === "string" && item.image.trim() !== "") ? item.image : "/images/placeholder.png"}
                          alt={item.name}
                          width={32}
                          height={32}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-slate-900 truncate">
                            {item.name}
                          </span>
                          {item.group_item_name && (
                            <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded border border-purple-200 font-medium">
                              {item.group_item_name}
                            </span>
                          )}
                        </div>
                        {item.barcode && (
                          <span className="text-[11px] text-slate-400 font-mono">
                            {item.barcode}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Counter & Delete */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleUpdateQuantity(idx, item.quantity - 1);
                          }}
                          disabled={item.quantity <= 1}
                          className="p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            handleUpdateQuantity(idx, isNaN(val) || val < 1 ? 1 : val);
                          }}
                          className="w-10 text-center text-xs font-bold text-slate-800 font-mono bg-transparent outline-none py-0.5"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleUpdateQuantity(idx, item.quantity + 1);
                          }}
                          className="p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center">
                <Package className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                <p className="text-xs text-slate-500">
                  No items selected yet. Use the search input above to add items.
                </p>
              </div>
            )}
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-500 font-medium">
              {selectedItems.length > 0 && (
                <span>
                  Total: <strong className="text-slate-800">{selectedItems.length}</strong> items (
                  <strong className="text-slate-800">{totalUnits}</strong> units)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || selectedItems.length === 0}
                className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  "Assign Items"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
