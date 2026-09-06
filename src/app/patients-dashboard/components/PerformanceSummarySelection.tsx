'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const PerformanceChart = dynamic(() => import('./PerformanceChart'), { ssr: false });

const stats = [
  { id: 'stat-sessions', label: 'Sessions This Week', value: '5', unit: '', emoji: '🎮', positive: true, change: '+2 vs last week' },
  { id: 'stat-accuracy', label: 'Average Accuracy', value: '78', unit: '%', emoji: '🎯', positive: true, change: '+4% vs last week' },
  { id: 'stat-response', label: 'Avg Response Time', value: '3.2', unit: 's', emoji: '⚡', positive: false, change: '+0.4s vs last week' },
  { id: 'stat-streak', label: 'Current Streak', value: '7', unit: ' days', emoji: '🔥', positive: true, change: 'Personal best!' },
];

export default function PerformanceSummarySection() {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Performance</h2>
          <p className="text-muted-foreground text-sm mt-0.5">Last 7 sessions — cognitive activity trend</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>
          <span className="w-2 h-2 rounded-full bg-success"></span>
          <span>Updated just now</span>
        </div>
      </div>

      {/* Stat mini cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats?.map((stat) => (
          <div key={stat?.id} className="rounded-xl p-4" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{stat?.emoji}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stat?.positive ? 'badge-high' : 'badge-medium'}`}>
                {stat?.change}
              </span>
            </div>
            <p className="text-2xl font-bold font-tabular text-foreground">
              {stat?.value}<span className="text-base font-semibold text-muted-foreground">{stat?.unit}</span>
            </p>
            <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wide">{stat?.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <PerformanceChart />

      {/* AI insight */}
      <div className="mt-4 flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
        <span className="text-xl flex-shrink-0">🤖</span>
        <div>
          <p className="text-sm font-bold text-foreground mb-1">AI Performance Insight</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your Memory Match accuracy has improved consistently over the past 5 sessions. The AI recommends increasing difficulty to Medium for this game. Sequence Recall shows a slight dip — consider practising this more this week.
          </p>
          <p className="text-xs text-muted-foreground mt-2 italic">
            This is a cognitive activity summary, not a medical assessment.
          </p>
        </div>
      </div>
    </div>
  );
}