import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Upload, User, MapPin, CreditCard, Camera, X } from 'lucide-react';
import { dummyRecentRegistrations } from '../../data/dummyData';

const RegisterUser = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    email: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhaarNumber: '',
  });

  useEffect(() => {
    if (isEditMode) {
      // Find dummy user
      const userToEdit = dummyRecentRegistrations.find(u => u.id === id);
      if (userToEdit) {
        setFormData(prev => ({
          ...prev,
          fullName: userToEdit.name,
          mobile: userToEdit.mobile,
          // other fields would be loaded from API here
        }));
      }
    }
  }, [id, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    alert(isEditMode ? 'User Updated!' : 'User Registration Submitted!');
  };

  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleImageUpload = (e, setSide) => {
    const file = e.target.files[0];
    if (file) {
      setSide(URL.createObjectURL(file));
    }
  };

  const handleAadhaarUploadClick = (inputId) => {
    document.getElementById(inputId).click();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-end items-center">
        <div className="space-x-3">
          <Button variant="outline">Save Draft</Button>
          <Button onClick={handleSubmit}>{isEditMode ? 'Update Registration' : 'Submit Registration'}</Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Personal Information */}
        <Card>
          <div className="flex items-center mb-4 text-[var(--color-primary)]">
            <User className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="e.g. Rahul Sharma" required />
            <Input label="Mobile Number" type="tel" placeholder="10-digit number" required />
            <Input label="Email Address" type="email" placeholder="Optional" />
            <Input label="Date of Birth" type="date" required />
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-[var(--color-text)]">Gender</label>
              <select className="block w-full rounded-md shadow-sm sm:text-sm py-2 px-3 border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-colors">
                <option>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Address */}
        <Card>
          <div className="flex items-center mb-4 text-[var(--color-primary)]">
            <MapPin className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Address</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Input label="Full Address" placeholder="Street, House No, Landmark" required />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="City" placeholder="City" required />
              <Input label="State" placeholder="State" required />
              <Input label="Pincode" placeholder="6-digit Pincode" required />
            </div>
          </div>
        </Card>

        {/* Aadhaar */}
        <Card>
          <div className="flex items-center mb-4 text-[var(--color-primary)]">
            <CreditCard className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Primary Aadhaar Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input label="Aadhaar Number" placeholder="12-digit Aadhaar Number" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Front Upload */}
            <div 
              onClick={() => !aadhaarFront && handleAadhaarUploadClick('aadhaar-front-upload')}
              className={`border-2 border-dashed border-[var(--color-border)] rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors ${!aadhaarFront ? 'cursor-pointer' : ''} relative overflow-hidden h-48`}
            >
              <input 
                type="file" 
                id="aadhaar-front-upload" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setAadhaarFront)}
              />
              {aadhaarFront ? (
                <div className="absolute inset-0 w-full h-full bg-white group flex items-center justify-center p-2">
                  <img src={aadhaarFront} alt="Aadhaar Front" className="max-w-full max-h-full object-contain" />
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setAadhaarFront(null); }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow border border-gray-200 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-[var(--color-subtext)] mb-2" />
                  <span className="text-sm font-medium text-[var(--color-text)]">Upload Aadhaar Front</span>
                  <span className="text-xs text-[var(--color-subtext)] mt-1">JPG, PNG up to 5MB</span>
                </>
              )}
            </div>

            {/* Back Upload */}
            <div 
              onClick={() => !aadhaarBack && handleAadhaarUploadClick('aadhaar-back-upload')}
              className={`border-2 border-dashed border-[var(--color-border)] rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors ${!aadhaarBack ? 'cursor-pointer' : ''} relative overflow-hidden h-48`}
            >
              <input 
                type="file" 
                id="aadhaar-back-upload" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setAadhaarBack)}
              />
              {aadhaarBack ? (
                <div className="absolute inset-0 w-full h-full bg-white group flex items-center justify-center p-2">
                  <img src={aadhaarBack} alt="Aadhaar Back" className="max-w-full max-h-full object-contain" />
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setAadhaarBack(null); }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow border border-gray-200 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-[var(--color-subtext)] mb-2" />
                  <span className="text-sm font-medium text-[var(--color-text)]">Upload Aadhaar Back</span>
                  <span className="text-xs text-[var(--color-subtext)] mt-1">JPG, PNG up to 5MB</span>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Profile Photo */}
        <Card>
          <div className="flex items-center mb-4 text-[var(--color-primary)]">
            <Camera className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Profile Photo</h3>
          </div>
          <div className="flex items-center space-x-6">
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border border-[var(--color-border)] overflow-hidden shrink-0">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-[var(--color-subtext)]" />
              )}
            </div>
            <div className="flex items-center space-x-4">
              <input 
                type="file" 
                id="profile-photo-upload" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setProfilePhoto)}
              />
              <Button variant="outline" type="button" className="flex items-center" onClick={() => handleAadhaarUploadClick('profile-photo-upload')}>
                <Camera className="h-4 w-4 mr-2" />
                {profilePhoto ? 'Change Photo' : 'Capture or Upload Photo'}
              </Button>
              
              {profilePhoto && (
                <button 
                  type="button" 
                  className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors" 
                  onClick={() => setProfilePhoto(null)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </Card>

      </form>
    </div>
  );
};

export default RegisterUser;
