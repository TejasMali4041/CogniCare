import React from 'react';

const reminders = [
  {
    id: 'rem-001',
    title: 'Morning Brain Game',
    time: '9:00 AM',
    type: 'game',
    emoji: '🎮',
    status: 'upcoming',
    note: 'Play Memory Match for 10 minutes',
  },
  {
    id: 'rem-002',
    title: 'Medication Reminder',
    time: '11:30 AM',
    type: 'medication',
    emoji: '💊',
    status: 'upcoming',
    note: 'Donepezil 10mg with water',
  },
  {
    id: 'rem-003',
    title: 'Afternoon Session',
    time: '3:00 PM',
    type: 'game',
    emoji: '🧩',
    status: 'upcoming',
    note: 'Pattern Recognition practice',
  },
  {
    id: 'rem-004',
    title: 'Doctor Check-in',
    time: '5:00 PM',
    type: 'appointment',
    emoji: '👨‍⚕️',
    status: 'upcoming',
    note: 'Video call with Dr. Sharma',
  },
];

const typeColors: Record<string, string> = {
  game: 'badge-info',
  medication: 'badge-medium',
  appointment: 'badge-high',
};

export default function RemindersPanel() {
  return (
    <div className="card-elevated p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Today&apos;s Reminders</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Sunday, 6 Sep 2026</p>
        </div>
        <button className="p-2 rounded-xl hover:bg-secondary transition-colors" title="Add reminder">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="space-y-2">
        {reminders.map((rem) => (
          <div
            key={rem.id}
            className="reminder-item flex items-start gap-3 p-3 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: 'var(--secondary)' }}>
              {rem.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="text-sm font-bold text-foreground truncate">{rem.title}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${typeColors[rem.type]}`}>
                  {rem.time}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{rem.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state placeholder */}
      <div className="mt-4 pt-4" style={{ borderTop: '1px dashed var(--border)' }}>
        <button className="w-full py-3 rounded-xl text-sm font-semibold text-primary hover:bg-secondary transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Reminder
        </button>
      </div>

      {/* Caregiver note */}
      <div className="mt-3 p-3 rounded-xl flex items-start gap-2" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
        <span className="text-sm flex-shrink-0">👩‍⚕️</span>
        <p className="text-xs text-success leading-relaxed">
          <span className="font-bold">Caregiver note:</span> Dr. Priya Gogoi added 2 reminders for today. All your medications are on schedule.
        </p>
      </div>
    </div>
  );
}