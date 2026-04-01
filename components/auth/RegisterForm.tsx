"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import Link from "next/link";
import RegisterUser from "@/apiServices/auth/RegisterUser";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

interface ApiSuccessResponse {
  success: true;
  message: string;
  data?: any;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  code?: number;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

const fieldMapping: Record<string, keyof FormData> = {
  email: "email",
  phone: "phone",
  name: "name",
  password: "password",
  password_confirmation: "password_confirmation",
};

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<FormData>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
  });


  const clearFieldError = (field: keyof FormData) => {
    if (errors[field]) clearErrors(field);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const result = (await RegisterUser(data)) as ApiResponse;

      if (result.success) {
        const role = result.data.roles[0];
        toast.success(result.message || "Registration successful!");

        const signInResult = await signIn("credentials", {
          redirect: false,
          email_or_phone: data.email,
          password: data.password,
        });
        reset();

        if (signInResult?.ok) {
          toast.success("Logged in successfully!");
          if (redirectPath) {
            router.push(redirectPath);
          } else if (role === "student") {
            router.push("/student/dashboard");
          } else {
            router.push("/dashboard");
          }
        } else {
          router.push(`/login${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`);
        }

        return;
      }

      if (result.code === 422 && result.errors) {
        toast.error(result.message || "Validation failed");

        Object.entries(result.errors).forEach(([field, messages]) => {
          const mappedField = fieldMapping[field] || (field as keyof FormData);

          if (mappedField && messages && messages.length > 0) {
            setError(mappedField, {
              type: "server",
              message: Array.isArray(messages) ? messages[0] : messages,
            });
          }
        });
        return;
      }

      toast.error(result.message || "Registration failed");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Something went wrong. Please try again.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="max-w-[500px] shadow-xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Registration</CardTitle>
          <CardDescription>
            Create an account to start your learning journey today
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              {/* Name */}
              <Field>
                <FieldLabel>Full Name *</FieldLabel>
                <Input
                  {...register("name")}
                  onChange={() => clearFieldError("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                <FieldError>{errors.name?.message}</FieldError>
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel>Email *</FieldLabel>
                <Input
                  type="email"
                  {...register("email")}
                  onChange={() => clearFieldError("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                <FieldError>{errors.email?.message}</FieldError>
              </Field>

              {/* Phone */}
              <Field>
                <FieldLabel>Phone *</FieldLabel>
                <Input
                  {...register("phone")}
                  onChange={() => clearFieldError("phone")}
                  className={errors.phone ? "border-destructive" : ""}
                />
                <FieldError>{errors.phone?.message}</FieldError>
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel>Password *</FieldLabel>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    onChange={() => clearFieldError("password")}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <FieldError>{errors.password?.message}</FieldError>
              </Field>

              {/* Confirm Password */}
              <Field>
                <FieldLabel>Confirm Password *</FieldLabel>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("password_confirmation")}
                    onChange={() => clearFieldError("password_confirmation")}
                    className={errors.password_confirmation ? "border-destructive" : ""}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <FieldError>{errors.password_confirmation?.message}</FieldError>
              </Field>

              {/* Submit */}
              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex gap-2 items-center">
                      <Spinner /> Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link
                  href={`/login${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
                  className="text-blue-600 hover:underline"
                >
                  Login
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
