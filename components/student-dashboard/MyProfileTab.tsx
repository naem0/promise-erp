"use client"

import { useState, useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { StudentProfile, Education } from "@/apiServices/studentDashboardService"
import {
  getStudentProfileClient,
  updateStudentProfileClient,
} from "@/apiServices/studentDashboardService"

interface ProfileFormData {
  name: string
  phone: string
  gender: string
  date_of_birth: string
  facebook: string
  linkedin: string
  profile_image?: FileList
}

const MyProfileTab = () => {
  const { data: session, update } = useSession()
  const [isPending, startTransition] = useTransition()
  const [educations, setEducations] = useState<Array<{ id?: number; degree: string; institution: string; subject: string }>>([
    { degree: "", institution: "", subject: "" }
  ])
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [educationErrors, setEducationErrors] = useState<Record<number, { degree?: string; institution?: string; subject?: string }>>({})
  const [profileData, setProfileData] = useState<StudentProfile | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      gender: "",
      date_of_birth: "",
      facebook: "",
      linkedin: "",
    },
  })

  const formData = watch()

  useEffect(() => {
    if (!session?.accessToken) {
      return
    }

    const token = session?.accessToken

    startTransition(async () => {
      try {
        const response = await getStudentProfileClient(token)
        if (!response || !response.success || !response.data) {
          console.warn("No profile data found for the student.")
          return
        }
        
        setProfileData(response?.data)

        if (response.success && response?.data) {
          const profile: StudentProfile = response?.data
          // Set form values
          setValue("name", profile.name || "")
          setValue("phone", profile.phone || "")
          setValue("gender", profile.gender || "")
          setValue("facebook", profile.facebook || "")
          setValue("linkedin", profile.linkedin || "")
          setValue("date_of_birth", profile.date_of_birth || "")

          // Map educations from API
          if (profile.educations && profile.educations.length > 0) {
            setEducations(
              profile.educations.map((edu: Education) => ({
                id: edu.id,
                degree: edu.degree || "",
                institution: edu.institution || "",
                subject: edu.subject || "",
              }))
            )
          } else {
            // Add one empty education entry if none exists
            setEducations([{ degree: "", institution: "", subject: "" }])
          }

          setProfileImage(profile.profile_image)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        if (error instanceof Error) {
          toast.error(error.message || "Failed to fetch profile")
        }
      }
    })
  }, [session?.accessToken, setValue, startTransition])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (jpeg, jpg, png, gif, webp)")
        return
      }

      // Validate file size (5MB max)
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
    // Reset file input
    const fileInput = document.getElementById("profile_image") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const onSubmit = async (data: ProfileFormData) => {
    if (!session?.accessToken) {
      toast.error("Unauthorized: Please login again")
      return
    }

    setEducationErrors({})

    startTransition(async () => {
      try {
        // Prepare educations payload
        const educationsPayload = educations
          .filter((edu) => edu.degree || edu.institution || edu.subject)
          .map((edu) => ({
            ...(edu.id && { id: edu.id }),
            degree: edu.degree,
            institution: edu.institution,
            subject: edu.subject,
          }))

        // Use FormData for file upload
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("phone", data.phone)
        formData.append("gender", data.gender.toLowerCase())

        if (data.date_of_birth) {
          formData.append("date_of_birth", data.date_of_birth)
        }

        if (data.facebook) {
          formData.append("facebook", data.facebook)
        }

        if (data.linkedin) {
          formData.append("linkedin", data.linkedin)
        }

        if (profileImageFile) {
          formData.append("profile_image", profileImageFile)
        }

        formData.append("educations", JSON.stringify(educationsPayload))

        const token = session.accessToken
        if (!token) {
          toast.error("Unauthorized: Please login again")
          return
        }

        const response = await updateStudentProfileClient(formData, token)

        if (response?.success) {
          toast.success(response.message || "Profile updated successfully!")
          if (response.data?.profile_image) {
            const newImageUrl = response.data.profile_image
            setProfileImage(newImageUrl)
            
            // Trigger NextAuth session update
            await update({
              ...session,
              user: {
                ...session?.user,
                image: newImageUrl,
              },
              image: newImageUrl,
            })
            
            setProfileImagePreview(null)
            setProfileImageFile(null)
          }

          if (response.data) {
            const profile = response.data
            setValue("name", profile.name || "")
            setValue("phone", profile.phone || "")
            setValue("gender", profile.gender || "")
            setValue("facebook", profile.facebook || "")
            setValue("linkedin", profile.linkedin || "")

            if (profile.educations && profile.educations.length > 0) {
              setEducations(
                profile.educations.map((edu: Education) => ({
                  id: edu.id,
                  degree: edu.degree || "",
                  institution: edu.institution || "",
                  subject: edu.subject || "",
                }))
              )
            }
          }
          return
        }

      // Handle validation errors from backend
      if (response.errors) {
        toast.error(response.message || "Validation failed")

        Object.entries(response.errors).forEach(([field, messages]) => {
          const errorMessage = Array.isArray(messages) ? messages[0] : messages

          // Handle education errors (e.g., "educations.0.degree", "educations.1.institution")
          if (field.startsWith("educations.")) {
            const parts = field.split(".")
            if (parts.length === 3) {
              const index = parseInt(parts[1])
              const educationField = parts[2]
              if (!isNaN(index)) {
                setEducationErrors((prev) => ({
                  ...prev,
                  [index]: {
                    ...prev[index],
                    [educationField]: errorMessage as string,
                  },
                }))
              }
            }
          } else {
            // Handle regular form field errors
            setError(field as keyof ProfileFormData, {
              type: "server",
              message: errorMessage as string,
            })
          }
        })
        return
      }

        // Handle other errors
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
        {/* Avatar */}
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
            {profileImagePreview && (
              <button
                type="button"
                onClick={handleImageRemove}
                className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 border-2 border-white text-white hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-normal text-secondary">
                  Name
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  className={`border-gray-200 text-secondary ${errors.name ? "border-red-500" : ""
                    }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-normal text-secondary">
                  Phone
                </Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  className={`border-gray-200 text-secondary ${errors.phone ? "border-red-500" : ""
                    }`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Gender and Date of Birth */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-base font-normal text-secondary">
                  Gender
                </Label>
                <Select value={formData.gender} onValueChange={(value) => setValue("gender", value)}>
                  <SelectTrigger id="gender" className={`border-gray-200 text-secondary w-full ${errors.gender ? "border-red-500" : ""}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500 mt-1">{errors.gender.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth" className="text-base font-normal text-secondary">
                  Age
                </Label>
                <Input
                  id="date_of_birth"
                  type="text"
                  placeholder="Enter your age"
                  {...register("date_of_birth")}
                  className={`border-gray-200 text-secondary ${errors.date_of_birth ? "border-red-500" : ""}`}
                />
                {errors.date_of_birth && (
                  <p className="text-sm text-red-500 mt-1">{errors.date_of_birth.message}</p>
                )}
              </div>
            </div>

            {/* Profile Image Error */}
            {errors.profile_image && (
              <div className="text-sm text-red-500 mt-1">{errors.profile_image.message}</div>
            )}

            {/* Educational Qualification */}
            <div className="space-y-4">
              <Label className="text-base font-normal text-secondary">
                Educational Qualification
              </Label>

              {educations.map((education, index) => (
                <div key={index} className="space-y-3 p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Degree */}
                    <div className="space-y-2">
                      <Label htmlFor={`degree-${index}`} className="text-sm font-normal text-secondary">
                        Degree
                      </Label>
                      <Input
                        id={`degree-${index}`}
                        value={education.degree}
                        onChange={(e) => {
                          const updated = [...educations]
                          updated[index] = { ...updated[index], degree: e.target.value }
                          setEducations(updated)
                          // Clear error when user types
                          if (educationErrors[index]?.degree) {
                            setEducationErrors((prev) => {
                              const newErrors = { ...prev }
                              if (newErrors[index]) {
                                delete newErrors[index].degree
                                if (Object.keys(newErrors[index]).length === 0) {
                                  delete newErrors[index]
                                }
                              }
                              return newErrors
                            })
                          }
                        }}
                        placeholder="Enter your degree"
                        className={`border-gray-200 text-secondary ${educationErrors[index]?.degree ? "border-red-500" : ""
                          }`}
                      />
                      {educationErrors[index]?.degree && (
                        <p className="text-sm text-red-500 mt-1">{educationErrors[index].degree}</p>
                      )}
                    </div>

                    {/* Institute */}
                    <div className="space-y-2">
                      <Label htmlFor={`institute-${index}`} className="text-sm font-normal text-secondary">
                        Institute
                      </Label>
                      <Input
                        id={`institute-${index}`}
                        value={education.institution}
                        onChange={(e) => {
                          const updated = [...educations]
                          updated[index] = { ...updated[index], institution: e.target.value }
                          setEducations(updated)
                          // Clear error when user types
                          if (educationErrors[index]?.institution) {
                            setEducationErrors((prev) => {
                              const newErrors = { ...prev }
                              if (newErrors[index]) {
                                delete newErrors[index].institution
                                if (Object.keys(newErrors[index]).length === 0) {
                                  delete newErrors[index]
                                }
                              }
                              return newErrors
                            })
                          }
                        }}
                        placeholder="Enter your institute's name"
                        className={`border-gray-200 text-secondary ${educationErrors[index]?.institution ? "border-red-500" : ""
                          }`}
                      />
                      {educationErrors[index]?.institution && (
                        <p className="text-sm text-red-500 mt-1">{educationErrors[index].institution}</p>
                      )}
                    </div>

                    {/* Subject/Division */}
                    <div className="space-y-2">
                      <Label htmlFor={`subject-${index}`} className="text-sm font-normal text-secondary">
                        Subject/Division
                      </Label>
                      <Input
                        id={`subject-${index}`}
                        value={education.subject}
                        onChange={(e) => {
                          const updated = [...educations]
                          updated[index] = { ...updated[index], subject: e.target.value }
                          setEducations(updated)
                          // Clear error when user types
                          if (educationErrors[index]?.subject) {
                            setEducationErrors((prev) => {
                              const newErrors = { ...prev }
                              if (newErrors[index]) {
                                delete newErrors[index].subject
                                if (Object.keys(newErrors[index]).length === 0) {
                                  delete newErrors[index]
                                }
                              }
                              return newErrors
                            })
                          }
                        }}
                        placeholder="Enter your subject or division"
                        className={`border-gray-200 text-secondary ${educationErrors[index]?.subject ? "border-red-500" : ""
                          }`}
                      />
                      {educationErrors[index]?.subject && (
                        <p className="text-sm text-red-500 mt-1">{educationErrors[index].subject}</p>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  {educations.length > 1 && (
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = educations.filter((_, i) => i !== index)
                          setEducations(updated)
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {/* Add More Button */}
              {/* <div className="flex justify-end"> */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setEducations([...educations, { degree: "", institution: "", subject: "" }])
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add More
              </Button>
              {/* </div> */}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Facebook Profile Link */}
              <div className="space-y-2">
                <Label htmlFor="facebook" className="text-base font-normal text-secondary">
                  Facebook Profile Link
                </Label>
                <Input
                  id="facebook"
                  {...register("facebook")}
                  className={`border-gray-200 text-secondary ${errors.facebook ? "border-red-500" : ""
                    }`}
                />
                {errors.facebook && (
                  <p className="text-sm text-red-500 mt-1">{errors.facebook.message}</p>
                )}
              </div>

              {/* LinkedIn Profile Link */}
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-base font-normal text-secondary">
                  LinkedIn Profile Link
                </Label>
                <Input
                  id="linkedin"
                  {...register("linkedin")}
                  className={`border-gray-200 text-secondary ${errors.linkedin ? "border-red-500" : ""
                    }`}
                />
                {errors.linkedin && (
                  <p className="text-sm text-red-500 mt-1">{errors.linkedin.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <Button type="submit" className="px-6" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Information"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default MyProfileTab
