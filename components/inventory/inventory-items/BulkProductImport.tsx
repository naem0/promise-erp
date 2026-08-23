"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  ArrowLeft,
  Download,
  Upload,
  Plus,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Search,
  Check,
  FileUp,
  AlertTriangle,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { importProducts, getProductItems, ServerRowError } from "@/apiServices/inventoryItemsService";
import { getProductCategories } from "@/apiServices/inventoryCategoriesService";
import { getBrands } from "@/apiServices/inventoryBrandsService";
import { getUnits } from "@/apiServices/inventoryUnitsService";
import { cn } from "@/lib/utils";

// ==========================================
// Types
// ==========================================

export interface BulkProductRow {
  id: string;
  name: string;
  barcode: string;
  category_name: string;
  brand_name: string;
  description: string;
  specification: string;
  unit_name: string;
  model: string;
  product_type: "Admin" | "IT" | "";
  purchase_price: string;
  mrp_price: string;
  status: "Active" | "Inactive" | "";
  serverErrors?: Record<string, string>;
}

export interface OptionItem {
  id: number;
  name: string;
}

export interface ExistingProductItem {
  name: string;
  barcode?: string;
}

interface BulkProductImportProps {
  initialCategories?: OptionItem[];
  initialBrands?: OptionItem[];
  initialUnits?: OptionItem[];
  initialExistingProducts?: ExistingProductItem[];
}

