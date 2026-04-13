"use client";

import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  FreeSeminar,
  createFreeSeminar,
  updateFreeSeminar,
} from "@/apiServices/freeSeminarsService";
import { Tool, getTools } from "@/apiServices/toolsService";
import { getBranches, Branch } from "@/apiServices/branchService";
import { getCategories, Category } from "@/apiServices/categoryService";
import { getTeachers, Teacher } from "@/apiServices/teacherService";
import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { ChevronLeft, Camera, X } from "lucide-react";
import RichTextEditor from "@/components/lms/courses/RichTextEditor";

interface FreeSeminarFormProps {
  title: string;
  freeSeminar?: FreeSeminar;
}

interface FormValues {
  title: string;
  slug: string;
  about: string;
  class_topic: string;
  seminar_type: string;
  description: string;
  location: string;
  seminar_date: string;
  seminar_time: string;
  seminar_link: string;
  branch_id: string;
  course_category_id: string;
  instructor_ids: string[];
  tool_ids: string[];
  meta_title: string;
  meta_description: string;
  meta_tag: string[];
  schema: string;
  image?: FileList;
}

export default function FreeSeminarForm({
  title,
  freeSeminar,
}: FreeSeminarFormProps) {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchedTeachers, setFetchedTeachers] = useState<Teacher[]>([]);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [preview, setPreview] = useState<string | null>(freeSeminar?.image || null);
  const [isToolsPending, startToolsTransition] = useTransition();

  // Meta tag state
  const [metaTags, setMetaTags] = useState<string[]>(
    Array.isArray(freeSeminar?.meta_tag) ? freeSeminar.meta_tag : []
  );
  const [metaTagInput, setMetaTagInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: freeSeminar?.title || "",
      slug: freeSeminar?.slug || "",
      about: freeSeminar?.about || "",
      class_topic: freeSeminar?.class_topic || "",
      seminar_type: freeSeminar?.seminar_type?.toString() || "0",
      description: freeSeminar?.description || "",
      location: freeSeminar?.location || "",
      seminar_date: freeSeminar?.seminar_date || "",
      seminar_time: freeSeminar?.seminar_time || "",
      seminar_link: freeSeminar?.seminar_link || "",
      branch_id: freeSeminar?.branch?.id?.toString() || "",
      course_category_id: freeSeminar?.category_id?.toString() || "",
      instructor_ids: freeSeminar?.instructors?.map((i) => i.id.toString()) || [],
      tool_ids: freeSeminar?.tools?.map((t) => t.id.toString()) || [],
      meta_title: freeSeminar?.meta_title || "",
      meta_description: freeSeminar?.meta_description || "",
      meta_tag: Array.isArray(freeSeminar?.meta_tag) ? freeSeminar.meta_tag : [],
      schema: freeSeminar?.schema || "",
    },
  });

  const watchedBranchId = watch("branch_id");
  const watchedSeminarType = watch("seminar_type");
  const watchedTitle = watch("title");

  // Auto-generate slug from title (only when creating)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!freeSeminar?.slug);
  useEffect(() => {
    if (!slugManuallyEdited) {
      const generated = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setValue("slug", generated);
    }
  }, [watchedTitle, slugManuallyEdited, setValue]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [branchesRes, categoriesRes] = await Promise.all([
          getBranches({ per_page: 999 }),
          getCategories({ per_page: 999 }),
        ]);
        if (branchesRes.success) setBranches(branchesRes.data?.branches || []);
        if (categoriesRes.success)
          setCategories(categoriesRes.data?.categories || []);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };
    loadInitialData();

    // Load tools via server action + useTransition
    startToolsTransition(async () => {
      try {
        const toolsRes = await getTools({ per_page: 1000, status: 1 });
        if (toolsRes?.success) setAllTools(toolsRes.data?.tools || []);
      } catch (error) {
        console.error("Error loading tools:", error);
      }
    });
  }, []);

  useEffect(() => {
    const fetchBranchTeachers = async () => {
      if (!watchedBranchId) {
        setFetchedTeachers([]);
        return;
      }
      try {
        const res = await getTeachers({
          branch_id: watchedBranchId,
          per_page: 100,
        });
        if (res.success && res.data) {
          setFetchedTeachers(res.data.teachers || []);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setFetchedTeachers([]);
      }
    };
    fetchBranchTeachers();
  }, [watchedBranchId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setValue("image", e.target.files as FileList);
    clearErrors("image"); // Clear any previous errors
  };


  const handleRemoveImage = () => {
    setPreview(null);
    setValue("image", undefined);
    const input = document.getElementById("image_input") as HTMLInputElement;
    if (input) input.value = "";
    toast.success("Image removed");
  };

  // Meta tag handlers
  const addMetaTag = (input: string) => {
    const trimmed = input.trim().replace(/,$/, "").trim();
    if (trimmed && !metaTags.includes(trimmed)) {
      const updated = [...metaTags, trimmed];
      setMetaTags(updated);
      setValue("meta_tag", updated);
    }
    setMetaTagInput("");
  };

  const handleMetaTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addMetaTag(metaTagInput);
    }
  };

  const handleMetaTagBlur = () => {
    if (metaTagInput.trim()) {
      addMetaTag(metaTagInput);
    }
  };

  const removeMetaTag = (tag: string) => {
    const updated = metaTags.filter((t) => t !== tag);
    setMetaTags(updated);
    setValue("meta_tag", updated);
  };

  const submitHandler = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("slug", values.slug);
    formData.append("about", values.about);
    formData.append("class_topic", values.class_topic);
    formData.append("seminar_type", values.seminar_type);
    formData.append("description", values.description);
    formData.append("location", values.location);
    formData.append("seminar_date", values.seminar_date);
    formData.append("seminar_time", values.seminar_time);
    formData.append("seminar_link", values.seminar_link);
    formData.append("branch_id", values.branch_id);
    formData.append("course_category_id", values.course_category_id);
    formData.append("instructor_ids", values.instructor_ids.join(","));
    formData.append("tool_ids", values.tool_ids.join(","));
    formData.append("meta_title", values.meta_title);
    formData.append("meta_description", values.meta_description);
    formData.append("meta_tag", JSON.stringify(values.meta_tag));
    formData.append("schema", values.schema);
    if (values.image?.[0]) {
      formData.append("image", values.image[0]);
    }

    try {
      const res = freeSeminar
        ? await updateFreeSeminar(freeSeminar.id, formData)
        : await createFreeSeminar(formData);

      console.log("res:", res);

      if (res.success) {
        toast.success(res.message || "Seminar saved successfully!");
        router.push("/lms/free-seminars");
        reset();
        setPreview(null);
        setMetaTags([]);
        return;
      }

      if (res.errors) {
        Object.entries(res.errors).forEach(([field, messages]) => {
          // Handle dot-notation array errors e.g. "instructor_ids.0" → "instructor_ids"
          const rootField = field.includes(".")
            ? (field.split(".")[0] as keyof FormValues)
            : (field as keyof FormValues);
          setError(rootField, {
            type: "server",
            message: Array.isArray(messages)
              ? messages[0]
              : (messages as string),
          });
        });
      }
      toast.error(res.message || "Failed to save seminar");
    } catch (error: unknown) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    }
  };

  return (
    <div className="mx-auto w-full space-y-4">
      <div className="flex items-center space-x-2 text-[#2A334E]">
        <button
          onClick={() => router.back()}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-8">

          {/* ── Basic Info ── */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Enter seminar title"
                  {...register("title")}
                  className="border-gray-200"
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Slug <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="auto-generated-from-title"
                  {...register("slug")}
                  className="border-gray-200"
                  onChange={(e) => {
                    setSlugManuallyEdited(true);
                    setValue("slug", e.target.value);
                  }}
                />
                {errors.slug && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Seminar Type <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="seminar_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="border-gray-200 w-full text-left">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Offline</SelectItem>
                        <SelectItem value="1">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.seminar_type && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.seminar_type.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Branch <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="branch_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="border-gray-200 w-full text-left">
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches?.map((b) => (
                          <SelectItem key={b.id} value={b.id.toString()}>
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.branch_id && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.branch_id.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Category <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="course_category_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="border-gray-200 w-full text-left">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.course_category_id && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.course_category_id.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Topics <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. HTML5, CSS3"
                  {...register("class_topic")}
                  className="border-gray-200"
                />
                {errors.class_topic && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.class_topic.message}
                  </p>
                )}
              </div>
            </div>
          </div>



          {/* ── Content ── */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  About <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Short summary"
                  {...register("about")}
                  className="border-gray-200 min-h-[100px]"
                />
                {errors.about && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.about.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Detailed Description 
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Scheduling ── */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  {...register("seminar_date")}
                  className="border-gray-200"
                />
                {errors.seminar_date && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.seminar_date.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Time <span className="text-red-500">*</span>
                </label>
                <Input
                  type="time"
                  {...register("seminar_time")}
                  className="border-gray-200"
                />
                {errors.seminar_time && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.seminar_time.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Location <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Location"
                  {...register("location")}
                  className="border-gray-200"
                />
                {errors.location && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Meeting Link
                  {watchedSeminarType === "1" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <Input
                  placeholder="Link"
                  {...register("seminar_link", {
                    required:
                      watchedSeminarType === "1"
                        ? "Meeting link is required for online seminars"
                        : false,
                  })}
                  className="border-gray-200"
                />
                {errors.seminar_link && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.seminar_link.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Instructors ── */}
          <div className="space-y-6">
            <div className="bg-[#F9FAFB] border rounded-lg p-4">
              <label className="text-sm font-semibold text-gray-600 mb-3 block">
                Assign Instructors <span className="text-red-500">*</span>
              </label>
              <Controller
                name="instructor_ids"
                control={control}
                render={({ field }) => {
                  const selected = Array.isArray(field.value) ? field.value : [];
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {fetchedTeachers.map((t) => {
                        const isSelected = selected.includes(t.id.toString());
                        return (
                          <div
                            key={t.id}
                            onClick={() => {
                              const val = t.id.toString();
                              const next = isSelected
                                ? selected.filter((x) => x !== val)
                                : [...selected, val];
                              field.onChange(next);
                            }}
                            className={`flex items-center space-x-3 p-2 rounded-md border cursor-pointer transition-all select-none ${isSelected
                              ? "bg-primary/10 border-primary"
                              : "bg-white hover:bg-gray-50 border-gray-200"
                              }`}
                          >
                            <input
                              type="checkbox"
                              readOnly
                              checked={isSelected}
                              className="h-4 w-4 rounded border-gray-300 text-primary pointer-events-none"
                            />
                            <span className="text-sm font-medium">
                              {t.name}
                            </span>
                          </div>
                        );
                      })}
                      {!fetchedTeachers.length && (
                        <p className="col-span-full text-center py-4 text-gray-500 italic text-sm">
                          {watchedBranchId ? "No instructors found" : "Select a branch first"}
                        </p>
                      )}
                    </div>
                  );
                }}
              />
              {errors.instructor_ids && (
                <p className="text-xs text-red-500 mt-2 font-medium">
                  {errors.instructor_ids.message}
                </p>
              )}
            </div>
          </div>

          {/* ── Tools ── */}
          <div className="space-y-6">
            <div className="bg-[#F9FAFB] border rounded-lg p-4">
              <label className="text-sm font-semibold text-gray-600 mb-3 block">
                Tools
              </label>
              <Controller
                name="tool_ids"
                control={control}
                render={({ field }) => {
                  const selected = Array.isArray(field.value) ? field.value : [];
                  return isToolsPending ? (
                    <p className="text-sm text-gray-400 italic py-2">Loading tools...</p>
                  ) : allTools.length === 0 ? (
                    <p className="text-sm text-gray-400 italic py-2">No tools available</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {allTools.map((tool) => {
                        const isSelected = selected.includes(tool.id.toString());
                        return (
                          <div
                            key={tool.id}
                            onClick={() => {
                              const val = tool.id.toString();
                              const next = isSelected
                                ? selected.filter((x) => x !== val)
                                : [...selected, val];
                              field.onChange(next);
                            }}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none ${isSelected
                              ? "bg-primary/10 border-primary"
                              : "bg-white hover:bg-gray-50 border-gray-200"
                              }`}
                          >
                            <input
                              type="checkbox"
                              readOnly
                              checked={isSelected}
                              className="h-4 w-4 rounded border-gray-300 text-primary pointer-events-none"
                            />
                            <Image
                              src={tool.image || "/images/placeholder.png"}
                              width={32}
                              height={32}
                              alt={tool.title}
                              className="rounded object-cover "
                            />
                            <span className="text-sm font-medium truncate">
                              {tool.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              />
              {errors.tool_ids && (
                <p className="text-xs text-red-500 mt-2 font-medium">
                  {errors.tool_ids.message}
                </p>
              )}
            </div>
          </div>

          {/* ── Image ── */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                Image <span className="text-red-500">*</span>
              </label>

              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="image_input"
                onChange={handleImageChange}
              />

              {preview ? (
                <div className="relative w-fit">
                  <Image
                    src={preview}
                    alt="Preview"
                    width={410}
                    height={230}
                    className="rounded-xl object-cover border border-gray-200"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 shadow-sm"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="image_input"
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 block cursor-pointer text-center hover:border-primary hover:bg-gray-50 transition-all group"
                >
                  <Camera className="mx-auto mb-3 text-gray-400 group-hover:text-primary transition-colors w-8 h-8" />
                  <span className="text-sm text-gray-500 font-medium group-hover:text-gray-700">
                    Click to upload image
                  </span>
                </label>
              )}

              {errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>
          </div>

          {/* ── SEO / Meta ── */}
          <div className="space-y-4 border rounded-lg p-5 bg-[#F9FAFB]">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
              SEO &amp; Meta
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Meta Title
                </label>
                <Input
                  placeholder="SEO title"
                  {...register("meta_title")}
                  className="border-gray-200"
                />
                {errors.meta_title && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.meta_title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Meta Description
                </label>
                <Input
                  placeholder="SEO description"
                  {...register("meta_description")}
                  className="border-gray-200"
                />
                {errors.meta_description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.meta_description.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Meta Tags
                </label>
                <div className="flex flex-wrap gap-2 border border-gray-200 rounded-md p-2 bg-white min-h-[42px] focus-within:ring-1 focus-within:ring-ring">
                  {metaTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeMetaTag(tag)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={metaTagInput}
                    onChange={(e) => setMetaTagInput(e.target.value)}
                    onKeyDown={handleMetaTagKeyDown}
                    onBlur={handleMetaTagBlur}
                    placeholder={metaTags.length === 0 ? "Type and press Enter or comma to add tags" : ""}
                    className="flex-1 min-w-[180px] outline-none text-sm bg-transparent placeholder:text-gray-400"
                  />
                </div>
                <input type="hidden" {...register("meta_tag")} />
                {errors.meta_tag && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.meta_tag.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Schema (JSON)
                </label>
                <Textarea
                  placeholder="{}"
                  {...register("schema")}
                  className="border-gray-200 font-mono text-xs min-h-20"
                />
                {errors.schema && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.schema.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="pt-6 flex justify-end space-x-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 bg-primary hover:bg-[#16a34a]"
            >
              {isSubmitting ? "Saving..." : freeSeminar ? "Update Seminar" : "Create Seminar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
