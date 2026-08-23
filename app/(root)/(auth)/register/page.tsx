import AuthLeftImage from "@/components/auth/AuthLeftImage";
import RegisterForm from "@/components/auth/RegisterForm";
import { Card } from "@/components/ui/card";

const RegisterPage = () => {
  return (
    <section className="min-h-screen flex items-center bg-(--primary-light-color)">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <Card
          className="w-full shadow max-w-full lg:max-w-7xl mx-auto px-4 bg-white/80 backdrop-blur-lg border-0"
          style={{
            boxShadow:
              "inset -4px -4px 16px rgba(21, 158, 66, 0.2), inset 4px 4px 16px rgba(21, 158, 66, 0.2)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xl:gap-5 justify-between items-center">
            <AuthLeftImage />
            <RegisterForm />
          </div>
        </Card>
      </div>
    </section>
  );
};

export default RegisterPage;
