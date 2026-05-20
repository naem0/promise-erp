interface SectionTitleProps {
  title?: string | null;
  subtitle?: string | null;
  iswhite?: boolean;
}

const SectionTitle = ({
  title = "",
  subtitle = "",
  iswhite = false,
}: SectionTitleProps) => {
  return (
    <div className="text-center mb-10 animate-fade-in-up">
      <h2
        className={`text-2xl md:text-4xl lg:text-5xl font-bold mb-4 capitalize ${
          iswhite ? "text-white" : "text-secondary"
        }`}
      >
        {title || null }
      </h2>

      {/* {subtitle && ( */}
        <p
          className={`text-lg max-w-5xl mx-auto ${
            iswhite ? "text-white" : "text-black/75"
          }`}
        >
          {subtitle || ""}
        </p>
      {/* )} */}
    </div>
  );
};

export default SectionTitle;
