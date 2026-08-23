"use client";


import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { resetPassword } from "@/apiServices/auth/RegisterUser";
import { toast } from "sonner";

type ResetPasswordFormValues = {
  password: string;
  password_confirmation: string;
};

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 🔹 query params
  const resetToken = searchParams.get("login-info");
  const email = searchParams.get("email"); // optional

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  // 🔒 block page if token missing
  useEffect(() => {
    if (!resetToken) {
      toast.error("Invalid or expired reset link");
      router.replace("/login");
    }
  }, [resetToken, router]);

  const onSubmit = (values: ResetPasswordFormValues) => {
    clearErrors();

    if (!resetToken) return;

    startTransition(async () => {
      try {
        const res = await resetPassword(
          values.password,
          values.password_confirmation,
          resetToken,
        );

        if (!res.success) {
          // server errors
          if (res.errors) {
            Object.entries(res.errors).forEach(([field, message]) => {
              setError(field as keyof ResetPasswordFormValues, {
                type: "server",
                message: Array.isArray(message) ? message[0] : message,
              });
            });
          } else {
            setError("root", {
              type: "server",
              message: res.message || "Failed to reset password",
            });
          }
          return;
        }

        // ✅ SUCCESS
        reset();
        toast.success(res.message || "Password reset successfully");

        // redirect to login
        router.replace("/login");
      } catch (error: unknown) {
        setError("root", {
          type: "server",
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">
            Reset Password
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4 pb-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="Please enter new password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="Please confirm password"
                  {...register("password_confirmation")}
                />
                {errors.password_confirmation && (
                  <p className="text-sm text-red-500">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              {/* form-level error */}
              {errors.root && (
                <p className="text-sm text-red-500">{errors.root.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={isPending}
            >
              {isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
