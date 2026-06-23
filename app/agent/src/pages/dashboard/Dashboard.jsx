import React from 'react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import { Users, Clock, IndianRupee, TrendingUp } from 'lucide-react';
import { dummyAgent, dummyRecentRegistrations } from '../../data/dummyData';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card className="flex items-center p-6">
    <div className={`p-3 rounded-full ${colorClass} bg-opacity-10 mr-4`}>
      <Icon className={`h-8 w-8 ${colorClass.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-[var(--color-subtext)]">{title}</p>
      <p className="text-2xl font-bold text-[var(--color-text)]">{value}</p>
    </div>
  </Card>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">Welcome back, {dummyAgent.name} 👋</h2>
          <p className="text-[var(--color-subtext)] mt-1">Agent ID: {dummyAgent.agentId}</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Registrations" 
          value={dummyAgent.totalRegistrations} 
          icon={Users} 
          colorClass="text-blue-600 bg-blue-100" 
        />
        <StatCard 
          title="Pending Users" 
          value={dummyAgent.pendingUsers} 
          icon={Clock} 
          colorClass="text-yellow-600 bg-yellow-100" 
        />
        <StatCard 
          title="Wallet Balance" 
          value={`₹${dummyAgent.walletBalance.toLocaleString()}`} 
          icon={IndianRupee} 
          colorClass="text-green-600 bg-green-100" 
        />
        <StatCard 
          title="Total Earnings" 
          value={`₹${dummyAgent.totalEarnings.toLocaleString()}`} 
          icon={TrendingUp} 
          colorClass="text-purple-600 bg-purple-100" 
        />
      </div>

      {/* Recent Activity Table */}
      <Card className="mt-8">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-[var(--color-border)]">
          <h3 className="text-lg leading-6 font-medium text-[var(--color-text)]">Recent Registrations</h3>
          <button className="text-sm text-[var(--color-primary)] hover:underline font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--color-border)]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[var(--color-border)]">
              {dummyRecentRegistrations.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[var(--color-text)]">{user.name}</div>
                    <div className="text-sm text-[var(--color-subtext)]">{user.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-subtext)]">
                    {user.mobile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-subtext)]">
                    {user.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge status={user.status}>{user.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
