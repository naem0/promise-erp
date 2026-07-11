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
import { getRequisitionFlows } from "@/apiServices/inventoryRequisitionFlowsService";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";
import DeleteRolesPowerButton from "./DeleteRolesPowerButton";
import RolesPowerClientTable from "./RolesPowerClientTable";

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
    requisition_flow_id:
      typeof resolvedSearchParams.requisition_flow_id === "string"
        ? resolvedSearchParams.requisition_flow_id
        : undefined,
    status:
      typeof resolvedSearchParams.status === "string"
        ? resolvedSearchParams.status
        : undefined,
  };

  let results;
  let flows = [];
  try {
    results = await getRolesPower(params);
    const flowsRes = await getRequisitionFlows({ per_page: 100 });
    flows = flowsRes?.data?.flows || [];
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


  return (
    <>
      <RolesPowerClientTable
        initialSteps={steps}
        flows={flows}
        page={page}
        per_page={per_page}
      />

      {paginationData && paginationData.last_page > 1 && (
        <div className="mt-4 pb-6">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </>
  );
};

export default RolesPowerData;
