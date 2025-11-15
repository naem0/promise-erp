"use client";

import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Division, getDivisions } from "@/apiServices/divisionService";
import { District, getDistricts } from "@/apiServices/districtService";
import { Branch, getBranches } from "@/apiServices/branchService";
import { Course, getCourses } from "@/apiServices/courseService";
import { Batch, getBatches } from "@/apiServices/batchService"; 
import { Checkbox } from "@/components/ui/checkbox";
import { Group, GroupFormData } from "@/apiServices/groupService";

interface GroupFormProps {
  title: string;
  onSubmit: (
    formData: GroupFormData,
    setFormError: (field: string, message: string) => void,
    resetForm: () => void
  ) => void | Promise<void>;
  group?: Group;
}

interface FormValues {
  group_name: string;
  division_id: string;
  district_id: string;
  branch_id: string;
  lm_course_id: string;
  lm_batch_id: string;
  is_active: boolean;
}

export default function GroupForm({ title, onSubmit, group }: GroupFormProps) {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      group_name: group?.group_name || "",
      division_id: group?.division_id?.toString() || "",
      district_id: group?.district_id?.toString() || "",
      branch_id: group?.branch?.id.toString() || "",
      lm_course_id: group?.course?.id.toString() || "",
      lm_batch_id: group?.batch?.id.toString() || "",
      is_active: group?.is_active || true,
    },
  });

  const setFormError = (field: string, message: string) => {
    setError(field as keyof FormValues, { type: "server", message });
  };

  const divisionId = watch("division_id");
  const districtId = watch("district_id");
  const courseId = watch("lm_course_id");

  useEffect(() => {
    if (group) {
      reset({
        group_name: group.group_name,
        division_id: group.division_id?.toString(),
        district_id: group.district_id?.toString(),
        branch_id: group.branch.id.toString(),
        lm_course_id: group.course.id.toString(),
        lm_batch_id: group.batch.id.toString(),
        is_active: group.is_active,
      });
    }
  }, [group, reset]);

  useEffect(() => {
    async function loadDivisions() {
      try {
        setIsLoading(true);
        const res = await getDivisions();
        if (res.success) {
          setDivisions(res.data?.divisions || []); 
        }
      } catch (error) {
        console.error("Error loading divisions:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadDivisions();
  }, []);

  useEffect(() => {
    async function loadDistricts() {
      if (!divisionId) return;
      try {
        const res = await getDistricts(1, { division_id: divisionId });
        if (res.success) {
          setDistricts(res.data?.districts || []);
        }
      } catch (error) {
        console.error("Error loading districts:", error);
      }
    }
    loadDistricts();
  }, [divisionId]);

  useEffect(() => {
    async function loadBranches() {
      if (!districtId) return;
      try {
        const res = await getBranches(1, { district_id: districtId });
        if (res.success) {
          setBranches(res.data?.branches || []);
        }
      } catch (error) {
        console.error("Error loading branches:", error);
      }
    }
    loadBranches();
  }, [districtId]);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await getCourses();
        if (res.success) {
          setCourses(res.data?.courses || []);
        }
      } catch (error) {
        console.error("Error loading courses:", error);
      }
    }
    loadCourses();
  }, []);

  useEffect(() => {
    async function loadBatches() {
      if (!courseId) return;
      try {
        const res = await getBatches(1, { lm_course_id: courseId });
        if (res.success) {
          setBatches(res.data?.batches || []);
        }
      } catch (error) {
        console.error("Error loading batches:", error);
      }
    }
    loadBatches();
  }, [courseId]);

  const submitHandler = (values: FormValues) => {
    const formData: GroupFormData = {
      group_name: values.group_name.trim(),
      division_id: Number(values.division_id),
      district_id: Number(values.district_id),
      branch_id: Number(values.branch_id),
      lm_course_id: Number(values.lm_course_id),
      lm_batch_id: Number(values.lm_batch_id),
      is_active: values.is_active,
    };
    onSubmit(formData, setFormError, () => reset());
  };

  return (
    <div className="max-w-md mx-auto bg-card border rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-center">{title}</h2>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
        
        <Controller
            name="division_id"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isLoading ? "Loading..." : "Select Division"} />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((division) => (
                    <SelectItem key={division.id} value={division.id.toString()}>
                      {division.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

        <Controller
            name="district_id"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
                disabled={!divisionId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.id.toString()}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

        <Controller
            name="branch_id"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
                disabled={!districtId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

        <Controller
            name="lm_course_id"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

        <Controller
            name="lm_batch_id"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
                disabled={!courseId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id.toString()}>
                      {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

        <div>
          <label className="block text-sm font-medium mb-1">Group Name</label>
          <Input
            placeholder="Enter Group name"
            {...register("group_name")}
          />
          {errors.group_name && (
            <p className="text-sm text-red-500 mt-1">{errors.group_name.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="is_active"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <label
              htmlFor="is_active"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Is Active
            </label>
          </div>

        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full cursor-pointer"
        >
          {isSubmitting ? "Submitting..." : group ? "Update Group" : "Add Group"}
        </Button>
      </form>
    </div>
  );
}