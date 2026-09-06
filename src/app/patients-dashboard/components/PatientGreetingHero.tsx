import React from 'react';

export default function PatientGreetingHero() {
  const streakDays = 7;
  const totalSessions = 34;
  const avgAccuracy = 78;

  return (
    <div
      className="relative rounded-2xl p-6 sm:p-8 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 60%, #3B82F6 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #FFFFFF 0%, transparent 70%)', transform: 'translate(20%, -20%)' }} />
      <div className="absolute bottom-0 left-1/2 w-48 h-48 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }} />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">🌅</span>
            <p className="text-blue-200 text-base font-medium">Good Morning</p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Ratan Kumar Das</h1>
          <p className="text-blue-100 text-lg">
            Sunday, 6 September 2026
          </p>
          <p className="text-blue-200 text-base mt-1">
            You have played <span className="text-white font-bold">{totalSessions} sessions</span> so far. Keep it up! 🎉
          </p>
        </div>

        {/* Stats row */}
        <div className="flex flex-row sm:flex-col gap-3 sm:gap-4 sm:min-w-[200px]">
          {/* Streak */}
          <div className="flex-1 sm:flex-none rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span className="text-3xl streak-fire">🔥</span>
            <div>
              <p className="text-white text-2xl font-bold font-tabular">{streakDays}</p>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide">Day Streak</p>
            </div>
          </div>
          {/* Avg accuracy */}
          <div className="flex-1 sm:flex-none rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span className="text-3xl">🎯</span>
            <div>
              <p className="text-white text-2xl font-bold font-tabular">{avgAccuracy}%</p>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide">Avg Accuracy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily tip */}
      <div className="relative z-10 mt-5 flex items-start gap-3 rounded-xl p-4" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        <span className="text-xl flex-shrink-0">💡</span>
        <p className="text-amber-100 text-sm leading-relaxed">
          <span className="font-bold text-amber-200">Today&apos;s Tip:</span> Playing Memory Match in the morning helps activate short-term memory pathways. Try to complete at least one game before lunch!
        </p>
      </div>
    </div>
  );
}