'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const communityPatients = [
  { id: 1, name: 'Ratan Das', age: 72, village: 'Guwahati North', lastActive: '2 hours ago', trend: 'improving', score: 84, accuracy: 88, sessions: 24, alert: null, avatar: 'R', followUp: 'No action required' },
  { id: 2, name: 'Meena Sharma', age: 68, village: 'Jorhat East', lastActive: 'Yesterday', trend: 'stable', score: 71, accuracy: 74, sessions: 18, alert: 'Performance change detected in recent memory activities.', avatar: 'M', followUp: 'Follow-up recommended' },
  { id: 3, name: 'Gopal Bora', age: 75, village: 'Dibrugarh', lastActive: '3 days ago', trend: 'declining', score: 52, accuracy: 58, sessions: 11, alert: 'Significant accuracy drop over last 5 sessions. Consider reviewing.', avatar: 'G', followUp: 'Professional assessment suggested' },
  { id: 4, name: 'Lakshmi Devi', age: 70, village: 'Silchar', lastActive: '1 day ago', trend: 'stable', score: 76, accuracy: 79, sessions: 15, alert: null, avatar: 'L', followUp: 'No action required' },
  { id: 5, name: 'Hari Prasad', age: 78, village: 'Tezpur', lastActive: '5 days ago', trend: 'declining', score: 48, accuracy: 52, sessions: 8, alert: 'Low engagement detected. Patient has not played in 5 days.', avatar: 'H', followUp: 'Caregiver contacted' },
];

const weeklyData = [
  { day: 'Mon', avgScore: 68, active: 3 },
  { day: 'Tue', avgScore: 72, active: 4 },
  { day: 'Wed', avgScore: 70, active: 3 },
  { day: 'Thu', avgScore: 75, active: 5 },
  { day: 'Fri', avgScore: 73, active: 4 },
  { day: 'Sat', avgScore: 78, active: 4 },
  { day: 'Sun', avgScore: 74, active: 3 },
];

const FOLLOW_UP_OPTIONS = ['No action required', 'Follow-up recommended', 'Caregiver contacted', 'Professional assessment suggested'];

