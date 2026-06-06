
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import NavStudentDashboard from "./NavStudentDashboard";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  CreditCard,
  Bell,
  Clock,
  GraduationCap,
  DollarSign,
  Calendar,
  User,
  MessageSquare,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function StudentSidebar() {
  const pathname = usePathname();

  const studentNavItems = [
    {
      title: "Dashboard",
      url: "/student/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/student/dashboard",
    },
    {
      title: "My Courses",
      url: "/student/mycourses",
      icon: BookOpen,
      isActive: pathname.startsWith("/student/mycourses"),
    },
    {
      title: "Free Seminar",
      url: "/student/freeseminar",
      icon: GraduationCap,
      isActive: pathname.startsWith("/student/freese"),
    },
    {
      title: "Upcoming Courses",
      url: "/student/upcomingcourses",
      icon: Calendar,
      isActive: pathname.startsWith("/student/upcomingcourses"),
    },
    {
      title: "My Earnings",
      url: "/student/myearnings",
      icon: DollarSign,
      isActive: pathname.startsWith("/student/myearnings"),
    },
    {
      title: "Certificates",
      url: "/student/certificate",
      icon: Award,
      isActive: pathname.startsWith("/student/certificate"),
    },
    {
      title: "Reviews",
      url: "/student/reviews",
      icon: MessageSquare,
      isActive: pathname.startsWith("/student/reviews"),
    },
    {
      title: "Due Payments",
      url: "/student/duepayment",
      icon: CreditCard,
      isActive: pathname.startsWith("/student/duepayment"),
    },
    {
      title: "Payment History",
      url: "/student/paymenthistory",
      icon: Clock,
      isActive: pathname.startsWith("/student/paymenthistory"),
    },
    {
      title: "Invoices",
      url: "/student/invoices",
      icon: FileText,
      isActive: pathname.startsWith("/student/invoices"),
    },
    {
      title: "Notifications",
      url: "/student/notifications",
      icon: Bell,
      isActive: pathname.startsWith("/student/notifications"),
    },
    {
      title: "Profile",
      url: "/student/profile",
      icon: User,
      isActive: pathname.startsWith("/student/profile"),
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="p-2 relative h-9 w-full" >
          <Image
            src="/images/logo.svg"
            alt="Logo"
            fill
            className="max-w-[162px]"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <NavStudentDashboard items={studentNavItems} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
