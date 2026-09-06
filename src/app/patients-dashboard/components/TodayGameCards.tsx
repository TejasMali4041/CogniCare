import React from 'react';

const games = [
  {
    id: 'game-memory-match',
    name: 'Memory Match',
    emoji: '🃏',
    description: 'Flip cards and find matching pairs. Great for short-term memory.',
    difficulty: 'Medium',
    difficultyClass: 'difficulty-medium',
    lastScore: 82,
    lastPlayed: '2 days ago',
    estimatedTime: '5–8 min',
    aiRecommended: true,
    recommendReason: 'Your accuracy improved 12% — ready for a new challenge!',
    cardClass: 'game-card-memory',
    href: '/games/memory-match',
    trend: '+12%',
    trendPositive: true,
  },
  {
    id: 'game-sequence-recall',
    name: 'Sequence Recall',
    emoji: '🔢',
    description: 'Remember and repeat number sequences. Trains working memory.',
    difficulty: 'Easy',
    difficultyClass: 'difficulty-easy',
    lastScore: 68,
    lastPlayed: 'Yesterday',
    estimatedTime: '3–5 min',
    aiRecommended: false,
    recommendReason: null,
    cardClass: 'game-card-sequence',
    href: '/games/sequence-recall',
    trend: '-5%',
    trendPositive: false,
  },
  {
    id: 'game-pattern-recog',
    name: 'Pattern Recognition',
    emoji: '🔵',
    description: 'Complete the visual pattern sequence. Sharpens logical thinking.',
    difficulty: 'Easy',
    difficultyClass: 'difficulty-easy',
    lastScore: 91,
    lastPlayed: 'Today',
    estimatedTime: '4–6 min',
    aiRecommended: false,
    recommendReason: null,
    cardClass: 'game-card-pattern',
    href: '/games/pattern-recognition',
    trend: '+8%',
    trendPositive: true,
  },
];

export default function TodayGameCards() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Today&apos;s Games</h2>
          <p className="text-muted-foreground text-sm mt-0.5">Choose a game to start your cognitive training session</p>
        </div>
        <a
          href="/games-selection"
          className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
        >
          All Games
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <div className="space-y-3">
        {games?.map((game) => (
          <div
            key={game?.id}
            className={`rounded-2xl p-5 card-hover cursor-pointer ${game?.cardClass} ${game?.aiRecommended ? 'ai-recommendation-glow' : ''}`}
          >
            {/* AI recommended banner */}
            {game?.aiRecommended && (
              <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full w-fit" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                <span className="text-sm">🤖</span>
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#92400E' }}>AI Recommended Today</span>
              </div>
            )}

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{game?.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-lg font-bold text-foreground">{game?.name}</h3>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${game?.difficultyClass}`}>
                      {game?.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{game?.description}</p>
                  {game?.aiRecommended && game?.recommendReason && (
                    <p className="text-xs font-medium mb-2" style={{ color: '#92400E' }}>💬 {game?.recommendReason}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>⏱ {game?.estimatedTime}</span>
                    <span>📅 Last: {game?.lastPlayed}</span>
                    <span className={`font-semibold ${game?.trendPositive ? 'text-success' : 'text-danger'}`}>
                      {game?.trend} vs last session
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <div className="text-right">
                  <p className="text-2xl font-bold font-tabular text-foreground">{game?.lastScore}</p>
                  <p className="text-xs text-muted-foreground">Last score</p>
                </div>
                <a
                  href={game?.href}
                  className="btn-primary px-5 py-2.5 text-sm whitespace-nowrap"
                  onClick={(e) => e?.stopPropagation()}
                >
                  Play Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
