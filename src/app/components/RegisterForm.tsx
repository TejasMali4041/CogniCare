'use client';
import React, { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { UserRole } from './AuthPageClient';

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  language: string;
  role: UserRole;
}

interface RegisterFormProps {
  form: UseFormReturn<RegisterFormValues>;
  onSubmit: (data: Record<string, string | boolean>) => void;
  isLoading: boolean;
  role: UserRole;
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi (हिन्दी)' },
  { code: 'as', label: 'Assamese (অসমীয়া)' },
  { code: 'bn', label: 'Bengali (বাংলা)' },
  { code: 'mni', label: 'Manipuri (ꯃꯩꯇꯩꯂꯣꯟ)' },
];

export default function RegisterForm({ form, onSubmit, isLoading, role }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = form;
  const password = watch('password');

  return (
    <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Register as a {role === 'chw' ? 'Community Health Worker' : role === 'caregiver' ? 'Caregiver' : 'Patient'}
        </p>
      </div>

      {/* Full name */}
      <div>
        <label htmlFor="reg-name" className="block text-base font-semibold text-foreground mb-1.5">
          Full Name
        </label>
        <input
          id="reg-name"
          type="text"
          autoComplete="name"
          placeholder="Ratan Kumar Das"
          {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
          className={`w-full px-4 py-3 rounded-xl border text-base transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/30 ${errors.fullName ? 'border-danger bg-red-50' : 'border-border bg-input focus:border-primary'}`}
        />
        {errors.fullName && <p className="mt-1 text-sm text-danger font-medium">{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="reg-email" className="block text-base font-semibold text-foreground mb-1.5">
          Email Address
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder="your@email.com"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
          })}
          className={`w-full px-4 py-3 rounded-xl border text-base transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/30 ${errors.email ? 'border-danger bg-red-50' : 'border-border bg-input focus:border-primary'}`}
        />
        {errors.email && <p className="mt-1 text-sm text-danger font-medium">{errors.email.message}</p>}
      </div>

      {/* Language preference */}
      {role === 'patient' && (
        <div>
          <label htmlFor="reg-language" className="block text-base font-semibold text-foreground mb-1.5">
            Preferred Language
          </label>
          <p className="text-sm text-muted-foreground mb-2">Games and instructions will appear in this language.</p>
          <select
            id="reg-language"
            {...register('language')}
            className="w-full px-4 py-3 rounded-xl border border-border bg-input text-base outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={`reglang-${lang.code}`} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Password */}
      <div>
        <label htmlFor="reg-password" className="block text-base font-semibold text-foreground mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              pattern: { value: /^(?=.*[A-Z])(?=.*[0-9])/, message: 'Must include uppercase letter and number' },
            })}
            className={`w-full px-4 py-3 pr-12 rounded-xl border text-base transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/30 ${errors.password ? 'border-danger bg-red-50' : 'border-border bg-input focus:border-primary'}`}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            )}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-danger font-medium">{errors.password.message}</p>}
      </div>

      {/* Confirm password */}
      <div>
        <label htmlFor="reg-confirm" className="block text-base font-semibold text-foreground mb-1.5">
          Confirm Password
        </label>
        <input
          id="reg-confirm"
          type="password"
          placeholder="Re-enter password"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (val) => val === password || 'Passwords do not match',
          })}
          className={`w-full px-4 py-3 rounded-xl border text-base transition-all duration-150 outline-none focus:ring-2 focus:ring-primary/30 ${errors.confirmPassword ? 'border-danger bg-red-50' : 'border-border bg-input focus:border-primary'}`}
        />
        {errors.confirmPassword && <p className="mt-1 text-sm text-danger font-medium">{errors.confirmPassword.message}</p>}
      </div>

      {/* Terms */}
      <p className="text-xs text-muted-foreground">
        By registering, you agree to our{' '}
        <a href="#" className="text-primary font-medium hover:underline">Terms of Service</a> and{' '}
        <a href="#" className="text-primary font-medium hover:underline">Privacy Policy</a>.
      </p>

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
            <span>Creating account...</span>
          </>
        ) : (
          <span>Create My Account</span>
        )}
      </button>
    </form>
  );
}