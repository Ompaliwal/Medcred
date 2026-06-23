import React, { useState } from 'react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Filter, ChevronRight, Check, X, FileText, Clock, AlertCircle } from 'lucide-react';
import { dummyApplications } from '../../data/dummyData';

const ApplicationTimeline = ({ currentStep, status }) => {
  const steps = [
    { label: 'Created', step: 1 },
    { label: 'Documents Uploaded', step: 2 },
    { label: 'Verification Pending', step: 3 },
    { label: 'Approved', step: 4 },
  ];

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-[var(--color-primary)] z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((s, index) => {
          const isCompleted = currentStep > s.step || (currentStep === s.step && status !== 'Rejected');
          const isCurrent = currentStep === s.step && status !== 'Rejected';
          const isRejected = currentStep === s.step && status === 'Rejected';

          let bgColor = 'bg-gray-200';
          let textColor = 'text-[var(--color-subtext)]';
          
          if (isCompleted || isCurrent) {
            bgColor = 'bg-[var(--color-primary)]';
            textColor = 'text-[var(--color-primary)]';
          }
          if (isRejected) {
            bgColor = 'bg-red-500';
            textColor = 'text-red-600';
          }

          return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center border-4 border-white ${bgColor} shadow-sm`}>
                {(isCompleted && !isCurrent) && <Check className="h-3 w-3 text-white" />}
              </div>
              <div className={`absolute top-8 text-xs font-medium text-center w-24 -ml-12 left-1/2 ${textColor}`}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Applications = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  
  const statuses = ['All', 'Submitted', 'Under Review', 'Verified', 'Approved', 'Rejected'];

  const filteredApps = statusFilter === 'All' 
    ? dummyApplications 
    : dummyApplications.filter(app => app.status === statusFilter);

  return (
    <div className="space-y-6 relative">
      
      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-600 bg-opacity-75">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex justify-between items-center bg-gray-50">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-[var(--color-primary)]" />
                <h3 className="text-lg font-bold text-[var(--color-text)]">Application Details</h3>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold text-[var(--color-text)]">{selectedApp.applicant}</h4>
                  <p className="text-sm font-medium text-[var(--color-subtext)]">{selectedApp.id}</p>
                </div>
                <Badge status={selectedApp.status === 'Approved' ? 'success' : selectedApp.status === 'Rejected' ? 'danger' : selectedApp.status === 'Under Review' ? 'warning' : 'pending'}>
                  {selectedApp.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-[var(--color-border)] py-4">
                <div>
                  <p className="text-xs text-[var(--color-subtext)] uppercase font-semibold">Application Type</p>
                  <p className="text-sm font-medium text-[var(--color-text)] mt-1">{selectedApp.type}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-subtext)] uppercase font-semibold">Submission Date</p>
                  <p className="text-sm font-medium text-[var(--color-text)] mt-1">{selectedApp.date}</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-md p-4 flex items-start border border-blue-100">
                {selectedApp.status === 'Rejected' ? (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                ) : (
                  <Clock className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h5 className="text-sm font-semibold text-[var(--color-text)]">Status Remarks</h5>
                  <p className="text-sm text-[var(--color-subtext)] mt-1">
                    {selectedApp.status === 'Approved' ? 'All documents verified successfully. Digital card has been dispatched to the user\'s profile.' :
                     selectedApp.status === 'Rejected' ? 'Aadhaar card image is blurry and illegible. Please request the user to re-upload a clear copy.' :
                     selectedApp.status === 'Under Review' ? 'Documents are currently being verified by the admin team. Usually takes 24-48 hours.' :
                     'Application has been submitted and is awaiting document upload.'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={() => setSelectedApp(null)}>Close Window</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end items-center relative">
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center text-sm font-medium text-[var(--color-subtext)] hover:text-[var(--color-text)] bg-white px-4 py-2 border border-[var(--color-border)] rounded-md shadow-sm transition-colors focus:outline-none"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter: {statusFilter}
          </button>
          
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-[var(--color-border)] z-20">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setIsFilterOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    statusFilter === status 
                      ? 'bg-blue-50 text-[var(--color-primary)] font-semibold' 
                      : 'text-[var(--color-text)] hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                
                {/* Left Info */}
                <div className="flex flex-col justify-between w-full lg:w-1/3">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-semibold text-[var(--color-subtext)]">{app.id}</span>
                      <Badge status={app.status === 'Approved' ? 'success' : app.status === 'Rejected' ? 'danger' : app.status === 'Under Review' ? 'warning' : 'pending'}>
                        {app.status}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--color-text)]">{app.applicant}</h3>
                    <p className="text-sm font-medium text-[var(--color-subtext)] mt-1">{app.type}</p>
                  </div>
                  <div className="mt-4 text-xs text-[var(--color-subtext)] font-medium">
                    Applied on {app.date}
                  </div>
                </div>

                {/* Middle Timeline */}
                <div className="w-full lg:w-2/3 flex items-center px-4 pb-8 lg:pb-0">
                  <ApplicationTimeline currentStep={app.step} status={app.status} />
                </div>

                {/* Right Action */}
                <div className="flex items-center justify-end w-full lg:w-auto mt-4 lg:mt-0 border-t lg:border-t-0 lg:border-l border-[var(--color-border)] pt-4 lg:pt-0 lg:pl-6">
                  <button 
                    onClick={() => setSelectedApp(app)}
                    className="flex items-center text-sm font-medium text-[var(--color-primary)] hover:text-blue-800 transition-colors"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>

              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-10 text-[var(--color-subtext)] bg-white rounded-lg border border-[var(--color-border)]">
            No applications found with status: {statusFilter}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
