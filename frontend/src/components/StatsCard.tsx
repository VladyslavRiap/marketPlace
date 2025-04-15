interface StatsCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string;
}

const StatsCard = ({ icon, iconBg, title, value }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
      <div className={`${iconBg} p-3 rounded-full mr-4`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl md:text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
