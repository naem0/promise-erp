"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AssignRoleDialog from "./AssignRoleDialog";

import Image from "next/image";
import { getAllRolesList, Role } from "@/apiServices/rolePermissionService";
import ErrorComponent from "../common/ErrorComponent";
import { useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";
import AddEditRoleDialog from "./AddEditRoleDialog";
import PermissionGuard from "../auth/PermissionGuard";

const RolesWrapper = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [rolAfterAddEdit, setRoleAfterAddEdit] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [assignRoleDialogOpen, setAssignRoleDialogOpen] = useState(false);
    const [addEditRoleDialogOpen, setAddEditRoleDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const [isPending, startTransition] = useTransition();
    const { data: session } = useSession();

    // Fetch Roles (useTransition)
    useEffect(() => {
        if (!session?.accessToken) return;

        startTransition(async () => {
            try {
                setError(null);

                const response = await getAllRolesList({
                    token: session.accessToken,
                });

                if (response.success) {
                    setRoles(response?.data?.roles || []);
                } else {
                    setError(response.message || "Failed to load roles");
                }
            } catch (err: unknown) {
                console.error("Error fetching roles:", err);
                if (err instanceof Error) {
                    setError(err.message);
                }
            }
        });
    }, [session?.accessToken, rolAfterAddEdit]);

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
        <div className="p-6 mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Roles</h1>
                <PermissionGuard requiredPermission="edit-roles">
                    <Button onClick={() => setAssignRoleDialogOpen(true)}>
                        Assign Role
                    </Button>
                </PermissionGuard>
            </div>

            {/* Error */}
            {error && <ErrorComponent message={error} />}

            {/* Content */}
            {isPending ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                        <Card key={index} className="p-4">
                            <Skeleton className="h-6 w-2/3 mb-2" />
                            <Skeleton className="h-4 w-1/3" />
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {/* Role Cards */}
                    {roles.map((role) => (
                        <Card
                            key={role?.id}
                            className="flex justify-between items-center p-4"
                        >
                            <CardContent className="p-0 text-center">
                                <div className="text-lg font-medium">{role?.name}</div>
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

                    {/* Add New Role Card */}
                    <PermissionGuard requiredPermission="create-roles">
                        <Card
                            className="flex justify-center items-center p-4 cursor-pointer hover:bg-muted transition"
                            onClick={openAddRoleDialog}
                        >
                            <CardContent className="p-0 flex items-center gap-4">
                                <Image
                                    src="/images/add-new-roles.png"
                                    alt="Add Role"
                                    width={40}
                                    height={40}
                                />
                                <Button variant="outline">Add New Role</Button>
                            </CardContent>
                        </Card>
                    </PermissionGuard>
                </div>
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
                initialRoleName={editingRole?.name || null}
                roleId={editingRole?.id || null}
                token={session?.accessToken}
                setRoleAfterAddEdit={setRoleAfterAddEdit}
                roleAfterAddEdit={rolAfterAddEdit}
            />
        </div>
    );
};

export default RolesWrapper;
