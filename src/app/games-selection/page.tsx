import React from 'react';
import PatientLayout from '@/components/PatientLayout';
import GamesSelectionHeader from './components/GameSelectionHeader';
import AIRecommendationBanner from './components/AIRecommenddationBanner';
import GameCardGrid from './components/GameCardGrid';
import RecentSessionsTable from './components/RecentSessionTable';

export default function GamesSelectionPage() {
  return (
    <PatientLayout activeRoute="/games-selection">
      <div className="space-y-6 fade-in">
        <GamesSelectionHeader />
        <AIRecommendationBanner />
        <GameCardGrid />
        <RecentSessionsTable />
      </div>
    </PatientLayout>
  );
}