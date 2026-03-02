"use client";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

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
import NotFoundComponent from "@/components/common/NotFoundComponent";
import Image from "next/image";
import { Wrench } from "lucide-react";

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

/* =================== Component================ */

export default function CourseToolsAddForm({
  courseId,
  onSuccess,
  isEdit = false,
}: CourseToolsAddFormProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { watch, setValue, handleSubmit, setError } = useForm<FormValues>({
    defaultValues: { tools: [] },
  });

  const selectedToolIds = watch("tools");

  /* =======================
     Load all tools
  ======================= */
  const loadTools = () => {
    setLoadError(null);

    startTransition(async () => {
      try {
        const queryParams = {
          per_page: "1000",
          page: "1",
          status: "1",
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
      }
    });
  };

  useEffect(() => {
    loadTools();
  }, []);

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

  /* ==================Toggle tool selection================== */
  const toggleTool = (toolId: number, isChecked: boolean) => {
    const updatedToolIds = isChecked
      ? [...selectedToolIds, toolId]
      : selectedToolIds.filter((id) => id !== toolId);

    setValue("tools", updatedToolIds, { shouldValidate: true });
    setSaveError(null);
  };

  /* ====================Submit selected tools==================== */
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

  /*==================== UI==================== */
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
              onActionClick={loadTools}
              actionLabel="Try Again"
            />
          )}

          {/* Empty */}
          {!loadError && tools.length === 0 && (
            <NotFoundComponent
              message="No active tools found. Please create tools first."
              onActionClick={loadTools}
              actionLabel="Refresh"
            />
          )}

          {/* Validation Error */}
          {saveError && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md">
              {saveError}
            </div>
          )}

          {/* Tools List */}
          {!loadError && tools.length > 0 && (
            <div className="grid gap-4">
              <Label>Select tools for this course:</Label>

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
                        src={tool.image || "/images/placeholder.png"}
                        width={45}
                        height={45}
                        alt={tool.title}
                        className="rounded object-cover"
                      />

                      <Label
                        htmlFor={`tool-${tool.id}`}
                        className="cursor-pointer font-medium stretched-link after:absolute after:inset-0"
                      >
                        {tool.title}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Save Button */}
          {!loadError && tools.length > 0 && (
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
