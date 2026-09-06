'use client';
import React, { useState } from 'react';
import AppLogo from '@/components/ui/AppLogo';

interface PatientTopbarProps {
  activeRoute?: string;
}

const languages = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'hi', label: 'हि', full: 'Hindi' },
  { code: 'as', label: 'অ', full: 'Assamese' },
  { code: 'bn', label: 'বাং', full: 'Bengali' },
  { code: 'mni', label: 'ꯃꯩ', full: 'Manipuri' },
];

export default function PatientTopbar({ activeRoute }: PatientTopbarProps) {
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');

  const navItems = [
    { href: '/patient-dashboard', label: 'Home', emoji: '🏠' },
    { href: '/games-selection', label: 'Games', emoji: '🎮' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 1px 4px rgba(15,23,42,0.06)' }}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <AppLogo size={36} />
          <span className="font-bold text-lg text-foreground hidden sm:block tracking-tight">CogniCare</span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={`nav-${item.href}`}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                activeRoute === item.href
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
              }`}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border font-semibold text-sm transition-all duration-150 hover:bg-secondary"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <span>{languages.find(l => l.code === selectedLang)?.label}</span>
              <svg className="w-3 h-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border shadow-modal z-50 overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                {languages.map((lang) => (
                  <button
                    key={`lang-${lang.code}`}
                    onClick={() => { setSelectedLang(lang.code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary ${selectedLang === lang.code ? 'text-primary bg-secondary' : 'text-foreground'}`}
                  >
                    <span className="font-bold w-6">{lang.label}</span>
                    <span>{lang.full}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification bell */}
          <button className="relative p-2 rounded-xl transition-all duration-150 hover:bg-secondary" style={{ color: 'var(--muted-foreground)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger"></span>
          </button>

          {/* User avatar */}
          <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-150 hover:bg-secondary">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground" style={{ backgroundColor: 'var(--primary)' }}>
              R
            </div>
            <span className="hidden sm:block text-sm font-semibold text-foreground">Ratan Das</span>
          </button>
        </div>
      </div>
    </header>
  );
}