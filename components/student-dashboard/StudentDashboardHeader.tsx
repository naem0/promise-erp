import HeaderNavLink from '../common/HeaderNavLink'
import { NavLink } from '../common/HeaderContent'
import { Suspense } from 'react';

const StudentDashboardHeader = () => {
    const navLinks: NavLink[] = [
        { name: "Home", href: "/" },
        { name: "Courses", href: "/courses", hasDropdown: true },
        { name: "Instructors", href: "/instructors" },
        { name: "Branch", href: "/branch" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" },
    ]

    return (
        <div className="w-full">
            <Suspense fallback={<div className="h-10 bg-background border-b animate-pulse" />}>
                <HeaderNavLink navLinks={navLinks} isStudentDashboard={true} />
            </Suspense>
        </div>
    );
};

export default StudentDashboardHeader;
