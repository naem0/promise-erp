'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import CourseAddForm from './CourseAddForm';
import ChapterLessonAddForm from './ChapterLessonAddForm';
import FAQSelection from './FAQSelection';
import FacilitiesSelection from './FacilitiesSelection';
import CourseLearningsAddForm from './CourseLearningsAddForm';
import CourseToolsAddForm from './CourseToolsAddForm';
import WhoCanJoinSelection from './WhoCanJoinSelection';

import { getCourseById, Course } from '@/apiServices/courseService';
import { ArrowLeft } from 'lucide-react';

interface CourseEditWizardProps {
  courseId: string;
}

export default function CourseEditWizard({ courseId }: CourseEditWizardProps) {
  const router = useRouter();
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing course
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseById(courseId);
        if (res.success && res.data) {
          setCourseData(res.data);
        } else {
          setError(res.message || 'Course not found');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);


  if (loading) return <div>Loading course data...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!courseData) return <div>No course data found.</div>;

  // We default to opening all sections
  const defaultOpenSections = [
    'course-details',
    'chapters',
    'faqs',
    'facilities',
    'learnings',
    'tools',
    'who-can-join'
  ];

  return (
    <Card className="mx-auto w-full border-none shadow-none">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Edit Course</h2>
        <Button variant="outline" className='border-primary' onClick={() => router.push('/lms/courses')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
      </div>

      <CardContent className="p-0">
        <Accordion type="multiple" defaultValue={defaultOpenSections} className="w-full space-y-4">

          {/* Section 1: Course Details */}
          <AccordionItem value="course-details" className="border rounded-lg px-4">
            <AccordionTrigger className="text-xl font-semibold">1. Course Details</AccordionTrigger>
            <AccordionContent className="pt-4">
              <CourseAddForm
                title="Edit Course Details"
                initialData={courseData}
                onSuccess={async () => {
                  const res = await getCourseById(courseId);
                  if (res.success && res.data) {
                    setCourseData(res.data);
                  }
                }}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Section 2: Chapters & Lessons */}
          <AccordionItem value="chapters" className="border rounded-lg px-4">
            <AccordionTrigger className="text-xl font-semibold">2. Chapters & Lessons</AccordionTrigger>
            <AccordionContent className="pt-4">
              <ChapterLessonAddForm
                courseId={Number(courseId)}
                onSuccess={() => { }}
                isEdit={true}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Section 3: FAQs */}
          <AccordionItem value="faqs" className="border rounded-lg px-4">
            <AccordionTrigger className="text-xl font-semibold">3. FAQs</AccordionTrigger>
            <AccordionContent className="pt-4">
              <FAQSelection
                courseId={Number(courseId)}
                onSuccess={() => { }}
                isEdit
              />
            </AccordionContent>
          </AccordionItem>

          {/* Section 4: Facilities */}
          <AccordionItem value="facilities" className="border rounded-lg px-4">
            <AccordionTrigger className="text-xl font-semibold">4. Facilities</AccordionTrigger>
            <AccordionContent className="pt-4">
              <FacilitiesSelection
                courseId={Number(courseId)}
                onSuccess={() => { }}
                isEdit
              />
            </AccordionContent>
          </AccordionItem>

          {/* Section 5: Course Learnings */}
          <AccordionItem value="learnings" className="border rounded-lg px-4">
            <AccordionTrigger className="text-xl font-semibold">5. Course Learnings</AccordionTrigger>
            <AccordionContent className="pt-4">
              <CourseLearningsAddForm
                courseId={Number(courseId)}
                title="Course Learnings"
                onSuccess={() => { }}
                isEdit
              />
            </AccordionContent>
          </AccordionItem>

          {/* Section 6: Course Tools */}
          <AccordionItem value="tools" className="border rounded-lg px-4">
            <AccordionTrigger className="text-xl font-semibold">6. Course Tools</AccordionTrigger>
            <AccordionContent className="pt-4">
              <CourseToolsAddForm
                courseId={Number(courseId)}
                onSuccess={() => { }}
                isEdit
              />
            </AccordionContent>
          </AccordionItem>

          {/* Section 7: Who Can Join */}
          <AccordionItem value="who-can-join" className="border rounded-lg px-4">
            <AccordionTrigger className="text-xl font-semibold">7. Who Can Join</AccordionTrigger>
            <AccordionContent className="pt-4">
              <WhoCanJoinSelection
                courseId={Number(courseId)}
                onSuccess={() => { }}
                isEdit
              />
            </AccordionContent>
          </AccordionItem>

        </Accordion>

        <div className="mt-8 flex justify-end">
          <Button size="lg" onClick={() => router.push('/lms/courses')}>
            Finish Editing
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
