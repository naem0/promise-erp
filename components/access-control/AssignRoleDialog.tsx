"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  assignRole,
  getAllUserlist,
  UserList,
} from "@/apiServices/rolePermissionService";
import RoleSearchSelect from "@/components/common/RoleSearchSelect";
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
  const [userList, setUserList] = useState<UserList[]>([]);
  const [error, setError] = useState<string | null>(null);

  // future use
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  //=========================== User List =============================

  useEffect(() => {
    if (!open || !session?.accessToken) return;
    startTransition(async () => {
      try {
        setError(null);
        const response = await getAllUserlist(session?.accessToken);
        if (response?.success) {
          setUserList(response?.data?.users || []);
        } else {
          setError(response?.message || "Failed to load users");
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
          session?.accessToken,
          selectedUser,
          selectedRole,
        );
        if (res?.success) {
          toast.success(res?.message);
          resetAndClose();
        } else {
          setError(res?.message || "Failed to assign role");
          toast.error(error || res?.message);
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
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md w-full" showCloseButton={false}>
        <DialogHeader className="relative">
          <DialogTitle>Assign Role</DialogTitle>

          <button
            onClick={resetAndClose}
            className="absolute right-0 top-0 rounded-sm p-1 bg-red-600 text-white hover:bg-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Role */}
          <div>
            <label className="text-sm font-medium mb-1 block">Role</label>
            <RoleSearchSelect
              value={selectedRole}
              onValueChange={(val) => setSelectedRole(val || "")}
              useNameAsValue={true}
              disabled={isPending}
              placeholder="Select Role"
            />
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
                {userList?.map((user) => (
                  <SelectItem key={user?.id} value={user?.id.toString()}>
                    {user?.name} {"->"} {user?.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignRoleDialog;
