export const dummyAgent = {
  name: 'Vikram Singh',
  mobile: '9876543210',
  agentId: 'AGT-2024-001',
  status: 'Active',
  totalRegistrations: 145,
  pendingUsers: 12,
  walletBalance: 12500,
  totalEarnings: 45000,
};

export const dummyRecentRegistrations = [
  { id: 'USR001', name: 'Rahul Sharma', mobile: '9988776655', status: 'Verified', date: '2026-06-21' },
  { id: 'USR002', name: 'Priya Patel', mobile: '9988776654', status: 'Pending', date: '2026-06-22' },
  { id: 'USR003', name: 'Amit Kumar', mobile: '9988776653', status: 'Rejected', date: '2026-06-22' },
  { id: 'USR004', name: 'Neha Gupta', mobile: '9988776652', status: 'Verified', date: '2026-06-23' },
];

export const dummyTransactions = [
  { id: 'TRX001', date: '2026-06-23', type: 'Registration Bonus', amount: 50, status: 'Credited' },
  { id: 'TRX002', date: '2026-06-22', type: 'Card Activation Commission', amount: 200, status: 'Credited' },
  { id: 'TRX003', date: '2026-06-21', type: 'Payout to Bank', amount: 5000, status: 'Completed' },
  { id: 'TRX004', date: '2026-06-20', type: 'Registration Bonus', amount: 50, status: 'Pending' },
];

export const dummyIncentives = [
  { id: 'INC001', user: 'Rahul Sharma', type: 'Registration Bonus', amount: 50, date: '2026-06-21', status: 'Credited' },
  { id: 'INC002', user: 'Neha Gupta', type: 'Card Activation', amount: 200, date: '2026-06-23', status: 'Pending' },
  { id: 'INC003', user: 'Priya Patel', type: 'Registration Bonus', amount: 50, date: '2026-06-22', status: 'Pending' },
];

export const dummyApplications = [
  { id: 'APP-001', applicant: 'Rahul Sharma', type: 'MedCred Health Card', status: 'Approved', step: 4, date: '2026-06-21' },
  { id: 'APP-002', applicant: 'Priya Patel', type: 'MedCred Health Card', status: 'Under Review', step: 3, date: '2026-06-22' },
  { id: 'APP-003', applicant: 'Amit Kumar', type: 'MedCred Health Card', status: 'Rejected', step: 3, date: '2026-06-22' },
  { id: 'APP-004', applicant: 'Neha Gupta', type: 'MedCred Health Card', status: 'Verified', step: 4, date: '2026-06-23' },
  { id: 'APP-005', applicant: 'Suresh Raina', type: 'Mediclaim Limit Increase', status: 'Submitted', step: 1, date: '2026-06-23' },
];

export const dummyNotifications = [
  { id: 'NOTIF-001', title: 'New Commission Earned!', description: 'You earned ₹200 for Neha Gupta\'s card activation.', type: 'commission', date: '1 hour ago', read: false },
  { id: 'NOTIF-002', title: 'User Approved', description: 'Rahul Sharma\'s KYC has been approved by the admin.', type: 'success', date: '3 hours ago', read: false },
  { id: 'NOTIF-003', title: 'Document Rejected', description: 'Amit Kumar\'s Aadhaar card image was blurry. Please re-upload.', type: 'danger', date: '1 day ago', read: true },
  { id: 'NOTIF-004', title: 'Registration Bonus', description: '₹50 registration bonus credited for Priya Patel.', type: 'commission', date: '2 days ago', read: true },
];

export const dummyPayoutRequests = [
  { id: 'REQ-001', amount: 5000, status: 'Approved', date: '2026-06-20' },
  { id: 'REQ-002', amount: 1200, status: 'Pending', date: '2026-06-22' },
];
