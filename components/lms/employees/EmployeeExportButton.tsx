"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { getEmployees, Employee } from "@/apiServices/employeeService";

const getEmploymentTypeLabel = (type: number | string | undefined) => {
    switch (Number(type)) {
        case 0: return "Probation";
        case 1: return "Full-time";
        case 2: return "Part-time";
        case 3: return "Contractual";
        default: return "—";
    }
};

export default function EmployeeExportButton() {
    const searchParams = useSearchParams();
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const currentSearch = searchParams.get("search") || "";
            const currentSortOrder = searchParams.get("sort_order") || "";
            const currentEmploymentType = searchParams.get("employment_type") || "";
            const currentBranchId = searchParams.get("branch_id") || "";
            const currentDepartmentId = searchParams.get("department_id") || "";
            const currentRoleId = searchParams.get("role_id") || "";
            const currentDesignationId = searchParams.get("designation_id") || "";
            const currentBloodGroup = searchParams.get("blood_group") || "";
            const currentPerPage = searchParams.get("per_page") || "15";
            const currentPage = searchParams.get("page") || "1";

            const params: Record<string, unknown> = {
                page: currentPage,
                per_page: currentPerPage,
                ...(currentSearch && { search: currentSearch }),
                ...(currentSortOrder && { sort_order: currentSortOrder }),
                ...(currentEmploymentType && { employment_type: currentEmploymentType }),
                ...(currentBranchId && { branch_id: currentBranchId }),
                ...(currentDepartmentId && { department_id: currentDepartmentId }),
                ...(currentRoleId && { role_id: currentRoleId }),
                ...(currentDesignationId && { designation_id: currentDesignationId }),
                ...(currentBloodGroup && { blood_group: currentBloodGroup }),
            };

            const result = await getEmployees(params);
            const employees: Employee[] = result?.data?.employees || [];

            if (!employees.length) {
                alert("No employee data found to export.");
                return;
            }

            const perPage = Number(currentPerPage) || 15;
            const page = Number(currentPage) || 1;

            const headers = [
                "Sl",
                "Employee ID",
                "Name",
                "Email",
                "Phone",
                "Designation",
                "Department",
                "Role",
                "Branch",
                "Blood Group",
                "Employment Type",
                "Display Order",
                "Status",
            ];

            const rows = employees.map((emp: Employee, index: number) => [
                (page - 1) * perPage + (index + 1),
                emp.employee_id || "",
                emp.name || "",
                emp.email || "",
                emp.phone || "",
                emp.designation?.name || "",
                emp.department?.name || "",
                emp.role?.name || "",
                emp.branches?.map((b) => b.name).join(" | ") || "",
                emp.blood_group || "",
                getEmploymentTypeLabel(emp.employment_type),
                emp.display_order ?? "",
                Number(emp.is_blocked) === 1 ? "Blocked" : "Active",
            ]);

            const csvContent = [
                headers.join(","),
                ...rows.map((row) =>
                    row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
                ),
            ].join("\n");

            const bom = "\uFEFF";
            const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            const today = new Date().toISOString().split("T")[0];
            link.href = url;
            link.download = `employees_export_${today}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export error:", error);
            alert("Failed to export employee data. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
            className="cursor-pointer"
        >
            {isExporting ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Exporting...
                </>
            ) : (
                <>
                    <Download className="h-4 w-4" />
                    Export
                </>
            )}
        </Button>
    );
}
