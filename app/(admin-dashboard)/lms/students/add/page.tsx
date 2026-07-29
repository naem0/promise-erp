import { getBranches } from "@/apiServices/branchService";
import StudentForm from "@/components/lms/students/StudentForm";

export default async function AddStudentPage() {
  let branchesRes = null;
  try {
    branchesRes = await getBranches({ per_page: 999 });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) throw error;
    if (error instanceof Error) {
      console.error("Failed to load branches for student form:", error.message);
      branchesRes = null;
    } else {
      console.error("Failed to load branches for student form:", error);
    }
  }

  return (
    <StudentForm
      title="Add New Student"
      branches={branchesRes?.data?.branches || []}
    />
  );
}
