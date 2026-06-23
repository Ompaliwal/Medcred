import React, { useState } from 'react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import { Award, Filter } from 'lucide-react';
import { dummyIncentives } from '../../data/dummyData';

const Incentives = () => {
  const [typeFilter, setTypeFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const types = ['All', 'Registration Bonus', 'Card Activation'];

  const filteredIncentives = typeFilter === 'All'
    ? dummyIncentives
    : dummyIncentives.filter(inc => inc.type === typeFilter);

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center relative">
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center text-sm font-medium text-[var(--color-subtext)] hover:text-[var(--color-text)] bg-white px-4 py-2 border border-[var(--color-border)] rounded-md shadow-sm transition-colors focus:outline-none"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter: {typeFilter}
          </button>
          
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-[var(--color-border)] z-20">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setTypeFilter(type);
                    setIsFilterOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    typeFilter === type 
                      ? 'bg-blue-50 text-[var(--color-primary)] font-semibold' 
                      : 'text-[var(--color-text)] hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center bg-gray-50">
          <Award className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
          <h3 className="text-lg font-medium text-[var(--color-text)]">Incentive Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--color-border)]">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Incentive ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[var(--color-border)]">
              {filteredIncentives.length > 0 ? (
                filteredIncentives.map((inc) => (
                  <tr key={inc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-subtext)] font-medium">
                      {inc.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text)] font-medium">
                      {inc.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-subtext)]">
                      {inc.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-subtext)]">
                      {inc.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[var(--color-text)]">
                      ₹{inc.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge status={inc.status === 'Credited' ? 'success' : inc.status.toLowerCase()}>
                        {inc.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-[var(--color-subtext)]">
                    No incentives found for type: {typeFilter}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Incentives;
