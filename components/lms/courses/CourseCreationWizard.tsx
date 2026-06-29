"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

import CourseAddForm from "./CourseAddForm";
import ChapterLessonAddForm from "./ChapterLessonAddForm";
import FAQSelection from "./FAQSelection";
import FacilitiesSelection from "./FacilitiesSelection";
import CourseLearningsAddForm from "./CourseLearningsAddForm";
import CourseToolsAddForm from "./CourseToolsAddForm";
import WhoCanJoinSelection from "./WhoCanJoinSelection";

import { Button } from "@/components/ui/button";

interface StepHeaderProps {
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

function StepHeader({ number, title, isActive, isCompleted }: StepHeaderProps) {
  const circleClass = isCompleted
    ? "bg-green-500 text-white border-green-500"
    : isActive
      ? "bg-primary text-primary-foreground border-primary"
      : "bg-background text-muted-foreground border-muted";

  const textColor =
    isActive || isCompleted ? "text-foreground" : "text-muted-foreground";

  return (
    <div className="flex items-center space-x-4 mb-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${circleClass}`}
      >
        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : number}
      </div>
      <h3 className={`text-lg font-medium ${textColor}`}>{title}</h3>
    </div>
  );
}

export default function CourseCreationWizard() {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [courseId, setCourseId] = useState<number | null>(null);

  const goNext = () => setStep((prev) => prev + 1);

  useEffect(() => {
    if (step === 8) {
      const timer = setTimeout(() => router.push("/lms/courses"), 1500);
      return () => clearTimeout(timer);
    }
  }, [step, router]);

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-2xl">
          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="cursor-pointer me-3"
          >
            <span className="text-sm">Go Back</span>
          </Button>
          Create Course
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* STEP 1 */}
        <StepHeader number={1} title="Course" isActive={step === 1} isCompleted={step > 1} />
        {step === 1 && (
          <div className="mt-4">
            <CourseAddForm title="Create Course" setCourseId={setCourseId} goNext={goNext} />
          </div>
        )}
        <Separator className="my-6" />

        {/* STEP 2 */}
        <StepHeader number={2} title="Chapters & Lessons" isActive={step === 2} isCompleted={step > 2} />
        {step === 2 && courseId ? (
          <div className="mt-4">
            <ChapterLessonAddForm courseId={courseId} onSuccess={goNext} />
          </div>
        ) : step === 2 ? <p>Loading step 2...</p> : null}
        <Separator className="my-6" />

        {/* STEP 3 */}
        <StepHeader number={3} title="FAQs" isActive={step === 3} isCompleted={step > 3} />
        {step === 3 && courseId ? (
          <div className="mt-4">
            <FAQSelection courseId={courseId} onSuccess={goNext} />
          </div>
        ) : step === 3 ? <p>Loading step 3...</p> : null}
        <Separator className="my-6" />

        {/* STEP 4 */}
        <StepHeader number={4} title="Facilities" isActive={step === 4} isCompleted={step > 4} />
        {step === 4 && courseId ? (
          <div className="mt-4">
            <FacilitiesSelection courseId={courseId} onSuccess={goNext} />
          </div>
        ) : step === 4 ? <p>Loading step 4...</p> : null}
        <Separator className="my-6" />

        {/* STEP 5 */}
        <StepHeader number={5} title="Course Learnings" isActive={step === 5} isCompleted={step > 5} />
        {step === 5 && courseId ? (
          <div className="mt-4">
            <CourseLearningsAddForm
              courseId={courseId}
              title="Course Learnings"
              onSuccess={goNext}
            />
          </div>
        ) : step === 5 ? <p>Loading step 5...</p> : null}
        <Separator className="my-6" />

        {/* STEP 6 */}
        <StepHeader number={6} title="Course Tools" isActive={step === 6} isCompleted={step > 6} />
        {step === 6 && courseId ? (
          <div className="mt-4">
            <CourseToolsAddForm courseId={courseId} onSuccess={goNext} />
          </div>
        ) : step === 6 ? <p>Loading step 7...</p> : null}
        <Separator className="my-6" />
        {/* STEP 7 */}
        <StepHeader number={7} title="Who Can Join" isActive={step === 7} isCompleted={step > 7} />
        {step === 7 && courseId ? (
          <div className="mt-4">
            <WhoCanJoinSelection courseId={courseId} onSuccess={goNext} />
          </div>
        ) : step === 7 ? <p>Loading step 7...</p> : null}
        <Separator className="my-6" />

        {/* STEP 8 — COMPLETE */}
        <StepHeader number={8} title="Complete" isActive={step === 8} isCompleted={step > 7} />
        {step === 8 && (
          <div className="mt-4 text-green-600 font-semibold">
            Course creation completed successfully! Redirecting...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
