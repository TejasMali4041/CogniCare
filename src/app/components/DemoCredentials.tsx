'use client';
import React, { useState } from 'react';
import type { UserRole } from './AuthPageClient';

interface DemoCredentialsProps {
  role: UserRole;
  onFill: (email: string, password: string) => void;
}

const demoAccounts: Record<UserRole, { email: string; password: string; label: string; emoji: string }> = {
  patient: { email: 'patient@demo.com', password: 'Demo@123', label: 'Patient Demo', emoji: '👴' },
  caregiver: { email: 'caregiver@demo.com', password: 'Demo@123', label: 'Caregiver Demo', emoji: '👩‍⚕️' },
  chw: { email: 'chw@demo.com', password: 'Demo@123', label: 'CHW Demo', emoji: '🏥' },
};

export default function DemoCredentials({ role, onFill }: DemoCredentialsProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const demo = demoAccounts[role];

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="mt-4 rounded-xl border-2 border-dashed overflow-hidden" style={{ borderColor: 'var(--accent)', backgroundColor: '#FFFBEB' }}>
      <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: '#FEF3C7' }}>
        <span className="text-base">{demo.emoji}</span>
        <span className="text-sm font-bold" style={{ color: '#92400E' }}>Demo Account — {demo.label}</span>
        <button
          onClick={() => onFill(demo.email, demo.password)}
          className="ml-auto px-3 py-1 rounded-lg text-xs font-bold transition-all duration-150 hover:opacity-90 active:scale-95"
          style={{ backgroundColor: 'var(--accent)', color: 'white' }}
        >
          Use this account →
        </button>
      </div>
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#92400E', minWidth: '56px' }}>Email</span>
            <code className="text-sm font-mono bg-white px-2 py-0.5 rounded-lg border" style={{ borderColor: '#FCD34D', color: '#1D4ED8' }}>{demo.email}</code>
          </div>
          <button
            onClick={() => handleCopy(demo.email, 'email')}
            className="p-1.5 rounded-lg transition-all hover:bg-amber-100"
            title="Copy email"
          >
            {copied === 'email' ? (
              <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-4 h-4" style={{ color: '#92400E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            )}
          </button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#92400E', minWidth: '56px' }}>Password</span>
            <code className="text-sm font-mono bg-white px-2 py-0.5 rounded-lg border" style={{ borderColor: '#FCD34D', color: '#1D4ED8' }}>{demo.password}</code>
          </div>
          <button
            onClick={() => handleCopy(demo.password, 'password')}
            className="p-1.5 rounded-lg transition-all hover:bg-amber-100"
            title="Copy password"
          >
            {copied === 'password' ? (
              <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-4 h-4" style={{ color: '#92400E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}