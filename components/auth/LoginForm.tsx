"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import Link from "next/link";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { getSession } from "next-auth/react";

export interface FormData {
  email_or_phone: string;
  password: string;
}

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ mode: "onTouched" });

  const onSubmit = async (data: FormData) => {
    const res = await signIn("credentials", {
      redirect: false,
      email_or_phone: data.email_or_phone,
      password: data.password,
    });

    if (res?.ok) {
      const updatedSession = await getSession();
      const role = updatedSession?.user?.roles?.[0];
      if (redirectPath) {
        router.push(redirectPath);
      } else if (role === "student") {
        router.push("/student/dashboard");
      } else {
        router.push("/dashboard");
      }
      toast.success("Logged in successfully!");
    } else {
      toast.error(res?.error || "Login failed! Please try again.");
    }
  };

  return (
    <div className="w-full">
      <Card className="shadow-none border-0 mx-auto bg-white/80 backdrop-blur-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-primary">Login</CardTitle>
          <CardDescription>
            Log in to manage your courses and progress
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 lg:px-12">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel>
                  Email or Phone *
                </FieldLabel>
                <Input
                  id="email_or_phone"
                  type="string"
                  placeholder="Enter your email or phone"
                  {...register("email_or_phone", {
                    required: "email or phone is required",
                  })}
                  defaultValue={process.env.NEXT_PUBLIC_ADMIN_EMAIL}
                  className={`border-primary/40 h-12 ${errors.email_or_phone ? "border-destructive" : ""}`}
                />
                {errors.email_or_phone && (
                  <FieldError>{errors.email_or_phone.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>
                  Password *
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    defaultValue={process.env.NEXT_PUBLIC_ADMIN_PASSWORD}
                    className={`border-primary/40 h-12 ${errors.password ? "border-destructive" : ""}`}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
                {errors.password && (
                  <FieldError>{errors.password.message}</FieldError>
                )}
                <FieldDescription className="flex justify-end mt-1">
                  <Link
                    href="/forgot-password"
                    className="text-primary font-bold hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </FieldDescription>
              </Field>

              <Field className="w-fit mx-auto">
                <Button
                  className="cursor-pointer"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex gap-2 items-center">
                      <Spinner /> Login...
                    </span>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Field>
              <div className="flex flex-col gap-1 mt-2">
                <FieldDescription className="text-center font-bold">
                  Don’t have an account?{" "}
                  <Link
                    className="text-primary font-extrabold"
                    href={`/register${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
                  >
                    Register
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

export default LoginForm;
