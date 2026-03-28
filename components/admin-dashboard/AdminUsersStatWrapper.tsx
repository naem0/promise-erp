import {
  Building2,
  Users,
  BarChart3,
  AlertCircle,
  Package,
  Bell,
} from "lucide-react";
import AdminUsersStat from "./AdminUsersStat";

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
}
const stats: StatCard[] = [
  {
    label: "Active Branches",
    value: "64",
    icon: <Building2 className="w-6 h-6 text-green-600" />,
  },
  {
    label: "Total Assets",
    value: "1250",
    icon: <BarChart3 className="w-6 h-6 text-green-600" />,
  },
  {
    label: "Pending Requests",
    value: "12",
    icon: <Users className="w-6 h-6 text-green-600" />,
  },
  {
    label: "Repair Needed",
    value: "04",
    icon: <AlertCircle className="w-6 h-6 text-green-600" />,
  },
  {
    label: "New Inventory",
    value: "42",
    icon: <Package className="w-6 h-6 text-green-600" />,
  },
  {
    label: "Notice Sent",
    value: "02",
    icon: <Bell className="w-6 h-6 text-green-600" />,
  },
];
const branchColor = "bg-green-500";
const assetColor = "bg-blue-500";
const requestColor = "bg-yellow-500";
const repairColor = "bg-red-500";
const inventoryColor = "bg-purple-500";
const noticeColor = "bg-pink-500";

const AdminUsersStatWrapper = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 px-4 py-5">
      <AdminUsersStat bgColor={branchColor} students={stats} title="Branches" />
      <AdminUsersStat bgColor={assetColor} students={stats} title="Assets" />
      <AdminUsersStat bgColor={repairColor} students={stats} title="Repair Needed" />
      <AdminUsersStat bgColor={inventoryColor} students={stats} title="New Inventory" />
      <AdminUsersStat bgColor={noticeColor} students={stats} title="Notice Sent" />
      <AdminUsersStat bgColor={requestColor} students={stats} title="Pending Requests" />

    </div>
  );
};

export default AdminUsersStatWrapper;
