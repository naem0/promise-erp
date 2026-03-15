import { FreeSeminarRegistrationForm } from "@/components/root/free-seminars/FreeSeminarRegistrationForm";
import { PublicFreeSeminar } from "@/apiServices/studentDashboardService";
interface FreeSeminarContentSectionProps {
  seminar: PublicFreeSeminar;
}

const FreeSeminarContentSection = ({
  seminar,
}: FreeSeminarContentSectionProps) => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-12">
      <div className="lg:col-span-2 space-y-12 pt-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 leading-relaxed">
            এই {seminar.title} সেমিনারে <br className="hidden md:block" />
            আপনি যা যা শিখবেন:
          </h2>
          <div className="text-gray-700 space-y-4">
            {seminar.class_topic ? (
              <div
                className="text-black/70 text-base"
                dangerouslySetInnerHTML={{ __html: seminar.class_topic }}
              />
            ) : (
              <p>not found class topic</p>
            )}
          </div>
        </div>

        {/* Why you will learn */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 leading-relaxed">
            {currentYear} সালে কেন {seminar.title} শিখবেন?
          </h2>
          <div className="text-black/70 text-base space-y-4">
            {seminar.description ? (
              <div
                className="text-black/70 text-base"
                dangerouslySetInnerHTML={{ __html: seminar.description }}
              />
            ) :  (
              <p>not found description</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Registration Form & Contact */}
      <div className="lg:col-span-1 space-y-6 sticky top-8">
        {/* Registration Form (includes Contact Box now) */}
        <FreeSeminarRegistrationForm seminarId={seminar.id} />
      </div>
    </div>
  );
};

export default FreeSeminarContentSection;
