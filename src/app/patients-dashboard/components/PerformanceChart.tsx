'use client';
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const sessionData = [
  { session: 'S1', memoryMatch: 65, sequenceRecall: 72, patternRecognition: 80 },
  { session: 'S2', memoryMatch: 70, sequenceRecall: 68, patternRecognition: 85 },
  { session: 'S3', memoryMatch: 62, sequenceRecall: 74, patternRecognition: 78 },
  { session: 'S4', memoryMatch: 75, sequenceRecall: 70, patternRecognition: 88 },
  { session: 'S5', memoryMatch: 78, sequenceRecall: 65, patternRecognition: 82 },
  { session: 'S6', memoryMatch: 80, sequenceRecall: 69, patternRecognition: 91 },
  { session: 'S7', memoryMatch: 82, sequenceRecall: 68, patternRecognition: 91 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="card-elevated p-3 text-sm min-w-[180px]">
      <p className="font-bold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={`tooltip-${entry.name}`} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground text-xs">{entry.name}</span>
          </div>
          <span className="font-bold text-foreground font-tabular">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

export default function PerformanceChart() {
  return (
    <div>
      <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Accuracy by Game — Last 7 Sessions</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={sessionData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="memoryGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="sequenceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--success)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--success)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="patternGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="session" tick={{ fontSize: 12, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }} axisLine={false} tickLine={false} />
          <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px', fontFamily: 'var(--font-sans)' }}
          />
          <Area type="monotone" dataKey="memoryMatch" name="Memory Match" stroke="var(--primary)" strokeWidth={2.5} fill="url(#memoryGrad)" dot={{ r: 3, fill: 'var(--primary)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
          <Area type="monotone" dataKey="sequenceRecall" name="Sequence Recall" stroke="var(--success)" strokeWidth={2.5} fill="url(#sequenceGrad)" dot={{ r: 3, fill: 'var(--success)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
          <Area type="monotone" dataKey="patternRecognition" name="Pattern Recognition" stroke="var(--accent)" strokeWidth={2.5} fill="url(#patternGrad)" dot={{ r: 3, fill: 'var(--accent)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}