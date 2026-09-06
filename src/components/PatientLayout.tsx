import React from 'react';
import PatientTopbar from './PatientTopbar';

interface PatientLayoutProps {
  children: React.ReactNode;
  activeRoute?: string;
}

export default function PatientLayout({ children, activeRoute }: PatientLayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <PatientTopbar activeRoute={activeRoute} />
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16 py-6 pb-24 md:pb-8">
        {children}
      </main>
      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden z-40 border-t" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-around py-2 px-4">
          <MobileNavItem href="/patient-dashboard" icon="🏠" label="Home" active={activeRoute === '/patient-dashboard'} />
          <MobileNavItem href="/games-selection" icon="🎮" label="Games" active={activeRoute === '/games-selection'} />
          <MobileNavItem href="/patient-dashboard#reminders" icon="🔔" label="Reminders" active={false} />
          <MobileNavItem href="/patient-dashboard#profile" icon="👤" label="Profile" active={false} />
        </div>
      </nav>
    </div>
  );
}

function MobileNavItem({ href, icon, label, active }: { href: string; icon: string; label: string; active: boolean }) {
  return (
    <a
      href={href}
      className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-150 ${
        active ? 'text-primary' : 'text-muted-foreground'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className={`text-xs font-semibold ${active ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
    </a>
  );
}