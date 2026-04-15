"use client";

import HeroSectionForm from "@/components/web-content/hero-section/HeroSectionForm";
import { useRouter } from "next/navigation";
import { createHeroSection } from "@/apiServices/homePageAdminService";
import { toast } from "sonner";

const HeroSectionAddPage = () => {
  const router = useRouter();

  const handleSubmit = async (
    formData: FormData,
    setFormError: (field: string, message: string) => void,
    resetForm: () => void
  ) => {
    try {
      const res = await createHeroSection(formData);
      console.log("Create hero section response:", res);
      if (res.success) {
        toast.success(res.message);
        resetForm();
        router.push("/web-content/hero-section");
      } else {
        if (res.errors) {
          Object.entries(res.errors).forEach(([field, messages]) => {
            const errorMessage = Array.isArray(messages) ? messages[0] : messages;
            setFormError(field, errorMessage as string);
          });
          toast.error(res.message);
        } else {
          toast.error(res.message);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create hero section. Please try again.");
      }
      console.error("Create hero section error:", error);
    }
  };

  return (
    <HeroSectionForm title="Add Hero Section" onSubmit={handleSubmit} />
  
  );
};

export default HeroSectionAddPage;