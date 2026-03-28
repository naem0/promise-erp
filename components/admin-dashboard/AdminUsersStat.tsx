interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
}
interface StatCardProps {
  bgColor: string;
  title: string;
  students: StatCard[];
}

const AdminUsersStat = ({ bgColor, students, title }: StatCardProps) => {
  console.log(bgColor, "<===bgColor");
  return (
    <div className={`${bgColor} rounded-xl p-4`}>
      <div className="pb-4 text-white text-2xl font-medium">
        <h3>{title}</h3>
      </div>
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 `}>
        {students.map((stat, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0">
              {stat.icon}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium mb-1">
                {stat.label}
              </p>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersStat;
