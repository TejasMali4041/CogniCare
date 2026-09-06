'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const patients = [
  { id: 1, name: 'Ratan Das', age: 72, lastActive: '2 hours ago', trend: 'improving', score: 84, accuracy: 88, sessions: 24, alert: null, avatar: 'R', condition: 'Mild Cognitive Impairment' },
  { id: 2, name: 'Meena Sharma', age: 68, lastActive: 'Yesterday', trend: 'stable', score: 71, accuracy: 74, sessions: 18, alert: 'Performance change detected in recent memory activities.', avatar: 'M', condition: 'Early Stage Support' },
  { id: 3, name: 'Gopal Bora', age: 75, lastActive: '3 days ago', trend: 'declining', score: 52, accuracy: 58, sessions: 11, alert: 'Significant accuracy drop over last 5 sessions. Consider reviewing.', avatar: 'G', condition: 'Cognitive Support' },
];

const trendData = [
  { day: 'Mon', memory: 78, sequence: 65, pattern: 82 },
  { day: 'Tue', memory: 82, sequence: 70, pattern: 79 },
  { day: 'Wed', memory: 80, sequence: 68, pattern: 85 },
  { day: 'Thu', memory: 85, sequence: 72, pattern: 88 },
  { day: 'Fri', memory: 84, sequence: 71, pattern: 84 },
  { day: 'Sat', memory: 88, sequence: 75, pattern: 90 },
  { day: 'Sun', memory: 84, sequence: 73, pattern: 87 },
];

const reminders = [
  { id: 1, patient: 'Ratan Das', title: 'Morning Medication', time: '08:00 AM', type: 'medicine', status: 'pending' },
  { id: 2, patient: 'Meena Sharma', title: 'Hydration Reminder', time: '10:00 AM', type: 'hydration', status: 'done' },
  { id: 3, patient: 'Gopal Bora', title: 'Cognitive Exercise', time: '03:00 PM', type: 'exercise', status: 'pending' },
  { id: 4, patient: 'Ratan Das', title: 'Doctor Appointment', time: 'Tomorrow 11:00 AM', type: 'appointment', status: 'pending' },
];

const recentActivity = [
  { patient: 'Ratan Das', game: 'Memory Match', score: 84, accuracy: '88%', difficulty: 'Medium', time: '2h ago' },
  { patient: 'Meena Sharma', game: 'Pattern Recognition', score: 71, accuracy: '74%', difficulty: 'Easy', time: '5h ago' },
  { patient: 'Gopal Bora', game: 'Sequence Recall', score: 52, accuracy: '58%', difficulty: 'Easy', time: '3d ago' },
];

const typeEmoji: Record<string, string> = { medicine: '💊', hydration: '💧', exercise: '🧠', appointment: '🏥' };

