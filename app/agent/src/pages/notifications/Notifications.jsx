import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import Card from '../../components/Card';
import { Bell, CheckCircle, XCircle, IndianRupee, Settings } from 'lucide-react';

const NotificationIcon = ({ type }) => {
  switch (type) {
    case 'commission':
      return (
        <div className="bg-yellow-100 p-3 rounded-full flex-shrink-0">
          <IndianRupee className="h-6 w-6 text-yellow-600" />
        </div>
      );
    case 'success':
      return (
        <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
      );
    case 'danger':
      return (
        <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
          <XCircle className="h-6 w-6 text-red-600" />
        </div>
      );
    default:
      return (
        <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
          <Bell className="h-6 w-6 text-blue-600" />
        </div>
      );
  }
};

const Notifications = () => {
  const { notifications, setNotifications } = useOutletContext();

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-end items-center">
        <Link 
          to="/settings"
          className="flex items-center text-sm font-medium text-[var(--color-subtext)] hover:text-[var(--color-text)] transition-colors"
        >
          <Settings className="h-5 w-5 mr-1" />
          Preferences
        </Link>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <Card key={notif.id} className={`flex items-start p-5 transition-all ${notif.read ? 'opacity-70 bg-gray-50 hover:opacity-100' : 'border-l-4 border-l-[var(--color-primary)]'}`}>
            <NotificationIcon type={notif.type} />
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <h3 className={`text-lg font-bold ${notif.read ? 'text-gray-700' : 'text-[var(--color-text)]'}`}>
                  {notif.title}
                </h3>
                <span className="text-xs font-medium text-[var(--color-subtext)]">
                  {notif.date}
                </span>
              </div>
              <p className="text-sm text-[var(--color-subtext)] mt-1">{notif.description}</p>
              
              {!notif.read && (
                <div className="mt-3">
                  <button 
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="text-sm font-semibold text-[var(--color-primary)] hover:text-blue-800 transition-colors"
                  >
                    Mark as read
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
