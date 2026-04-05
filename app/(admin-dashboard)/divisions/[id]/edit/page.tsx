"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Division, DivisionFormData, getDivision, updateDivision } from "@/apiServices/divisionService";
import DivisionForm from "@/components/division/DivisionForm";
import { toast } from "sonner";
import { DivisionDetailsResponse } from "@/apiServices/divisionService";
import TableSkeleton from "@/components/TableSkeleton";
import { handleFormErrors, handleFormSuccess } from "@/lib/formErrorHandler";
import { UseFormSetError } from "react-hook-form";
import { ApiErrorResponse } from "@/lib/apiErrorHandler";

interface EditDivisionPageProps {
  params: Promise<{ id: string }>;
}

export default function EditDivisionPage({ params }: EditDivisionPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const divisionId = Number(id);
  const [division, setDivision] = useState<Division | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDivision = async () => {
      try {
        setLoading(true);
        const response: DivisionDetailsResponse = await getDivision(divisionId);
        if (response.success && response.data?.division) {
          setDivision(response.data.division);
        } else {
          setError(response.message || "Failed to fetch division data.");
          toast.error(response.message || "Failed to fetch division data.");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (divisionId) {
      fetchDivision();
    }
  }, [divisionId]);

  const handleSubmit = async (
    formData: DivisionFormData,
    setFormError: (field: string, message: string) => void
  ) => {
    const result = await updateDivision(divisionId, formData);

    if (result.success) {
      handleFormSuccess(result.message || "Division updated successfully!");
      router.push("/divisions");
    } else {
      handleFormErrors(result as ApiErrorResponse, setFormError as UseFormSetError<any>);
    }
  };

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Division</h1>
      {division && (
        <DivisionForm
          title="Edit Division"
          buttonTitle="Update Division"
          defaultValues={division}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}