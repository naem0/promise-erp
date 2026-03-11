import { MyCourseBySlugCurrentLesson } from "@/apiServices/studentDashboardService";
import MyCourseLessonVideoPlayer from "./MyCourseLessonVideoPlayer";
interface VideoPlayerProps {
  currentLesson: MyCourseBySlugCurrentLesson;
}

const MyCourseBySlugVideoPlayer = ({ currentLesson }: VideoPlayerProps) => {

  return (
    <div>
      <div className="mb-4">
        <span className="text-primary font-medium text-sm">
          {currentLesson?.chapter_title ?? "---"}
        </span>
        <h2 className="text-xl font-semibold text-secondary pb-2 my-2 border-b border-secondary/40">
          {currentLesson?.title ?? "---"}
        </h2>
        <p className="text-sm text-secondary mb-1">
          Duration: {currentLesson?.duration}
        </p>
      </div>

      {currentLesson?.type === 1 && currentLesson?.video_url && (
        <div className="mb-4">
          <MyCourseLessonVideoPlayer videoUrl={currentLesson?.video_url} />
        </div>
      )}

      {currentLesson?.type === 0 && (
        <div className="mb-4">
          <p className="text-sm text-foreground/80">
            {currentLesson?.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyCourseBySlugVideoPlayer;
