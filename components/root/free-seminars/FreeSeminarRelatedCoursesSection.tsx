import HomeCourses from "@/components/root/home/HomeCourses";
import { PublicCourse } from "@/apiServices/studentDashboardService";

interface FreeSeminarRelatedCoursesSectionProps {
    coursesData?: PublicCourse[] | null;
}

const FreeSeminarRelatedCoursesSection = ({ coursesData }: FreeSeminarRelatedCoursesSectionProps) => {
    if (!coursesData || coursesData.length === 0) return null;

    return (
        <div className="bg-primary/10 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-3">
                        শিক্ষার্থীদের পছন্দের কোর্সসমূহ
                    </h2>
                    <p className="text-gray-600">
                        দেখে নিন কোন কোর্সগুলো সবচেয়ে বেশি জনপ্রিয় হয়েছে
                    </p>
                </div>
                <div>
                    <HomeCourses courses={coursesData} />
                </div>
            </div>
        </div>
    );
};

export default FreeSeminarRelatedCoursesSection;
