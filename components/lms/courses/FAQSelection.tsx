"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getFaqs, Faq } from "@/apiServices/faqsService";
import {
  assignFaqsToCourse,
  getCourseFaqs,
  AssignedFaqsResponse,
} from "@/apiServices/courseService";
import { handleFormSuccess } from "@/lib/formErrorHandler";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import NotFoundComponent from "@/components/common/NotFoundComponent";

/* =======================
   Types & Interfaces
======================= */

interface FAQSelectionProps {
  courseId: number;
  onSuccess: () => void;
  isEdit?: boolean;
}

interface FormValues {
  faqs: number[];
}

/* =======================
   Component
======================= */

export default function FAQSelection({
  courseId,
  onSuccess,
  isEdit = false,
}: FAQSelectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [searchVal, setSearchVal] = useState(searchParams.get("faq_search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("faq_search") || "");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  const { watch, setValue, handleSubmit } = useForm<FormValues>({
    defaultValues: { faqs: [] },
  });

  const selectedFaqIds = watch("faqs");

  /* =======================
     Load FAQs
  ======================= */
  const loadFaqs = (searchQuery = "") => {
    setLoadError(null);
    setIsLoading(true);

    startTransition(async () => {
      try {
        const queryParams = {
          per_page: "1000",
          page: "1",
          status: "1",
          search: searchQuery || undefined,
        };

        const response = await getFaqs(queryParams);

        if (response?.data?.faq_sections) {
          setFaqs(response?.data?.faq_sections);
        } else {
          throw new Error("Failed to load FAQs");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load FAQs";

        setLoadError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    });
  };

  // 1. Debounce searchVal -> debouncedSearch
  useEffect(() => {
    if (!searchVal) {
      setDebouncedSearch("");
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal);
    }, 600);

    return () => clearTimeout(handler);
  }, [searchVal]);

  // 2. Fetch FAQs and update URL parameters when debouncedSearch changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentVal = params.get("faq_search") || "";
    if (debouncedSearch !== currentVal) {
      params.delete("page");
      if (debouncedSearch) {
        params.set("faq_search", debouncedSearch);
      } else {
        params.delete("faq_search");
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    loadFaqs(debouncedSearch);
  }, [debouncedSearch, router, pathname]);

  /* =======================
     Load assigned FAQs (Edit mode)
  ======================= */
  useEffect(() => {
    if (!isEdit || !courseId) return;

    const fetchAssignedFaqs = async () => {
      try {
        const response: AssignedFaqsResponse = await getCourseFaqs(courseId);

        if (response?.success && response?.data) {
          const faqsList: Faq[] = response?.data;

          if (faqsList.length > 0) {
            const assignedFaqIds = faqsList.map((faq) => faq.id);
            setValue("faqs", assignedFaqIds);
          }
        }
      } catch (error: unknown) {
        console.error("Failed to load assigned FAQs", error);
      }
    };

    fetchAssignedFaqs();
  }, [isEdit, courseId, setValue]);

  /* =======================
     Toggle FAQ selection
  ======================= */
  const toggleFaq = (
    faqId: number,
    isChecked: boolean
  ) => {
    const updatedFaqIds = isChecked
      ? [...selectedFaqIds, faqId]
      : selectedFaqIds.filter(
        (selectedId) => selectedId !== faqId
      );

    setValue("faqs", updatedFaqIds, {
      shouldValidate: true,
    });
    setSaveError(null);
  };

  /* =======================
     Submit selected FAQs
  ======================= */
  const onSubmit = (formData: FormValues) => {
    if (formData.faqs.length === 0) {
      const errorMessage = "Please select at least 1 FAQ";
      setSaveError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setSaveError(null);

    startTransition(async () => {
      try {
        const response = await assignFaqsToCourse(
          courseId,
          formData.faqs
        );

        if (response.success) {
          handleFormSuccess(
            response.message ||
            "FAQs assigned successfully!"
          );
          onSuccess();
        } else {
          throw new Error(
            response.message || "Failed to save FAQs"
          );
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to save FAQs";

        setSaveError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  const handleClear = () => {
    setSearchVal("");
    setDebouncedSearch("");
  };

  /* =======================
     UI
  ======================= */
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          Select FAQs
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-6"
        >
          {/* Loading */}
          {isLoading && !loadError && (
            <p className="text-center">Loading FAQs…</p>
          )}

          {/* Error */}
          {loadError && (
            <NotFoundComponent
              message={loadError}
              onActionClick={() => loadFaqs(debouncedSearch)}
              actionLabel="Try Again"
            />
          )}

          {/* Validation Error */}
          {saveError && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md">
              {saveError}
            </div>
          )}

          {/* FAQs List */}
          {!loadError && (
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Label className="text-base font-semibold">Select FAQs for this course:</Label>
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search FAQs..."
                    className="pl-10 pr-10"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                  />
                  {searchVal && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {!isLoading && faqs.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-lg text-muted-foreground">
                  No FAQs found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {faqs.map((faq) => {
                    const isSelected = selectedFaqIds.includes(faq.id);
                    return (
                      <div
                        key={faq.id}
                        className={`flex items-start gap-3 p-4 rounded-lg border transition-all select-none relative group ${isSelected ? "bg-accent border-primary" : "hover:bg-accent/50"
                          }`}
                      >
                        <Checkbox
                          id={`faq-${faq.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            toggleFaq(faq.id, Boolean(checked))
                          }
                          className="mt-1 z-10"
                        />

                        <div className="grid gap-1 flex-1">
                          <Label
                            htmlFor={`faq-${faq.id}`}
                            className="cursor-pointer font-medium text-base leading-none stretched-link after:absolute after:inset-0"
                          >
                            {faq.question || "—"}
                          </Label>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {faq.answer || "—"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Save Button */}
          {!isLoading &&
            !loadError &&
            faqs.length > 0 && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-32"
                  disabled={
                    isPending ||
                    selectedFaqIds.length === 0
                  }
                >
                  {isPending ? "Saving..." : "Save FAQs"}
                </Button>
              </div>
            )}
        </form>
      </CardContent>
    </Card>
  );
}
