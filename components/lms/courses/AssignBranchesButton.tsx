"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link2 } from "lucide-react";
import { getBranches } from "@/apiServices/branchService";
import { assignBranchesToCourse } from "@/apiServices/courseService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Branch } from "@/apiServices/branchService";
import { Spinner } from "@/components/ui/spinner";

interface AssignBranchesButtonProps {
  courseId: string;
  initialAssignedBranches: { id: number; name: string }[];
}

const AssignBranchesButton: React.FC<AssignBranchesButtonProps> = ({
  courseId,
  initialAssignedBranches,
}) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (dialogOpen) {
      setSelectedBranchIds(initialAssignedBranches?.map((b) => b.id));
      fetchBranches();
    }
  }, [dialogOpen, initialAssignedBranches]);

  const fetchBranches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBranches({ per_page: 9999 });
      if (response.success) {
        setBranches(response.data.branches);
      } else {
        setError(response.message || "Failed to fetch branches.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (branchId: number, checked: boolean) => {
    setSelectedBranchIds((prev) =>
      checked ? [...prev, branchId] : prev.filter((id) => id !== branchId)
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await assignBranchesToCourse(String(courseId), selectedBranchIds);
      if (response.success) {
        toast.success("Branches assigned successfully!");
        setDialogOpen(false);
        router.refresh();
      } else {
        toast.error(response.message || "Failed to assign branches.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div
          className="flex items-center px-2 py-1 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setDialogOpen(true);
          }}
        >
          <Link2 className="mr-2 h-4 w-4" /> Assign Branches
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Branches to Course</DialogTitle>
        </DialogHeader>

        {loading && <Spinner />}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && branches.length === 0 && (
          <p>No branches available.</p>
        )}

        {!loading && !error && branches.length > 0 && (
          <div className="grid grid-cols-2 gap-4 py-4 max-h-[400px] overflow-y-auto">
            {branches?.map((branch) => (
              <div key={branch.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedBranchIds.includes(branch.id)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(branch.id, checked as boolean)
                  }
                />
                <label className="text-sm">{branch.name}</label>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignBranchesButton;
