"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEnrollment } from "@/apiServices/enrollmentService";
import { getStudents } from "@/apiServices/studentService";
import { getBatches } from "@/apiServices/batchService";
import {
  PAYMENT_METHOD_PAYLATER,
  PAYMENT_METHOD_ROCKET,
  PAYMENT_METHOD_NAGAD,
  PAYMENT_METHOD_BKASH,
} from "@/apiServices/paymentConstants";
import {
  PAYMENT_STATUS_PENDING,
  PAYMENT_STATUS_PAID,
} from "@/apiServices/paymentConstants";
import {
  ENROLLMENT_STATUS_PENDING,
  ENROLLMENT_STATUS_ACTIVE,
} from "@/apiServices/enrollmentConstants";
import { Plus, Loader2 } from "lucide-react";

interface Student {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

interface Batch {
  id: number;
  name: string;
  course?: {
    id: number;
    title: string;
  };
}

export default function CreateEnrollmentDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [formData, setFormData] = useState({
    user_id: "",
    batch_id: "",
    status: ENROLLMENT_STATUS_ACTIVE.toString(),
    payment_method: PAYMENT_METHOD_BKASH.toString(),
    payment_status: PAYMENT_STATUS_PENDING.toString(),
    payment_amount: "",
    discount_amount: "",
    payment_reference: "",
  });

  useEffect(() => {
    if (isOpen && students.length === 0) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [studentsRes, batchesRes] = await Promise.all([
        getStudents({ per_page: 100 }),
        getBatches({ per_page: 999 }),
      ]);

      setStudents(studentsRes.data?.students || []);
      setBatches(batchesRes.data?.batches || []);
    } catch (error) {
      toast.error("Failed to load students and batches");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.user_id || !formData.batch_id) {
      toast.error("Please select student and batch");
      return;
    }

    startTransition(async () => {
      try {
        await createEnrollment({
          user_id: Number(formData.user_id),
          batch_id: Number(formData.batch_id),
          status: Number(formData.status),
          payment_method: Number(formData.payment_method),
          payment_status: Number(formData.payment_status),
          payment_amount: formData.payment_amount ? Number(formData.payment_amount) : undefined,
          discount_amount: formData.discount_amount ? Number(formData.discount_amount) : undefined,
          payment_reference: formData.payment_reference || undefined,
        });

        toast.success("Enrollment created successfully");
        setIsOpen(false);
        setFormData({
          user_id: "",
          batch_id: "",
          status: ENROLLMENT_STATUS_ACTIVE.toString(),
          payment_method: PAYMENT_METHOD_BKASH.toString(),
          payment_status: PAYMENT_STATUS_PENDING.toString(),
          payment_amount: "",
          discount_amount: "",
          payment_reference: "",
        });
        router.refresh();
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to create enrollment");
        }
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Enrollment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Enrollment</DialogTitle>
          <DialogDescription>
            Create a new enrollment for a student. Pricing will be automatically calculated from the batch.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user_id">
                Student <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.user_id}
                onValueChange={(value) => setFormData({ ...formData, user_id: value })}
                disabled={isLoadingData || isPending}
              >
                <SelectTrigger id="user_id" className="w-full">
                  <SelectValue placeholder={isLoadingData ? "Loading students..." : "Select student"} />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name} {student.email && `(${student.email})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch_id">
                Batch <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.batch_id}
                onValueChange={(value) => setFormData({ ...formData, batch_id: value })}
                disabled={isLoadingData || isPending}
              >
                <SelectTrigger id="batch_id" className="w-full">
                  <SelectValue placeholder={isLoadingData ? "Loading batches..." : "Select batch"} />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id.toString()}>
                      {batch.name} {batch.course && `- ${batch.course.title}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                disabled={isPending}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ENROLLMENT_STATUS_PENDING.toString()}>Pending</SelectItem>
                  <SelectItem value={ENROLLMENT_STATUS_ACTIVE.toString()}>Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                  disabled={isPending}
                >
                  <SelectTrigger id="payment_method" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PAYMENT_METHOD_PAYLATER.toString()}>Pay Later</SelectItem>
                    <SelectItem value={PAYMENT_METHOD_ROCKET.toString()}>Rocket</SelectItem>
                    <SelectItem value={PAYMENT_METHOD_NAGAD.toString()}>Nagad</SelectItem>
                    <SelectItem value={PAYMENT_METHOD_BKASH.toString()}>bKash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_status">Payment Status</Label>
                <Select
                  value={formData.payment_status}
                  onValueChange={(value) => setFormData({ ...formData, payment_status: value })}
                  disabled={isPending}
                >
                  <SelectTrigger id="payment_status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PAYMENT_STATUS_PENDING.toString()}>Pending</SelectItem>
                    <SelectItem value={PAYMENT_STATUS_PAID.toString()}>Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount_amount">Additional Discount</Label>
                <Input
                  id="discount_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.discount_amount}
                  onChange={(e) => setFormData({ ...formData, discount_amount: e.target.value })}
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_amount">Payment Amount</Label>
                <Input
                  id="payment_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.payment_amount}
                  onChange={(e) => setFormData({ ...formData, payment_amount: e.target.value })}
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_reference">Payment Reference</Label>
              <Input
                id="payment_reference"
                type="text"
                placeholder="Transaction ID / Reference"
                value={formData.payment_reference}
                onChange={(e) => setFormData({ ...formData, payment_reference: e.target.value })}
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Enrollment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
