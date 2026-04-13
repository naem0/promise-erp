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
  Student,
  createStudent,
  updateStudent,
} from "@/apiServices/studentService";
import { Branch } from "@/apiServices/branchService";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Camera,
  Hash,
  Calendar as CalendarIcon,
  X,
  User,
} from "lucide-react";

interface StudentFormProps {
  title: string;
  student?: Student;
  branches?: Branch[];
}

interface FormValues {
  name: string;
  email: string;
  phone: string;
  alternate_phone: string;
  blood_group: string;
  nid_no: string;
  date_of_birth: string;
  present_address: string;
  occupation: string;
  father_name: string;
  father_occupation: string;
  father_phone: string;
  branch_id: string;
  profile_image?: FileList;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function StudentForm({
  title,
  student,
  branches = [],
}: StudentFormProps) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  const branchId = student?.branches
    ? (branches.find((b) => b.name === student.branches)?.id?.toString() ?? "")
    : "";

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: student?.name || "",
      email: student?.email || "",
      phone: student?.phone || "",
      alternate_phone: student?.alternate_phone || "",
      blood_group: student?.blood_group || "",
      nid_no: student?.nid_no || "",
      date_of_birth: student?.date_of_birth || "",
      present_address: student?.present_address || "",
      occupation: student?.occupation || "",
      father_name: student?.father_name || "",
      father_occupation: student?.father_occupation || "",
      father_phone: student?.father_phone || "",
      branch_id: branchId,
      profile_image: undefined,
    },
  });

   /* ===== Image handlers ===== */
   useEffect(() => {
    if (student?.profile_image) {
      setPreview(student.profile_image);
    }
  }, [student]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setIsImageRemoved(false);
  };

   const handleRemoveImage = () => {
    setPreview(null);
    setIsImageRemoved(true);
    setValue("profile_image", undefined);

    const input = document.getElementById(
      "profile_image_input"
    ) as HTMLInputElement;
    if (input) input.value = "";

    toast.success("Image removed");
  };

  const submitHandler = async (values: FormValues) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === "profile_image") {
        if (value?.[0]) {
          formData.append("profile_image", value[0]);
        } else if (isImageRemoved && student) {
          formData.append("profile_image", "");
        }
      } else if (value !== undefined && value !== "") {
        formData.append(key, String(value));
      }
    });

    try {

      const res = student
        ? await updateStudent(student.id, formData)
        : await createStudent(formData);

      if (res.success) {
        toast.success(res.message || "Student saved successfully!");
        reset();
        router.push("/lms/students");
        setPreview(null);
        return;
      }

      if (res.errors) {
        Object.entries(res.errors).forEach(([field, messages]) => {
          setError(field as keyof FormValues, {
            type: "server",
            message: messages[0],
          });
        });
      } 
      toast.error(res.message || "Failed to save student");
    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

  return (
    <div className="mx-auto w-full space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2 text-[#2A334E]">
        <button
          onClick={() => router.back()}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-8">
          {/* Top Section: Avatar and Info Cards */}
          <div className="flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0">
            {/* Profile Image Upload */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-[#E5E7EB] flex items-center justify-center overflow-hidden border-2 border-transparent">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Profile preview"
                    fill
                    className="object-scale-down rounded-full"
                  />
                ) : (
                  <div className="text-secondary">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full cursor-pointer border-2 border-white shadow-sm hover:bg-[#16a34a] transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input
                  id="profile_image_input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("profile_image")}
                  onChange={(e) => {
                    register("profile_image").onChange(e);
                    handleImageChange(e);
                  }}
                />
              </label>
              {preview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute cursor-pointer top-1 right-0 bg-red-500 p-1 rounded-full border-2 border-white text-white hover:bg-red-600 transition-colors shadow-sm"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Info Cards */}
            <div className="flex space-x-4 w-full md:w-auto">
              <div className="bg-[#F9FAFB] border rounded-lg p-3 flex items-center space-x-3 min-w-[140px]">
                <div className="bg-primary p-1.5 rounded-md">
                  <Hash className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-none">
                    Serial No
                  </p>
                  <p className="text-primary font-bold text-lg leading-tight">
                    {student?.id || "---"}
                  </p>
                </div>
              </div>
              <div className="bg-[#F9FAFB] border rounded-lg p-3 flex items-center space-x-3 min-w-[140px]">
                <div className="bg-primary p-1.5 rounded-md">
                  <CalendarIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-none">
                    Date
                  </p>
                  <p className="text-primary font-bold text-lg leading-tight">
                    {student?.created_at || "---"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-6">
            <div className="border-b pb-2">
              <h3 className="text-lg font-bold text-[#2A334E]">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Enter student full name"
                  {...register("name")}
                  className=" border-gray-200"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Phone Number <span className="text-red-500">*</span>{" "}
                </label>
                <Input
                  placeholder="e.g. 01XXXXXXXXX"
                  {...register("phone")}
                  className="border-gray-200"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Email Address <span className="text-red-500">*</span>{" "}
                </label>
                <Input
                  type="email"
                  placeholder="example@mail.com"
                  {...register("email")}
                  className=" border-gray-200"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Occupation{" "}
                </label>
                <Input
                  placeholder="Student, Engineer, etc."
                  {...register("occupation")}
                  className=" border-gray-200"
                />
                {errors.occupation && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.occupation.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  NID{" "}
                </label>
                <Input
                  placeholder="Enter NID number"
                  {...register("nid_no")}
                  className=" border-gray-200"
                />
                {errors.nid_no && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.nid_no.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Date of Birth{" "}
                </label>
                <Input
                  type="date"
                  placeholder="dd/mm/yyyy"
                  {...register("date_of_birth")}
                  className=" border-gray-200"
                />
                {errors.date_of_birth && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.date_of_birth.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Address{" "}
                </label>
                <Textarea
                  placeholder="Enter present address"
                  {...register("present_address")}
                  className=" border-gray-200 min-h-[100px]"
                />
                {errors.present_address && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.present_address.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Blood Group{" "}
                </label>
                <Controller
                  name="blood_group"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full border-gray-200">
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_GROUPS.map((bg) => (
                          <SelectItem key={bg} value={bg}>
                            {bg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.blood_group && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.blood_group.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Alternative Contact *
                </label>
                <Input
                  placeholder="Alternative phone number"
                  {...register("alternate_phone")}
                  className=" border-gray-200"
                />
                {errors.alternate_phone && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.alternate_phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Branch{" "}
                </label>
                <Controller
                  name="branch_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className=" border-gray-200 w-full">
                        <SelectValue placeholder="Select a branch" />
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
            </div>
          </div>

          {/* Guardian's Information */}
          <div className="space-y-6">
            <div className="border-b pb-2">
              <h3 className="text-lg font-bold text-[#2A334E]">
                Guardian&apos;s Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Name{" "}
                </label>
                <Input
                  placeholder="Enter guardian name"
                  {...register("father_name")}
                  className="border-gray-200"
                />
                {errors.father_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.father_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Phone Number{" "}
                </label>
                <Input
                  placeholder="Guardian phone number"
                  {...register("father_phone")}
                  className=" border-gray-200"
                />
                {errors.father_phone && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.father_phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Occupation{" "}
                </label>
                <Input
                  placeholder="Guardian occupation"
                  {...register("father_occupation")}
                  className=" border-gray-200"
                />
                {errors.father_occupation && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.father_occupation.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : student
                  ? "Update Student"
                  : "Add Student"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
