import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { dummyRecentRegistrations } from '../../data/dummyData';
import { Eye, Edit, Search } from 'lucide-react';

const UsersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter users based on search term (name, id, or mobile)
  const filteredUsers = dummyRecentRegistrations.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <div className="flex w-full sm:w-auto space-x-3">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[var(--color-subtext)]" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-sm"
            />
          </div>
          <Link to="/users/register">
            <Button>Register New</Button>
          </Link>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--color-border)]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Name & ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Reg. Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[var(--color-border)]">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[var(--color-text)]">{user.name}</div>
                      <div className="text-xs text-[var(--color-subtext)]">{user.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text)]">
                      {user.mobile}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-subtext)]">
                      {user.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge status={user.status}>{user.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/users/${user.id}`} className="text-[var(--color-primary)] hover:text-blue-900 bg-blue-50 p-1.5 rounded-md transition-colors">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link 
                          to={`/users/${user.id}/edit`}
                          className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-md transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[var(--color-subtext)]">
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-[var(--color-border)] flex items-center justify-between bg-white">
            <div className="text-sm text-[var(--color-subtext)]">
              Showing <span className="font-medium text-[var(--color-text)]">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-[var(--color-text)]">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-medium text-[var(--color-text)]">{filteredUsers.length}</span> users
            </div>
            {totalPages > 1 && (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 h-auto text-sm"
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1.5 h-auto text-sm"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default UsersList;
