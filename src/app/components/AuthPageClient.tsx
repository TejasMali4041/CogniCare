'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import AppLogo from '@/components/ui/AppLogo';
import AuthRoleTabs from './AuthRoleTabs';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import DemoCredentials from './DemoCredentials';

export type UserRole = 'patient' | 'caregiver' | 'chw';
export type AuthMode = 'login' | 'register';

export default function AuthPageClient() {
  const [role, setRole] = useState<UserRole>('patient');
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm({
    defaultValues: { email: '', password: '', remember: false },
  });

  const registerForm = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      language: 'en',
      role: 'patient' as UserRole,
    },
  });

  const handleLoginSubmit = async (data: { email: string; password: string; remember: boolean }) => {
    setIsLoading(true);
    // BACKEND INTEGRATION: POST /api/auth/login with { email, password, role }
    await new Promise((r) => setTimeout(r, 1200));

    const demoMap: Record<UserRole, { email: string; password: string }> = {
      patient: { email: 'patient@demo.com', password: 'Demo@123' },
      caregiver: { email: 'caregiver@demo.com', password: 'Demo@123' },
      chw: { email: 'chw@demo.com', password: 'Demo@123' },
    };

    const demo = demoMap[role];
    if (data.email === demo.email && data.password === demo.password) {
      toast.success('Login successful! Welcome to CogniCare.', { duration: 3000 });
      setTimeout(() => {
        if (role === 'patient') window.location.href = '/patients-dashboard';
        else if (role === 'caregiver') window.location.href = '/caregiver-dashboard';
        else window.location.href = '/chw-dashboard';
      }, 800);
    } else {
      toast.error('Invalid credentials — use the demo accounts below to sign in', { duration: 4000 });
      loginForm.setError('email', { message: ' ' });
      loginForm.setError('password', { message: 'Invalid credentials — use the demo accounts below' });
    }
    setIsLoading(false);
  };

  const handleRegisterSubmit = async (_data: Record<string, string | boolean>) => {
    setIsLoading(true);
    // BACKEND INTEGRATION: POST /api/auth/register with full user data
    await new Promise((r) => setTimeout(r, 1400));
    toast.success('Account created! Please log in to continue.', { duration: 3000 });
    setMode('login');
    setIsLoading(false);
  };

  const handleDemoFill = (email: string, password: string) => {
    loginForm.setValue('email', email);
    loginForm.setValue('password', password);
    toast.info('Demo credentials filled — click Sign In to continue', { duration: 2500 });
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background)' }}>
      {/* Left brand panel */}
      <div
        className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between p-10 xl:p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #1E3A5F 0%, #1D4ED8 50%, #2563EB 100%)' }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #60A5FA 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <AppLogo size={44} />
          <span className="text-2xl font-bold text-white tracking-tight">CogniCare</span>
        </div>

        {/* Hero content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Cognitive Care,<br />
              <span style={{ color: '#FCD34D' }}>Close to Home</span>
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed max-w-md">
              AI-powered memory games and cognitive training designed for elderly patients across Northeast India — in their language, at their pace.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            {[
              { icon: '🎮', title: '3 Cognitive Games', desc: 'Memory Match, Sequence Recall, Pattern Recognition' },
              { icon: '🗣️', title: '5 Regional Languages', desc: 'English, Hindi, Assamese, Bengali, Manipuri' },
              { icon: '🤖', title: 'AI Adaptive Difficulty', desc: 'Random Forest model personalizes each session' },
              { icon: '👨‍⚕️', title: 'Caregiver & CHW Support', desc: 'Real-time monitoring and alert system' },
            ].map((feat) => (
              <div key={`feat-${feat.icon}`} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                  {feat.icon}
                </div>
                <div>
                  <p className="font-semibold text-white text-base">{feat.title}</p>
                  <p className="text-blue-200 text-sm">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical disclaimer */}
        <div className="relative z-10 p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <p className="text-blue-100 text-xs leading-relaxed">
            <span className="font-semibold text-white">⚕️ Medical Note:</span> CogniCare is a cognitive activity and monitoring tool. It is not a diagnostic instrument and does not provide medical diagnoses. Always consult a healthcare professional for clinical concerns.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-10 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <AppLogo size={36} />
          <span className="text-xl font-bold text-foreground">CogniCare</span>
        </div>

        <div className="w-full max-w-md xl:max-w-lg">
          {/* Mode toggle */}
          <div className="flex items-center justify-center gap-1 p-1 rounded-2xl mb-6" style={{ backgroundColor: 'var(--muted)' }}>
            {(['login', 'register'] as AuthMode[]).map((m) => (
              <button
                key={`mode-${m}`}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 ${
                  mode === m ? 'tab-active' : 'tab-inactive'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Role tabs */}
          <AuthRoleTabs role={role} onRoleChange={setRole} />

          {/* Form card */}
          <div className="card-elevated p-6 sm:p-8 mt-5">
            {mode === 'login' ? (
              <LoginForm
                form={loginForm}
                onSubmit={handleLoginSubmit}
                isLoading={isLoading}
                role={role}
              />
            ) : (
              <RegisterForm
                form={registerForm}
                onSubmit={handleRegisterSubmit}
                isLoading={isLoading}
                role={role}
              />
            )}
          </div>

          {/* Demo credentials */}
          {mode === 'login' && (
            <DemoCredentials role={role} onFill={handleDemoFill} />
          )}

          {/* Toggle mode link */}
          <p className="text-center mt-5 text-base text-muted-foreground">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="font-semibold text-primary hover:underline"
            >
              {mode === 'login' ? 'Register here' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}