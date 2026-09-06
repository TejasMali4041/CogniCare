'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface Game {
  id: string;
  name: string;
  emoji: string;
  description: string;
  longDescription: string;
  currentDifficulty: Difficulty;
  aiDifficulty: Difficulty;
  lastScore: number;
  bestScore: number;
  totalSessions: number;
  lastPlayed: string;
  estimatedTime: string;
  aiRecommended: boolean;
  cardClass: string;
  iconBg: string;
  difficultyConfig: Record<Difficulty, { pairs?: number; elements?: number; description: string }>;
  skills: string[];
}

const games: Game[] = [
  {
    id: 'game-memory-match',
    name: 'Memory Match',
    emoji: '🃏',
    description: 'Flip cards and find matching pairs to train short-term memory.',
    longDescription: 'Cards are placed face-down on a grid. Flip two cards at a time — if they match, they stay revealed. Remember the positions of unmatched cards to find their pairs faster.',
    currentDifficulty: 'Medium',
    aiDifficulty: 'Medium',
    lastScore: 82,
    bestScore: 94,
    totalSessions: 14,
    lastPlayed: '2 days ago',
    estimatedTime: '5–8 min',
    aiRecommended: true,
    cardClass: 'game-card-memory',
    iconBg: '#DBEAFE',
    difficultyConfig: {
      Easy: { pairs: 2, description: '4 cards, 2 pairs — perfect for beginners' },
      Medium: { pairs: 4, description: '8 cards, 4 pairs — recommended for you' },
      Hard: { pairs: 6, description: '12 cards, 6 pairs — for advanced players' },
    },
    skills: ['Short-term memory', 'Visual recall', 'Concentration'],
  },
  {
    id: 'game-sequence-recall',
    name: 'Sequence Recall',
    emoji: '🔢',
    description: 'Watch a number sequence, then recall it in the correct order.',
    longDescription: 'A sequence of numbers or symbols is shown briefly, then hidden. You must reproduce the sequence in the correct order. Each correct answer builds working memory capacity.',
    currentDifficulty: 'Easy',
    aiDifficulty: 'Easy',
    lastScore: 68,
    bestScore: 79,
    totalSessions: 12,
    lastPlayed: 'Yesterday',
    estimatedTime: '3–5 min',
    aiRecommended: false,
    cardClass: 'game-card-sequence',
    iconBg: '#DCFCE7',
    difficultyConfig: {
      Easy: { elements: 3, description: '3 elements — gentle introduction' },
      Medium: { elements: 5, description: '5 elements — moderate challenge' },
      Hard: { elements: 7, description: '7 elements — advanced recall' },
    },
    skills: ['Working memory', 'Attention span', 'Sequence processing'],
  },
  {
    id: 'game-pattern-recog',
    name: 'Pattern Recognition',
    emoji: '🔵',
    description: 'Complete the visual colour or shape pattern sequence.',
    longDescription: 'A repeating pattern of colours or shapes is shown with one element missing. Identify the rule governing the pattern and select the correct next element. Builds logical reasoning.',
    currentDifficulty: 'Easy',
    aiDifficulty: 'Medium',
    lastScore: 91,
    bestScore: 91,
    totalSessions: 8,
    lastPlayed: 'Today',
    estimatedTime: '4–6 min',
    aiRecommended: false,
    cardClass: 'game-card-pattern',
    iconBg: '#FED7AA',
    difficultyConfig: {
      Easy: { description: 'Simple 2-element patterns (RED→BLUE→RED→?)' },
      Medium: { description: '3-element patterns with shapes and colours' },
      Hard: { description: 'Complex multi-attribute patterns' },
    },
    skills: ['Logical reasoning', 'Pattern detection', 'Visual processing'],
  },
];

