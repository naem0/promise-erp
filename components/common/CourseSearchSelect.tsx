'use client'

import { useEffect, useState, useTransition } from 'react'
import { Combobox } from '@/components/ui/combobox'
import { getPublicCoursesAll, Course } from '@/apiServices/courseService'

interface CourseSearchSelectProps {
  value: string
  onValueChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function CourseSearchSelect({
  value,
  onValueChange,
  placeholder = "Select course (optional)...",
  disabled = false,
  className
}: CourseSearchSelectProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getPublicCoursesAll()
        if (res.success) {
          // Flatten if multiple pages or just set if simple array
          // Backend returns { courses: Course[] } or similar structure
          setCourses(res.data.courses || [])
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error)
      }
    })
  }, [])

  const options = (courses || []).map(course => ({
    value: String(course.id),
    label: course.title
  }))

  return (
    <Combobox
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder={isPending ? "Loading courses..." : placeholder}
      searchPlaceholder="Search course..."
      emptyMessage={isPending ? "Loading..." : "No courses found"}
      disabled={disabled || isPending}
      className={className}
    />
  )
}
