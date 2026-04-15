'use client'

import { getHeroSectionById, updateHeroSection, HeroSection } from '@/apiServices/homePageAdminService'
import HeroSectionForm from '@/components/web-content/hero-section/HeroSectionForm'
import { useRouter } from 'next/navigation'
import { useEffect, useState, use } from 'react'
import { handleFormErrors, handleFormSuccess } from '@/lib/formErrorHandler'
import { UseFormSetError } from 'react-hook-form'
import { ApiErrorResponse } from '@/lib/apiErrorHandler'

export default function EditHeroSectionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHeroSection = async () => {
      try {
        const response = await getHeroSectionById(Number(resolvedParams.id))
        if (response?.data) {
          setHeroSection(response.data)
        } else {
          setError('Hero section not found')
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('An unexpected error occurred.')
        }
      }
    }

    fetchHeroSection()
  }, [resolvedParams.id])

  const handleSubmit = async (
    formData: FormData,
    setFormError: (field: string, message: string) => void
  ) => {
    const res = await updateHeroSection(Number(resolvedParams.id), formData)
    console.log('Update response:', res)

    if (res.success) {
      handleFormSuccess(res.message || 'Hero section updated successfully!')
      router.push('/web-content/hero-section')
    } else {
      handleFormErrors(res as ApiErrorResponse, setFormError as UseFormSetError<any>)
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-red-200 rounded-xl bg-red-50 text-red-600">
        <p className="font-semibold">Error loading hero section</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  if (!heroSection) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <HeroSectionForm title="Edit Hero Section" onSubmit={handleSubmit} heroSection={heroSection} />
}
