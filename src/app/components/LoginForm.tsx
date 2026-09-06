'use client';
import React, { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { UserRole } from './AuthPageClient';

interface LoginFormProps {
  form: UseFormReturn<{ email: string; password: string; remember: boolean }>;
  onSubmit: (data: { email: string; password: string; remember: boolean }) => void;
  isLoading: boolean;
  role: UserRole;
}

const roleGreetings: Record<UserRole, { title: string; subtitle: string }> = {
  patient: { title: 'Welcome Back! 😊', subtitle: "Let's play some brain games today." },
  caregiver: { title: 'Caregiver Portal', subtitle: 'Monitor your patients\' cognitive progress.' },
  chw: { title: 'CHW Dashboard', subtitle: 'Community health monitoring and follow-up.' },
};

export default function LoginForm({ form, onSubmit, isLoading, role }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = form;
  const greeting = roleGreetings[role];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{greeting.title}</h2>
        <p className="text-muted-foreground mt-1">{greeting.subtitle}</p>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="login-email" className="block text-base font-semibold text-foreground mb-1.5">
          Email Address
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="your@email.com"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
          })}
          className={`w-full px-4 py-3 rounded-xl border text-base transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/30 ${
            errors.email ? 'border-danger bg-red-50' : 'border-border bg-input focus:border-primary'
          }`}
        />
        {errors.email && <p className="mt-1 text-sm text-danger font-medium">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="login-password" className="text-base font-semibold text-foreground">
            Password
          </label>
          <a href="#" className="text-sm text-primary font-medium hover:underline">Forgot password?</a>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
            className={`w-full px-4 py-3 pr-12 rounded-xl border text-base transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/30 ${
              errors.password ? 'border-danger bg-red-50' : 'border-border bg-input focus:border-primary'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-danger font-medium">{errors.password.message}</p>}
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-2">
        <input
          id="login-remember"
          type="checkbox"
          {...register('remember')}
          className="w-4 h-4 rounded border-border text-primary accent-primary cursor-pointer"
        />
        <label htmlFor="login-remember" className="text-base text-muted-foreground cursor-pointer select-none">
          Remember me on this device
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        style={{ minHeight: '52px' }}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Signing in...</span>
          </>
        ) : (
          <span>Sign In to CogniCare</span>
        )}
      </button>
    </form>
  );
}