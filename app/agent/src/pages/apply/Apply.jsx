import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { User, CreditCard, Building, Building2, Upload, CheckCircle, ArrowLeft, ArrowRight, X } from 'lucide-react';

const Apply = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [panFront, setPanFront] = useState(null);

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(5); // Success step
  };

  const handleImageUpload = (e, setSide) => {
    const file = e.target.files[0];
    if (file) {
      setSide(URL.createObjectURL(file));
    }
  };

  const triggerUpload = (id) => document.getElementById(id).click();

  const renderProgress = () => {
    if (step === 5) return null;
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-[var(--color-primary)] z-0 transition-all duration-300" 
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
          
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className={`relative z-10 flex flex-col items-center justify-center w-8 h-8 rounded-full border-2 ${step >= num ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : 'bg-white border-gray-300 text-gray-400'} font-bold transition-colors duration-300`}>
              {step > num ? <CheckCircle className="h-5 w-5" /> : num}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs font-medium text-[var(--color-subtext)] px-1">
          <span>Personal</span>
          <span>KYC</span>
          <span>Business</span>
          <span>Banking</span>
        </div>
      </div>
    );
  };

  const renderUploadBox = (id, state, setState, title) => (
    <div 
      onClick={() => !state && triggerUpload(id)}
      className={`border-2 border-dashed border-[var(--color-border)] rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors ${!state ? 'cursor-pointer' : ''} relative overflow-hidden h-48`}
    >
      <input 
        type="file" 
        id={id} 
        className="hidden" 
        accept="image/*"
        onChange={(e) => handleImageUpload(e, setState)}
      />
      {state ? (
        <div className="absolute inset-0 w-full h-full bg-white group flex items-center justify-center p-2">
          <img src={state} alt={title} className="max-w-full max-h-full object-contain" />
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setState(null); }}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow border border-gray-200 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <>
          <Upload className="h-8 w-8 text-[var(--color-subtext)] mb-2" />
          <span className="text-sm font-medium text-[var(--color-text)]">{title}</span>
          <span className="text-xs text-[var(--color-subtext)] mt-1">JPG, PNG up to 5MB</span>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Crisp White Header */}
      <header className="bg-white border-b border-[var(--color-border)] py-4 px-6 sm:px-10 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-[var(--color-primary)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <h1 className="text-xl font-extrabold text-[var(--color-primary)] tracking-tight">MedCred</h1>
        </div>
        <Link to="/login" className="text-sm font-medium text-[var(--color-subtext)] hover:text-[var(--color-text)] transition-colors flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-3xl mx-auto py-10 px-4 sm:px-6">
        
        {step < 5 && (
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-[var(--color-text)] tracking-tight">Become a MedCred Agent</h2>
            <p className="mt-3 text-[var(--color-subtext)]">
              Join our network and start earning by onboarding patients.
            </p>
          </div>
        )}

        {renderProgress()}

        <Card className="p-6 md:p-10 shadow-lg border-0 ring-1 ring-[var(--color-border)] rounded-2xl bg-white">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center text-[var(--color-primary)] mb-4 border-b border-[var(--color-border)] pb-2">
                <User className="mr-2 h-6 w-6" />
                <h3 className="text-xl font-bold">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" placeholder="As per Aadhaar" required />
                <Input label="Mobile Number" type="tel" placeholder="10-digit number" required />
                <Input label="Email Address" type="email" placeholder="Required for notifications" required />
                <Input label="Date of Birth" type="date" required />
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleNext} className="flex items-center">
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center text-[var(--color-primary)] mb-4 border-b border-[var(--color-border)] pb-2">
                <CreditCard className="mr-2 h-6 w-6" />
                <h3 className="text-xl font-bold">KYC Details</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <Input label="Aadhaar Number" placeholder="12-digit Aadhaar Number" required className="mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderUploadBox('aadhaar-front', aadhaarFront, setAadhaarFront, 'Upload Aadhaar Front')}
                    {renderUploadBox('aadhaar-back', aadhaarBack, setAadhaarBack, 'Upload Aadhaar Back')}
                  </div>
                </div>
                <div className="pt-4 border-t border-[var(--color-border)]">
                  <Input label="PAN Number" placeholder="10-digit PAN Number" required className="mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderUploadBox('pan-front', panFront, setPanFront, 'Upload PAN Card')}
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack} className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleNext} className="flex items-center">
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center text-[var(--color-primary)] mb-4 border-b border-[var(--color-border)] pb-2">
                <Building className="mr-2 h-6 w-6" />
                <h3 className="text-xl font-bold">Business Details</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Business/Agency Name" placeholder="Leave blank if individual" />
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-[var(--color-text)]">Agent Type</label>
                    <select className="block w-full rounded-md shadow-sm sm:text-sm py-2 px-3 border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none">
                      <option>Individual</option>
                      <option>Insurance Agency</option>
                      <option>Clinic/Hospital</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <Input label="Years of Experience" type="number" placeholder="e.g. 5" />
                <div className="pt-2">
                  <h4 className="text-sm font-semibold mb-3">Operating Address</h4>
                  <Input label="Full Address" placeholder="Street, House/Office No" required className="mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="City" placeholder="City" required />
                    <Input label="State" placeholder="State" required />
                    <Input label="Pincode" placeholder="6-digit Pincode" required />
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack} className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleNext} className="flex items-center">
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center text-[var(--color-primary)] mb-4 border-b border-[var(--color-border)] pb-2">
                <Building2 className="mr-2 h-6 w-6" />
                <h3 className="text-xl font-bold">Banking Details</h3>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4 text-sm text-blue-800 flex">
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>This account will be used to automatically credit your monthly incentives and commissions.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Account Holder Name" placeholder="Exactly as per Bank" required />
                <Input label="Account Number" placeholder="Bank Account Number" required />
                <Input label="IFSC Code" placeholder="e.g. HDFC0001234" required />
                <Input label="UPI ID (Optional)" placeholder="e.g. mobile@upi" />
              </div>
              <div className="flex justify-between pt-6 border-t border-[var(--color-border)]">
                <Button variant="outline" onClick={handleBack} className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleSubmit} className="flex items-center bg-green-600 hover:bg-green-700 border-green-600 shadow-md">
                  Submit Application <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-10 animate-in zoom-in duration-500">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4">Application Submitted!</h2>
              <p className="text-lg text-[var(--color-subtext)] max-w-md mx-auto mb-8">
                Your application has been received and is currently under <strong>Verification</strong>. 
                Our Admin team will review your KYC documents and approve your account shortly.
              </p>
              <div className="bg-gray-50 border border-[var(--color-border)] rounded-lg p-6 max-w-md mx-auto mb-8 text-left">
                <h4 className="font-semibold text-[var(--color-text)] mb-2">What happens next?</h4>
                <ul className="space-y-2 text-sm text-[var(--color-subtext)]">
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-[var(--color-primary)] mr-2 mt-0.5 flex-shrink-0" /> We verify your Aadhaar, PAN, and Bank Details.</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-[var(--color-primary)] mr-2 mt-0.5 flex-shrink-0" /> You receive an SMS and Email upon approval.</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-[var(--color-primary)] mr-2 mt-0.5 flex-shrink-0" /> You log in using your Mobile Number & OTP.</li>
                </ul>
              </div>
              <Link to="/login">
                <Button variant="outline" className="px-8">
                  Return to Login
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Apply;
