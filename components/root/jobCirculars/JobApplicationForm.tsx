"use client";


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { applyJobApplicationForWeb } from "@/apiServices/jobCircularPublicService";

interface JobApplicationFormProps {
  careerId: number;
}

type FormValues = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  cover_letter?: string;
  resume: FileList;
};

const JobApplicationForm = ({ careerId }: JobApplicationFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const resumeFile = watch("resume");

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();

      formData.append("career_id", careerId.toString());
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("address", data.address || "");
      formData.append("cover_letter", data.cover_letter || "");
      formData.append("resume", data.resume[0]);

      const response = await applyJobApplicationForWeb(formData);

      if (response.success) {
        toast.success(response.message);
        reset();
      } else if (response.errors) {
        toast.error(response.message);

        Object.entries(response.errors).forEach(([key, value]) => {
          setError(key as keyof FormValues, {
            type: "server",
            message: value[0],
          });
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleRemoveFile = () => {
    reset({ resume: undefined });
  };

  return (
    <div className="space-y-4">
      <Card className="py-0 gap-4">
        <CardHeader className="bg-linear-to-r to-[#009F41] from-0% via-[#1C833E] via-40% from-[#0B5B28] to-100% border-none shadow-lg rounded-tl-xl rounded-tr-xl text-white text-center px-4 py-8">
          <CardTitle className="text-2xl font-bold text-white">
            Get Hired
          </CardTitle>
          <CardDescription className="text-white">
            Apply today to join Bangladesh {"'"}s biggest IT Training Institute!
          </CardDescription>
        </CardHeader>

        <CardContent className="p-3 lg:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Your Name*</Label>
              <Input {...register("name")} placeholder="Enter your full name" />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Your Email*</Label>
              <Input
                type="email"
                {...register("email")}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Phone Number*</Label>
              <Input {...register("phone")} placeholder="+880 1XXXXXXXXX" />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Present Address</Label>
              <Input
                {...register("address")}
                placeholder="Your current address"
              />
            </div>

            {/* Cover Letter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Cover Letter</Label>
              <Textarea
                {...register("cover_letter")}
                placeholder="Tell us why you're the perfect fit"
                rows={4}
              />
            </div>

            {/* Resume Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Upload CV/Resume*</Label>

              <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-secondary/50 transition-colors cursor-pointer bg-muted/30 relative">
                {!resumeFile || resumeFile.length === 0 ? (
                  <>
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-sm font-medium text-green-600">
                      {resumeFile[0].name}
                    </p>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  {...register("resume")}
                  className="absolute w-full h-full opacity-0 top-0 left-0 cursor-pointer"
                />
              </div>

              {errors.resume && (
                <p className="text-red-500 text-xs">{errors.resume.message}</p>
              )}
            </div>

            <Button
              className="w-full shadow-lg hover:shadow-xl"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By applying, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        </CardContent>
      </Card>

      {/* <Card className="bg-linear-to-r to-[#009F41] from-0% via-[#1C833E] via-40% from-[#0B5B28] to-100% border-none shadow-lg rounded-tl-xl">
        <CardContent className="p-6 text-center">
          <p className="text-white mb-3 font-medium">
            Know someone perfect for this role?
          </p>

          <Button
            variant="outline"
            className="bg-white w-full shadow-lg hover:shadow-xl"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share This Job
          </Button>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default JobApplicationForm;
