"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  assignRole,
  getAllRolesList,
  getAllUserlist,
  Role,
  UserList,
} from "@/apiServices/rolePermissionService";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import { toast } from "sonner";

interface AssignRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AssignRoleDialog: React.FC<AssignRoleDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [userList, setUserList] = useState<UserList[]>([]);
  const [error, setError] = useState<string | null>(null);

  // future use
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  // ============================ Fetch Roles =============================
  useEffect(() => {
    if (!session?.accessToken || !open) return;

    startTransition(async () => {
      try {
        setError(null);
        const response = await getAllRolesList({
          token: session.accessToken,
        });

        if (response?.success) {
          setRoles(response?.data?.roles || []);
        } else {
          setError(response?.message || "Failed to load roles");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    });
  }, [session?.accessToken, open]);

  //=========================== User List =============================

  useEffect(() => {
    if (!open || !session?.accessToken) return;
    startTransition(async () => {
      try {
        setError(null);
        const response = await getAllUserlist(session?.accessToken);
        if (response.success) {
          setUserList(response?.data?.users || []);
        } else {
          setError(response.message || "Failed to load roles");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    });
  }, [open, session?.accessToken]);

  //=========================== Save (Assign Role API) ==========================

  const saveAssignedRole = () => {
    if (!selectedRole || !selectedUser || !session?.accessToken) return;

    startTransition(async () => {
      try {
        const res = await assignRole(
          session.accessToken,
          selectedUser,
          selectedRole,
        );
        if (res.success) {
          toast.success(res.message);
          resetAndClose();
        } else {
          setError(res.message || "Failed to assign role");
          toast.error(error || res.message);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          toast.error(err.message);
        }
      }
    });
  };

  // ===================== Helpers =====================
  const resetAndClose = () => {
    setSelectedRole("");
    setSelectedUser(null);
    setError(null);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={resetAndClose}>
      <AlertDialogContent className="sm:max-w-md w-full">
        <AlertDialogHeader className="relative">
          <AlertDialogTitle>Assign Role</AlertDialogTitle>

          <button
            onClick={resetAndClose}
            className="absolute right-0 top-0 rounded-sm p-1 bg-red-600 text-white hover:bg-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Role */}
          <div>
            <label className="text-sm font-medium mb-1 block">Role</label>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
              disabled={isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={isPending ? "Loading Roles..." : "Select Role"}
                />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={String(role.name)}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          {/* User */}
          <div>
            <label className="text-sm font-medium mb-1 block">User</label>
            <Select
              value={selectedUser?.toString()}
              onValueChange={(value) => setSelectedUser(Number(value))}
              disabled={isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={isPending ? "Loading Users..." : "Select User"}
                />
              </SelectTrigger>
              <SelectContent>
                {userList.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name} {"->"} {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>

        <AlertDialogFooter className="mt-6 gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={resetAndClose}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={saveAssignedRole}
            disabled={!selectedRole || !selectedUser || isPending}
          >
            {isPending ? "Assigning..." : "Assign Role"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AssignRoleDialog;
