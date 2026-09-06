'use client';
import React, { useState, useCallback, useEffect } from 'react';
import PatientLayout from '@/components/PatientLayout';

type Difficulty = 'Easy' | 'Medium' | 'Hard';
type Phase = 'idle' | 'playing' | 'feedback' | 'finished';

interface PatternQuestion {
  sequence: string[];
  answer: string;
  options: string[];
}

const EASY_PATTERNS = [
  { elements: ['🔴', '🔵', '🔴', '🔵', '🔴', '?'], answer: '🔵' },
  { elements: ['⭐', '⭐', '🌙', '⭐', '⭐', '?'], answer: '🌙' },
  { elements: ['🟢', '🟡', '🟢', '🟡', '🟢', '?'], answer: '🟡' },
  { elements: ['🐱', '🐶', '🐱', '🐶', '🐱', '?'], answer: '🐶' },
  { elements: ['🍎', '🍊', '🍎', '🍊', '🍎', '?'], answer: '🍊' },
];

const MEDIUM_PATTERNS = [
  { elements: ['🔴', '🔵', '🟢', '🔴', '🔵', '?'], answer: '🟢' },
  { elements: ['1️⃣', '2️⃣', '3️⃣', '1️⃣', '2️⃣', '?'], answer: '3️⃣' },
  { elements: ['🌸', '🌺', '🌻', '🌸', '🌺', '?'], answer: '🌻' },
  { elements: ['⬆️', '➡️', '⬇️', '⬆️', '➡️', '?'], answer: '⬇️' },
  { elements: ['🔺', '🔷', '🔺', '🔷', '🔺', '?'], answer: '🔷' },
];

const HARD_PATTERNS = [
  { elements: ['🔴', '🔵', '🟢', '🟡', '🔴', '?'], answer: '🔵' },
  { elements: ['A', 'B', 'C', 'A', 'B', '?'], answer: 'C' },
  { elements: ['🌑', '🌒', '🌓', '🌔', '🌕', '?'], answer: '🌖' },
  { elements: ['1️⃣', '3️⃣', '5️⃣', '7️⃣', '9️⃣', '?'], answer: '🔟' },
  { elements: ['🐣', '🐥', '🐔', '🐣', '🐥', '?'], answer: '🐔' },
];

