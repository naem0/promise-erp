"use client";


import { addTeacher } from "@/apiServices/teacherService";
import { useRouter } from "next/navigation";
import UserForm from "@/components/common/UserForm";
import { handleFormErrors, handleFormSuccess } from "@/lib/formErrorHandler";
import { UseFormSetError } from "react-hook-form";
import { ApiErrorResponse } from "@/lib/apiErrorHandler";

export default function AddTeacherPage() {
  const router = useRouter();

  const handleSubmit = async (
    formData: FormData,
    setFormError: (field: string, message: string) => void,
    resetForm: () => void
  ) => {
    const res = await addTeacher(formData);

    if (res.success) {
      handleFormSuccess(res.message || "Teacher added successfully!");
      resetForm();
      router.push("/lms/teachers");
    } else {
      handleFormErrors(res as ApiErrorResponse, setFormError as UseFormSetError<any>);
    }
  };

  return <UserForm title="Add New Teacher" onSubmit={handleSubmit} />;
}
