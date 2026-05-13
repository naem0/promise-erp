"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { changeUserPassword } from "@/apiServices/auth/profileService"

interface PasswordFormData {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

const PasswordTab = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const token = session?.accessToken

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
  } = useForm<PasswordFormData>({
    mode: "onTouched",
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  })
  const newPassword = watch("new_password")
  const confirmPassword = watch("new_password_confirmation")

  const onSubmit = async (data: PasswordFormData) => {

    if (!token) {
      toast.error("Unauthorized: Please login again")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await changeUserPassword(
        {
          current_password: data.current_password,
          new_password: data.new_password,
          new_password_confirmation: data.new_password_confirmation,
        },
        token
      )

      if (response?.success) {
        toast.success(response.message || "Password changed successfully!")
        reset()
        setShowCurrentPassword(false)
        setShowNewPassword(false)
        setShowConfirmPassword(false)
        await signOut({
          redirect: false,
        })
        router.refresh()
        router.push("/login")
        return
      }

      if (response.errors) {
        toast.error(response.message || "Validation failed")
        Object.entries(response.errors).forEach(([field, messages]) => {
          const errorMessage = Array.isArray(messages) ? messages[0] : messages
          let formField: keyof PasswordFormData = "current_password"
          if (field === "new_password") formField = "new_password"
          else if (field === "new_password_confirmation" || field === "password_confirmation") formField = "new_password_confirmation"
          else if (field === "current_password") formField = "current_password"

          setError(formField, {
            type: "server",
            message: errorMessage as string,
          })
        })
        return
      }

      toast.error(response.message || "Failed to change password")
    } catch (error) {
      console.error("Password change error:", error)
      if (error instanceof Error) {
        toast.error(error.message || "An error occurred while changing password")
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-gray-200 text-secondary shadow-sm py-0">
      <CardHeader className="px-8 pt-6 pb-2">
        <CardTitle className="text-xl font-semibold text-secondary">Change Password</CardTitle>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-base font-normal text-secondary">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Provide your current password"
                  {...register("current_password")}
                  className={`border-gray-200 text-secondary pr-10 ${errors.current_password ? "border-red-500" : ""
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.current_password && (
                <p className="text-sm text-red-500 mt-1">{errors.current_password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-base font-normal text-secondary">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Set a new password"
                  {...register("new_password")}
                  className={`border-gray-200 text-secondary pr-10 ${errors.new_password ? "border-red-500" : ""
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.new_password && (
                <p className="text-sm text-red-500 mt-1">{errors.new_password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-base font-normal text-secondary">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Write the new password"
                  {...register("new_password_confirmation")}
                  className={`border-gray-200 text-secondary pr-10 ${errors.new_password_confirmation ? "border-red-500" : ""
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword &&
                newPassword !== confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    Password confirmation does not match
                  </p>
                )}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" className="px-6 cursor-pointer" disabled={isSubmitting}>
                {isSubmitting ? "Changing Password..." : "Change Password"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default PasswordTab
