import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Phone, Lock } from 'lucide-react';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = mobile, 2 = OTP

  const handleSendOtp = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (onLogin) onLogin();
    // Simulate auth success
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center space-x-2 mb-2">
          <svg className="w-8 h-8 text-[var(--color-primary)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <h2 className="text-center text-3xl font-extrabold text-[var(--color-primary)] tracking-tight">
            MedCred
          </h2>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold text-[var(--color-text)]">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--color-subtext)]">
          Sign in to your agent portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-lg border-0 ring-1 ring-[var(--color-border)] sm:rounded-2xl sm:px-10 bg-white">
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <Input
                label="Mobile Number"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                icon={Phone}
                required
              />
              <Button type="submit" className="w-full h-11 text-base shadow-sm">
                Get OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-center text-sm text-blue-800 mb-6">
                We've sent a 6-digit OTP to your mobile number.
              </div>
              <Input
                label="Secure OTP"
                type="text"
                placeholder="• • • • • •"
                icon={Lock}
                maxLength="6"
                required
                className="text-center tracking-[0.5em] text-xl font-mono"
              />
              <Button type="submit" className="w-full h-11 text-base shadow-sm">
                Verify & Login
              </Button>
              <div className="text-center mt-6">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="text-sm font-medium text-[var(--color-primary)] hover:underline transition-colors"
                >
                  Change Mobile Number
                </button>
              </div>
            </form>
          )}
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--color-subtext)] mb-3">Don't have an agent account yet?</p>
          <button 
            onClick={() => navigate('/apply')}
            className="text-[var(--color-primary)] font-semibold hover:underline"
          >
            Become a MedCred Agent &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