const ALL_EMOJIS = ['🔴', '🔵', '🟢', '🟡', '⭐', '🌙', '🐱', '🐶', '🍎', '🍊', '🌸', '🌺', '🌻', '⬆️', '➡️', '⬇️', '🔺', '🔷', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🐣', '🐥', '🐔', 'A', 'B', 'C', '1️⃣', '2️⃣', '3️⃣', '🔟'];

function getPatterns(diff: Difficulty) {
  return diff === 'Easy' ? EASY_PATTERNS : diff === 'Medium' ? MEDIUM_PATTERNS : HARD_PATTERNS;
}

function buildQuestion(diff: Difficulty): PatternQuestion {
  const pool = getPatterns(diff);
  const p = pool[Math.floor(Math.random() * pool.length)];
  const sequence = p.elements.slice(0, -1);
  const answer = p.answer;
  const distractors = ALL_EMOJIS.filter(e => e !== answer).sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [...distractors, answer].sort(() => Math.random() - 0.5);
  return { sequence, answer, options };
}

export default function PatternRecognitionPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [phase, setPhase] = useState<Phase>('idle');
  const [question, setQuestion] = useState<PatternQuestion | null>(null);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(6);
  const [scores, setScores] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const nextQuestion = useCallback((diff: Difficulty = difficulty) => {
    setQuestion(buildQuestion(diff));
    setSelectedOption(null);
    setLastCorrect(null);
    setStartTime(Date.now());
    setPhase('playing');
  }, [difficulty]);

  const startGame = useCallback(() => {
    setRound(1);
    setScores([]);
    setMistakes(0);
    setResponseTimes([]);
    nextQuestion(difficulty);
  }, [difficulty, nextQuestion]);

  const handleAnswer = useCallback((option: string) => {
    if (phase !== 'playing' || !question) return;
    const rt = Math.round((Date.now() - startTime) / 1000);
    const correct = option === question.answer;
    const roundScore = correct ? Math.max(5, 20 - rt * 2) : 0;
    if (!correct) setMistakes(m => m + 1);
    setLastCorrect(correct);
    setSelectedOption(option);
    setScores(s => [...s, roundScore]);
    setResponseTimes(r => [...r, rt]);
    setPhase('feedback');

    setTimeout(() => {
      if (round >= totalRounds) {
        setPhase('finished');
      } else {
        setRound(r => r + 1);
        nextQuestion(difficulty);
      }
    }, 1200);
  }, [phase, question, startTime, round, totalRounds, difficulty, nextQuestion]);

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const accuracy = scores.length > 0 ? Math.round((scores.filter(s => s > 0).length / scores.length) * 100) : 0;
  const avgRT = responseTimes.length > 0 ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) : 0;

  const speakResult = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(
        `Pattern recognition complete! You scored ${totalScore} points with ${accuracy} percent accuracy. ${accuracy >= 80 ? 'Excellent logical thinking!' : 'Keep practising to sharpen your pattern skills.'}`
      );
      msg.lang = 'en-IN'; msg.rate = 0.85;
      window.speechSynthesis.speak(msg);
    }
  }, [totalScore, accuracy]);

  useEffect(() => { if (phase === 'finished') speakResult(); }, [phase, speakResult]);

  return (
    <PatientLayout activeRoute="/games-selection">
      <div className="max-w-2xl mx-auto space-y-6 fade-in">
        <div className="flex items-center gap-4">
          <a href="/games-selection" className="p-2 rounded-xl hover:bg-secondary transition-colors">
            <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <div>
            <h1 className="text-2xl font-bold text-foreground">🔵 Pattern Recognition</h1>
            <p className="text-muted-foreground text-sm">Complete the visual pattern sequence</p>
          </div>
        </div>

        {phase === 'idle' && (
          <div className="card-elevated p-8 text-center space-y-6">
            <div className="text-6xl">🔵</div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Choose Difficulty</h2>
              <p className="text-muted-foreground">{totalRounds} patterns per game</p>
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 ${difficulty === d ? (d === 'Easy' ? 'difficulty-easy border-green-400' : d === 'Medium' ? 'difficulty-medium border-yellow-400' : 'difficulty-hard border-red-400') : 'border-transparent bg-secondary text-muted-foreground hover:bg-muted'}`}>
                  <div>{d}</div>
                  <div className="text-xs font-normal mt-0.5 opacity-75">{d === 'Easy' ? '2-element patterns' : d === 'Medium' ? '3-element patterns' : 'Complex patterns'}</div>
                </button>
              ))}
            </div>
            <button onClick={startGame} className="btn-primary px-10 py-4 text-lg font-bold rounded-2xl">Start Game 🎮</button>
          </div>
        )}

        {(phase === 'playing' || phase === 'feedback') && question && (
          <>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Round', value: `${round}/${totalRounds}`, color: 'text-foreground' },
                { label: 'Score', value: totalScore, color: 'text-primary' },
                { label: 'Mistakes', value: mistakes, color: 'text-danger' },
                { label: 'Difficulty', value: difficulty, color: 'text-foreground' },
              ].map(s => (
                <div key={s.label} className="card-elevated p-3 text-center">
                  <p className={`text-xl font-bold font-tabular ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground font-semibold">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="card-elevated p-8 space-y-6">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide text-center mb-4">What comes next?</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {question.sequence.map((el, i) => (
                    <React.Fragment key={i}>
                      <div className="w-14 h-14 rounded-xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-3xl font-bold">
                        {el}
                      </div>
                      <span className="text-muted-foreground font-bold">→</span>
                    </React.Fragment>
                  ))}
                  <div className={`w-14 h-14 rounded-xl border-2 border-dashed flex items-center justify-center text-3xl font-bold transition-all ${phase === 'feedback' ? (lastCorrect ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400') : 'bg-gray-50 border-gray-300 text-gray-400'}`}>
                    {phase === 'feedback' ? question.answer : '?'}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-muted-foreground text-center mb-3">Choose the answer:</p>
                <div className="grid grid-cols-2 gap-3">
                  {question.options.map((opt, i) => (
                    <button key={i} onClick={() => handleAnswer(opt)} disabled={phase === 'feedback'}
                      className={`h-20 rounded-2xl text-4xl font-bold transition-all active:scale-95 border-2 ${
                        phase === 'feedback'
                          ? opt === question.answer ? 'bg-green-100 border-green-400': opt === selectedOption ? 'bg-red-100 border-red-400' : 'bg-gray-50 border-gray-200 opacity-50' :'bg-secondary border-border hover:bg-primary hover:text-white hover:border-primary cursor-pointer'
                      }`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {phase === 'feedback' && (
                <div className={`rounded-xl p-4 text-center font-bold ${lastCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {lastCorrect ? '✅ Correct! Well done!' : `❌ The answer was ${question.answer}`}
                </div>
              )}
            </div>
          </>
        )}

        {phase === 'finished' && (
          <div className="card-elevated p-8 text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-foreground">All Patterns Complete!</h2>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {[
                { label: 'Total Score', value: totalScore, color: 'text-primary', bg: 'bg-blue-50' },
                { label: 'Accuracy', value: `${accuracy}%`, color: 'text-success', bg: 'bg-green-50' },
                { label: 'Mistakes', value: mistakes, color: 'text-danger', bg: 'bg-red-50' },
                { label: 'Avg Response', value: `${avgRT}s`, color: 'text-foreground', bg: 'bg-gray-50' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
                  <p className={`text-3xl font-bold font-tabular ${s.color}`}>{s.value}</p>
                  <p className="text-sm text-muted-foreground font-semibold mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className={`rounded-xl p-4 text-sm font-medium ${accuracy >= 80 ? 'bg-green-50 text-green-800' : accuracy >= 60 ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'}`}>
              🤖 <strong>AI Recommendation:</strong>{' '}
              {accuracy >= 80 ? `Excellent pattern skills! Try ${difficulty === 'Hard' ? 'Hard' : difficulty === 'Medium' ? 'Hard' : 'Medium'} next.`
                : accuracy >= 60 ? `Good effort! Stay at ${difficulty} to build confidence.`
                : `Keep practising at Easy level. Patterns will become clearer!`}
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={startGame} className="btn-primary px-8 py-3 font-bold rounded-xl">Play Again</button>
              <a href="/games-selection" className="btn-secondary px-8 py-3 font-bold rounded-xl">All Games</a>
              <a href="/patient-dashboard" className="btn-secondary px-8 py-3 font-bold rounded-xl">Dashboard</a>
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
