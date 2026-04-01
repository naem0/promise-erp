'use client'

import React, { useEffect, useState } from 'react'
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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true)
      try {
        const res = await getPublicCoursesAll()
        if (res.success) {
          // Flatten if multiple pages or just set if simple array
          // Backend returns { courses: Course[] } or similar structure
          setCourses(res.data.courses || [])
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
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
      placeholder={loading ? "Loading courses..." : placeholder}
      searchPlaceholder="Search course..."
      emptyMessage={loading ? "Loading..." : "No courses found"}
      disabled={disabled || loading}
      className={className}
    />
  )
}
