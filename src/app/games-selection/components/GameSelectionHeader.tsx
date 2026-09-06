import React from 'react';

export default function GamesSelectionHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <a href="/patient-dashboard" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </a>
          <span className="text-muted-foreground text-sm">/</span>
          <span className="text-foreground text-sm font-semibold">Games</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Choose Your Game</h1>
        <p className="text-muted-foreground mt-1 text-base">
          Pick a cognitive activity to start your training session
        </p>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: 'var(--secondary)', border: '1px solid var(--border)' }}>
          <span className="text-lg">🏆</span>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Best Score</p>
            <p className="text-base font-bold text-foreground font-tabular">91 pts</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: 'var(--secondary)', border: '1px solid var(--border)' }}>
          <span className="text-lg">📊</span>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Total Sessions</p>
            <p className="text-base font-bold text-foreground font-tabular">34</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: 'var(--secondary)', border: '1px solid var(--border)' }}>
          <span className="text-lg">🔥</span>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Streak</p>
            <p className="text-base font-bold text-foreground font-tabular">7 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}