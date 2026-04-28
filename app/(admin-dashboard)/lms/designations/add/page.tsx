import DesignationsForm from "@/components/lms/designations/DesignationsForm";

export const metadata = {
  title: "Add Designation | LMS",
};

export default function AddDesignationPage() {
    return (
        <div className="max-w-4xl mx-auto py-6">
            <DesignationsForm title="Add New Designation" />
        </div>
    );
}
