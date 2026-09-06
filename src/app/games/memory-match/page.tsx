'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PatientLayout from '@/components/PatientLayout';


type Difficulty = 'Easy' | 'Medium' | 'Hard';

const CARD_EMOJIS = ['🍎', '🐘', '🌸', '🦋', '🎵', '🌙', '⭐', '🏠', '🐟', '🌺', '🎈', '🦁'];

interface Card {
  id: number;
  emoji: string;
  pairId: number;
  flipped: boolean;
  matched: boolean;
}

const DIFFICULTY_CONFIG: Record<Difficulty, { pairs: number; label: string }> = {
  Easy: { pairs: 2, label: '4 cards · 2 pairs' },
  Medium: { pairs: 4, label: '8 cards · 4 pairs' },
  Hard: { pairs: 6, label: '12 cards · 6 pairs' },
};

function buildDeck(pairs: number): Card[] {
  const emojis = CARD_EMOJIS.slice(0, pairs);
  const cards: Card[] = [];
  emojis.forEach((emoji, i) => {
    cards.push({ id: i * 2, emoji, pairId: i, flipped: false, matched: false });
    cards.push({ id: i * 2 + 1, emoji, pairId: i, flipped: false, matched: false });
  });
  return cards.sort(() => Math.random() - 0.5);
}

