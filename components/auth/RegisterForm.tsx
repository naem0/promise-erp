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
          router.push(
            `/login${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`,
          );
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
      <Card className="shadow-none border-0 mx-auto bg-white/80 backdrop-blur-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-primary">
            Registration
          </CardTitle>
          <CardDescription>
            Create an account to start your learning journey today
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 lg:px-12">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup className="gap-4">
              {/* Name */}
              <Field>
                <FieldLabel>Full Name *</FieldLabel>
                <Input
                  {...register("name")}
                  placeholder="Enter your name"
                  onChange={() => clearFieldError("name")}
                  className={`border-primary/40 h-12 ${errors.name ? "border-destructive" : ""}`}
                />
                <FieldError>{errors.name?.message}</FieldError>
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel>Email *</FieldLabel>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  onChange={() => clearFieldError("email")}
                  className={`border-primary/40 h-12 ${errors.email ? "border-destructive" : ""}`}
                />
                <FieldError>{errors.email?.message}</FieldError>
              </Field>

              {/* Phone */}
              <Field>
                <FieldLabel>Phone *</FieldLabel>
                <Input
                  {...register("phone")}
                  onChange={() => clearFieldError("phone")}
                  placeholder="Enter your phone number"
                  className={`border-primary/40 h-12 ${errors.phone ? "border-destructive" : ""}`}
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
                    placeholder="Enter your password"
                    onChange={() => clearFieldError("password")}
                    className={`border-primary/40 h-12 ${errors.password ? "border-destructive" : ""}`}
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
                    placeholder="Confirm your password"
                    {...register("password_confirmation")}
                    onChange={() => clearFieldError("password_confirmation")}
                    className={`border-primary/40 h-12 ${errors.password_confirmation ? "border-destructive" : ""}`}
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
              <Field className="w-fit mx-auto">
                <Button
                  type="submit"
                  className="cursor-pointer"
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
              <div className="flex flex-col gap-1 mt-2">
                <FieldDescription className="text-center font-semibold ">
                  By Sign Up, You agree to our,{" "}
                  <Link
                    href="#"
                    className="text-primary font-extrabold"
                  >
                    Terms and Conditions
                  </Link>
                </FieldDescription>

                <FieldDescription className="text-center font-bold ">
                  Already have an account?{" "}
                  <Link
                    href={`/login${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
                    className="text-primary font-extrabold "
                  >
                    Login
                  </Link>
                </FieldDescription>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
