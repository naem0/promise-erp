"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AssignRoleDialog from "./AssignRoleDialog";

import { getAllRolesList, Role } from "@/apiServices/rolePermissionService";
import ErrorComponent from "../common/ErrorComponent";
import { useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";
import AddEditRoleDialog from "./AddEditRoleDialog";
import PermissionGuard from "../auth/PermissionGuard";
import { useSearchParams } from "next/navigation";
import Pagination from "@/components/common/Pagination";
import { PaginationType } from "@/types/pagination";

const RolesWrapper = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolAfterAddEdit, setRoleAfterAddEdit] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationType | null>(null);

  const [assignRoleDialogOpen, setAssignRoleDialogOpen] = useState(false);
  const [addEditRoleDialogOpen, setAddEditRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "16";

  // Fetch Roles (useTransition)
  useEffect(() => {
    if (!session?.accessToken) return;

    startTransition(async () => {
      try {
        setError(null);

        const response = await getAllRolesList({
          token: session?.accessToken,
          params: {
            page,
            per_page: perPage,
          },
        });

        if (response?.success) {
          setRoles(response?.data?.roles || []);
          setPagination(response?.data?.pagination || null);
        } else {
          setError(response?.message || "Failed to load roles");
        }
      } catch (err: unknown) {
        console.error("Error fetching roles:", err);
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    });
  }, [session?.accessToken, rolAfterAddEdit, page, perPage]);

  //==== Dialog handlers =====

  const openAddRoleDialog = () => {
    setEditingRole(null);
    setAddEditRoleDialogOpen(true);
  };

  const openEditRoleDialog = (role: Role) => {
    setEditingRole(role);
    setAddEditRoleDialogOpen(true);
  };

  return (
    <div className="mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Roles</h1>
        <div className="flex gap-2">
          <PermissionGuard requiredPermission="create-roles">
            <Button onClick={openAddRoleDialog} className="cursor-pointer">
              Add New Role
            </Button>
          </PermissionGuard>
          <PermissionGuard requiredPermission="edit-roles">
            <Button className="cursor-pointer" onClick={() => setAssignRoleDialogOpen(true)}>
              Assign Role
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Error */}
      {error && <ErrorComponent message={error} />}

      {/* Content */}
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="p-4">
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Add New Role Card */}

            {/* Role Cards */}
            {roles.map((role) => (
              <Card
                key={role?.id}
                className="flex justify-between items-center p-4"
              >
                <CardContent className="p-0 text-center">
                  <div className="text-base ">
                    <p className="font-semibold">
                      Role: {role?.technical_name || "---"}
                    </p>
                    <p className="font-normal text-base">
                      Display : {role?.display_name || "---"}
                    </p>
                  </div>
                  <PermissionGuard requiredPermission="edit-roles">
                    <Button
                      variant="outline"
                      className="mt-1 cursor-pointer"
                      onClick={() => openEditRoleDialog(role)}
                    >
                      Edit Role
                    </Button>
                  </PermissionGuard>
                </CardContent>
              </Card>
            ))}
          </div>

          {pagination && pagination.last_page > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination pagination={pagination} />
            </div>
          )}
        </>
      )}

      {/* Assign Role Dialog */}
      <AssignRoleDialog
        open={assignRoleDialogOpen}
        onOpenChange={setAssignRoleDialogOpen}
      />

      {/* Add/Edit Role Dialog */}
      <AddEditRoleDialog
        open={addEditRoleDialogOpen}
        onOpenChange={setAddEditRoleDialogOpen}
        initialRoleName={
          editingRole?.technical_name || editingRole?.name || null
        }
        initialDisplayName={editingRole?.display_name || null}
        roleId={editingRole?.id || null}
        token={session?.accessToken}
        setRoleAfterAddEdit={setRoleAfterAddEdit}
        roleAfterAddEdit={rolAfterAddEdit}
      />
    </div>
  );
};

export default RolesWrapper;
