import {
  Home,
  Settings,
  UsersRound,
  List,
  FileUser,
  Plus,
  ContactRound,
  UserRoundPen,
  Banknote,
  Landmark,
  BanknoteArrowDown,
  GraduationCap,
  BookMarked,
  BookDashed,
  BookOpenCheck,
  ArrowDownNarrowWide,
} from "lucide-react";
import Dashboard from "@/pages/dashboard.page";
import Students_Page from "@/pages/student/students.page";
import CreateStudentPage from "@/pages/student/createStudent.page";
import AttendancePage from "@/pages/student/attendance.page";
import CreateParentPage from "@/pages/student/parent.page";

const navItems = [
  {
    id: "dashboard",
    to: "/dashboard",
    label: "الرئيسية",
    icon: Home,
    component: Dashboard,
  },
  {
    id: "students",
    to: null,
    label: "إدارة الطلاب",
    icon: UsersRound,
    children: [
      {
        id: "all-students",
        to: "/dashboard/students",
        label: "عرض جميع الطلاب",
        icon: List,
        component: Students_Page,
      },
      {
        id: "attendance",
        to: "/dashboard/students/attendance",
        label: "سجل الحضور",
        icon: FileUser,
        component: AttendancePage,
      },
      {
        id: "create-student",
        to: "/dashboard/students/create",
        label: "إضافة طالب جديد",
        icon: Plus,
        component: CreateStudentPage,
      },
      {
        id: "create-parent",
        to: "/dashboard/students/parent/create",
        label: "إضافة ولي أمر",
        icon: ContactRound,
        component: CreateParentPage,
      },
      // {
      //   id: "student-profile",
      //   to: "/dashboard/students/profile",
      //   label: "ملف الطالب",
      //   icon: UserRoundPen,
      //   component: StudentID,
      // },
    ],
  },
  {
    id: "payments",
    to: "/dashboard/payments",
    label: "إجراء معاملة مالية",
    icon: Banknote,
    component: Dashboard,
  },
  {
    id: "finance-history",
    to: "/dashboard/finance",
    label: "سجل المعاملات المالية",
    icon: Landmark,
    component: Dashboard,
  },
  {
    id: "settings",
    to: null,
    label: "الإعدادات",
    icon: Settings,
    children: [
      {
        id: "categories",
        to: "/dashboard/settings/category",
        label: "تصنيفات البيانات",
        icon: ArrowDownNarrowWide,
        component: Dashboard,
      },
      {
        id: "payment-plans",
        to: "/dashboard/settings/paymen-plan",
        label: "خطط الدفع",
        icon: BanknoteArrowDown,
        component: Dashboard,
      },
      {
        id: "grades",
        to: "/dashboard/settings/grade-level",
        label: "المراحل الدراسية",
        icon: GraduationCap,
        component: Dashboard,
      },
      {
        id: "homework",
        to: "/dashboard/settings/homework",
        label: "إدارة الواجبات",
        icon: BookMarked,
        component: Dashboard,
      },
      {
        id: "homework-template",
        to: "/dashboard/settings/homework/template",
        label: "قوالب الواجبات",
        icon: BookDashed,
        component: Dashboard,
      },
      {
        id: "exams",
        to: "/dashboard/settings/exam",
        label: "الاختبارات",
        icon: BookOpenCheck,
        component: Dashboard,
      },
    ],
  },
];

export default navItems;