const DEFAULT_EMPTY_ROW = (): BulkProductRow => ({
  id: `row-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  name: "",
  barcode: "",
  category_name: "",
  brand_name: "",
  description: "",
  specification: "",
  unit_name: "",
  model: "",
  product_type: "",
  purchase_price: "",
  mrp_price: "",
  status: "",
});

// ==========================================
// Direct Inline Search Select for Table Cells
// ==========================================

interface InlineSearchSelectProps {
  value: string;
  onValueChange: (val: string) => void;
  placeholder: string;
  options: OptionItem[];
  hasError?: boolean;
}

function InlineSearchSelect({
  value,
  onValueChange,
  placeholder,
  options,
  hasError = false,
}: InlineSearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!inputValue.trim()) return options;
    const q = inputValue.toLowerCase().trim();
    return options.filter((o) => o.name.toLowerCase().includes(q));
  }, [options, inputValue]);

  const handleSelectOption = (name: string) => {
    setInputValue(name);
    onValueChange(name);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onValueChange(val);
    if (!isOpen) setIsOpen(true);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue("");
    onValueChange("");
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={cn(
          "relative flex h-8 w-full items-center justify-between rounded-md border text-xs transition-all bg-transparent px-2",
          hasError
            ? "border-rose-400 bg-rose-50/50 text-rose-900 ring-1 ring-rose-300/40"
            : "border-transparent hover:border-slate-300 focus-within:border-primary/60 focus-within:bg-white"
        )}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-xs placeholder:text-slate-400 pr-5"
        />

        <div className="absolute right-1 flex items-center gap-0.5">
          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-5 w-5 p-0 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Clear"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen((prev) => !prev)}
            className="h-5 w-5 p-0 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-50 min-w-[200px] w-full bg-white rounded-xl border border-slate-200 shadow-xl p-1 max-h-48 overflow-y-auto space-y-0.5 scrollbar-thin">
          {filteredOptions.map((opt) => {
            const isSelected = inputValue.trim().toLowerCase() === opt.name.trim().toLowerCase();
            return (
              <div
                key={opt.id || opt.name}
                onClick={() => handleSelectOption(opt.name)}
                className={cn(
                  "px-2.5 py-1.5 text-xs rounded-lg cursor-pointer flex items-center justify-between transition-colors",
                  isSelected
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-slate-100 text-slate-700"
                )}
              >
                <span className="truncate">{opt.name}</span>
                {isSelected && <Check className="w-3 h-3 text-primary" />}
              </div>
            );
          })}

          {filteredOptions.length === 0 && (
            <div className="py-2.5 text-center text-xs text-slate-400">
              No matching options
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// Main BulkProductImport Component
// ==========================================

export default function BulkProductImport({
  initialCategories = [],
  initialBrands = [],
  initialUnits = [],
  initialExistingProducts = [],
}: BulkProductImportProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dependencies state
  const [categories, setCategories] = useState<OptionItem[]>(initialCategories);
  const [brands, setBrands] = useState<OptionItem[]>(initialBrands);
  const [units, setUnits] = useState<OptionItem[]>(initialUnits);
  const [existingProducts, setExistingProducts] = useState<ExistingProductItem[]>(initialExistingProducts);

  // Fetch dependencies if empty
  useEffect(() => {
    if (categories.length === 0) {
      getProductCategories({ per_page: 500 })
        .then((res) => {
          if (res?.data?.categories) {
            setCategories(res.data.categories.map((c) => ({ id: c.id, name: c.name })));
          }
        })
        .catch(console.error);
    }
    if (brands.length === 0) {
      getBrands({ per_page: 500 })
        .then((res) => {
          if (res?.data?.brands) {
            setBrands(res.data.brands.map((b) => ({ id: b.id, name: b.name })));
          }
        })
        .catch(console.error);
    }
    if (units.length === 0) {
      getUnits({ per_page: 500 })
        .then((res) => {
          if (res?.data?.units) {
            setUnits(res.data.units.map((u) => ({ id: u.id, name: u.name })));
          }
        })
        .catch(console.error);
    }
    if (existingProducts.length === 0) {
      getProductItems({ per_page: 1000 })
        .then((res) => {
          if (res?.data?.products) {
            setExistingProducts(
              res.data.products.map((p) => ({
                name: p.name,
                barcode: p.barcode,
              }))
            );
          }
        })
        .catch(console.error);
    }
  }, [categories.length, brands.length, units.length, existingProducts.length]);

  const [rows, setRows] = useState<BulkProductRow[]>(() =>
    Array.from({ length: 15 }, () => DEFAULT_EMPTY_ROW())
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "valid" | "invalid">("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [originalFileName, setOriginalFileName] = useState<string>("bulk_products_import.xlsx");

  // ==========================================
  // Lookup Sets
  // ==========================================

  const categoryNamesSet = useMemo(() => {
    return new Set(categories.map((c) => c.name.trim().toLowerCase()));
  }, [categories]);

  const brandNamesSet = useMemo(() => {
    return new Set(brands.map((b) => b.name.trim().toLowerCase()));
  }, [brands]);

  const unitNamesSet = useMemo(() => {
    return new Set(units.map((u) => u.name.trim().toLowerCase()));
  }, [units]);

  // Existing database products lookup sets
  const existingDbProductNamesSet = useMemo(() => {
    return new Set(existingProducts.map((p) => p.name.trim().toLowerCase()));
  }, [existingProducts]);

  const existingDbBarcodesSet = useMemo(() => {
    return new Set(
      existingProducts
        .filter((p) => p.barcode?.trim())
        .map((p) => p.barcode!.trim().toLowerCase())
    );
  }, [existingProducts]);

  // Duplicate name counts inside table grid
  const duplicateNameCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    rows.forEach((r) => {
      const trimmed = r.name?.trim().toLowerCase();
      if (trimmed) {
        counts[trimmed] = (counts[trimmed] || 0) + 1;
      }
    });
    return counts;
  }, [rows]);

  // Duplicate barcode counts inside table grid
  const duplicateBarcodeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    rows.forEach((r) => {
      const trimmed = r.barcode?.trim().toLowerCase();
      if (trimmed) {
        counts[trimmed] = (counts[trimmed] || 0) + 1;
      }
    });
    return counts;
  }, [rows]);

  // ==========================================
  // Row & Field Validation
  // ==========================================

  const getFieldErrors = (row: BulkProductRow) => {
    const errors: Record<string, string> = {};

    // 1. Name validation
    if (!row.name?.trim()) {
      errors.name = "Product name is required";
    } else if (existingDbProductNamesSet.has(row.name.trim().toLowerCase())) {
      errors.name = `Product '${row.name.trim()}' already exists in database`;
    } else if (duplicateNameCounts[row.name.trim().toLowerCase()] > 1) {
      errors.name = `Duplicate name '${row.name.trim()}' in table`;
    }

    // 2. Barcode validation (if provided)
    if (row.barcode?.trim()) {
      const rawBarcode = row.barcode.trim();
      const cleanBarcode = rawBarcode.toLowerCase();
      if (existingDbBarcodesSet.has(cleanBarcode)) {
        errors.barcode = `Barcode '${rawBarcode}' already exists in database`;
      } else if (duplicateBarcodeCounts[cleanBarcode] > 1) {
        errors.barcode = `Duplicate barcode in table`;
      }
    }

    // 3. Category validation
    if (!row.category_name?.trim()) {
      errors.category_name = "Category is required";
    } else if (categories.length > 0 && !categoryNamesSet.has(row.category_name.trim().toLowerCase())) {
      errors.category_name = `Category "${row.category_name}" does not exist in DB`;
    }

    // 4. Brand validation (optional, but if provided, must exist in DB)
    if (row.brand_name?.trim() && brands.length > 0 && !brandNamesSet.has(row.brand_name.trim().toLowerCase())) {
      errors.brand_name = `Brand "${row.brand_name}" does not exist in DB`;
    }

    // 5. Unit validation
    if (!row.unit_name?.trim()) {
      errors.unit_name = "Unit is required";
    } else if (units.length > 0 && !unitNamesSet.has(row.unit_name.trim().toLowerCase())) {
      errors.unit_name = `Unit "${row.unit_name}" does not exist in DB`;
    }

    // 6. Product Type validation
    if (!row.product_type) {
      errors.product_type = "Item Type is required";
    } else if (!["Admin", "IT"].includes(row.product_type)) {
      errors.product_type = "Select valid type (Admin or IT)";
    }

    // 7. Status validation
    if (!row.status) {
      errors.status = "Status is required";
    } else if (!["Active", "Inactive"].includes(row.status)) {
      errors.status = "Select status (Active or Inactive)";
    }

    // Merge any server-side validation error from API response
    if (row.serverErrors) {
      Object.assign(errors, row.serverErrors);
    }

    return errors;
  };

  const isRowEmpty = (row: BulkProductRow) => {
    return (
      !row.name?.trim() &&
      !row.barcode?.trim() &&
      !row.category_name?.trim() &&
      !row.brand_name?.trim() &&
      !row.description?.trim() &&
      !row.specification?.trim() &&
      !row.unit_name?.trim() &&
      !row.model?.trim() &&
      !row.product_type?.trim() &&
      !row.purchase_price?.trim() &&
      !row.mrp_price?.trim() &&
      !row.status?.trim()
    );
  };

  const isRowValid = (row: BulkProductRow) => {
    return !isRowEmpty(row) && Object.keys(getFieldErrors(row)).length === 0;
  };

  // Stats
  const meaningfulRows = useMemo(() => rows.filter((r) => !isRowEmpty(r)), [rows]);
  const validRowsCount = useMemo(() => meaningfulRows.filter((r) => isRowValid(r)).length, [meaningfulRows]);
  const invalidRowsCount = useMemo(() => meaningfulRows.length - validRowsCount, [meaningfulRows, validRowsCount]);

  const activeFilterType = useMemo(() => {
    if (filterType === "invalid" && invalidRowsCount === 0) return "all";
    if (filterType === "valid" && validRowsCount === 0) return "all";
    return filterType;
  }, [filterType, invalidRowsCount, validRowsCount]);

  // Filtered rows for grid display
  const displayedRows = useMemo(() => {
    return rows.filter((row, index) => {
      // 1. Filter by status
      if (activeFilterType === "valid" && !isRowValid(row)) return false;
      if (activeFilterType === "invalid" && (isRowValid(row) || isRowEmpty(row))) return false;

      // 2. Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          row.name.toLowerCase().includes(q) ||
          row.barcode.toLowerCase().includes(q) ||
          row.category_name.toLowerCase().includes(q) ||
          row.brand_name.toLowerCase().includes(q) ||
          row.model.toLowerCase().includes(q) ||
          row.unit_name.toLowerCase().includes(q) ||
          String(index + 1).includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [rows, activeFilterType, searchQuery]);

  // ==========================================
  // Grid Handlers
  // ==========================================

  const handleCellChange = (id: string, field: keyof BulkProductRow, value: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, [field]: value };
        if (updated.serverErrors) {
          const newServerErrors = { ...updated.serverErrors };
          delete newServerErrors[field];
          delete newServerErrors.general;
          updated.serverErrors = Object.keys(newServerErrors).length > 0 ? newServerErrors : undefined;
        }
        return updated;
      })
    );
  };

  const handleAddRow = () => {
    const newRow = DEFAULT_EMPTY_ROW();
    setRows((prev) => [...prev, newRow]);
    toast.success("New row added");
  };

  const handleRemoveRow = (id: string) => {
    if (rows.length === 1) {
      setRows([DEFAULT_EMPTY_ROW()]);
      toast.info("Row cleared");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleResetTable = () => {
    setRows(Array.from({ length: 15 }, () => DEFAULT_EMPTY_ROW()));
    setOriginalFileName("bulk_products_import.xlsx");
    setSearchQuery("");
    setFilterType("all");
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Table has been reset");
  };

  // ==========================================
  // Download Sample Excel (.xlsx)
  // ==========================================

  const handleDownloadSample = () => {
    try {
      const sampleCat1 = categories[0]?.name || "Computer & IT";
      const sampleCat2 = categories[1]?.name || categories[0]?.name || "Accessories";
      const sampleBrand1 = brands[0]?.name || "Dell";
      const sampleBrand2 = brands[1]?.name || brands[0]?.name || "Logitech";
      const sampleUnit = units[0]?.name || "Piece";
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);

      const sampleRows = [
        {
          "Item Name *": `New Product Sample A-${randomSuffix}`,
          "Barcode (Optional, Auto Generated if Empty)": `PRD-NEW-${randomSuffix}`,
          "Category Name *": sampleCat1,
          "Brand Name (Optional)": sampleBrand1,
          "Description (Optional)": "Brand new Item description",
          "Specification (Optional)": "Color: Black",
          "Unit Name *": sampleUnit,
          "Model (Optional)": "SMPL-100",
          "Item Type (Admin,IT)": "IT",
          "Purchase Price (Optional)": "500",
          "MRP Price (Optional)": "700",
          "Status (Active,Inactive)": "Active",
        },
        {
          "Item Name *": `New Item Sample B-${randomSuffix + 1}`,
          "Barcode (Optional, Auto Generated if Empty)": "",
          "Category Name *": sampleCat2,
          "Brand Name (Optional)": sampleBrand2,
          "Description (Optional)": "Sample accessories item",
          "Specification (Optional)": "Color: White",
          "Unit Name *": sampleUnit,
          "Model (Optional)": "SMPL-200",
          "Item Type (Admin,IT)": "IT",
          "Purchase Price (Optional)": "350",
          "MRP Price (Optional)": "450",
          "Status (Active,Inactive)": "Active",
        },
      ];

      const worksheet = XLSX.utils.json_to_sheet(sampleRows);

      worksheet["!cols"] = [
        { wch: 30 },
        { wch: 25 },
        { wch: 20 },
        { wch: 18 },
        { wch: 40 },
        { wch: 30 },
        { wch: 14 },
        { wch: 18 },
        { wch: 18 },
        { wch: 18 },
        { wch: 18 },
        { wch: 16 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

      XLSX.writeFile(workbook, "products_bulk_import_sample.xlsx");
      toast.success("Sample template downloaded successfully!");
    } catch (error) {
      console.error("Failed to download sample file:", error);
      toast.error("Failed to download sample excel file.");
    }
  };

  // ==========================================
  // Import Excel / CSV File
  // ==========================================

  const parseUploadedFile = (file: File) => {
    if (!file) return;

    const validExtensions = [".xlsx", ".xls", ".csv"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      toast.error("Invalid file format. Please upload an .xlsx, .xls, or .csv file.");
      return;
    }

    setIsParsingFile(true);
    setOriginalFileName(file.name);

    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            setIsParsingFile(false);
            return;
          }

          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          if (!sheet) {
            toast.error("No valid worksheet found in the uploaded file.");
            setIsParsingFile(false);
            return;
          }

          const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
            defval: "",
          });

          if (!rawRows || rawRows.length === 0) {
            toast.error("The uploaded file is empty.");
            setIsParsingFile(false);
            return;
          }

          let unmatchedCount = 0;

          const parsedRows: BulkProductRow[] = rawRows.map((r, idx) => {
            const getVal = (possibleKeys: string[]): string => {
              for (const key of Object.keys(r)) {
                const cleanKey = key.trim().toLowerCase();
                if (possibleKeys.some((pk) => cleanKey.includes(pk.toLowerCase()))) {
                  const val = r[key];
                  return val != null ? String(val).trim() : "";
                }
              }
              return "";
            };

            const name = getVal(["name *", "product_name", "item_name", "name"]);
            const barcode = getVal(["barcode", "bar_code", "product_barcode"]);
            const rawCat = getVal(["category name *", "category_name", "category"]);
            const rawBrand = getVal(["brand name", "brand_name", "brand"]);
            const description = getVal(["description", "desc"]);
            const specification = getVal(["specification", "spec", "specs"]);
            const rawUnit = getVal(["unit name *", "unit_name", "unit"]);
            const model = getVal(["model", "product_model"]);
            const rawType = getVal(["item type", "product type", "type", "product_type", "item_type"]);
            const product_type: "Admin" | "IT" | "" =
              rawType.toLowerCase().includes("admin") ? "Admin" : rawType.toLowerCase().includes("it") ? "IT" : "";
            const purchase_price = getVal(["purchase price", "purchase_price", "buy_price", "cost"]);
            const mrp_price = getVal(["mrp price", "mrp_price", "mrp", "sale_price", "price"]);
            const rawStatus = getVal(["status", "is_active"]);
            const status: "Active" | "Inactive" | "" =
              rawStatus.toLowerCase().includes("inact") || rawStatus === "0" || rawStatus.toLowerCase() === "false"
                ? "Inactive"
                : rawStatus.toLowerCase().includes("act") || rawStatus === "1" || rawStatus.toLowerCase() === "true"
                  ? "Active"
                  : "";

            // Auto match category if possible
            let category_name = rawCat;
            const matchedCategory = categories.find(
              (c) => c.name.trim().toLowerCase() === rawCat.trim().toLowerCase()
            );
            if (matchedCategory) {
              category_name = matchedCategory.name;
            }

            // Auto match brand if possible
            let brand_name = rawBrand;
            const matchedBrand = brands.find(
              (b) => b.name.trim().toLowerCase() === rawBrand.trim().toLowerCase()
            );
            if (matchedBrand) {
              brand_name = matchedBrand.name;
            }

            // Auto match unit if possible
            let unit_name = rawUnit;
            const matchedUnit = units.find(
              (u) => u.name.trim().toLowerCase() === rawUnit.trim().toLowerCase()
            );
            if (matchedUnit) {
              unit_name = matchedUnit.name;
            }

            const parsedRow: BulkProductRow = {
              id: `row-imported-${idx}-${Date.now()}`,
              name,
              barcode,
              category_name,
              brand_name,
              description,
              specification,
              unit_name,
              model,
              product_type,
              purchase_price,
              mrp_price,
              status,
            };

            const errs = getFieldErrors(parsedRow);
            if (Object.keys(errs).length > 0) {
              unmatchedCount++;
            }

            return parsedRow;
          });

          setRows(parsedRows);

          // Accurately check parsed rows for unmapped categories/brands/units & duplicates
          const catSet = new Set(categories.map((c) => c.name.trim().toLowerCase()));
          const brandSet = new Set(brands.map((b) => b.name.trim().toLowerCase()));
          const unitSet = new Set(units.map((u) => u.name.trim().toLowerCase()));
          const dbProdSet = new Set(existingProducts.map((p) => p.name.trim().toLowerCase()));
          const dbBarcodeSet = new Set(
            existingProducts.filter((p) => p.barcode?.trim()).map((p) => p.barcode!.trim().toLowerCase())
          );

          const fileNamesCount: Record<string, number> = {};
          const fileBarcodesCount: Record<string, number> = {};
          parsedRows.forEach((r) => {
            if (r.name?.trim()) {
              const n = r.name.trim().toLowerCase();
              fileNamesCount[n] = (fileNamesCount[n] || 0) + 1;
            }
            if (r.barcode?.trim()) {
              const b = r.barcode.trim().toLowerCase();
              fileBarcodesCount[b] = (fileBarcodesCount[b] || 0) + 1;
            }
          });

          const invalidCount = parsedRows.filter((r) => {
            const cName = r.name?.trim().toLowerCase();
            const cBarcode = r.barcode?.trim().toLowerCase();
            const cCat = r.category_name?.trim().toLowerCase();
            const cBrand = r.brand_name?.trim().toLowerCase();
            const cUnit = r.unit_name?.trim().toLowerCase();

            if (!r.name?.trim() || !r.category_name?.trim() || !r.unit_name?.trim() || !r.product_type || !r.status) {
              return true;
            }
            if (dbProdSet.has(cName) || (fileNamesCount[cName] || 0) > 1) return true;
            if (cBarcode && (dbBarcodeSet.has(cBarcode) || (fileBarcodesCount[cBarcode] || 0) > 1)) return true;
            if (cCat && catSet.size > 0 && !catSet.has(cCat)) return true;
            if (cBrand && brandSet.size > 0 && !brandSet.has(cBrand)) return true;
            if (cUnit && unitSet.size > 0 && !unitSet.has(cUnit)) return true;

            return false;
          }).length;

          setFilterType("all");
          if (invalidCount > 0) {
            toast.warning(
              `Imported ${parsedRows.length} rows. ${invalidCount} row(s) have unmapped or invalid fields. Please review highlighted cells.`
            );
          } else {
            toast.success(`Successfully loaded ${parsedRows.length} valid rows into table.`);
          }
        } catch (error) {
          console.error("Failed to parse file:", error);
          toast.error("Failed to parse excel file. Please check file formatting.");
        } finally {
          setIsParsingFile(false);
        }
      };

      reader.onerror = () => {
        toast.error("Failed to read file.");
        setIsParsingFile(false);
      };

      reader.readAsBinaryString(file);
    }, 50);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      parseUploadedFile(file);
    }
  };

  // ==========================================
  // Form Submission & Server Error Mapping
  // ==========================================

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const validRowsToSubmit = rows.filter((r) => !isRowEmpty(r));

    if (validRowsToSubmit.length === 0) {
      toast.error("Please add or import at least one item before submitting.");
      return;
    }

    if (invalidRowsCount > 0) {
      toast.error(
        `There are ${invalidRowsCount} row(s) with errors or missing required fields. Please fix highlighted fields before submitting.`
      );
      setFilterType("invalid");
      return;
    }

    setIsSubmitting(true);

    try {
      const exportData = validRowsToSubmit.map((r) => ({
        "Name *": r.name,
        "Barcode (Optional, Auto Generated if Empty)": r.barcode || "",
        "Category Name *": r.category_name,
        "Brand Name (Optional)": r.brand_name || "",
        "Description (Optional)": r.description || "",
        "Specification (Optional)": r.specification || "",
        "Unit Name *": r.unit_name,
        "Model (Optional)": r.model || "",
        "Item Type (Admin,IT)": r.product_type || "IT",
        "Purchase Price (Optional)": r.purchase_price ? Number(r.purchase_price) || r.purchase_price : "",
        "MRP Price (Optional)": r.mrp_price ? Number(r.mrp_price) || r.mrp_price : "",
        "Status (Active,Inactive)": r.status || "Active",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const excelBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileToUpload = new File([excelBlob], originalFileName, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const formData = new FormData();
      formData.append("file", fileToUpload);

      const res = await importProducts(formData);

      if (res?.success) {
        toast.success(res.message || "Items imported successfully!");
        handleResetTable();
        router.push("/inventory/inventory-items");
        router.refresh();
      } else {
        // Map server errors back to rows
        if (Array.isArray(res?.errors)) {
          const serverRowErrors = res.errors as ServerRowError[];
          const errorMapByRowIndex: Record<number, Record<string, string>> = {};

          serverRowErrors.forEach((errObj) => {
            // Excel row 2 corresponds to submitted item 0 (header is row 1)
            const submitIndex = errObj.row - 2;
            const msgs = Array.isArray(errObj.errors) ? errObj.errors : [errObj.errors];

            msgs.forEach((msg) => {
              const lower = msg.toLowerCase();
              let fieldKey = "name";
              if (lower.includes("barcode")) fieldKey = "barcode";
              else if (lower.includes("category")) fieldKey = "category_name";
              else if (lower.includes("unit")) fieldKey = "unit_name";
              else if (lower.includes("brand")) fieldKey = "brand_name";
              else if (lower.includes("product type") || lower.includes("type")) fieldKey = "product_type";
              else if (lower.includes("status")) fieldKey = "status";

              if (!errorMapByRowIndex[submitIndex]) {
                errorMapByRowIndex[submitIndex] = {};
              }
              errorMapByRowIndex[submitIndex][fieldKey] = msg;
            });
          });

          // Apply error map to state rows
          setRows((prevRows) => {
            let submittedCounter = 0;
            return prevRows.map((r) => {
              if (isRowEmpty(r)) return r;
              const currentSubmittedIndex = submittedCounter;
              submittedCounter++;

              const rowErrors = errorMapByRowIndex[currentSubmittedIndex];
              if (rowErrors) {
                return {
                  ...r,
                  serverErrors: {
                    ...(r.serverErrors || {}),
                    ...rowErrors,
                  },
                };
              }
              return r;
            });
          });

          setFilterType("invalid");
          toast.error(res.message || "Validation failed: duplicate products or invalid fields found.");
        } else if (res?.errors && typeof res.errors === "object") {
          const firstErr = Object.values(res.errors)[0];
          const errMsg = Array.isArray(firstErr) ? firstErr[0] : firstErr;
          toast.error(errMsg || res.message || "Failed to import products.");
        } else {
          toast.error(res?.message || "Failed to import products.");
        }
      }
    } catch (error: unknown) {
      console.error("Bulk upload error:", error);
      if (error instanceof Error) {
        toast.error(error.message || "An unexpected error occurred during import.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto space-y-5 pb-16">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls, .csv"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* ── Top Header Bar ── */}
      <Card className="border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-2xl">
        <div className="flex items-center gap-3.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.back()}
            className="cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Go Back
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Bulk Import Products
              </h1>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                Excel / CSV
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Import multiple products at once via Excel or CSV file, or enter product details directly in the table below.
            </p>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            type="button"
            disabled={isParsingFile || isSubmitting}
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary hover:bg-primary/90 text-white rounded-xl text-xs sm:text-sm font-medium cursor-pointer shadow-sm h-9.5 px-3.5 transition-all disabled:opacity-60"
          >
            {isParsingFile ? (
              <>
                <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                Reading File...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-1.5" />
                Import CSV / Excel
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={isParsingFile || isSubmitting}
            onClick={handleDownloadSample}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs sm:text-sm font-medium cursor-pointer shadow-2xs h-9.5 px-3.5 transition-all disabled:opacity-60"
          >
            <Download className="w-4 h-4 mr-1.5 text-slate-600" />
            Download Sample Excel (.xlsx)
          </Button>
        </div>
      </Card>

      {/* ── Grid Control & Filter Bar ── */}
      <Card className="border-slate-200/90 shadow-sm p-3.5 sm:p-4 bg-white rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Search inside grid */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <Input
              type="text"
              placeholder="Search product, category, barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-9 text-sm bg-slate-50/60 border-slate-200 focus:bg-white focus-visible:ring-primary/20 rounded-xl"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 hover:text-slate-700 p-0 rounded-md hover:bg-slate-200/80 transition-colors cursor-pointer z-10"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>

          {/* Filter Pills & Add Row */}
          <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-xs">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFilterType("all")}
                className={cn(
                  "h-7 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
                  filterType === "all"
                    ? "bg-white text-slate-900 shadow-2xs font-semibold hover:bg-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                )}
              >
                All ({meaningfulRows.length || rows.length})
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFilterType("valid")}
                className={cn(
                  "h-7 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1",
                  filterType === "valid"
                    ? "bg-white text-primary shadow-2xs font-semibold hover:bg-white"
                    : "text-slate-600 hover:text-primary hover:bg-slate-200/60"
                )}
              >
                <CheckCircle2 className="w-3 h-3 text-primary" />
                Valid ({validRowsCount})
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFilterType("invalid")}
                className={cn(
                  "h-7 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1",
                  filterType === "invalid"
                    ? "bg-white text-rose-700 shadow-2xs font-semibold hover:bg-white"
                    : "text-slate-600 hover:text-rose-700 hover:bg-slate-200/60"
                )}
              >
                <AlertCircle className="w-3 h-3 text-rose-600" />
                Errors ({invalidRowsCount})
              </Button>
            </div>

            <Button
              type="button"
              onClick={handleAddRow}
              size="sm"
              disabled={isParsingFile || isSubmitting}
              className="bg-secondary hover:bg-secondary/90 text-white rounded-xl h-8.5 px-3 text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-60"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Row
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Interactive Spreadsheet DataGrid ── */}
      <Card className="border-slate-200/90 shadow-sm overflow-hidden bg-white rounded-2xl p-0">
        <div className="overflow-x-auto max-h-[580px] relative scrollbar-thin">
          {/* File Parsing Overlay */}
          {isParsingFile && (
            <div className="absolute inset-0 bg-white/85 backdrop-blur-xs z-30 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Reading & Processing File...</p>
                <p className="text-xs text-slate-500 mt-1">Please wait while rows are being parsed and validated.</p>
              </div>
            </div>
          )}

          <Table className="w-full border-collapse text-left text-xs">
            <TableHeader className="bg-slate-100/90 text-slate-700 font-semibold sticky top-0 z-20 backdrop-blur-xs border-b border-slate-200">
              <TableRow className="hover:bg-transparent">
                <TableHead className="p-2.5 text-center w-12 border-r border-slate-200 text-slate-700 font-semibold">SI</TableHead>
                <TableHead className="p-2.5 min-w-[220px] border-r border-slate-200 text-slate-700 font-semibold">
                  Item Name <span className="text-red-500 font-bold">*</span>
                </TableHead>
                <TableHead className="p-2.5 min-w-[140px] border-r border-slate-200 text-slate-700 font-semibold">Barcode</TableHead>
                <TableHead className="p-2.5 min-w-[180px] border-r border-slate-200 text-slate-700 font-semibold">
                  Category Name <span className="text-red-500 font-bold">*</span>
                </TableHead>
                <TableHead className="p-2.5 min-w-[170px] border-r border-slate-200 text-slate-700 font-semibold">Brand Name</TableHead>
                <TableHead className="p-2.5 min-w-[140px] border-r border-slate-200 text-slate-700 font-semibold">
                  Unit Name <span className="text-red-500 font-bold">*</span>
                </TableHead>
                <TableHead className="p-2.5 min-w-[130px] border-r border-slate-200 text-slate-700 font-semibold">
                  Item Type <span className="text-red-500 font-bold">*</span>
                </TableHead>
                <TableHead className="p-2.5 min-w-[120px] border-r border-slate-200 text-slate-700 font-semibold">Model</TableHead>
                <TableHead className="p-2.5 min-w-[120px] border-r border-slate-200 text-slate-700 font-semibold">Purchase Price</TableHead>
                <TableHead className="p-2.5 min-w-[120px] border-r border-slate-200 text-slate-700 font-semibold">MRP Price</TableHead>
                <TableHead className="p-2.5 min-w-[180px] border-r border-slate-200 text-slate-700 font-semibold">Specification</TableHead>
                <TableHead className="p-2.5 min-w-[200px] border-r border-slate-200 text-slate-700 font-semibold">Description</TableHead>
                <TableHead className="p-2.5 min-w-[130px] border-r border-slate-200 text-slate-700 font-semibold">
                  Status <span className="text-red-500 font-bold">*</span>
                </TableHead>
                <TableHead className="p-2.5 text-center w-12 sticky right-0 bg-slate-100 z-10 text-slate-700 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-200 bg-white">
              {displayedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} className="py-12 text-center text-slate-400">
                    <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                    <p className="text-sm font-medium">No products found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Add a new row or import an Excel/CSV file.</p>
                  </TableCell>
                </TableRow>
              ) : (
                displayedRows.map((row, index) => {
                  const fieldErrors = getFieldErrors(row);
                  const hasErrors = !isRowEmpty(row) && Object.keys(fieldErrors).length > 0;

                  return (
                    <TableRow
                      key={row.id}
                      className={cn(
                        "hover:bg-slate-50/70 transition-colors group",
                        hasErrors && "bg-rose-50/30"
                      )}
                    >
                      {/* Row Index */}
                      <TableCell className="p-2 text-center text-slate-500 font-mono border-r border-slate-200 bg-slate-50/40">
                        <TooltipProvider>
                          <div className="flex items-center justify-center gap-1.5">
                            {hasErrors ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs bg-rose-900 text-rose-100 max-w-xs">
                                  {Object.values(fieldErrors).join("\n")}
                                </TooltipContent>
                              </Tooltip>
                            ) : !isRowEmpty(row) ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">
                                  Valid row ready to import
                                </TooltipContent>
                              </Tooltip>
                            ) : null}
                            <span className="text-slate-600 font-medium">{index + 1}</span>
                          </div>
                        </TooltipProvider>
                      </TableCell>

                      {/* 1. Product Name * */}
                      <TableCell className="p-1 border-r border-slate-200 align-top">
                        <div className="space-y-0.5">
                          <Input
                            type="text"
                            value={row.name}
                            placeholder="e.g. Dell Inspiron 15"
                            onChange={(e) => handleCellChange(row.id, "name", e.target.value)}
                            className={cn(
                              "w-full h-8 px-2 text-xs bg-transparent border rounded-md shadow-none transition-all",
                              fieldErrors.name && !isRowEmpty(row)
                                ? "border-rose-400 bg-rose-50/50 text-rose-900 focus-visible:ring-rose-400"
                                : "border-transparent hover:border-slate-300 focus-visible:border-primary/60 focus-visible:bg-white focus-visible:ring-primary/20"
                            )}
                          />
                          {fieldErrors.name && !isRowEmpty(row) && (
                            <p className="text-[10px] text-rose-600 px-1 font-medium leading-tight">
                              {fieldErrors.name}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* 2. Barcode */}
                      <TableCell className="p-1 border-r border-slate-200 align-top">
                        <div className="space-y-0.5">
                          <Input
                            type="text"
                            value={row.barcode}
                            placeholder="Optional"
                            onChange={(e) => handleCellChange(row.id, "barcode", e.target.value)}
                            className={cn(
                              "w-full h-8 px-2 text-xs bg-transparent border rounded-md shadow-none transition-all font-mono",
                              fieldErrors.barcode && !isRowEmpty(row)
                                ? "border-rose-400 bg-rose-50/50 text-rose-900 focus-visible:ring-rose-400"
                                : "border-transparent hover:border-slate-300 focus-visible:border-primary/60 focus-visible:bg-white focus-visible:ring-primary/20"
                            )}
                          />
                          {fieldErrors.barcode && !isRowEmpty(row) && (
                            <p className="text-[10px] text-rose-600 px-1 font-medium leading-tight">
                              {fieldErrors.barcode}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* 3. Category Name * (Direct Inline Search Select) */}
                      <TableCell className="p-1 border-r border-slate-200 align-top">
                        <div className="space-y-0.5">
                          <InlineSearchSelect
                            value={row.category_name}
                            onValueChange={(val) => handleCellChange(row.id, "category_name", val)}
                            placeholder="Select Category"
                            options={categories}
                            hasError={!!fieldErrors.category_name && !isRowEmpty(row)}
                          />
                          {fieldErrors.category_name && !isRowEmpty(row) && (
                            <p className="text-[10px] text-rose-600 px-1 font-medium leading-tight">
                              {fieldErrors.category_name}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* 4. Brand Name (Direct Inline Search Select) */}
                      <TableCell className="p-1 border-r border-slate-200 align-top">
                        <div className="space-y-0.5">
                          <InlineSearchSelect
                            value={row.brand_name}
                            onValueChange={(val) => handleCellChange(row.id, "brand_name", val)}
                            placeholder="Select Brand"
                            options={brands}
                            hasError={!!fieldErrors.brand_name && !isRowEmpty(row)}
                          />
                          {fieldErrors.brand_name && !isRowEmpty(row) && (
                            <p className="text-[10px] text-rose-600 px-1 font-medium leading-tight">
                              {fieldErrors.brand_name}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* 5. Unit Name * (Dropdown) */}
                      <TableCell className="p-1 border-r border-slate-200 align-top">
                        <div className="space-y-0.5">
                          <Select
                            value={row.unit_name || ""}
                            onValueChange={(val) => handleCellChange(row.id, "unit_name", val)}
                          >
                            <SelectTrigger
                              className={cn(
                                "h-8 text-xs border rounded-md w-full shadow-none transition-all",
                                fieldErrors.unit_name && !isRowEmpty(row)
                                  ? "border-rose-400 bg-rose-50/50 text-rose-900 focus:border-rose-500 ring-1 ring-rose-300/40"
                                  : "border-transparent focus:border-primary/60 bg-transparent hover:bg-slate-50"
                              )}
                            >
                              <SelectValue placeholder="Select Unit">
                                {row.unit_name || "Select Unit"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {/* If imported unit not in DB */}
                              {row.unit_name &&
                                units.length > 0 &&
                                !unitNamesSet.has(row.unit_name.trim().toLowerCase()) && (
                                  <SelectItem
                                    value={row.unit_name}
                                    className="text-rose-600 font-medium bg-rose-50/80"
                                  >
                                    ⚠️ {row.unit_name} (Not in DB)
                                  </SelectItem>
                                )}
                              {units.map((u) => (
                                <SelectItem key={u.id} value={u.name}>
                                  {u.name}
                                </SelectItem>
                              ))}
                              {units.length === 0 && (
                                <SelectItem value="Piece">Piece</SelectItem>
                              )}
                            </SelectContent>
                          </Select>

                          {fieldErrors.unit_name && !isRowEmpty(row) && (
                            <p className="text-[10px] text-rose-600 px-1 font-medium leading-tight">
                              {fieldErrors.unit_name}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* 6. Product Type * (Admin / IT Dropdown) */}
                      <TableCell className="p-1 border-r border-slate-200 align-top">
                        <div className="space-y-0.5">
                          <Select
                            value={row.product_type || ""}
                            onValueChange={(val) =>
                              handleCellChange(row.id, "product_type", val as "Admin" | "IT")
                            }
                          >
                            <SelectTrigger
                              className={cn(
                                "h-8 text-xs border rounded-md w-full shadow-none transition-all",
                                fieldErrors.product_type && !isRowEmpty(row)
                                  ? "border-rose-400 bg-rose-50/50 text-rose-900 focus:border-rose-500 ring-1 ring-rose-300/40"
                                  : "border-transparent focus:border-primary/60 bg-transparent hover:bg-slate-50"
                              )}
                            >
                              <SelectValue placeholder="Select Type">
                                {row.product_type || "Select Type"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IT">IT</SelectItem>
                              <SelectItem value="Admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>

                          {fieldErrors.product_type && !isRowEmpty(row) && (
                            <p className="text-[10px] text-rose-600 px-1 font-medium leading-tight">
                              {fieldErrors.product_type}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* 7. Model */}
                      <TableCell className="p-1 border-r border-slate-200 align-top">
                        <Input
                          type="text"
                          value={row.model}
                          placeholder="e.g. SN-100"
                          onChange={(e) => handleCellChange(row.id, "model", e.target.value)}
                          className="w-full h-8 px-2 text-xs bg-transparent border-transparent hover:border-slate-300 focus-visible:border-primary/60 focus-visible:bg-white focus-visible:ring-primary/20 rounded-md shadow-none transition-all"
                        />
                      </TableCell>

                      {/* 8. Purchase Price */}
                      <TableCell className="p-1 border-r border-slate-200 align-top">
                        <Input
                          type="number"
                          value={row.purchase_price}
                          placeholder="0.00"
                          onChange={(e) => handleCellChange(row.id, "purchase_price", e.target.value)}
                          className="w-full h-8 px-2 text-xs bg-transparent border-transparent hover:border-slate-300 focus-visible:border-primary/60 focus-visible:bg-white focus-visible:ring-primary/20 rounded-md shadow-none transition-all font-mono"
                        />
                      </TableCell>

                      {/* 9. MRP Price */}
                      <TableCell className="p-1 border-r border-slate-200 align-top">
                        <Input
                          type="number"
                          value={row.mrp_price}
                          placeholder="0.00"
                          onChange={(e) => handleCellChange(row.id, "mrp_price", e.target.value)}
                          className="w-full h-8 px-2 text-xs bg-transparent border-transparent hover:border-slate-300 focus-visible:border-primary/60 focus-visible:bg-white focus-visible:ring-primary/20 rounded-md shadow-none transition-all font-mono"
                        />
                      </TableCell>

                      {/* 10. Specification */}
                      <TableCell className="p-1 border-r border-slate-200 align-top">
                        <Input
                          type="text"
                          value={row.specification}
                          placeholder="Color: Black, 16GB RAM..."
                          onChange={(e) => handleCellChange(row.id, "specification", e.target.value)}
                          className="w-full h-8 px-2 text-xs bg-transparent border-transparent hover:border-slate-300 focus-visible:border-primary/60 focus-visible:bg-white focus-visible:ring-primary/20 rounded-md shadow-none transition-all"
                        />
                      </TableCell>

                      {/* 11. Description */}
                      <TableCell className="p-1 border-r border-slate-200 align-top">
                        <Input
                          type="text"
                          value={row.description}
                          placeholder="Item description..."
                          onChange={(e) => handleCellChange(row.id, "description", e.target.value)}
                          className="w-full h-8 px-2 text-xs bg-transparent border-transparent hover:border-slate-300 focus-visible:border-primary/60 focus-visible:bg-white focus-visible:ring-primary/20 rounded-md shadow-none transition-all"
                        />
                      </TableCell>

                      {/* 12. Status * (Dropdown) */}
                      <TableCell className="p-1 border-r border-slate-200 align-top">
                        <div className="space-y-0.5">
                          <Select
                            value={row.status || ""}
                            onValueChange={(val) =>
                              handleCellChange(row.id, "status", val as "Active" | "Inactive")
                            }
                          >
                            <SelectTrigger
                              className={cn(
                                "h-8 text-xs border rounded-md w-full shadow-none transition-all",
                                fieldErrors.status && !isRowEmpty(row)
                                  ? "border-rose-400 bg-rose-50/50 text-rose-900 focus:border-rose-500 ring-1 ring-rose-300/40"
                                  : "border-transparent focus:border-primary/60 bg-transparent hover:bg-slate-50"
                              )}
                            >
                              <SelectValue placeholder="Select Status">
                                {row.status || "Select Status"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>

                          {fieldErrors.status && !isRowEmpty(row) && (
                            <p className="text-[10px] text-rose-600 px-1 font-medium leading-tight">
                              {fieldErrors.status}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Action (Delete) */}
                      <TableCell className="p-1 text-center sticky right-0 bg-white group-hover:bg-slate-50/70 z-10 align-top">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveRow(row.id)}
                          className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                          title="Remove row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* ── Bottom Confirmation & Legend Bar ── */}
      <Card className="border-slate-200/90 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl">
        {/* Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || meaningfulRows.length === 0 || invalidRowsCount > 0}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed text-white font-semibold rounded-xl px-6 h-10 shadow-sm transition-all flex-1 sm:flex-none"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Importing Products...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Confirm Products ({validRowsCount})
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleResetTable}
            disabled={isSubmitting}
            className="border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl h-10 cursor-pointer shadow-2xs"
          >
            Reset Table
          </Button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-2xs" />
            <span>The input is incorrect, duplicate in DB/table, or a mandatory field is empty</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-primary inline-block shadow-2xs" />
            <span>Valid row ready to import</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
