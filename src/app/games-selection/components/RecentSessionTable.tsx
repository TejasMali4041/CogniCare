'use client';
import React, { useState } from 'react';

interface Session {
  id: string;
  date: string;
  game: string;
  gameEmoji: string;
  difficulty: string;
  score: number;
  accuracy: number;
  mistakes: number;
  responseTime: string;
  completionTime: string;
  performanceCategory: 'HIGH' | 'MEDIUM' | 'LOW';
}

const sessions: Session[] = [
  { id: 'sess-001', date: 'Sep 6, 2026', game: 'Pattern Recognition', gameEmoji: '🔵', difficulty: 'Easy', score: 91, accuracy: 91, mistakes: 1, responseTime: '2.8s', completionTime: '4m 12s', performanceCategory: 'HIGH' },
  { id: 'sess-002', date: 'Sep 5, 2026', game: 'Memory Match', gameEmoji: '🃏', difficulty: 'Medium', score: 82, accuracy: 82, mistakes: 3, responseTime: '3.4s', completionTime: '6m 55s', performanceCategory: 'HIGH' },
  { id: 'sess-003', date: 'Sep 5, 2026', game: 'Sequence Recall', gameEmoji: '🔢', difficulty: 'Easy', score: 68, accuracy: 68, mistakes: 4, responseTime: '4.1s', completionTime: '3m 40s', performanceCategory: 'MEDIUM' },
  { id: 'sess-004', date: 'Sep 4, 2026', game: 'Memory Match', gameEmoji: '🃏', difficulty: 'Medium', score: 80, accuracy: 80, mistakes: 3, responseTime: '3.2s', completionTime: '7m 10s', performanceCategory: 'HIGH' },
  { id: 'sess-005', date: 'Sep 3, 2026', game: 'Pattern Recognition', gameEmoji: '🔵', difficulty: 'Easy', score: 88, accuracy: 88, mistakes: 2, responseTime: '2.9s', completionTime: '5m 02s', performanceCategory: 'HIGH' },
  { id: 'sess-006', date: 'Sep 2, 2026', game: 'Sequence Recall', gameEmoji: '🔢', difficulty: 'Easy', score: 72, accuracy: 72, mistakes: 3, responseTime: '3.8s', completionTime: '4m 15s', performanceCategory: 'MEDIUM' },
  { id: 'sess-007', date: 'Sep 1, 2026', game: 'Memory Match', gameEmoji: '🃏', difficulty: 'Easy', score: 75, accuracy: 75, mistakes: 4, responseTime: '3.6s', completionTime: '5m 30s', performanceCategory: 'MEDIUM' },
  { id: 'sess-008', date: 'Aug 31, 2026', game: 'Pattern Recognition', gameEmoji: '🔵', difficulty: 'Easy', score: 62, accuracy: 62, mistakes: 6, responseTime: '4.5s', completionTime: '6m 20s', performanceCategory: 'LOW' },
];

const perfBadge: Record<string, string> = {
  HIGH: 'badge-high',
  MEDIUM: 'badge-medium',
  LOW: 'badge-low',
};

const diffBadge: Record<string, string> = {
  Easy: 'difficulty-easy',
  Medium: 'difficulty-medium',
  Hard: 'difficulty-hard',
};

export default function RecentSessionsTable() {
  const [filter, setFilter] = useState<string>('All');

  const filtered = filter === 'All' ? sessions : sessions.filter((s) => s.game === filter);
  const gameNames = ['All', 'Memory Match', 'Sequence Recall', 'Pattern Recognition'];

  return (
    <div className="card-elevated p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">Recent Sessions</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Your last {sessions.length} cognitive activity sessions</p>
        </div>
        {/* Filter tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto" style={{ backgroundColor: 'var(--muted)' }}>
          {gameNames.map((name) => (
            <button
              key={`filter-${name}`}
              onClick={() => setFilter(name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                filter === name ? 'tab-active' : 'tab-inactive'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--secondary)' }}>
              {['Date', 'Game', 'Difficulty', 'Score', 'Accuracy', 'Mistakes', 'Avg Response', 'Duration', 'Performance'].map((col) => (
                <th key={`col-${col}`} className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((session, idx) => (
              <tr
                key={session.id}
                className="border-t transition-colors hover:bg-secondary/50"
                style={{ borderColor: 'var(--border)', backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--background)' }}
              >
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap font-medium">{session.date}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span>{session.gameEmoji}</span>
                    <span className="font-semibold text-foreground">{session.game}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${diffBadge[session.difficulty]}`}>
                    {session.difficulty}
                  </span>
                </td>
                <td className="px-4 py-3 font-bold text-foreground font-tabular">{session.score}</td>
                <td className="px-4 py-3 font-tabular">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${session.accuracy}%`,
                          backgroundColor: session.accuracy >= 80 ? 'var(--success)' : session.accuracy >= 65 ? 'var(--warning)' : 'var(--danger)',
                        }}
                      />
                    </div>
                    <span className="font-semibold text-foreground">{session.accuracy}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-tabular">
                  <span className={`font-semibold ${session.mistakes <= 2 ? 'text-success' : session.mistakes <= 4 ? 'text-warning' : 'text-danger'}`}>
                    {session.mistakes}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground font-tabular">{session.responseTime}</td>
                <td className="px-4 py-3 text-muted-foreground font-tabular">{session.completionTime}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${perfBadge[session.performanceCategory]}`}>
                    {session.performanceCategory}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> of <span className="font-semibold text-foreground">{sessions.length}</span> sessions
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full badge-high inline-block"></span> HIGH</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full badge-medium inline-block"></span> MEDIUM</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full badge-low inline-block"></span> LOW</span>
        </div>
      </div>

      {/* Medical note */}
      <div className="mt-4 p-3 rounded-xl flex items-start gap-2" style={{ backgroundColor: '#F0F4FF', border: '1px solid #BFDBFE' }}>
        <span className="text-sm flex-shrink-0">ℹ️</span>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Cognitive Activity Record:</span> These scores reflect performance on memory and attention activities. They are not clinical assessments and do not indicate a diagnosis. Performance categories (HIGH/MEDIUM/LOW) are generated by the AI model based on session metrics.
        </p>
      </div>
    </div>
  );
}