import React, { useState } from 'react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { IndianRupee, Clock, CheckCircle, TrendingUp, Download, ArrowUpRight, X } from 'lucide-react';
import { dummyAgent, dummyTransactions, dummyPayoutRequests as initialPayoutRequests } from '../../data/dummyData';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card className="flex flex-col p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
        <Icon className={`h-6 w-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <div>
      <p className="text-2xl font-bold text-[var(--color-text)]">{value}</p>
      <p className="text-sm font-medium text-[var(--color-subtext)] mt-1">{title}</p>
    </div>
  </Card>
);

const Wallet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutError, setPayoutError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [payoutRequests, setPayoutRequests] = useState(initialPayoutRequests);
  const [walletBalance, setWalletBalance] = useState(dummyAgent.walletBalance);

  const handleRequestPayout = (e) => {
    e.preventDefault();
    setPayoutError('');

    const amount = Number(payoutAmount);

    if (!amount || amount < 500) {
      setPayoutError('Minimum withdrawal amount is ₹500');
      return;
    }

    if (amount > walletBalance) {
      setPayoutError('Insufficient wallet balance');
      return;
    }

    // Success logic
    const newRequest = {
      id: `REQ-00${payoutRequests.length + 1}`,
      amount: amount,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0] // current date YYYY-MM-DD
    };

    setPayoutRequests([newRequest, ...payoutRequests]);
    setWalletBalance(prev => prev - amount);
    setIsModalOpen(false);
    setPayoutAmount('');
    
    // Show toast
    setToastMessage('Payout request submitted successfully');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {toastMessage}
        </div>
      )}

      {/* Payout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-600 bg-opacity-75">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex justify-between items-center">
              <h3 className="text-lg font-bold text-[var(--color-text)]">Request Payout</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleRequestPayout} className="p-6 space-y-4">
              <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-md mb-4 text-sm font-medium flex justify-between">
                <span>Available Balance:</span>
                <span>₹{walletBalance.toLocaleString()}</span>
              </div>
              
              <div>
                <Input 
                  label="Amount (₹)" 
                  type="number" 
                  placeholder="Enter amount" 
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  required 
                />
                {payoutError && <p className="text-red-500 text-xs mt-1 font-medium">{payoutError}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Bank Account</label>
                <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500 text-sm font-medium">
                  XXXXXXXX1234
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[var(--color-border)] mt-6">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Submit Request</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-end items-center">
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center">
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Request Payout
        </Button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Wallet Balance" 
          value={`₹${walletBalance.toLocaleString()}`} 
          icon={IndianRupee} 
          colorClass="text-blue-600 bg-blue-100" 
        />
        <StatCard 
          title="Pending Earnings" 
          value="₹2,500" 
          icon={Clock} 
          colorClass="text-yellow-600 bg-yellow-100" 
        />
        <StatCard 
          title="Paid Earnings" 
          value={`₹${(dummyAgent.totalEarnings - dummyAgent.walletBalance).toLocaleString()}`} 
          icon={CheckCircle} 
          colorClass="text-green-600 bg-green-100" 
        />
        <StatCard 
          title="Total Earnings" 
          value={`₹${dummyAgent.totalEarnings.toLocaleString()}`} 
          icon={TrendingUp} 
          colorClass="text-purple-600 bg-purple-100" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Table */}
        <Card className="overflow-hidden p-0">
          <div className="px-6 py-5 border-b border-[var(--color-border)] flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-medium text-[var(--color-text)]">Wallet Transactions</h3>
            <button 
              onClick={() => alert("Exporting transaction history to CSV...")}
              className="text-[var(--color-subtext)] hover:text-[var(--color-text)] flex items-center text-sm font-medium transition-colors"
            >
              <Download className="h-4 w-4 mr-1" /> Export
            </button>
          </div>
          <div className="overflow-x-auto max-h-[400px]">
            <table className="min-w-full divide-y divide-[var(--color-border)] relative">
              <thead className="bg-white sticky top-0 z-10 border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[var(--color-border)]">
                {dummyTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-subtext)]">
                      {trx.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text)] font-medium">
                      {trx.type}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${trx.type === 'Payout to Bank' || trx.type === 'Withdrawal' ? 'text-red-600' : 'text-green-600'}`}>
                      {trx.type === 'Payout to Bank' || trx.type === 'Withdrawal' ? '-' : '+'}₹{trx.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge status={trx.status === 'Completed' || trx.status === 'SUCCESS' ? 'success' : trx.status.toLowerCase()}>{trx.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Payout Requests Table */}
        <Card className="overflow-hidden p-0">
          <div className="px-6 py-5 border-b border-[var(--color-border)] bg-gray-50">
            <h3 className="text-lg font-medium text-[var(--color-text)]">Payout Requests</h3>
          </div>
          <div className="overflow-x-auto max-h-[400px]">
            <table className="min-w-full divide-y divide-[var(--color-border)] relative">
              <thead className="bg-white sticky top-0 z-10 border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Request ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-subtext)] uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[var(--color-border)]">
                {payoutRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text)]">
                      {req.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[var(--color-text)]">
                      ₹{req.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge status={req.status === 'Approved' ? 'success' : req.status === 'Rejected' ? 'danger' : 'warning'}>
                        {req.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-subtext)]">
                      {req.date}
                    </td>
                  </tr>
                ))}
                {payoutRequests.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-[var(--color-subtext)]">
                      No payout requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Wallet;
