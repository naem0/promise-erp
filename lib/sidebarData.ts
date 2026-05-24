import {
  BookOpen,
  BoxesIcon,
  BriefcaseBusiness,
  ChartLine,
  DollarSign,
  DollarSignIcon,
  GalleryVerticalEnd,
  GraduationCap,
  HouseIcon,
  ImagePlay,
  LocationEdit,
  LockIcon,
  MessageSquare,
  MonitorCog,
  Settings,
  ShieldCheck,
  ShoppingCartIcon,
  User2Icon,
  UserCheck,
  Users,
  Warehouse,
} from "lucide-react";
import { title } from "process";

export const sidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  teams: [
    {
      name: "EL ERP System",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],

  navSections: [
    {
      label: undefined,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: HouseIcon,
        },
      ],
    },

    {
      label: "LMS",
      items: [
        {
          title: "User Management",
          url: "#",
          icon: Users,
          items: [
            {
              title: "Employees",
              url: "/lms/employees",
              permissions: ["view-employees"],
            },
            {
              title: "Students",
              url: "/lms/students",
              permissions: ["view-students"],
            },
            {
              title: "Designations",
              url: "/lms/designations",
              permissions: ["view-designations"],
            },
          ],
        },
        {
          title: "Course Management",
          url: "#",
          icon: GraduationCap,
          items: [
            {
              title: "Categories",
              url: "/lms/categories",
              permissions: ["view-course-categories"],
            },
            {
              title: "Courses",
              url: "/lms/courses",
              permissions: ["view-courses"],
            },
            {
              title: "Batches",
              url: "/lms/batches",
              permissions: ["view-batches"],
            },
            {
              title: "Facilities",
              url: "/lms/facilities",
              permissions: ["view-course-facilities"],
            },
            {
              title: "FAQs",
              url: "/lms/faqs",
              permissions: ["view-faq-sections"],
            },
            {
              title: "Coupons",
              url: "/lms/coupons",
              permissions: ["view-coupons"],
            },
            {
              title: "Who Can Join",
              url: "/lms/who-can-join",
              permissions: ["view-course-joins"],
            },
            {
              title: "Course Reviews",
              url: "/lms/reviews",
              permissions: ["view-reviews"],
            },
            {
              title: "Course Tools",
              url: "/lms/tools",
              permissions: ["view-course-tools"],
            },
            {
              title: "Free Seminars",
              url: "/lms/free-seminars",
              permissions: ["view-free-seminars"],
            },

            // {
            //   title: "Blogs",
            //   url: "/lms/blogs",
            //   permissions: ["view-blogs"],
            // },
          ],
        },
        // {
        //   title: "Teacher Management",
        //   url: "#",
        //   icon: UserCheck,
        //   items: [
        //     {
        //       title: "Teachers",
        //       url: "/lms/teachers",
        //       permissions: ["view-teachers"],
        //     },
        //     {
        //       title: "Active Teachers",
        //       url: "#",
        //       permissions: ["view-teachers"],
        //     },
        //     {
        //       title: "Pending Approvals",
        //       url: "#",
        //       permissions: ["create-teachers"],
        //     },
        //     {
        //       title: "Teacher Attendance",
        //       url: "#",
        //       permissions: ["view-attendances"],
        //     },
        //     {
        //       title: "Teacher Payments",
        //       url: "#",
        //       permissions: ["view-payment-histories"],
        //     },
        //     {
        //       title: "Performance Reports",
        //       url: "#",
        //       permissions: ["view-teacher-stats"],
        //     },
        //   ],
        // },
        {
          title: "Enroll & Payments",
          url: "#",
          icon: DollarSignIcon,
          items: [
            {
              title: "Enrollments",
              url: "/lms/enrollments",
              permissions: ["view-enrollments"],
            },
            {
              title: "Invoices",
              url: "#",
              permissions: ["view-invoices"],
            },
            // {
            //   title: "Coupons",
            //   url: "#",
            //   permissions: ["view-coupons"],
            // },
            {
              title: "Certificates",
              url: "#",
              permissions: ["view-certificates"],
            },
            {
              title: "Subscription Plans",
              url: "#",
              permissions: ["view-subscriptions"],
            },
            {
              title: "Enrollment Reports",
              url: "/lms/enrollment-reports",
              permissions: [
                "view-course-sales-summary",
                "view-course-sales-report",
              ],
            },
          ],
        },
        {
          title: "Assessments",
          url: "#",
          icon: BookOpen,
          items: [
            {
              title: "Quizs",
              url: "#",
              permissions: ["view-quizzes"],
            },
            {
              title: "Questions",
              url: "#",
              permissions: ["view-questions"],
            },
            {
              title: "Assignment",
              url: "#",
              permissions: ["view-assignments"],
            },
            {
              title: "Results",
              url: "#",
              permissions: ["view-results"],
            },
          ],
        },
        {
          title: "Contents Management",
          url: "#",
          icon: ImagePlay,
          items: [
            {
              title: "Statistics",
              url: "/web-content/stats",
              permissions: ["view-stats"],
            },
            // {
            //   title: "Departments",
            //   url: "#",
            //   permissions: ["view-divisions"],
            // },
            // {
            //   title: "Offers List",
            //   url: "#",
            //   permissions: ["view-sections"],
            // },
            {
              title: "Blog Categories",
              url: "/web-content/blog-categories",
              permissions: ["view-blog-categories"],
            },
            {
              title: "Blog Posts",
              url: "/lms/blogs",
              permissions: ["view-blogs"],
            },
            // {
            //   title: "Notices",
            //   url: "/web-content/notices",
            //   permissions: ["view-news-feeds"],
            // },
            {
              title: "Hero Sections",
              url: "/web-content/hero-section",
              permissions: ["view-hero-sections"],
            },
            {
              title: "Common Sections",
              url: "/web-content/common-sections",
              permissions: ["view-sections"],
            },
            {
              title: "Opportunities",
              url: "/web-content/opportunities",
              permissions: ["view-opportunities"],
            },
            {
              title: "Video Galleries",
              url: "/web-content/video-galleries",
              permissions: ["view-video-galleries"],
            },
            {
              title: "Image Galleries",
              url: "/web-content/image-galleries",
              permissions: ["view-image-galleries"],
            },
            {
              title: "Our Partners",
              url: "/web-content/our-partners",
              permissions: ["view-partners"],
            },
            {
              title: "News & Updates",
              url: "/web-content/news-feeds",
              permissions: ["view-news-feeds"],
            },

            {
              title: "Contact Page",
              url: "/web-content/contact-page",
              permissions: ["view-contact-pages"],
            },

            {
              title: "Branches",
              url: "/lms/branches",
              permissions: ["view-branches"],
            },
          ],
        },
        {
          title: "Communications",
          url: "#",
          icon: MessageSquare,
          items: [
            {
              title: "Notifications",
              url: "#",
              permissions: ["view-notifications"],
            },
            {
              title: "Reviews",
              url: "#",
              permissions: ["view-reviews-communications"],
            },
            {
              title: "Free Consultations",
              url: "#",
              permissions: ["view-contact-queries"],
            },
            {
              title: "Newsletter Subscriptions",
              url: "#",
              permissions: ["view-newsletters"],
            },
          ],
        },
        {
          title: "Progress Reports",
          url: "#",
          icon: ChartLine,
          items: [
            {
              title: "Completed Lessons",
              url: "#",
              permissions: ["view-progress-reports"],
            },
            {
              title: "Wishlists",
              url: "#",
              permissions: ["view-wishlists"],
            },
            {
              title: "Tags",
              url: "#",
              permissions: ["view-tags"],
            },
          ],
        },
        {
          title: "Careers Management",
          url: "#",
          icon: BriefcaseBusiness,
          items: [
            {
              title: "Career Categories",
              url: "/web-content/career-categories",
              permissions: ["view-career-categories"],
            },
            {
              title: "All Careers",
              url: "/lms/careers",
              permissions: ["view-careers"],
            },
            {
              title: "Job Applications",
              url: "/web-content/job-applies",
              permissions: ["view-job-applications"],
            },
            // {
            //   title: "Interviews",
            //   url: "#",
            //   permissions: ["view-interviews"],
            // },
          ],
        },
        {
          title: "Requisition Manage",
          url: "#",
          icon: HouseIcon,
          items: [
            {
              title: "Your Requisition",
              url: "#",
              permissions: ["view-requisitions"],
            },
            {
              title: "All Branches",
              url: "#",
              permissions: ["view-branches-requisitions"],
            },
            {
              title: "Head office",
              url: "#",
              permissions: ["view-head-office-requisitions"],
            },
          ],
        },
      ],
    },

    {
      label: "CRM",
      items: [
        {
          title: "CRM Management",
          url: "#",
          icon: MonitorCog,
          items: [
            {
              title: "Leads",
              url: "/crm/leads",
              permissions: ["view-leads", "view-assign-leads"],
            },
            {
              title: "Lead Activities",
              url: "/crm/lead-activities",
              permissions: [
                "view-lead-activity-list",
                "view-assigned-lead-activity-list",
              ],
            },
            {
              title: "Lead Categories",
              url: "/crm/categories",
              permissions: ["view-crm-categories"],
            },
            {
              title: "Lead Sources",
              url: "/crm/sources",
              permissions: ["view-crm-sources"],
            },
            {
              title: "Lead Reports",
              url: "/crm/lead-reports",
              permissions: ["crm-lead-reports"],
            },
            {
              title: "Counsellor Performance",
              url: "/crm/consultants-performance",
              permissions: ["view-users-performance"],
            },
            {
              title: "Lead Referrers",
              url: "/crm/lead-referrers",
              permissions: ["view-crm-referrers"],
            },
            {
              title: "All Notifications",
              url: "/crm/notifications",
              permissions: ["view-consultant-notifications","mark-consultant-notification-read","mark-all-consultant-notifications-read"],
            },
          ],
        },
      ],
    },
     {
      label: "INVENTORY",
      items: [
        {
          title: "Inventory Management",
          url: "#",
          icon: Warehouse,
          items: [
            {
              title: "Inventory Items",
              url: "/inventory/inventory-items",
              permissions: ["view-products"],
            },
            {
              title: "Inventory Categories",
              url: "/inventory/inventory-categories",
              permissions: ["view-product-categories"],
            },
            {
              title: "Brands",
              url: "/inventory/inventory-brands",
              permissions: ["view-brands"],
            },
            {
              title: "Units",
              url: "/inventory/inventory-units",
              permissions: ["view-units"],
            },
          ],
        },
      ],
    },

    {
      label: "HR",
      items: [
        {
          title: "Requirement Onboarding",
          url: "#",
          icon: User2Icon,
          items: [
            {
              title: "Job Circular",
              url: "#",
              permissions: ["view-job-circulars"],
            },
            {
              title: "Application Tracking",
              url: "#",
              permissions: ["view-application-tracking"],
            },
            {
              title: "Interview Schedule",
              url: "#",
              permissions: ["view-interview-schedules"],
            },
            {
              title: "Candidate Evaluation",
              url: "#",
              permissions: ["view-candidate-evaluations"],
            },
            {
              title: "Offer Letter",
              url: "#",
              permissions: ["view-offer-letters"],
            },
            {
              title: "Onboarding / Joining",
              url: "#",
              permissions: ["view-onboarding-joining"],
            },
          ],
        },
        {
          title: "Attendance",
          url: "#",
          icon: User2Icon,
          items: [
            {
              title: "Manual Attendance",
              url: "#",
              permissions: ["view-attendances"],
            },
            {
              title: "Biometric",
              url: "#",
              permissions: ["view-attendances"],
            },
            {
              title: "Device (Optional)",
              url: "#",
              permissions: ["view-attendances"],
            },
            {
              title: "Late Report",
              url: "#",
              permissions: ["view-attendances"],
            },
            {
              title: "Early Leave Report",
              url: "#",
              permissions: ["view-attendances"],
            },
            {
              title: "Attendance Summary",
              url: "#",
              permissions: ["view-attendances"],
            },
            {
              title: "Attendance Report",
              url: "#",
              permissions: ["view-attendances"],
            },
          ],
        },
        {
          title: "Payroll",
          url: "#",
          icon: User2Icon,
          items: [
            {
              title: "Salary Structure",
              url: "#",
              permissions: ["view-salary-structures"],
            },
            {
              title: "Salary Processing",
              url: "#",
              permissions: ["view-salary-processing"],
            },
            {
              title: "Overtime Calculation",
              url: "#",
              permissions: ["view-overtime-calculations"],
            },
            {
              title: "Pay Slip Generation",
              url: "#",
              permissions: ["view-pay-slips"],
            },
            {
              title: "Tax Deduction",
              url: "#",
              permissions: ["view-tax-deductions"],
            },
            {
              title: "Salary Report",
              url: "#",
              permissions: ["view-salary-reports"],
            },
            {
              title: "Advance Salary",
              url: "#",
              permissions: ["view-advance-salaries"],
            },
            {
              title: "Salary Certificate",
              url: "#",
              permissions: ["view-salary-certificates"],
            },
            {
              title: "Incentive",
              url: "#",
              permissions: ["view-incentives"],
            },
            {
              title: "Medical Allowance",
              url: "#",
              permissions: ["view-medical-allowances"],
            },
            {
              title: "Convenance Allowance",
              url: "#",
              permissions: ["view-convenance-allowances"],
            },
            {
              title: "Bonus",
              url: "#",
              permissions: ["view-bonuses"],
            },
          ],
        },
        {
          title: "Holiday & Leave",
          url: "#",
          icon: User2Icon,
          items: [
            {
              title: "Leave Application",
              url: "#",
              permissions: ["view-leave-applications"],
            },
            {
              title: "Leave Application Rules",
              url: "#",
              permissions: ["view-leave-application-rules"],
            },
            {
              title: "Leave Approval Process",
              url: "#",
              permissions: ["view-leave-approval-process"],
            },
            {
              title: "Leave Report (Y/M)",
              url: "#",
              permissions: ["view-leave-reports"],
            },
            {
              title: "Leave Encashment",
              url: "#",
              permissions: ["view-leave-encashments"],
            },
            {
              title: "Leave Summary",
              url: "#",
              permissions: ["view-leave-summaries"],
            },
          ],
        },
        {
          title: "Increment & Promotion",
          url: "#",
          icon: User2Icon,
          items: [
            {
              title: "Individual Person Promotion",
              url: "#",
              permissions: ["view-individual-person-promotions"],
            },
            {
              title: "Demotion with Reason",
              url: "#",
              permissions: ["view-demotions-with-reason"],
            },
            {
              title: "Employee Suspend",
              url: "#",
              permissions: ["view-employee-suspends"],
            },
            {
              title: "Increment / Decrement with Reason",
              url: "#",
              permissions: ["view-increment-decrement-with-reason"],
            },
          ],
        },
        {
          title: "Provident Fund",
          url: "#",
          icon: User2Icon,
          items: [
            {
              title: "Provident Fund Configuration",
              url: "#",
              permissions: ["view-provident-fund-configurations"],
            },
            {
              title: "PF Opening",
              url: "#",
              permissions: ["view-pf-openings"],
            },
            {
              title: "Loan Against PR",
              url: "#",
              permissions: ["view-loan-against-prs"],
            },
            {
              title: "Loan Adjustment",
              url: "#",
              permissions: ["view-loan-adjustments"],
            },
            {
              title: "PR Settlement",
              url: "#",
              permissions: ["view-pr-settlements"],
            },
            {
              title: "Interest on PF",
              url: "#",
              permissions: ["view-interest-on-pfs"],
            },
            {
              title: "PF Ledger",
              url: "#",
              permissions: ["view-pf-ledgers"],
            },
            {
              title: "PF Report",
              url: "#",
              permissions: ["view-pf-reports"],
            },
          ],
        },
        {
          title: "HR Configuration",
          url: "#",
          icon: User2Icon,
          items: [
            {
              title: "Notice Board",
              url: "#",
              permissions: ["view-notice-boards"],
            },
            {
              title: "HR Policy / Rules",
              url: "#",
              permissions: ["view-hr-policy-rules"],
            },
            {
              title: "Manage Company Info",
              url: "#",
              permissions: ["view-manage-company-infos"],
            },
            {
              title: "Designation & Department Setup",
              url: "#",
              permissions: ["view-designation-department-setups"],
            },
            {
              title: "Roaster Schedule",
              url: "#",
              permissions: ["view-roaster-schedules"],
            },
            {
              title: "Employee Class Management",
              url: "#",
              permissions: ["view-employee-class-managements"],
            },
            {
              title: "Work Station & Front Desk Manage",
              url: "#",
              permissions: ["view-work-station-front-desk-manages"],
            },
            {
              title: "Grade System for Salary",
              url: "#",
              permissions: ["view-grade-system-for-salaries"],
            },
          ],
        },
      ],
    },

    {
      label: "Inventory",
      items: [
        {
          title: "Inventory Management",
          url: "#",
          icon: BoxesIcon,
          items: [
            {
              title: "Dashboard",
              url: "#",
              permissions: ["view-inventory-dashboard"],
            },
            {
              title: "Requisitions",
              url: "#",
              permissions: ["view-requisitions"],
            },
            {
              title: "Requisition Overview",
              url: "#",
              permissions: ["view-requisition-overview"],
            },
            {
              title: "Requisition Accepts",
              url: "#",
              permissions: ["view-requisition-accepts"],
            },
            {
              title: "Purchase",
              url: "#",
              permissions: ["view-purchase"],
            },
            {
              title: "Manual Entry Form / POS",
              url: "#",
              permissions: ["view-manual-entry-form-pos"],
            },
            {
              title: "Item Management",
              url: "#",
              permissions: ["view-item-management"],
            },
            {
              title: "Stock Management",
              url: "#",
              permissions: ["view-stock-management"],
            },
            {
              title: "Supplier / Vendor Management",
              url: "#",
              permissions: ["view-supplier-vendor-management"],
            },
            {
              title: "Warehouse Management",
              url: "#",
              permissions: ["view-warehouse-management"],
            },
          ],
        },
      ],
    },

    {
      label: "Sales",
      items: [
        {
          title: "Sales Management",
          url: "#",
          icon: ShoppingCartIcon,
          items: [
            {
              title: "Dashboard",
              url: "#",
              permissions: ["view-sales-dashboard"],
            },
            {
              title: "Customer Management",
              url: "#",
              permissions: ["view-customer-management"],
            },
            {
              title: "Product / Item Management",
              url: "#",
              permissions: ["view-product-item-management"],
            },
            {
              title: "Delivery Management",
              url: "#",
              permissions: ["view-delivery-management"],
            },
            {
              title: "Sales Report",
              url: "#",
              permissions: ["view-sales-report"],
            },
            {
              title: "Orders Management",
              url: "#",
              permissions: ["view-orders-management"],
            },
            {
              title: "Quotation & Proposal",
              url: "#",
              permissions: ["view-quotation-proposal"],
            },
            {
              title: "Invoice & Billing",
              url: "#",
              permissions: ["view-invoices"],
            },
            {
              title: "Payment Collection / Due Management",
              url: "#",
              permissions: ["view-payment-collection-due-management"],
            },
            {
              title: "Sales Return / Exchange Policy",
              url: "#",
              permissions: ["view-sales-return-exchange-policy"],
            },
            {
              title: "Sales Target",
              url: "#",
              permissions: ["view-sales-target"],
            },
          ],
        },
      ],
    },

    {
      label: "Expenses",
      items: [
        {
          title: "Expenses Management",
          url: "#",
          icon: DollarSign,
          items: [
            {
              title: "List Expenses",
              url: "#",
              permissions: ["view-expense"],
            },
            {
              title: "Add Expense",
              url: "#",
              permissions: ["create-expense"],
            },
            {
              title: "Expense Categories",
              url: "#",
              permissions: ["view-expense-category"],
            },
          ],
        },
      ],
    },

    {
      label: "Purchase",
      items: [
        {
          title: "Purchases Manage",
          url: "#",
          icon: DollarSign,
          items: [
            {
              title: "Purchases List",
              url: "#",
              permissions: ["view-purchases"],
            },
            {
              title: "Add Purchases",
              url: "#",
              permissions: ["create-purchases"],
            },
            {
              title: "List Purchase Return",
              url: "#",
              permissions: ["view-purchase-returns"],
            },
            {
              title: "Stock Transfers List",
              url: "#",
              permissions: ["view-stock-transfers"],
            },
            {
              title: "Add Stock Transfer",
              url: "#",
              permissions: ["create-stock-transfers"],
            },
            {
              title: "Stock Adjustments List",
              url: "#",
              permissions: ["view-stock-adjustments"],
            },
            {
              title: "Add Stock Adjustment",
              url: "#",
              permissions: ["create-stock-adjustments"],
            },
          ],
        },
      ],
    },

    {
      label: "Account",
      items: [
        {
          title: "Account Management",
          url: "#",
          icon: Users,
          items: [
            {
              title: "Accounts List",
              url: "#",
              permissions: ["view-accounts"],
            },
            {
              title: "Balance Sheet",
              url: "#",
              permissions: ["view-balance-sheet"],
            },
            {
              title: "Trial Balance",
              url: "#",
              permissions: ["view-trial-balance"],
            },
            {
              title: "Cash Flow",
              url: "#",
              permissions: ["view-cash-flow"],
            },
            {
              title: "Payment Account Report",
              url: "#",
              permissions: ["view-payment-account-report"],
            },
          ],
        },
      ],
    },

    {
      label: "Division",
      items: [
        {
          title: "Division List",
          url: "#",
          icon: LocationEdit,
          items: [
            {
              title: "Divisions",
              url: "/divisions",
              permissions: ["view-divisions"],
            },
          ],
        },
      ],
    },

    {
      label: "District",
      items: [
        {
          title: "District List",
          url: "#",
          icon: LockIcon,
          items: [
            {
              title: "Districts",
              url: "/districts",
              permissions: ["view-districts"],
            },
          ],
        },
      ],
    },

    // {
    //   label: "User Management",
    //   items: [
    //     {
    //       title: "User Management",
    //       url: "#",
    //       icon: Users,
    //       items: [
    //         {
    //           title: "Users List",
    //           url: "#",
    //           permissions: ["view-users"],
    //         },
    //         {
    //           title: "User Roles",
    //           url: "#",
    //           permissions: ["view-role-users"],
    //         },
    //         {
    //           title: "User Permissions",
    //           url: "#",
    //           permissions: ["view-user-permissions"],
    //         },
    //         {
    //           title: "User Activity Logs",
    //           url: "#",
    //           permissions: ["view-logs"],
    //         },
    //         {
    //           title: "User Profile Settings",
    //           url: "#",
    //           permissions: ["view-user-profile-settings"],
    //         },
    //       ],
    //     },
    //   ],
    // },

    {
      label: "Role & Permission",
      items: [
        {
          title: "Role & Permission",
          url: "#",
          icon: ShieldCheck,
          items: [
            {
              title: "Roles List",
              url: "/access-control/roles",
              permissions: ["view-roles"],
            },
            {
              title: "Permissions List",
              url: "/access-control/permissions",
              permissions: ["view-permissions"],
            },
          ],
        },
      ],
    },
    {
      label: "Settings",
      items: [
        {
          title: "Settings",
          url: "#",
          icon: Settings,
          items: [
            {
              title: "Profile",
              url: "/settings/profile",
              permissions: ["view-my-profile"],
            },
            {
              title: "General",
              url: "#",
              permissions: ["view-general-settings"],
            },
            {
              title: "Team",
              url: "#",
              permissions: ["view-team-settings"],
            },
            {
              title: "Billing",
              url: "#",
              permissions: ["view-billing-settings"],
            },
            {
              title: "Limits",
              url: "#",
              permissions: ["view-limits-settings"],
            },
          ],
        },
      ],
    },
  ],
};