export default function MemoryMatchPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [matches, setMatches] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalPairs = DIFFICULTY_CONFIG[difficulty].pairs;

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState, startTime]);

  const startGame = useCallback(() => {
    const deck = buildDeck(DIFFICULTY_CONFIG[difficulty].pairs);
    setCards(deck);
    setFlippedIds([]);
    setMistakes(0);
    setMatches(0);
    setElapsed(0);
    setScore(0);
    setStartTime(Date.now());
    setGameState('playing');
  }, [difficulty]);

  const handleCardClick = useCallback((cardId: number) => {
    if (flippedIds.length === 2) return;
    const card = cards.find(c => c.id === cardId);
    if (!card || card.flipped || card.matched) return;

    const newFlipped = [...flippedIds, cardId];
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, flipped: true } : c));
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      const [id1, id2] = newFlipped;
      const c1 = cards.find(c => c.id === id1)!;
      const c2 = cards.find(c => c.id === id2)!;

      if (c1.pairId === c2.pairId) {
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === id1 || c.id === id2) ? { ...c, matched: true } : c));
          setMatches(m => {
            const newMatches = m + 1;
            if (newMatches === totalPairs) {
              if (timerRef.current) clearInterval(timerRef.current);
              const finalElapsed = Math.floor((Date.now() - startTime) / 1000);
              const _accuracy = Math.round((totalPairs / (totalPairs + mistakes)) * 100);
              const finalScore = Math.max(0, Math.round(100 - mistakes * 8 - finalElapsed * 0.5));
              setScore(finalScore);
              setElapsed(finalElapsed);
              setGameState('finished');
            }
            return newMatches;
          });
          setFlippedIds([]);
        }, 600);
      } else {
        setMistakes(m => m + 1);
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === id1 || c.id === id2) ? { ...c, flipped: false } : c));
          setFlippedIds([]);
        }, 900);
      }
    }
  }, [flippedIds, cards, totalPairs, startTime, mistakes]);

  const accuracy = matches + mistakes > 0 ? Math.round((matches / (matches + mistakes)) * 100) : 100;
  const finalAccuracy = Math.round((totalPairs / (totalPairs + mistakes)) * 100);

  const speakResult = useCallback((sc: number, acc: number) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(
        `Well done! You scored ${sc} points with ${acc} percent accuracy. ${acc >= 80 ? 'Excellent work! Try a harder level next.' : 'Keep practising. You are doing great!'}`
      );
      msg.lang = 'en-IN';
      msg.rate = 0.85;
      window.speechSynthesis.speak(msg);
    }
  }, []);

  useEffect(() => {
    if (gameState === 'finished') {
      speakResult(score, finalAccuracy);
    }
  }, [gameState, score, finalAccuracy, speakResult]);

  const gridCols = totalPairs <= 2 ? 'grid-cols-2' : totalPairs <= 4 ? 'grid-cols-4' : 'grid-cols-4';

  return (
    <PatientLayout activeRoute="/games-selection">
      <div className="max-w-3xl mx-auto space-y-6 fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <a href="/games-selection" className="p-2 rounded-xl hover:bg-secondary transition-colors" title="Back">
            <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <div>
            <h1 className="text-2xl font-bold text-foreground">🃏 Memory Match</h1>
            <p className="text-muted-foreground text-sm">Flip cards and find matching pairs</p>
          </div>
        </div>

        {/* Idle / Difficulty Selection */}
        {gameState === 'idle' && (
          <div className="card-elevated p-8 text-center space-y-6">
            <div className="text-6xl">🃏</div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Choose Difficulty</h2>
              <p className="text-muted-foreground">Select how many card pairs you want to match</p>
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 ${difficulty === d ? (d === 'Easy' ? 'difficulty-easy border-green-400' : d === 'Medium' ? 'difficulty-medium border-yellow-400' : 'difficulty-hard border-red-400') : 'border-transparent bg-secondary text-muted-foreground hover:bg-muted'}`}
                >
                  <div>{d}</div>
                  <div className="text-xs font-normal mt-0.5 opacity-75">{DIFFICULTY_CONFIG[d].label}</div>
                </button>
              ))}
            </div>
            <button onClick={startGame} className="btn-primary px-10 py-4 text-lg font-bold rounded-2xl">
              Start Game 🎮
            </button>
          </div>
        )}

        {/* Playing */}
        {gameState === 'playing' && (
          <>
            {/* Stats bar */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Matches', value: `${matches}/${totalPairs}`, color: 'text-success' },
                { label: 'Mistakes', value: mistakes, color: 'text-danger' },
                { label: 'Accuracy', value: `${accuracy}%`, color: 'text-primary' },
                { label: 'Time', value: `${elapsed}s`, color: 'text-foreground' },
              ].map(s => (
                <div key={s.label} className="card-elevated p-3 text-center">
                  <p className={`text-xl font-bold font-tabular ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground font-semibold">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Card grid */}
            <div className={`grid ${gridCols} gap-3`}>
              {cards.map(card => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.flipped || card.matched}
                  className={`aspect-square rounded-2xl text-4xl font-bold flex items-center justify-center transition-all duration-300 active:scale-95 border-2 ${
                    card.matched
                      ? 'bg-green-100 border-green-400 scale-95'
                      : card.flipped
                      ? 'bg-blue-50 border-blue-300 shadow-lg'
                      : 'bg-primary border-primary hover:bg-blue-600 cursor-pointer shadow-md'
                  }`}
                  style={{ minHeight: '80px' }}
                >
                  {card.flipped || card.matched ? card.emoji : (
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Finished */}
        {gameState === 'finished' && (
          <div className="card-elevated p-8 text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Game Complete!</h2>
              <p className="text-muted-foreground mt-1">Great job on your memory training session</p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {[
                { label: 'Score', value: score, color: 'text-primary', bg: 'bg-blue-50' },
                { label: 'Accuracy', value: `${finalAccuracy}%`, color: 'text-success', bg: 'bg-green-50' },
                { label: 'Mistakes', value: mistakes, color: 'text-danger', bg: 'bg-red-50' },
                { label: 'Time', value: `${elapsed}s`, color: 'text-foreground', bg: 'bg-gray-50' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
                  <p className={`text-3xl font-bold font-tabular ${s.color}`}>{s.value}</p>
                  <p className="text-sm text-muted-foreground font-semibold mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className={`rounded-xl p-4 text-sm font-medium ${finalAccuracy >= 80 ? 'bg-green-50 text-green-800' : finalAccuracy >= 60 ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'}`}>
              🤖 <strong>AI Recommendation:</strong>{' '}
              {finalAccuracy >= 80
                ? `Excellent performance! Try ${difficulty === 'Hard' ? 'Hard' : difficulty === 'Medium' ? 'Hard' : 'Medium'} difficulty next.`
                : finalAccuracy >= 60
                ? `Good effort! Continue at ${difficulty} difficulty to build confidence.`
                : `Keep practising at ${difficulty === 'Easy' ? 'Easy' : 'Easy'} difficulty. You are improving!`}
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={startGame} className="btn-primary px-8 py-3 font-bold rounded-xl">
                Play Again
              </button>
              <a href="/games-selection" className="btn-secondary px-8 py-3 font-bold rounded-xl">
                All Games
              </a>
              <a href="/patient-dashboard" className="btn-secondary px-8 py-3 font-bold rounded-xl">
                Dashboard
              </a>
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
