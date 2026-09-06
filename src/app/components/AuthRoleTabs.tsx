'use client';
import React from 'react';
import type { UserRole } from './AuthPageClient';

interface AuthRoleTabsProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roles: { id: UserRole; label: string; emoji: string; desc: string }[] = [
  { id: 'patient', label: 'Patient', emoji: '👴', desc: 'Elderly user playing cognitive games' },
  { id: 'caregiver', label: 'Caregiver', emoji: '👩‍⚕️', desc: 'Monitor assigned patients' },
  { id: 'chw', label: 'CHW', emoji: '🏥', desc: 'Community Health Worker' },
];

export default function AuthRoleTabs({ role, onRoleChange }: AuthRoleTabsProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-muted-foreground mb-2 text-center tracking-wide uppercase">I am a</p>
      <div className="grid grid-cols-3 gap-2">
        {roles.map((r) => (
          <button
            key={`role-${r.id}`}
            onClick={() => onRoleChange(r.id)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
              role === r.id
                ? 'border-primary bg-secondary shadow-sm'
                : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/50'
            }`}
          >
            <span className="text-2xl">{r.emoji}</span>
            <span className={`text-sm font-bold ${role === r.id ? 'text-primary' : 'text-foreground'}`}>{r.label}</span>
            <span className="text-xs text-muted-foreground text-center leading-tight hidden sm:block">{r.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}