import Image from "next/image";
const AuthLeftImage = () => {
  return (
    <div className="hidden md:flex justify-center w-full">
      <div className="relative w-[650px] h-[550px] flex items-center justify-center">
        <Image
          src="/images/register-new-img.png"
          alt="Register Illustration"
          fill
          className="object-scale-down"
          priority
        />
      </div>
    </div>
  );
};

export default AuthLeftImage;
