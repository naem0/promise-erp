"use client";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getFacilities, Facility } from "@/apiServices/facilitiesService";
import {
  assignFacilitiesToCourse,
  getCourseFacilities,
  AssignedFacilitiesResponse,
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
import Image from "next/image";

/* =======================
   Types & Interfaces
======================= */

interface FacilitiesSelectionProps {
  courseId: number;
  onSuccess: () => void;
  isEdit?: boolean;
}

interface FormValues {
  facilities: number[];
}

/* =======================
   Component
======================= */

export default function FacilitiesSelection({
  courseId,
  onSuccess,
  isEdit = false,
}: FacilitiesSelectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchVal, setSearchVal] = useState(searchParams.get("facility_search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("facility_search") || "");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  const { watch, setValue, handleSubmit } = useForm<FormValues>({
    defaultValues: { facilities: [] },
  });

  const selectedFacilityIds = watch("facilities");

  /* =======================
     Load facilities
  ======================= */
  const loadFacilities = (searchQuery = "") => {
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

        const response = await getFacilities(queryParams);

        if (response?.data?.facilities) {
          setFacilities(response?.data?.facilities);
        } else {
          throw new Error("Failed to load facilities");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load facilities";

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

  // 2. Fetch facilities and update URL parameters when debouncedSearch changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentVal = params.get("facility_search") || "";
    if (debouncedSearch !== currentVal) {
      params.delete("page");
      if (debouncedSearch) {
        params.set("facility_search", debouncedSearch);
      } else {
        params.delete("facility_search");
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    loadFacilities(debouncedSearch);
  }, [debouncedSearch, router, pathname]);

  /* =======================
     Load assigned facilities (Edit mode)
  ======================= */
  useEffect(() => {
    if (!isEdit || !courseId) return;

    const fetchAssignedFacilities = async () => {
      try {
        const response: AssignedFacilitiesResponse = await getCourseFacilities(courseId);

        if (response?.success && response?.data) {
          const facilitiesList: Facility[] = response?.data;

          if (facilitiesList.length > 0) {
            const assignedFacilityIds = facilitiesList.map((facility) => facility.id);
            setValue("facilities", assignedFacilityIds);
          }
        }
      } catch (error: unknown) {
        console.error("Failed to load assigned facilities", error);
      }
    };

    fetchAssignedFacilities();
  }, [isEdit, courseId, setValue]);

  /* =======================
     Toggle facility selection
  ======================= */
  const toggleFacility = (
    facilityId: number,
    isChecked: boolean
  ) => {
    const updatedFacilityIds = isChecked
      ? [...selectedFacilityIds, facilityId]
      : selectedFacilityIds.filter(
        (selectedId) => selectedId !== facilityId
      );

    setValue("facilities", updatedFacilityIds, {
      shouldValidate: true,
    });
    setSaveError(null);
  };

  /* =======================
     Submit selected facilities
  ======================= */
  const onSubmit = (formData: FormValues) => {
    if (formData.facilities.length === 0) {
      const errorMessage =
        "Please select at least 1 facility";
      setSaveError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setSaveError(null);

    startTransition(async () => {
      try {
        const response = await assignFacilitiesToCourse(
          courseId,
          formData.facilities
        );

        if (response.success) {
          handleFormSuccess(
            response.message ||
            "Facilities assigned successfully!"
          );
          onSuccess();
        } else {
          throw new Error(
            response.message || "Failed to save facilities"
          );
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to save facilities";

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
          Select Facilities
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-6"
        >
          {/* Loading */}
          {isLoading && !loadError && (
            <p className="text-center">
              Loading facilities…
            </p>
          )}

          {/* Error */}
          {loadError && (
            <NotFoundComponent
              message={loadError}
              onActionClick={() => loadFacilities(debouncedSearch)}
              actionLabel="Try Again"
            />
          )}

          {/* Validation Error */}
          {saveError && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md">
              {saveError}
            </div>
          )}

          {/* Facilities List */}
          {!loadError && (
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Label className="text-base font-semibold">
                  Select facilities for this course:
                </Label>
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search facilities..."
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

              {!isLoading && facilities.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-lg text-muted-foreground">
                  No facilities found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {facilities.map((facility) => {
                    const isSelected = selectedFacilityIds.includes(facility.id);
                    return (
                      <div
                        key={facility.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border transition-all select-none relative group ${isSelected ? "bg-accent border-primary" : "hover:bg-accent/50"
                          }`}
                      >
                        <Checkbox
                          id={`facility-${facility.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            toggleFacility(facility.id, Boolean(checked))
                          }
                          className="z-10"
                        />

                        <Image
                          src={(facility.image && typeof facility.image === "string" && facility.image.trim() !== "") ? facility.image : "/images/placeholder.png"}
                          width={45}
                          height={45}
                          alt={facility.title || "Facility"}
                          className="rounded object-cover"
                        />

                        <Label
                          htmlFor={`facility-${facility.id}`}
                          className="cursor-pointer font-medium stretched-link after:absolute after:inset-0"
                        >
                          {facility.title || "—"}
                        </Label>
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
            facilities.length > 0 && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-32"
                  disabled={
                    isPending ||
                    selectedFacilityIds.length === 0
                  }
                >
                  {isPending
                    ? "Saving..."
                    : "Save Facilities"}
                </Button>
              </div>
            )}
        </form>
      </CardContent>
    </Card>
  );
}
