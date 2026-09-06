'use client';
import React from 'react';
import PatientLayout from '@/components/PatientLayout';
import PatientGreetingHero from './components/PatientGreetingHero';
import TodayGameCards from './components/TodayGameCards';
import PerformanceSummarySection from './components/PerformanceSummarySelection';
import RemindersPanel from './components/ReminderPanel';
import VoiceCommandButton from './components/VoiceCommandButton';

export default function PatientDashboardPage() {
  return (
    <PatientLayout activeRoute="/patient-dashboard">
      <div className="space-y-6 fade-in">
        {/* Greeting hero */}
        <PatientGreetingHero />

        {/* Main grid: games + performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
          {/* Today's games - spans 2 cols */}
          <div className="lg:col-span-2">
            <TodayGameCards />
          </div>
          {/* Reminders panel */}
          <div className="lg:col-span-1">
            <RemindersPanel />
          </div>
        </div>

        {/* Performance summary full width */}
        <PerformanceSummarySection />
      </div>

      {/* Floating voice button */}
      <VoiceCommandButton />
    </PatientLayout>
  );
}