const difficultyOrder: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export default function GameCardGrid() {
  const [difficulties, setDifficulties] = useState<Record<string, Difficulty>>({
    'game-memory-match': 'Medium',
    'game-sequence-recall': 'Easy',
    'game-pattern-recog': 'Easy',
  });

  const handleDifficultyChange = (gameId: string, diff: Difficulty) => {
    setDifficulties((prev) => ({ ...prev, [gameId]: diff }));
    toast.info(`Difficulty set to ${diff}`, { duration: 2000 });
  };

  const handleStartGame = (game: Game) => {
    const diff = difficulties[game.id];
    const routes: Record<string, string> = {
      'game-memory-match': '/games/memory-match',
      'game-sequence-recall': '/games/sequence-recall',
      'game-pattern-recog': '/games/pattern-recognition',
    };
    const route = routes[game.id];
    if (route) {
      toast.success(`Starting ${game.name} at ${diff} difficulty...`, { duration: 1500 });
      setTimeout(() => { window.location.href = route; }, 600);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-4">Select a Game</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {games.map((game) => {
          const currentDiff = difficulties[game.id];
          const isAiMatch = currentDiff === game.aiDifficulty;

          return (
            <div
              key={game.id}
              className={`rounded-2xl overflow-hidden card-hover flex flex-col ${game.cardClass} ${game.aiRecommended ? 'ai-recommendation-glow' : ''}`}
              style={{ border: game.aiRecommended ? '2px solid rgba(245,158,11,0.5)' : undefined }}
            >
              {/* AI recommended banner */}
              {game.aiRecommended && (
                <div className="px-5 pt-4 pb-0">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full w-fit" style={{ backgroundColor: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)' }}>
                    <span className="text-sm">⭐</span>
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#92400E' }}>AI Recommended Today</span>
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0" style={{ backgroundColor: game.iconBg }}>
                    {game.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-foreground mb-1">{game.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{game.description}</p>
                  </div>
                </div>

                {/* Long description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  {game.longDescription}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {game.skills.map((skill) => (
                    <span key={`skill-${game.id}-${skill}`} className="text-xs font-semibold px-2.5 py-1 rounded-full badge-info">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
                    <p className="text-lg font-bold font-tabular text-foreground">{game.lastScore}</p>
                    <p className="text-xs text-muted-foreground font-semibold">Last Score</p>
                  </div>
                  <div className="text-center p-2 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
                    <p className="text-lg font-bold font-tabular text-foreground">{game.bestScore}</p>
                    <p className="text-xs text-muted-foreground font-semibold">Best Score</p>
                  </div>
                  <div className="text-center p-2 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
                    <p className="text-lg font-bold font-tabular text-foreground">{game.totalSessions}</p>
                    <p className="text-xs text-muted-foreground font-semibold">Sessions</p>
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span>⏱ {game.estimatedTime}</span>
                  <span>📅 {game.lastPlayed}</span>
                </div>

                {/* Difficulty selector */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-foreground">Difficulty Level</p>
                    {!isAiMatch && (
                      <button
                        onClick={() => handleDifficultyChange(game.id, game.aiDifficulty)}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        🤖 Use AI suggestion ({game.aiDifficulty})
                      </button>
                    )}
                    {isAiMatch && (
                      <span className="text-xs font-semibold text-success flex items-center gap-1">
                        ✓ AI suggested
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}>
                    {difficultyOrder.map((diff) => (
                      <button
                        key={`diff-${game.id}-${diff}`}
                        onClick={() => handleDifficultyChange(game.id, diff)}
                        className={`py-2 rounded-lg text-sm font-bold transition-all duration-150 active:scale-95 ${
                          currentDiff === diff
                            ? diff === 'Easy' ?'difficulty-easy shadow-sm'
                              : diff === 'Medium' ?'difficulty-medium shadow-sm' :'difficulty-hard shadow-sm' :'text-muted-foreground hover:bg-white/60'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {game.difficultyConfig[currentDiff].description}
                  </p>
                </div>

                {/* Start button */}
                <button
                  onClick={() => handleStartGame(game)}
                  className={`w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all duration-150 active:scale-97 mt-auto ${
                    game.aiRecommended
                      ? 'text-white' :'btn-primary'
                  }`}
                  style={game.aiRecommended ? { backgroundColor: 'var(--accent)', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' } : {}}
                >
                  <span className="text-xl">{game.emoji}</span>
                  <span>Start {game.name}</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}