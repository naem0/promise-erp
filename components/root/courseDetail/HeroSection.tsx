import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  PlayCircle,
  Clock,
  Users,
  HeadphonesIcon,
  Inbox,
  GraduationCap,
  Play,
} from "lucide-react";
import { CourseDetail } from "@/apiServices/courseDetailPublicService";
import Image from "next/image";
import RatingStars from "@/components/common/RatingStars";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import dynamic from "next/dynamic";
const EnrollButton = dynamic(() => import("./EnrollButton"));

interface HeroSectionProps {
  course: CourseDetail;
}

export const HeroSection = ({ course }: HeroSectionProps) => {
  const totalReviews = course.reviews?.length || 0;
  const rating = course.ratings || 0;
  const price = course.batch?.after_discount || course.batch?.price || 0;
  const originalPrice = course.batch?.price || 0;
  const discount = course.batch?.discount || 0;
  const hasDiscount = discount > 0 && originalPrice > price;
  const discount_percentage = course.batch?.discount_percentage || 0;
  const batchId = course?.batch?.id;
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left Column - Course Info */}
      <div className="animate-in fade-in slide-in-from-left duration-500">
        <Badge className="bg-primary text-primary-foreground mb-4">
          <GraduationCap className="w-5 h-5 mr-1" />{" "}
          {course.total_certified || 0} Learners Certified
        </Badge>
        <h1 className="text-2xl lg:text-4xl font-bold text-foreground mb-4">
          {course?.title}
        </h1>
        <h4 className="text-secondary mb-2">{course?.sub_title}</h4>
        <p className="text-muted-foreground mb-2">
          {course?.short_description}
        </p>
        <h3 className="text-primary mb-4">{course?.about_support}</h3>
        <div className="flex items-center flex-wrap gap-4 md:gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Inbox className="w-4 h-4" />
            <span className="text-sm text-primary">{totalReviews} Reviews</span>
          </div>
          <div className="flex items-center gap-1">
            <RatingStars rating={rating} />
            <span className="text-sm text-primary">
              ({rating.toFixed(1)} Rating)
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>
              <Play className="w-4 h-4 mr-1" />{" "}
            </span>
            <span className="text-sm text-primary">
              {course?.total_prerecorded_video || 0} Videos
            </span>
          </div>
        </div>

        <div className="flex gap-3 mb-3 flex-wrap">
          {course.batch?.start_date ? (
            <Badge variant="secondary" className="py-2 px-6">
              <PlayCircle className="w-4 h-4 mr-1" />
              Starts: {new Date(course.batch.start_date).toLocaleDateString()}
            </Badge>
          ) : null}
          {course.total_seats ? (
            <Badge variant="secondary" className="py-2 px-6">
              <HeadphonesIcon className="w-4 h-4 mr-1" />
              {course.total_seats} total seats
            </Badge>
          ) : null}
          {course.total_enrolled ? (
            <Badge variant="secondary" className="py-2 px-6">
              <Users className="w-4 h-4 mr-1" />
              {course.total_enrolled} total enrolled
            </Badge>
          ) : null}
          {course.total_live_class ? (
            <Badge variant="secondary" className="py-2 px-6">
              <Clock className="w-4 h-4 mr-1" />
              {course.total_live_class} total live classes
            </Badge>
          ) : null}
        </div>
        <div className="mb-4">
          <Badge variant="secondary" className="py-2 px-6">
            <Users className="w-4 h-4 mr-1" />
            Level : {course?.level}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-4 mb-6">
          {course?.course_facilities?.map((facility) => (
            <Card key={facility.id} className="p-0">
              <CardContent className="p-2 flex items-start gap-2">
                {facility.image ? (
                  <Image
                    src={facility.image}
                    alt={facility.title}
                    width={20}
                    height={20}
                    className="object-contain w-10 h-10"
                  />
                ) : (
                  <PlayCircle className="w-4 h-4 text-primary mt-1 shrink-0" />
                )}
                <div>
                  <div className="text-sm font-medium text-secondary">
                    {facility.title}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          {hasDiscount ? (
            <Badge className="mb-3">{discount_percentage}% OFF</Badge>
          ) : null}
          <div className="flex items-center gap-5 mb-4">
            <span className="text-3xl font-bold text-primary">{price} ৳</span>
            {hasDiscount && (
              <span className="text-xl text-muted-foreground line-through">
                {originalPrice} ৳
              </span>
            )}
          </div>
        </div>

        <EnrollButton slug={course?.slug} batchId={batchId} />
      </div>

      {/* Right Column - About Course */}
      <div className="animate-in fade-in slide-in-from-right duration-500">
        <Card className="py-0">
          <CardContent className="p-4 lg:p-6">
            <h2 className="text-2xl font-bold mb-4">About this Course</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(course.description),
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
