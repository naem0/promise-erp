"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { createLeadHistory } from "@/apiServices/crmLeadsHistoryService";
import { toast } from "sonner";

interface LeadHistoryFormProps {
  leadId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const LeadHistoryForm = ({ leadId }: LeadHistoryFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    type: 1,
    status: 1,
    note: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const res = await createLeadHistory({
          lead_id: leadId,
          ...formData,
        });

        if (res.success) {
          toast.success(res.message || "Log saved successfully");
          setFormData({
            date: new Date().toISOString().split("T")[0],
            type: 1,
            status: 1,
            note: "",
          });
          router.refresh();
        } else {
          toast.error(res.message || "Failed to save log");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
        console.error(error); 
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Plus className="w-5 h-5 text-green-600" />
        <h3 className="text-xl font-semibold text-slate-800">Add Call Log</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="next_date" className="text-sm font-medium text-slate-700">Next Date</Label>
          <Input
            id="next_date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full border-slate-200 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        {/*type * integer  1: Call, 2: Message*/}
        <div>
          <Label htmlFor="interaction_type" className="text-sm font-medium text-slate-700">Interaction Type</Label>
          <Select
            value={String(formData.type)}
            onValueChange={(val) => setFormData({ ...formData, type: Number(val) })}
          >
            <SelectTrigger className="w-full border-slate-200">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Call</SelectItem>
              <SelectItem value="2">Message</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="call_result" className="text-sm font-medium text-slate-700">Status</Label>
          <Select
            value={String(formData.status)}
            onValueChange={(val) => setFormData({ ...formData, status: Number(val) })}
          >
            <SelectTrigger className="w-full border-slate-200">
              <SelectValue placeholder="Select Result" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">New</SelectItem>
              <SelectItem value="2">Busy</SelectItem>
              <SelectItem value="3">Interested</SelectItem>
              <SelectItem value="4">Follow Up</SelectItem>
              <SelectItem value="5">Enrolled</SelectItem>
              <SelectItem value="6">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="note" className="text-sm font-medium text-slate-700">Note</Label>
          <Textarea
            id="note"
            placeholder="Enter Call Notes...."
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="w-full min-h-[120px] border-slate-200 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {isPending ? "Saving..." : "Save Logs"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeadHistoryForm;