export default function CHWDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'alerts' | 'followup'>('overview');
  const [selectedPatient, setSelectedPatient] = useState<typeof communityPatients[0] | null>(null);
  const [followUps, setFollowUps] = useState<Record<number, string>>(
    Object.fromEntries(communityPatients.map(p => [p.id, p.followUp]))
  );
  const [followUpNotes, setFollowUpNotes] = useState<Record<number, string>>({});

  const alerts = communityPatients.filter(p => p.alert);
  const needingFollowUp = communityPatients.filter(p => p.trend === 'declining' || p.alert);
  const activeToday = communityPatients.filter(p => p.lastActive.includes('hour') || p.lastActive === 'Today');

  const updateFollowUp = (patientId: number, status: string) => {
    setFollowUps(prev => ({ ...prev, [patientId]: status }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 1px 4px rgba(15,23,42,0.06)' }}>
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg">C</div>
            <div>
              <span className="font-bold text-lg text-foreground">CogniCare</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">Community Health Worker</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">Anita Gogoi</span>
            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">A</div>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors">Logout</Link>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-6">
        {/* Community stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Patients', value: communityPatients.length, icon: '👥', color: 'text-primary', bg: 'bg-blue-50' },
            { label: 'Active Today', value: activeToday.length, icon: '✅', color: 'text-success', bg: 'bg-green-50' },
            { label: 'Need Follow-up', value: needingFollowUp.length, icon: '🔍', color: 'text-warning', bg: 'bg-yellow-50' },
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
        <div className="flex gap-1 p-1 rounded-xl bg-secondary w-fit flex-wrap">
          {(['overview', 'patients', 'alerts', 'followup'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'tab-active' : 'tab-inactive'}`}>
              {tab === 'alerts' && alerts.length > 0 ? `Alerts (${alerts.length})` : tab === 'followup' ? 'Follow-up' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-elevated p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Community Avg Score (7 days)</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis domain={[40, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgScore" stroke="#0D9488" strokeWidth={2.5} dot={{ r: 4 }} name="Avg Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="card-elevated p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Daily Active Patients</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, communityPatients.length]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="active" fill="#0D9488" name="Active Patients" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Patient summary table */}
            <div className="card-elevated p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Community Patient Summary</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Patient</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Village</th>
                      <th className="text-center py-2 px-3 text-muted-foreground font-semibold">Score</th>
                      <th className="text-center py-2 px-3 text-muted-foreground font-semibold">Trend</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Last Active</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Follow-up</th>
                    </tr>
                  </thead>
                  <tbody>
                    {communityPatients.map(p => (
                      <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30 cursor-pointer" onClick={() => { setSelectedPatient(p); setActiveTab('patients'); }}>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold text-sm flex items-center justify-center">{p.avatar}</div>
                            <span className="font-semibold text-foreground">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">{p.village}</td>
                        <td className="py-3 px-3 text-center font-bold text-primary">{p.score}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.trend === 'improving' ? 'bg-green-100 text-green-700' : p.trend === 'stable' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {p.trend === 'improving' ? '↑ Improving' : p.trend === 'stable' ? '→ Stable' : '↓ Declining'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground text-xs">{p.lastActive}</td>
                        <td className="py-3 px-3">
                          <span className={`text-xs font-medium ${followUps[p.id] === 'No action required' ? 'text-success' : followUps[p.id] === 'Professional assessment suggested' ? 'text-danger' : 'text-warning'}`}>
                            {followUps[p.id]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                    <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 font-bold text-2xl flex items-center justify-center">{selectedPatient.avatar}</div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-foreground">{selectedPatient.name}</h2>
                      <p className="text-muted-foreground">Age {selectedPatient.age} · {selectedPatient.village}</p>
                      <p className="text-xs text-muted-foreground mt-1">Last active: {selectedPatient.lastActive}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedPatient.trend === 'improving' ? 'bg-green-100 text-green-700' : selectedPatient.trend === 'stable' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {selectedPatient.trend === 'improving' ? '↑ Improving' : selectedPatient.trend === 'stable' ? '→ Stable' : '↓ Needs Attention'}
                    </span>
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
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                      <p className="text-sm font-semibold text-red-700">⚠️ {selectedPatient.alert}</p>
                    </div>
                  )}
                  {/* Follow-up section */}
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                    <h3 className="font-bold text-teal-800 mb-3">Follow-up Status</h3>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {FOLLOW_UP_OPTIONS.map(opt => (
                        <button key={opt} onClick={() => updateFollowUp(selectedPatient.id, opt)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border ${followUps[selectedPatient.id] === opt ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-teal-700 border-teal-200 hover:bg-teal-100'}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={followUpNotes[selectedPatient.id] || ''}
                      onChange={e => setFollowUpNotes(prev => ({ ...prev, [selectedPatient.id]: e.target.value }))}
                      placeholder="Add follow-up notes (optional)..."
                      className="w-full px-3 py-2 rounded-xl border border-teal-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                      rows={3}
                    />
                    <p className="text-xs text-teal-600 mt-2">⚠️ CHWs do not provide clinical diagnoses. Follow-up status is for monitoring and support purposes only.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {communityPatients.map(p => (
                  <div key={p.id} className="card-elevated p-5 cursor-pointer card-hover" onClick={() => setSelectedPatient(p)}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 font-bold text-lg flex items-center justify-center">{p.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground">{p.name}</h3>
                        <p className="text-xs text-muted-foreground">{p.village} · Age {p.age}</p>
                        <p className="text-xs text-muted-foreground">{p.lastActive}</p>
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
                    <div className={`text-xs font-medium px-2 py-1 rounded-lg ${followUps[p.id] === 'No action required' ? 'bg-green-50 text-green-700' : followUps[p.id] === 'Professional assessment suggested' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                      {followUps[p.id]}
                    </div>
                    {p.alert && <div className="mt-2 bg-red-50 rounded-lg p-2 text-xs text-red-700 font-medium">⚠️ {p.alert.slice(0, 55)}...</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">Community Alerts</h2>
            {alerts.length === 0 ? (
              <div className="card-elevated p-8 text-center">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-semibold text-foreground">No active alerts</p>
              </div>
            ) : (
              alerts.map(p => (
                <div key={p.id} className="card-elevated p-5 border-l-4 border-red-400">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center">{p.avatar}</div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{p.name} <span className="text-xs text-muted-foreground font-normal">· {p.village}</span></p>
                      <p className="text-sm text-red-700 mt-1">⚠️ {p.alert}</p>
                      <p className="text-xs text-muted-foreground mt-2">Last active: {p.lastActive} · Avg score: {p.score}</p>
                    </div>
                    <button onClick={() => { setSelectedPatient(p); setActiveTab('patients'); }} className="btn-secondary px-3 py-1.5 text-xs rounded-lg">View</button>
                  </div>
                </div>
              ))
            )}
            <div className="card-elevated p-4 bg-teal-50 border border-teal-200">
              <p className="text-xs text-teal-700 font-medium">ℹ️ Alerts are for community monitoring only. CHWs support patients and caregivers — clinical decisions are made by qualified healthcare professionals.</p>
            </div>
          </div>
        )}

        {/* Follow-up Tab */}
        {activeTab === 'followup' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">Follow-up Management</h2>
            <div className="space-y-3">
              {communityPatients.map(p => (
                <div key={p.id} className="card-elevated p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center">{p.avatar}</div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{p.name} <span className="text-xs text-muted-foreground font-normal">· {p.village} · Age {p.age}</span></p>
                      <p className="text-xs text-muted-foreground">Last active: {p.lastActive} · Score: {p.score}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.trend === 'improving' ? 'bg-green-100 text-green-700' : p.trend === 'stable' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {p.trend}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {FOLLOW_UP_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => updateFollowUp(p.id, opt)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${followUps[p.id] === opt ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-teal-700 border-teal-200 hover:bg-teal-100'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={followUpNotes[p.id] || ''}
                    onChange={e => setFollowUpNotes(prev => ({ ...prev, [p.id]: e.target.value }))}
                    placeholder="Add notes..."
                    className="w-full px-3 py-2 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}