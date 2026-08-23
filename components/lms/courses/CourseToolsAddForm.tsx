"use client";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getTools, Tool } from "@/apiServices/toolsService";
import {
  assignToolsToCourse,
  getCourseAssignedTools,
  AssignedToolsResponse,
  CourseTool,
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
import { Search, Wrench, X } from "lucide-react";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import Image from "next/image";

/* =======================
   Types & Interfaces
======================= */

interface CourseToolsAddFormProps {
  courseId: number;
  onSuccess: () => void;
  isEdit?: boolean;
}

interface FormValues {
  tools: number[];
}

/* =================== Component ================ */

export default function CourseToolsAddForm({
  courseId,
  onSuccess,
  isEdit = false,
}: CourseToolsAddFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [tools, setTools] = useState<Tool[]>([]);
  const [searchVal, setSearchVal] = useState(searchParams.get("tool_search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("tool_search") || "");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  const { watch, setValue, handleSubmit, setError } = useForm<FormValues>({
    defaultValues: { tools: [] },
  });

  const selectedToolIds = watch("tools");

  /* =======================
     Load tools
  ======================= */
  const loadTools = (searchQuery = "") => {
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

        const response = await getTools(queryParams);

        if (response?.data?.tools) {
          setTools(response.data.tools);
        } else {
          throw new Error("Failed to load tools");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load tools";
        setLoadError(errorMessage);
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

  // 2. Fetch tools and update URL parameters when debouncedSearch changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentVal = params.get("tool_search") || "";
    if (debouncedSearch !== currentVal) {
      params.delete("page");
      if (debouncedSearch) {
        params.set("tool_search", debouncedSearch);
      } else {
        params.delete("tool_search");
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    loadTools(debouncedSearch);
  }, [debouncedSearch, router, pathname]);

  /*==================== Load assigned tools (Edit mode)===================*/
  useEffect(() => {
    if (!isEdit || !courseId) return;

    const fetchAssignedTools = async () => {
      try {
        const response: AssignedToolsResponse =
          await getCourseAssignedTools(courseId);
        if (response.success && response.data) {
          const toolsList: CourseTool[] = response.data;
          if (toolsList.length > 0) {
            const assignedToolIds = toolsList.map((tool) => tool.id);
            setValue("tools", assignedToolIds);
          }
        }
      } catch (error: unknown) {
        console.error("Failed to load assigned tools", error);
      }
    };

    fetchAssignedTools();
  }, [isEdit, courseId, setValue]);

  /* ================== Toggle tool selection ================== */
  const toggleTool = (toolId: number, isChecked: boolean) => {
    const updatedToolIds = isChecked
      ? [...selectedToolIds, toolId]
      : selectedToolIds.filter((id) => id !== toolId);

    setValue("tools", updatedToolIds, { shouldValidate: true });
    setSaveError(null);
  };

  /* ==================== Submit selected tools ==================== */
  const onSubmit = (formData: FormValues) => {
    if (formData.tools.length === 0) {
      const errorMessage = "Please select at least 1 tool";
      setSaveError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setSaveError(null);

    startTransition(async () => {
      try {
        const response = await assignToolsToCourse(courseId, formData.tools);

        if (response.success) {
          toast.success(response.message || "Tools assigned successfully");
          onSuccess();
        } else {
          if (response.errors) {
            toast.error(response.message || "Failed to save tool");
            Object.entries(response.errors).forEach(([field, messages]) => {
              const errorMessage = Array.isArray(messages)
                ? messages[0]
                : messages;
              setError(field as keyof FormValues, {
                type: "server",
                message: errorMessage as string,
              });
            });
          }
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save tool";
        setSaveError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  const handleClear = () => {
    setSearchVal("");
    setDebouncedSearch("");
  };

  /*==================== UI ==================== */
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Wrench className="w-6 h-6 text-primary" />
          {isEdit ? "Edit Course Tools" : "Select Tools"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
          {/* Error */}
          {loadError && (
            <NotFoundComponent
              message={loadError}
              onActionClick={() => loadTools(debouncedSearch)}
              actionLabel="Try Again"
            />
          )}

          {/* Validation Error */}
          {saveError && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md">
              {saveError}
            </div>
          )}

          {/* Tools List */}
          {!loadError && (
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Label className="text-base font-semibold">Select tools for this course:</Label>
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tools..."
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

              {!isLoading && tools.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-lg text-muted-foreground">
                  No tools found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {tools.map((tool) => {
                    const isSelected = selectedToolIds.includes(tool.id);
                    return (
                      <div
                        key={tool.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border transition-all select-none relative group ${isSelected
                          ? "bg-accent border-primary"
                          : "hover:bg-accent/50"
                          }`}
                      >
                        <Checkbox
                          id={`tool-${tool.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            toggleTool(tool.id, Boolean(checked))
                          }
                          className="z-10"
                        />

                        <Image
                          src={(tool.image && typeof tool.image === "string" && tool.image.trim() !== "") ? tool.image : "/images/placeholder.png"}
                          width={45}
                          height={45}
                          alt={tool.title || "Tool"}
                          className="rounded object-cover"
                        />

                        <Label
                          htmlFor={`tool-${tool.id}`}
                          className="cursor-pointer font-medium stretched-link after:absolute after:inset-0"
                        >
                          {tool.title || "—"}
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
            tools.length > 0 && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-36"
                  disabled={isPending || selectedToolIds.length === 0}
                >
                  {isPending ? "Saving..." : "Save Tools"}
                </Button>
              </div>
            )}
        </form>
      </CardContent>
    </Card>
  );
}
