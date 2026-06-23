import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Lock, Bell, LogOut, Shield } from 'lucide-react';

const Settings = () => {
  const { onLogout } = useOutletContext();

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10 animate-in fade-in duration-300">
      {/* Change Password */}
      <Card className="border-0 shadow-md ring-1 ring-gray-100 overflow-hidden">
        <div className="bg-white px-4 sm:px-6 py-5 border-b border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center">
          <div className="bg-indigo-50 p-2 rounded-lg mr-4 shadow-sm self-start sm:self-auto mb-3 sm:mb-0 flex-shrink-0">
            <Lock className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text)]">Change Password</h3>
            <p className="text-sm text-[var(--color-subtext)] mt-0.5">Ensure your account uses a long, random password to stay secure.</p>
          </div>
        </div>
        <div className="p-6 bg-gray-50/50">
          <form className="space-y-6 max-w-2xl">
            <Input label="Current Password" type="password" placeholder="Enter current password" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input label="New Password" type="password" placeholder="Enter new password" />
              <Input label="Confirm New Password" type="password" placeholder="Confirm new password" />
            </div>
            <div className="pt-2">
              <Button type="button" className="shadow-sm">Update Password</Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="border-0 shadow-md ring-1 ring-gray-100 overflow-hidden">
        <div className="bg-white px-4 sm:px-6 py-5 border-b border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center">
          <div className="bg-blue-50 p-2 rounded-lg mr-4 shadow-sm self-start sm:self-auto mb-3 sm:mb-0 flex-shrink-0">
            <Bell className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text)]">Notification Preferences</h3>
            <p className="text-sm text-[var(--color-subtext)] mt-0.5">Manage how we contact you regarding applications and payouts.</p>
          </div>
        </div>
        <div className="p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-[var(--color-border)] hover:bg-gray-50 transition-colors">
            <div className="mb-3 sm:mb-0 pr-0 sm:pr-4">
              <p className="font-semibold text-[var(--color-text)]">Email Notifications</p>
              <p className="text-sm text-[var(--color-subtext)] mt-1">Receive daily summaries and commission alerts via email.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 self-start sm:self-auto">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
            </label>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors">
            <div className="mb-3 sm:mb-0 pr-0 sm:pr-4">
              <p className="font-semibold text-[var(--color-text)]">SMS Alerts</p>
              <p className="text-sm text-[var(--color-subtext)] mt-1">Receive instant SMS for approved KYC and payouts.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 self-start sm:self-auto">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Security & Logout */}
      <Card className="border-0 shadow-md ring-1 ring-red-200 overflow-hidden">
        <div className="bg-red-50 px-4 sm:px-6 py-5 border-b border-red-100 flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex items-start sm:items-center mb-4 sm:mb-0">
            <div className="bg-red-100 p-2 rounded-lg mr-4 flex-shrink-0 mt-1 sm:mt-0">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-800">Account Security</h3>
              <p className="text-sm text-red-600 mt-0.5">Need to sign out of your agent account on this device?</p>
            </div>
          </div>
          <Button variant="danger" className="flex items-center justify-center shadow-sm w-full sm:w-auto" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </Card>

    </div>
  );
};

export default Settings;