export default function CaregiverDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'reminders' | 'alerts'>('overview');
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [newReminder, setNewReminder] = useState({ title: '', patient: '', time: '', type: 'medicine' });
  const [remindersList, setRemindersList] = useState(reminders);
  const [showAddReminder, setShowAddReminder] = useState(false);

  const alerts = patients.filter(p => p.alert);

  const addReminder = () => {
    if (!newReminder.title || !newReminder.patient) return;
    setRemindersList(prev => [...prev, { id: Date.now(), ...newReminder, status: 'pending' }]);
    setNewReminder({ title: '', patient: '', time: '', type: 'medicine' });
    setShowAddReminder(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 1px 4px rgba(15,23,42,0.06)' }}>
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg">C</div>
            <div>
              <span className="font-bold text-lg text-foreground">CogniCare</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Caregiver</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">Dr. Priya Nath</span>
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">P</div>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors">Logout</Link>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Assigned Patients', value: patients.length, icon: '👥', color: 'text-primary', bg: 'bg-blue-50' },
            { label: 'Active Today', value: 2, icon: '✅', color: 'text-success', bg: 'bg-green-50' },
            { label: 'Pending Reminders', value: remindersList.filter(r => r.status === 'pending').length, icon: '🔔', color: 'text-warning', bg: 'bg-yellow-50' },
            { label: 'Active Alerts', value: alerts.length, icon: '⚠️', color: 'text-danger', bg: 'bg-red-50' },
          ].map(s => (
            <div key={s.label} className="card-elevated p-5">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
              <p className={`text-3xl font-bold font-tabular ${s.color}`}>{s.value}</p>
              <p className="text-sm text-muted-foreground font-semibold mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-secondary w-fit">
          {(['overview', 'patients', 'reminders', 'alerts'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === tab ? 'tab-active' : 'tab-inactive'}`}>
              {tab === 'alerts' && alerts.length > 0 ? `Alerts (${alerts.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Performance trend chart */}
            <div className="card-elevated p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Weekly Performance Trends</h2>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis domain={[40, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="memory" stroke="#2563EB" fill="#DBEAFE" name="Memory Match" strokeWidth={2} />
                  <Area type="monotone" dataKey="sequence" stroke="#16A34A" fill="#DCFCE7" name="Sequence Recall" strokeWidth={2} />
                  <Area type="monotone" dataKey="pattern" stroke="#F59E0B" fill="#FEF3C7" name="Pattern Recognition" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recent activity */}
            <div className="card-elevated p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Recent Patient Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">{a.patient[0]}</div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{a.patient}</p>
                        <p className="text-xs text-muted-foreground">{a.game} · {a.difficulty} · {a.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{a.score}</p>
                      <p className="text-xs text-muted-foreground">{a.accuracy} accuracy</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="space-y-4">
            {selectedPatient ? (
              <div className="space-y-4">
                <button onClick={() => setSelectedPatient(null)} className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  ← Back to Patient List
                </button>
                <div className="card-elevated p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary text-white font-bold text-2xl flex items-center justify-center">{selectedPatient.avatar}</div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{selectedPatient.name}</h2>
                      <p className="text-muted-foreground">{selectedPatient.condition} · Age {selectedPatient.age}</p>
                      <p className="text-xs text-muted-foreground mt-1">Last active: {selectedPatient.lastActive}</p>
                    </div>
                    <div className="ml-auto">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedPatient.trend === 'improving' ? 'bg-green-100 text-green-700' : selectedPatient.trend === 'stable' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {selectedPatient.trend === 'improving' ? '↑ Improving' : selectedPatient.trend === 'stable' ? '→ Stable' : '↓ Needs Attention'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Avg Score', value: selectedPatient.score, color: 'text-primary' },
                      { label: 'Accuracy', value: `${selectedPatient.accuracy}%`, color: 'text-success' },
                      { label: 'Sessions', value: selectedPatient.sessions, color: 'text-foreground' },
                    ].map(s => (
                      <div key={s.label} className="bg-secondary/50 rounded-xl p-4 text-center">
                        <p className={`text-2xl font-bold font-tabular ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-muted-foreground font-semibold mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  {selectedPatient.alert && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm font-semibold text-red-700">⚠️ Alert: {selectedPatient.alert}</p>
                    </div>
                  )}
                </div>
                <div className="card-elevated p-6">
                  <h3 className="font-bold text-foreground mb-4">Performance Trend (7 days)</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis domain={[40, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="memory" fill="#2563EB" name="Score" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {patients.map(p => (
                  <div key={p.id} className="card-elevated p-5 cursor-pointer card-hover" onClick={() => setSelectedPatient(p)}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary text-white font-bold text-lg flex items-center justify-center">{p.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground">{p.name}</h3>
                        <p className="text-xs text-muted-foreground">Age {p.age} · {p.lastActive}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.trend === 'improving' ? 'bg-green-100 text-green-700' : p.trend === 'stable' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {p.trend === 'improving' ? '↑' : p.trend === 'stable' ? '→' : '↓'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center"><p className="font-bold text-primary">{p.score}</p><p className="text-xs text-muted-foreground">Score</p></div>
                      <div className="text-center"><p className="font-bold text-success">{p.accuracy}%</p><p className="text-xs text-muted-foreground">Accuracy</p></div>
                      <div className="text-center"><p className="font-bold text-foreground">{p.sessions}</p><p className="text-xs text-muted-foreground">Sessions</p></div>
                    </div>
                    {p.alert && <div className="bg-red-50 rounded-lg p-2 text-xs text-red-700 font-medium">⚠️ {p.alert.slice(0, 60)}...</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reminders Tab */}
        {activeTab === 'reminders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Patient Reminders</h2>
              <button onClick={() => setShowAddReminder(!showAddReminder)} className="btn-primary px-4 py-2 text-sm rounded-xl">+ Add Reminder</button>
            </div>
            {showAddReminder && (
              <div className="card-elevated p-5 space-y-3">
                <h3 className="font-bold text-foreground">New Reminder</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input value={newReminder.title} onChange={e => setNewReminder(p => ({ ...p, title: e.target.value }))}
                    placeholder="Reminder title" className="px-3 py-2 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <select value={newReminder.patient} onChange={e => setNewReminder(p => ({ ...p, patient: e.target.value }))}
                    className="px-3 py-2 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Select patient</option>
                    {patients.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                  <input type="time" value={newReminder.time} onChange={e => setNewReminder(p => ({ ...p, time: e.target.value }))}
                    className="px-3 py-2 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <select value={newReminder.type} onChange={e => setNewReminder(p => ({ ...p, type: e.target.value }))}
                    className="px-3 py-2 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="medicine">💊 Medicine</option>
                    <option value="hydration">💧 Hydration</option>
                    <option value="exercise">🧠 Exercise</option>
                    <option value="appointment">🏥 Appointment</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={addReminder} className="btn-primary px-5 py-2 text-sm rounded-xl">Save</button>
                  <button onClick={() => setShowAddReminder(false)} className="btn-secondary px-5 py-2 text-sm rounded-xl">Cancel</button>
                </div>
              </div>
            )}
            <div className="space-y-3">
              {remindersList.map(r => (
                <div key={r.id} className="card-elevated p-4 flex items-center gap-4">
                  <div className="text-2xl">{typeEmoji[r.type] || '🔔'}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.patient} · {r.time}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${r.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {r.status === 'done' ? '✓ Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">Performance Alerts</h2>
            {alerts.length === 0 ? (
              <div className="card-elevated p-8 text-center">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-semibold text-foreground">No active alerts</p>
                <p className="text-sm text-muted-foreground mt-1">All patients are performing within normal range</p>
              </div>
            ) : (
              alerts.map(p => (
                <div key={p.id} className="card-elevated p-5 border-l-4 border-red-400">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center">{p.avatar}</div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{p.name}</p>
                      <p className="text-sm text-red-700 mt-1">⚠️ {p.alert}</p>
                      <p className="text-xs text-muted-foreground mt-2">Last active: {p.lastActive} · Avg score: {p.score}</p>
                    </div>
                    <button onClick={() => setSelectedPatient(p)} className="btn-secondary px-3 py-1.5 text-xs rounded-lg">View Patient</button>
                  </div>
                </div>
              ))
            )}
            <div className="card-elevated p-4 bg-blue-50 border border-blue-200">
              <p className="text-xs text-blue-700 font-medium">ℹ️ Alerts are for monitoring purposes only. Performance changes may have many causes. Healthcare professionals are responsible for clinical decisions.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
