import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { ArrowLeft, User, Phone, MapPin, Calendar, CheckCircle, Clock, FileText, CreditCard, Users, Plus, Trash2, ShieldCheck, QrCode, Eye, X } from 'lucide-react';

const UserDetails = () => {
  const { id } = useParams();

  // Mock data for this specific user
  const user = {
    id: id || 'USR001',
    name: 'Rahul Sharma',
    mobile: '+91 9988776655',
    email: 'rahul.sharma@example.com',
    dob: '15 Aug 1985',
    gender: 'Male',
    address: '123 MG Road, Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    aadhaar: 'XXXX XXXX 1234',
    status: 'Verified',
    cardStatus: 'Active',
    cardId: 'MCI-2024-00123'
  };

  const timeline = [
    { title: 'Registration Created', date: '21 Jun 2026, 10:00 AM', status: 'completed' },
    { title: 'Documents Uploaded', date: '21 Jun 2026, 10:15 AM', status: 'completed' },
    { title: 'Verification Pending', date: '21 Jun 2026, 10:15 AM', status: 'completed' },
    { title: 'Approved by Admin', date: '22 Jun 2026, 02:30 PM', status: 'completed' },
    { title: 'Health Card Issued', date: '22 Jun 2026, 03:00 PM', status: 'completed' },
  ];

  const [familyMembers, setFamilyMembers] = useState([
    { name: 'Priya Sharma', relation: 'Spouse', aadhaar: 'XXXX XXXX 9876', dob: '1988-04-12', verified: true }
  ]);
  const [isAddingFamily, setIsAddingFamily] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', relation: '', aadhaar: '', dob: '', gender: '' });
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);

  const handleAddFamilyMember = () => {
    if (newMember.name && newMember.relation && newMember.aadhaar) {
      setFamilyMembers([...familyMembers, { ...newMember, verified: false }]);
      setNewMember({ name: '', relation: '', aadhaar: '', dob: '', gender: '' });
      setIsAddingFamily(false);
    }
  };

  const removeFamilyMember = (index) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/users" className="p-2 bg-white shadow-sm border border-[var(--color-border)] rounded-md hover:bg-gray-50 text-[var(--color-text)] transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold text-[var(--color-subtext)]">User ID: <span className="text-[var(--color-text)]">{user.id}</span></span>
            <Badge status={user.status}>{user.status}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Profile & Documents */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile Overview */}
          <Card>
            <div className="flex items-start justify-between mb-6 border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-[var(--color-primary)] font-bold text-xl mr-4">
                  RS
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text)]">{user.name}</h3>
                  <div className="flex items-center text-[var(--color-subtext)] mt-1">
                    <Phone className="h-4 w-4 mr-1" /> {user.mobile}
                  </div>
                </div>
              </div>
              <Link to={`/users/${user.id}/edit`}>
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-xs text-[var(--color-subtext)] uppercase tracking-wider font-semibold">Email</p>
                <p className="text-sm font-medium mt-1">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-subtext)] uppercase tracking-wider font-semibold">Date of Birth</p>
                <div className="flex items-center text-sm font-medium mt-1">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" /> {user.dob} ({user.gender})
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-[var(--color-subtext)] uppercase tracking-wider font-semibold">Address</p>
                <div className="flex items-start text-sm font-medium mt-1">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0 mt-0.5" />
                  {user.address}, {user.city}, {user.state} - {user.pincode}
                </div>
              </div>
            </div>
          </Card>

          {/* Documents Section */}
          <Card>
            <h3 className="text-lg font-medium text-[var(--color-text)] mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
              Uploaded Documents
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-[var(--color-border)] rounded-md">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-md mr-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Aadhaar Card (Front & Back)</p>
                    <p className="text-xs text-[var(--color-subtext)]">{user.aadhaar}</p>
                  </div>
                </div>
                <Button variant="outline">View Files</Button>
              </div>
              <div className="flex items-center justify-between p-3 border border-[var(--color-border)] rounded-md bg-gray-50">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-md mr-3">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Income Proof (Optional)</p>
                    <p className="text-xs text-[var(--color-subtext)]">Not uploaded</p>
                  </div>
                </div>
                <Button variant="outline">Upload</Button>
              </div>
            </div>
          </Card>

          {/* Family Members Section */}
          <Card>
            <div className="flex items-center justify-between mb-4 border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
                <h3 className="text-lg font-medium text-[var(--color-text)]">Family Members</h3>
              </div>
              {!isAddingFamily && (
                <Button variant="outline" className="text-sm flex items-center" onClick={() => setIsAddingFamily(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Member
                </Button>
              )}
            </div>

            {familyMembers.length === 0 && !isAddingFamily ? (
              <div className="text-center py-6 text-[var(--color-subtext)] text-sm">
                No family members linked to this card yet.
              </div>
            ) : (
              <div className="space-y-4 mb-4">
                {familyMembers.map((member, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[var(--color-border)] rounded-lg bg-gray-50/50">
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-semibold text-[var(--color-text)]">{member.name}</h4>
                        <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{member.relation}</span>
                        {member.verified ? (
                          <span className="ml-2 flex items-center text-xs text-green-600 font-medium">
                            <CheckCircle className="h-3 w-3 mr-1" /> Verified
                          </span>
                        ) : (
                          <span className="ml-2 flex items-center text-xs text-yellow-600 font-medium">
                            <Clock className="h-3 w-3 mr-1" /> Pending KYC
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--color-subtext)] mt-1">Aadhaar: {member.aadhaar}</p>
                    </div>
                    <div className="mt-3 sm:mt-0 flex space-x-2 items-center">
                      <button onClick={() => setSelectedFamilyMember(member)} className="p-1.5 text-blue-500 hover:text-blue-700 rounded border border-transparent hover:border-blue-200 hover:bg-blue-50 transition-colors" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      {!member.verified && (
                        <Button variant="outline" className="text-xs px-3 py-1.5 h-auto">Verify</Button>
                      )}
                      <button onClick={() => removeFamilyMember(index)} className="p-1.5 text-gray-400 hover:text-red-500 rounded border border-transparent hover:border-red-200 hover:bg-red-50 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isAddingFamily && (
              <div className="p-5 border border-blue-200 rounded-xl bg-blue-50/30">
                <h4 className="font-semibold text-blue-900 mb-4">Add New Family Member</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="As per Aadhaar"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  />
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-[var(--color-text)]">Relationship</label>
                    <select
                      className="block w-full rounded-md shadow-sm sm:text-sm py-2 px-3 border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                      value={newMember.relation}
                      onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Parent">Parent</option>
                    </select>
                  </div>
                  <Input
                    label="Aadhaar Number"
                    placeholder="12-digit"
                    value={newMember.aadhaar}
                    onChange={(e) => setNewMember({ ...newMember, aadhaar: e.target.value })}
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={newMember.dob}
                    onChange={(e) => setNewMember({ ...newMember, dob: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-5 pt-4 border-t border-blue-100">
                  <Button variant="outline" onClick={() => setIsAddingFamily(false)}>Cancel</Button>
                  <Button onClick={handleAddFamilyMember}>Save & Verify</Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Card Status & Timeline */}
        <div className="space-y-6">

          {/* Card Status */}
          <Card className="bg-gradient-to-br from-blue-50 to-white">
            <h3 className="text-lg font-medium text-[var(--color-text)] mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
              MedCred Card Status
            </h3>
            <div className="bg-[var(--color-primary)] rounded-xl p-4 text-white shadow-lg relative overflow-hidden mb-4">
              <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-white opacity-10 w-24 h-24 rounded-full"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-blue-100 text-xs mb-1">Card Number</p>
                  <p className="text-lg font-mono font-bold tracking-widest">{user.cardId}</p>
                  
                  <div className="mt-4">
                    <p className="text-blue-100 text-xs mb-1">Card Holder</p>
                    <p className="font-semibold text-sm">{user.name}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="bg-white p-1 rounded mb-2">
                    <QrCode className="h-10 w-10 text-gray-800" />
                  </div>
                  <span className="bg-white text-[var(--color-primary)] px-2 py-0.5 rounded text-xs font-bold uppercase">
                    {user.cardStatus}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-400 grid grid-cols-3 gap-2 relative z-10">
                <div>
                  <p className="text-blue-200 text-[10px] uppercase tracking-wider">Plan</p>
                  <p className="font-medium text-xs">Family Gold</p>
                </div>
                <div>
                  <p className="text-blue-200 text-[10px] uppercase tracking-wider">Members</p>
                  <p className="font-medium text-xs">{familyMembers.length + 1}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-[10px] uppercase tracking-wider">Exp</p>
                  <p className="font-medium text-xs">12/2027</p>
                </div>
              </div>
            </div>
            <Button className="w-full">Download Digital Card</Button>
          </Card>

          {/* Timeline */}
          <Card>
            <h3 className="text-lg font-medium text-[var(--color-text)] mb-4">Application Timeline</h3>
            <div className="relative border-l border-gray-200 ml-3 space-y-6 pb-2">
              {timeline.map((item, index) => (
                <div key={index} className="relative pl-6">
                  <span className={`absolute -left-1.5 top-1 h-3 w-3 rounded-full ring-4 ring-white ${item.status === 'completed' ? 'bg-[var(--color-primary)]' : 'bg-gray-300'}`}></span>
                  <p className="text-sm font-medium text-[var(--color-text)]">{item.title}</p>
                  <p className="text-xs text-[var(--color-subtext)] mt-1">{item.date}</p>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>

      {selectedFamilyMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-600 bg-opacity-75">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-[var(--color-text)]">Family Member Details</h3>
              <button onClick={() => setSelectedFamilyMember(null)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xl text-[var(--color-text)]">{selectedFamilyMember.name}</h4>
                <Badge status={selectedFamilyMember.verified ? 'success' : 'warning'}>
                  {selectedFamilyMember.verified ? 'Verified' : 'Pending KYC'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-[var(--color-subtext)] uppercase tracking-wider font-semibold">Relationship</p>
                  <p className="text-sm font-medium mt-1">{selectedFamilyMember.relation}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-subtext)] uppercase tracking-wider font-semibold">Date of Birth</p>
                  <p className="text-sm font-medium mt-1">{selectedFamilyMember.dob || 'Not provided'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-[var(--color-subtext)] uppercase tracking-wider font-semibold">Aadhaar Number</p>
                  <p className="text-sm font-medium mt-1">{selectedFamilyMember.aadhaar}</p>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-[var(--color-border)] mt-4">
                <Button variant="outline" onClick={() => setSelectedFamilyMember(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
