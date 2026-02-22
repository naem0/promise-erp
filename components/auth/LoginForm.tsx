"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
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
  const redirectPath = searchParams.get("redirect") || "/";

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
      if (role === "super-admin") {
        router.push("/dashboard");
      } else if (role === "student") {
        router.push("/student/dashboard");
      } else if (role === "coordinator") {
        router.push("/coordinator/dashboard");
      } else {
        router.push(redirectPath);
      }
      toast.success("Logged in successfully!");
    } else {
      toast.error(res?.error || "Login failed! Please try again.");
    }
  };

  return (
    <div className="w-full">
      <Card className="max-w-[500px] shadow-xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Log in to manage your courses and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email_or_phone ">
                  Email or Phone<span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="email_or_phone"
                  type="string"
                  placeholder="Enter your email or phone"
                  {...register("email_or_phone", {
                    required: "email or  phone  is required",
                  })}
                  defaultValue={process.env.NEXT_PUBLIC_ADMIN_EMAIL}
                />
                {errors.email_or_phone && (
                  <FieldDescription className="text-red-500">
                    {errors.email_or_phone.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">
                  Password<span className="text-red-500">*</span>
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
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
                {errors.password && (
                  <FieldDescription className="text-red-500">
                    {errors.password.message}
                  </FieldDescription>
                )}
                <FieldDescription className="flex justify-end mt-1">
                  <Link
                    href="/forgot-password"
                    className="text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </FieldDescription>
              </Field>

              <Field orientation="horizontal">
                <Button
                  className="w-auto mx-auto"
                  variant="default"
                  size="default"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner /> Login...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Field>
              <FieldDescription className="px-6 text-center">
                Don’t have an account?{" "}
                <Link
                  className="text-blue-600 hover:underline"
                  href={`/register${redirectPath !== "/" ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
                >
                  Register
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
