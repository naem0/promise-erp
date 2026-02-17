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
import { getBranches, Branch } from "@/apiServices/branchService";
import { getCategories, Category } from "@/apiServices/categoryService";
import { getTeachers, Teacher } from "@/apiServices/teacherService";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, Camera } from "lucide-react";
import RichTextEditor from "@/components/lms/courses/RichTextEditor";

interface FreeSeminarFormProps {
  title: string;
  freeSeminar?: FreeSeminar;
}

interface FormValues {
  title: string;
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
  const [preview, setPreview] = useState<string | null>( freeSeminar?.image || null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: freeSeminar?.title || "",
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
    },
  });

  const watchedBranchId = watch("branch_id");
  const watchedSeminarType = watch("seminar_type");

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
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setValue("image", undefined);
    const input = document.getElementById("image_input") as HTMLInputElement;
    if (input) input.value = "";
    toast.success("Image removed");
  };

  const submitHandler = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
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
    formData.append("image", values.image?.[0] || "");

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
        return;
      }

      if (res.errors) {
        Object.entries(res.errors).forEach(([field, messages]) => {
          setError(field as keyof FormValues, {
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
                        {branches.map((b) => (
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
            </div>
          </div>

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
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Detailed Description <span className="text-red-500">*</span>
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
                      {fetchedTeachers.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center space-x-3 p-2 rounded-md bg-white border hover:border-primary transition-colors cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            id={`t-${t.id}`}
                            checked={selected.includes(t.id.toString())}
                            onChange={(e) => {
                              const val = t.id.toString();
                              const next = e.target.checked ? [...selected, val] : selected.filter((x) => x !== val);
                              field.onChange(next);
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary cursor-pointer"
                          />
                          <label
                            htmlFor={`t-${t.id}`}
                            className="text-sm font-medium cursor-pointer group-hover:text-primary transition-colors"
                          >
                            {t.name}
                          </label>
                        </div>
                      ))}
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

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                Image
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
