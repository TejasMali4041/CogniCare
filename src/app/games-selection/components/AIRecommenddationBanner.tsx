import React from 'react';

export default function AIRecommendationBanner() {
  return (
    <div className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #1D4ED8 100%)', border: '1px solid #1D4ED8' }}>
      <div className="flex items-center gap-4 flex-1">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
          🤖
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-white font-bold text-lg">AI Recommendation for Today</p>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: 'rgba(245, 158, 11, 0.8)' }}>
              PERSONALIZED
            </span>
          </div>
          <p className="text-blue-100 text-sm leading-relaxed max-w-2xl">
            Based on your last 7 sessions, your <strong className="text-white">Memory Match accuracy is trending up (+12%)</strong>. 
            The AI recommends starting with <strong className="text-white">Memory Match at Medium difficulty</strong> today, 
            followed by Sequence Recall to strengthen working memory patterns.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0 sm:text-right">
        <div className="px-4 py-2 rounded-xl text-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide">Confidence</p>
          <p className="text-white text-xl font-bold font-tabular">84%</p>
        </div>
        <p className="text-blue-300 text-xs">Random Forest Classifier v2.1</p>
        <p className="text-blue-300 text-xs italic">Not a medical assessment</p>
      </div>
    </div>
  );
}