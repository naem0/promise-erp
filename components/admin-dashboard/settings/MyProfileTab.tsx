"use client"

import { useState, useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, X } from "lucide-react"
import { toast } from "sonner"
import { getUserProfile, updateUserProfile, type UserProfile } from "@/apiServices/auth/profileService"
import { useAppDispatch } from "@/store/hooks"
import { setProfileImage as setReduxProfileImage } from "@/store/slices/userSlice"

interface ProfileFormData {
  name: string
  email: string
  phone: string
  gender: string
  date_of_birth: string
  blood_group: string
  nid: string
  address: string
  experience: string
  note: string
  profile_image?: FileList
}

const MyProfileTab = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isPending, startTransition] = useTransition()
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [profileData, setProfileData] = useState<UserProfile | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: "",
      date_of_birth: "",
      blood_group: "",
      nid: "",
      address: "",
      experience: "",
      note: "",
    },
  })

  const formData = watch()

  useEffect(() => {
    if (!session?.accessToken) return

    const token = session.accessToken

    startTransition(async () => {
      try {
        const response = await getUserProfile(token)
        if (!response || !response.success || !response.data) {
          console.warn("No profile data found.")
          return
        }

        const profile = response.data
        setProfileData(profile)

        // Set form values
        setValue("name", profile.name || "")
        setValue("email", profile.email || "")
        setValue("phone", profile.phone || "")
        setValue("gender", profile.gender || "")
        setValue("date_of_birth", profile.date_of_birth || "")
        setValue("blood_group", profile.blood_group || "")
        setValue("nid", profile.nid || "")
        setValue("address", profile.address || "")
        setValue("experience", profile.experience || "")
        setValue("note", profile.note || "")

        setProfileImage(profile?.profile_image || null)
      } catch (error) {
        console.error("Error fetching profile:", error)
        if (error instanceof Error) {
          toast.error(error.message || "Failed to fetch profile")
        }
      }
    })
  }, [session?.accessToken, setValue])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (jpeg, jpg, png, gif, webp)")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB")
        return
      }

      setProfileImageFile(file)
      setProfileImagePreview(URL.createObjectURL(file))
    }
  }

  const handleImageRemove = () => {
    setProfileImageFile(null)
    setProfileImagePreview(null)
    setProfileImage(null)
    const fileInput = document.getElementById("profile_image") as HTMLInputElement
    if (fileInput) fileInput.value = ""
    toast.success("Profile image removed. Click 'Update Information' to save changes.")
  }

  const onSubmit = async (data: ProfileFormData) => {
    if (!session?.accessToken) {
      toast.error("Unauthorized: Please login again")
      return
    }

    startTransition(async () => {
      try {
        const formDataPayload = new FormData()
        formDataPayload.append("name", data.name)
        formDataPayload.append("email", data.email)
        formDataPayload.append("phone", data.phone)
        if (data.gender) formDataPayload.append("gender", data.gender)
        if (data.date_of_birth) formDataPayload.append("date_of_birth", data.date_of_birth)
        if (data.blood_group) formDataPayload.append("blood_group", data.blood_group)
        if (data.nid) formDataPayload.append("nid", data.nid)
        if (data.address) formDataPayload.append("address", data.address)
        if (data.experience) formDataPayload.append("experience", data.experience)
        if (data.note) formDataPayload.append("note", data.note)

        if (profileImageFile) {
          formDataPayload.append("profile_image", profileImageFile)
        } else if (profileImage === null) {
          // If profileImage was explicitly set to null (removed), we might need to tell the backend
          // Depending on API, we might send an empty string or a specific flag
          formDataPayload.append("profile_image", "")
        }

        const response = await updateUserProfile(formDataPayload, session.accessToken)

        if (response?.success) {
          toast.success(response.message || "Profile updated successfully!")
          if (response.data?.profile_image) {
            const newImageUrl = response.data.profile_image
            setProfileImage(newImageUrl)
            dispatch(setReduxProfileImage(newImageUrl))
            setProfileImagePreview(null)
            setProfileImageFile(null)
          }

          if (response.data) {
            const profile = response.data
            setValue("name", profile.name || "")
            setValue("email", profile.email || "")
            setValue("phone", profile.phone || "")
            setValue("gender", profile.gender || "")
            setValue("date_of_birth", profile.date_of_birth || "")
            setValue("blood_group", profile.blood_group || "")
            setValue("nid", profile.nid || "")
            setValue("address", profile.address || "")
            setValue("experience", profile.experience || "")
            setValue("note", profile.note || "")
          }
          
          setTimeout(() => {
            router.push("/dashboard")
          }, 1500)
          return
        }

        if (response.errors) {
          toast.error(response.message || "Validation failed")
          Object.entries(response.errors).forEach(([field, messages]) => {
            const errorMessage = Array.isArray(messages) ? messages[0] : messages
            setError(field as keyof ProfileFormData, {
              type: "server",
              message: errorMessage as string,
            })
          })
          return
        }

        toast.error(response.message || "Failed to update profile")
      } catch (error) {
        console.error("Profile update error:", error)
        if (error instanceof Error) {
          toast.error(error.message || "An error occurred while updating profile")
        } else {
          toast.error("An unexpected error occurred")
        }
      }
    })
  }

  return (
    <Card className="border-gray-200 text-secondary shadow-sm py-0">
      <CardContent className="p-8">
        <div className="mb-6 flex justify-start">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={profileImagePreview || profileImage || "/placeholder.svg?height=96&width=96"}
                alt="Profile"
              />
              <AvatarFallback className="bg-secondary/20 text-xl text-white">
                {formData.name
                  ? formData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="profile_image"
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-green-600 border-2 border-white cursor-pointer hover:bg-green-700 transition-colors"
            >
              <Camera className="h-4 w-4 text-white" />
              <input
                id="profile_image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                className="hidden"
                {...register("profile_image")}
                onChange={handleImageChange}
              />
            </label>
            {(profileImagePreview || profileImage) && (
              <button
                type="button"
                onClick={handleImageRemove}
                className="cursor-pointer absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 border-2 border-white text-white hover:bg-red-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-normal text-secondary">Name</Label>
              <Input
                id="name"
                {...register("name")}
                className={`border-gray-200 text-secondary ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-normal text-secondary">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={`border-gray-200 text-secondary ${errors.email ? "border-red-500" : ""}`}
                  readOnly
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-normal text-secondary">Phone</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  className={`border-gray-200 text-secondary ${errors.phone ? "border-red-500" : ""}`}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-base font-normal text-secondary">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setValue("gender", value)}>
                  <SelectTrigger id="gender" className={`border-gray-200 text-secondary w-full ${errors.gender ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-sm text-red-500 mt-1">{errors.gender.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth" className="text-base font-normal text-secondary">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  {...register("date_of_birth")}
                  className={`border-gray-200 text-secondary ${errors.date_of_birth ? "border-red-500" : ""}`}
                />
                {errors.date_of_birth && <p className="text-sm text-red-500 mt-1">{errors.date_of_birth.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="blood_group" className="text-base font-normal text-secondary">Blood Group</Label>
                <Select value={formData.blood_group} onValueChange={(value) => setValue("blood_group", value)}>
                  <SelectTrigger id="blood_group" className={`border-gray-200 text-secondary w-full ${errors.blood_group ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
                {errors.blood_group && <p className="text-sm text-red-500 mt-1">{errors.blood_group.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nid" className="text-base font-normal text-secondary">NID</Label>
                <Input
                  id="nid"
                  {...register("nid")}
                  className={`border-gray-200 text-secondary ${errors.nid ? "border-red-500" : ""}`}
                />
                {errors.nid && <p className="text-sm text-red-500 mt-1">{errors.nid.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-base font-normal text-secondary">Address</Label>
              <Input
                id="address"
                {...register("address")}
                className={`border-gray-200 text-secondary ${errors.address ? "border-red-500" : ""}`}
              />
              {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-base font-normal text-secondary">Experience</Label>
              <Textarea
                id="experience"
                {...register("experience")}
                className={`border-gray-200 text-secondary ${errors.experience ? "border-red-500" : ""}`}
              />
              {errors.experience && <p className="text-sm text-red-500 mt-1">{errors.experience.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="note" className="text-base font-normal text-secondary">Note</Label>
              <Textarea
                id="note"
                {...register("note")}
                className={`border-gray-200 text-secondary ${errors.note ? "border-red-500" : ""}`}
              />
              {errors.note && <p className="text-sm text-red-500 mt-1">{errors.note.message}</p>}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" className="px-6 cursor-pointer" disabled={isSubmitting || isPending}>
                {isSubmitting || isPending ? "Updating..." : "Update Information"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default MyProfileTab
