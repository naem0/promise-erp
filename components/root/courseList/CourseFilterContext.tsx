"use client";

import { createContext, useContext, useState, useTransition, ReactNode } from "react";

interface CourseFilterContextType {
  isPending: boolean;
  startFilterTransition: (callback: () => void) => void;
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (open: boolean) => void;
  closeMobileFilter: () => void;
}

const CourseFilterContext = createContext<CourseFilterContextType>({
  isPending: false,
  startFilterTransition: (cb) => cb(),
  isMobileFilterOpen: false,
  setIsMobileFilterOpen: () => {},
  closeMobileFilter: () => {},
});

export const CourseFilterProvider = ({ children }: { children: ReactNode }) => {
  const [isPending, startTransition] = useTransition();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const startFilterTransition = (callback: () => void) => {
    startTransition(() => {
      callback();
    });
  };

  const closeMobileFilter = () => {
    setIsMobileFilterOpen(false);
  };

  return (
    <CourseFilterContext.Provider
      value={{
        isPending,
        startFilterTransition,
        isMobileFilterOpen,
        setIsMobileFilterOpen,
        closeMobileFilter,
      }}
    >
      {children}
    </CourseFilterContext.Provider>
  );
};

export const useCourseFilter = () => useContext(CourseFilterContext);
