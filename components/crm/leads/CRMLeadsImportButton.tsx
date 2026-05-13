"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Download, FileSpreadsheet, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { importCRMLeads } from "@/apiServices/crmLeadsService";
import { useRouter } from "next/navigation";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function CRMLeadsImportButton() {
  const [open, setOpen] = useState(false);
  const [isImporting, startImporting] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setOpen(false);

    startImporting(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await importCRMLeads(formData);

        if (res?.success) {
          toast.success(res?.message || "Leads imported successfully!");
          router.refresh();
        } else {
          // If the backend sends specific field errors, display the first one
          if (res?.errors?.file && res.errors.file.length > 0) {
            toast.error(res.errors.file[0]);
          } else {
            toast.error(res?.message || "Failed to import leads.");
          }
          console.error("Import errors:", res?.errors);
        }
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error("An error occurred while uploading the file.");
      }
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const downloadSample = async () => {
    try {
      const XLSX = await import("xlsx");

      const sampleData = [
        {
          Branch: "Bogura",
          Course_Name:
            "Advanced Excel Course for Professionals: Master Data Analytics & Finance",
          created_time: "5/10/26",
          course_type: "না_আমি_অনলাইন_ক্লাস_করতে_চাই",
          shift: "সকাল",
          full_name: "Evri Asif",
          whatsapp_num: "+8801798142968",
          phone_number: "+8801798142968",
          street_address: "taroknathdiya, rajpara, Rajshahi",
          Source: "Facebook",
          Category: "Facebook Lead",
        },
        {
          Branch: "Bogura",
          Course_Name:
            "Advanced Excel Course for Professionals: Master Data Analytics & Finance",
          created_time: "5/10/26",
          course_type: "হ্যাঁ_আমি_ঢাকা_অফলাইনে_ক্লাস_করতে_চাই",
          shift: "সন্ধ্যা",
          full_name: "Md Tazul Islam",
          whatsapp_num: "+8801733178642",
          phone_number: "+8801733178642",
          street_address: "Mohammadpur, Dhaka",
          Source: "Facebook",
          Category: "Facebook Lead",
        },
        {
          Branch: "Bogura",
          Course_Name:
            "Advanced Excel Course for Professionals: Master Data Analytics & Finance",
          created_time: "5/10/26",
          course_type: "না_আমি_শুধু_অনলাইন_ক্লাস_করতে_চাই",
          shift: "বিকাল",
          full_name: "Md Junaid Ahmed",
          whatsapp_num: "+8801925707619",
          phone_number: "+8801925707619",
          street_address: "Tanore, Rajshahi",
          Source: "Facebook",
          Category: "Facebook Lead",
        },
      ];

      const ws = XLSX.utils.json_to_sheet(sampleData);

      ws["!cols"] = [
        { wch: 15 }, // Branch
        { wch: 55 }, // Course_Name
        { wch: 15 }, // created_time
        { wch: 45 }, // course_type
        { wch: 12 }, // shift
        { wch: 25 }, // full_name
        { wch: 18 }, // whatsapp_num
        { wch: 18 }, // phone_number
        { wch: 40 }, // street_address
        { wch: 15 }, // Source
        { wch: 20 }, // Category
      ];

      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "CRM Leads Sample");

      XLSX.writeFile(wb, "CRM_Leads_Import_Sample.xlsx");

      setOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate sample file.");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
      />


      <Button
        variant="outline"
        className="cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
        disabled={isImporting}
      >
        {isImporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Importing...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Import <ChevronDown className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
          </>
        )}
      </Button>

      {open && !isImporting && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border bg-white shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <Button
            onClick={handleUploadClick}
            className="flex w-full items-center justify-start gap-3 px-4 py-2.5 text-sm text-foreground bg-white hover:bg-slate-100 transition-colors rounded-none shadow-none border-0"
            variant="ghost"
          >
            <FileSpreadsheet className="h-4 w-4 text-indigo-600" />
            Upload File
          </Button>

          <div className="border-t border-slate-100" />

          <Button
            onClick={downloadSample}
            className="flex w-full items-center justify-start gap-3 px-4 py-2.5 text-sm text-foreground bg-white hover:bg-slate-100 transition-colors rounded-none shadow-none border-0"
            variant="ghost"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            Download Sample
          </Button>
        </div>
      )}
    </div>
  );
}
