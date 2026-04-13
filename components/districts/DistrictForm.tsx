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
import { Division, DivisionSuccessResponse, getDivisions } from "@/apiServices/divisionService";
import { District, DistrictFormData } from "@/apiServices/districtService";

interface DistrictFormProps {
  title: string;
  onSubmit: (
    formData: DistrictFormData,
    setFormError: (field: string, message: string) => void,
    resetForm: () => void
  ) => void | Promise<void>;
  district?: District;
}

interface FormValues {
  name: string;
  division_id: string;
}

export default function DistrictForm({ title, onSubmit, district }: DistrictFormProps) {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: district?.name || "",
      division_id: district?.division_id.toString() || "",
    },
  });

  const setFormError = (field: string, message: string) => {
    setError(field as keyof FormValues, { type: "server", message });
  };

  useEffect(() => {
    if (district) {
      reset({
        name: district.name,
        division_id: district.division_id.toString(),
      });
    }
  }, [district, reset]);

  useEffect(() => {
    async function loadDivisions() {
      try {
        setIsLoading(true);
        const res: DivisionSuccessResponse = await getDivisions({per_page: 999});
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

  const submitHandler = (values: FormValues) => {
    const formData: DistrictFormData = {
      name: values.name.trim(),
      division_id: Number(values.division_id),
    };
    onSubmit(formData, setFormError, () => reset());
  };

  return (
    <div className="max-w-md mx-auto bg-card border rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-center">{title}</h2>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Division</label>
          <Controller
            name="division_id"
            control={control}
            rules={{ required: "Division is required" }}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isLoading ? "Loading divisions..." : "Select Division"} />
                </SelectTrigger>
                <SelectContent>
                  {divisions?.map((division) => (
                    <SelectItem key={division.id} value={division.id.toString()}>
                      {division.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.division_id && (
            <p className="text-sm text-red-500 mt-1">{errors.division_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">District Name</label>
          <Input
            placeholder="Enter District name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full cursor-pointer"
        >
          {isSubmitting ? "Submitting..." : district ? "Update District" : "Add District"}
        </Button>
      </form>
    </div>
  );
}