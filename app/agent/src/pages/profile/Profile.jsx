import React from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { User, Phone, Mail, CreditCard, Building, ShieldCheck } from 'lucide-react';
import { dummyAgent } from '../../data/dummyData';

const Profile = () => {
  return (
    <div className="max-w-5xl mx-auto pb-10 animate-in fade-in duration-500">
      {/* Cover Banner */}
      <div className="h-48 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 sm:rounded-t-2xl border border-gray-200 relative overflow-hidden">
        {/* Subtle geometric overlay */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </div>

      {/* Profile Header Card (Overlapping) */}
      <div className="relative px-4 sm:px-6 -mt-16">
        <Card className="p-6 flex flex-col sm:flex-row items-center sm:items-end justify-between shadow-xl border-0 ring-1 ring-gray-100">
          <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="h-32 w-32 rounded-full bg-white p-1.5 shadow-lg relative -mt-20 sm:-mt-24 z-10">
              <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-[var(--color-primary)] font-bold text-4xl">
                {dummyAgent.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="absolute bottom-2 right-2 bg-green-500 h-6 w-6 rounded-full border-4 border-white shadow-sm" title="Online & Verified"></div>
            </div>
            
            {/* Name & ID */}
            <div className="text-center sm:text-left pb-1">
              <h2 className="text-3xl font-bold text-[var(--color-text)] tracking-tight">{dummyAgent.name}</h2>
              <div className="flex items-center justify-center sm:justify-start mt-1 space-x-2 text-[var(--color-subtext)] font-medium">
                <span>Agent ID: {dummyAgent.id}</span>
                <span>•</span>
                <span>Joined Jan 2026</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-0 flex items-center space-x-4">
            <div className="bg-green-50 text-green-700 text-sm font-bold px-4 py-2 rounded-lg flex items-center border border-green-200">
              <ShieldCheck className="h-5 w-5 mr-1.5" /> Verified KYC
            </div>
            <Button className="shadow-md">Save Changes</Button>
          </div>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 px-4 sm:px-6">
        
        {/* Personal Information */}
        <Card className="border-0 shadow-md ring-1 ring-gray-100">
          <div className="flex items-center mb-6 pb-4 border-b border-[var(--color-border)]">
            <div className="bg-blue-50 p-2 rounded-lg mr-3">
              <User className="h-6 w-6 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text)]">Personal Information</h3>
          </div>
          
          <div className="space-y-5">
            <Input label="Full Name" defaultValue={dummyAgent.name} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input label="Mobile Number" defaultValue={dummyAgent.mobile} icon={Phone} disabled />
              <Input label="Email Address" defaultValue="agent.raj@example.com" icon={Mail} />
            </div>
            <Input label="Aadhaar Number" defaultValue="XXXX XXXX 4321" icon={CreditCard} disabled />
          </div>
        </Card>

        {/* Bank Details */}
        <Card className="border-0 shadow-md ring-1 ring-gray-100 flex flex-col">
          <div className="flex items-center mb-6 pb-4 border-b border-[var(--color-border)]">
            <div className="bg-indigo-50 p-2 rounded-lg mr-3">
              <Building className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text)]">Bank Details</h3>
          </div>
          
          <div className="space-y-5 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input label="Bank Name" defaultValue="HDFC Bank" />
              <Input label="Account Number" defaultValue="XXXX XXXX 1234" type="password" />
              <Input label="IFSC Code" defaultValue="HDFC0001234" />
              <Input label="Account Holder Name" defaultValue={dummyAgent.name} />
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start">
            <ShieldCheck className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 leading-relaxed">
              Your bank account is <span className="font-semibold">verified</span> and active. All your monthly payouts and incentives will be automatically credited to this account on the 1st of every month.
            </p>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Profile;
