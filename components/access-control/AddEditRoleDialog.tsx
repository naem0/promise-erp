"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { toast } from "sonner";

import {
    createRole,
    getRolePermissionslist,
    RolePermissionModule,
    updateRole,
    getRoleById,
} from "@/apiServices/rolePermissionService";
import { getUserWiseByRole, RoleWiseUserList } from "@/apiServices/rolePermissionService";

interface AddEditRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialRoleName?: string | null;
    roleId?: number | null;
    token?: string;
    setRoleAfterAddEdit: (value: boolean) => void;
    roleAfterAddEdit: boolean;
}

const AddEditRoleDialog: React.FC<AddEditRoleDialogProps> = ({
    open,
    onOpenChange,
    initialRoleName = null,
    roleId = null,
    token,
    setRoleAfterAddEdit,
    roleAfterAddEdit,
}) => {
    const [roleName, setRoleName] = useState("");
    const [rolePermissionList, setRolePermissionList] = useState<
        RolePermissionModule[]
    >([]);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [roleWiseUsers, setRoleWiseUsers] = useState<RoleWiseUserList[]>([]);
    const [isPending, startTransition] = useTransition();

    //===== Fetch all permissions list ======
    useEffect(() => {
        if (!token || !open) return;

        startTransition(async () => {
            try {
                const response = await getRolePermissionslist({ token });
                if (response.success) {
                    setRolePermissionList(response.data.permissions || []);
                }
            } catch (error) {
                console.error("Permission fetch error:", error);
            }
        });
    }, [token, open]);

    //==== Set role name (Edit mode)=====
    useEffect(() => {
        setRoleName(initialRoleName || "");
    }, [initialRoleName]);

    //===== Fetch role by id (Edit mode)====
    useEffect(() => {
        if (!token || !roleId || !open) return;

        startTransition(async () => {
            try {
                const response = await getRoleById({
                    token,
                    id: roleId,
                });

                if (response.success) {
                    setSelectedPermissions(response.data.role.permissions || []);
                }
            } catch (error) {
                console.error("getRoleById error:", error);
            }
        });
    }, [token, roleId, open]);

    //==== Toggle single permission=====
    const togglePermission = (permission: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permission)
                ? prev.filter((p) => p !== permission)
                : [...prev, permission],
        );
    };

    //==== Check if module all selected====
    const isModuleAllSelected = (module: RolePermissionModule) => {
        return module.module_permission.every((perm) =>
            selectedPermissions.includes(perm.name),
        );
    };

    //===== Toggle all permissions of module ====
    const toggleModulePermissions = (module: RolePermissionModule) => {
        const modulePermNames = module.module_permission.map((p) => p.name);

        setSelectedPermissions((prev) => {
            const allSelected = modulePermNames.every((p) => prev.includes(p));

            if (allSelected) {
                return prev.filter((p) => !modulePermNames.includes(p));
            }

            const newPerms = modulePermNames.filter((p) => !prev.includes(p));
            return [...prev, ...newPerms];
        });
    };

    //===== Save (Create / Update)=====
    const handleSave = async () => {
        if (!token) return;

        if (!roleName.trim()) {
            toast.error("Role name is required");
            return;
        }

        if (selectedPermissions.length === 0) {
            toast.error("At least one permission is required");
            return;
        }

        const payload = {
            name: roleName,
            guard_name: "api",
            permissions: selectedPermissions,
        };

        startTransition(async () => {
            try {
                const response = roleId
                    ? await updateRole(token, roleId, payload)
                    : await createRole(token, payload);
                if (response.success) {
                    onOpenChange(false);
                    setRoleAfterAddEdit(!roleAfterAddEdit);
                    setSelectedPermissions([]);
                    toast.success(response.message);
                } else {
                    toast.error(response.message);
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        });
    };

    // =====Start Fetch role wise users =====
    useEffect(() => {
        if (!token || !roleId) return;

        startTransition(async () => {
            try {
                const res = await getUserWiseByRole(roleId, token);
                if (res.success) {
                    setRoleWiseUsers(res?.data?.users || []);
                } else {
                    setRoleWiseUsers([]);
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error("getUserWiseByRole error:", error);
                }
            }
        });
    }, [token, roleId]);


    // =====End Fetch role wise users =====

    //====== Mobile permission row=======
    const MobilePermissionRow = ({
        module,
    }: {
        module: RolePermissionModule;
    }) => (
        <div className="border rounded-lg p-4 mb-3 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-3 pb-2 border-b">
                <h4 className="font-semibold text-sm truncate">
                    {module.module_title}
                </h4>

                <div className="flex items-center gap-1">
                    <Checkbox
                        className="cursor-pointer"
                        checked={isModuleAllSelected(module)}
                        onCheckedChange={() => toggleModulePermissions(module)}
                    />
                    <Label className="text-xs font-semibold cursor-pointer">All</Label>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {module.module_permission.map((perm) => (
                    <div key={perm.id} className="flex items-center space-x-2">
                        <Checkbox
                            className="cursor-pointer"
                            id={perm.name}
                            checked={selectedPermissions.includes(perm.name)}
                            onCheckedChange={() => togglePermission(perm.name)}
                        />
                        <Label className="text-sm cursor-pointer" htmlFor={perm.name}>{perm.name}</Label>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col w-[95vw] mx-2 p-0">
                <AlertDialogHeader className="shrink-0 sticky top-0 z-10 bg-white border-b px-4 py-3">
                    <div className="flex items-center justify-between">
                        <AlertDialogTitle className="text-lg sm:text-xl">
                            {roleId ? "Edit Role" : "Add Role"}
                        </AlertDialogTitle>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="rounded-full cursor-pointer p-1.5 bg-red-500 text-white hover:bg-secondary "
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </AlertDialogHeader>

                <Tabs defaultValue="role" className="w-full flex-1 overflow-hidden flex flex-col">
                    <div className="px-4 pt-3 shrink-0">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger className="cursor-pointer" value="role">{roleId ? "Edit Role" : "Add Role"}</TabsTrigger>
                            <TabsTrigger className="cursor-pointer" value="users">Role Wise User</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="role" className="flex-1 overflow-hidden flex flex-col mt-0 data-[state=inactive]:hidden">
                        <div className="flex-1 overflow-y-auto px-4 py-3">
                            <div className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Role Name</Label>
                                    <input
                                        value={roleName}
                                        onChange={(e) => setRoleName(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2.5 bg-white text-sm"
                                        placeholder="Enter role name"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold mb-3">
                                        Role Permissions
                                    </h3>

                                    <div className="hidden sm:block">
                                        <Card>
                                            <CardContent className="p-0">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Module</TableHead>
                                                            <TableHead className="text-center">
                                                                Permissions
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {isPending ? (
                                                            <TableRow>
                                                                <TableCell colSpan={2} className="text-center">
                                                                    <h1 className="text-xl font-bold">Loading...</h1>
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : rolePermissionList.length > 0 ? (
                                                            rolePermissionList.map((module) => (
                                                                <TableRow key={module.module_title}>
                                                                    <TableCell className="font-bold text-base capitalize">
                                                                        {module.module_title}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex gap-4 flex-wrap justify-start items-center">
                                                                            <div className="flex items-center gap-1">
                                                                                <Checkbox
                                                                                    id={module.module_title}
                                                                                    className="cursor-pointer"
                                                                                    checked={isModuleAllSelected(module)}
                                                                                    onCheckedChange={() =>
                                                                                        toggleModulePermissions(module)
                                                                                    }
                                                                                />
                                                                                <Label htmlFor={module.module_title} className="text-base font-semibold cursor-pointer">
                                                                                    All
                                                                                </Label>
                                                                            </div>

                                                                            {module.module_permission.map((perm) => (
                                                                                <div
                                                                                    key={perm.id}
                                                                                    className="flex items-center gap-1"
                                                                                >
                                                                                    <Checkbox
                                                                                        className="cursor-pointer"
                                                                                        id={perm.name}
                                                                                        checked={selectedPermissions.includes(
                                                                                            perm.name,
                                                                                        )}
                                                                                        onCheckedChange={() =>
                                                                                            togglePermission(perm.name)
                                                                                        }
                                                                                    />
                                                                                    <Label htmlFor={perm.name} className="text-md cursor-pointer">
                                                                                        {perm.name}
                                                                                    </Label>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={2} className="text-center">
                                                                    <h1>
                                                                        No permissions Data Currently Not Available
                                                                    </h1>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="sm:hidden">
                                        {isPending ? (
                                            <div className="text-center">
                                                <h1 className="text-lg font-bold">Loading...</h1>
                                            </div>
                                        ) : rolePermissionList.length > 0 ? (
                                            rolePermissionList.map((module) => (
                                                <MobilePermissionRow
                                                    key={module.module_title}
                                                    module={module}
                                                />
                                            ))
                                        ) : (
                                            <div className="text-center">
                                                <h1 className="text-lg font-bold">No permissions Data Currently Not Available</h1>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <AlertDialogFooter className="sticky bottom-0 bg-white border-t px-4 py-3 shrink-0">
                            <Button variant="outline" className="bg-red-500 text-white" onClick={() => onOpenChange(false)}>
                                Close
                            </Button>
                            <Button onClick={handleSave} disabled={isPending}>
                                {isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </AlertDialogFooter>
                    </TabsContent>

                    <TabsContent value="users" className="flex-1 overflow-hidden flex flex-col mt-0 data-[state=inactive]:hidden">
                        <div className="flex-1 overflow-y-auto px-4 py-3 flex items-center justify-center text-muted-foreground">
                            <Card className="w-full">
                                <CardContent className="p-0">
                                    <Table className="w-full">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {isPending ? (
                                                <TableRow>
                                                    <TableCell colSpan={2} className="text-center">
                                                        Loading...
                                                    </TableCell>
                                                </TableRow>
                                            ) : roleWiseUsers?.length > 0 ? (
                                                roleWiseUsers?.map((user) => (
                                                    <TableRow key={user?.id}>
                                                        <TableCell>{user?.name}</TableCell>
                                                        <TableCell>{user?.email}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={2} className="text-center">
                                                        No Users Found
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                        <AlertDialogFooter className="sticky bottom-0 bg-white border-t px-4 py-3 shrink-0">
                            <Button variant="outline" className="bg-red-500 text-white" onClick={() => onOpenChange(false)}>
                                Close
                            </Button>
                        </AlertDialogFooter>
                    </TabsContent>
                </Tabs>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AddEditRoleDialog;
