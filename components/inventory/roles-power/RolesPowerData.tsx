import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import Link from "next/link";
import {
  RolesPowerStep,
  getRolesPower,
} from "@/apiServices/inventoryRolesPowerService";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";
import DeleteRolesPowerButton from "./DeleteRolesPowerButton";
import RolesPowerClientTable from "./RolesPowerClientTable";

const WORKFLOW_TYPE_LABELS: Record<number, string> = {
  1: "Head Office",
  2: "Branch",
};

const RolesPowerData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const page =
    typeof resolvedSearchParams.page === "string"
      ? Number(resolvedSearchParams.page)
      : 1;
  const per_page =
    typeof resolvedSearchParams.per_page === "string"
      ? Number(resolvedSearchParams.per_page)
      : 15;

  const params = {
    page,
    per_page,
    workflow_type:
      typeof resolvedSearchParams.workflow_type === "string"
        ? resolvedSearchParams.workflow_type
        : undefined,
    status:
      typeof resolvedSearchParams.status === "string"
        ? resolvedSearchParams.status
        : undefined,
  };

  let results;
  try {
    results = await getRolesPower(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  if (!results || !results?.data) {
    return null;
  }

  const steps = results?.data?.steps || [];
  const paginationData = results?.data?.pagination;

  if (!steps.length) {
    return (
      <NotFoundComponent
        message={results?.message || "No roles power steps found."}
      />
    );
  }

  return (
    <>
      <RolesPowerClientTable initialSteps={steps} page={page} per_page={per_page} />

      {paginationData && paginationData.last_page > 1 && (
        <div className="mt-4 pb-6">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </>
  );
};

export default RolesPowerData;
