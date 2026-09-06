'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PatientLayout from '@/components/PatientLayout';

type Difficulty = 'Easy' | 'Medium' | 'Hard';
type Phase = 'idle' | 'showing' | 'input' | 'feedback' | 'finished';

const DIFFICULTY_CONFIG: Record<Difficulty, { length: number; showMs: number; label: string }> = {
  Easy: { length: 3, showMs: 2500, label: '3 numbers · 2.5s display' },
  Medium: { length: 5, showMs: 2000, label: '5 numbers · 2s display' },
  Hard: { length: 7, showMs: 1500, label: '7 numbers · 1.5s display' },
};

function generateSequence(len: number): number[] {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1);
}

export default function SequenceRecallPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [phase, setPhase] = useState<Phase>('idle');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(5);
  const [scores, setScores] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startRound = useCallback((diff: Difficulty = difficulty) => {
    const seq = generateSequence(DIFFICULTY_CONFIG[diff].length);
    setSequence(seq);
    setUserInput([]);
    setLastCorrect(null);
    setPhase('showing');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPhase('input');
      setStartTime(Date.now());
    }, DIFFICULTY_CONFIG[diff].showMs);
  }, [difficulty]);

  const startGame = useCallback(() => {
    setRound(1);
    setScores([]);
    setMistakes(0);
    setResponseTimes([]);
    startRound(difficulty);
  }, [difficulty, startRound]);

  const handleNumberPress = useCallback((num: number) => {
    if (phase !== 'input') return;
    const newInput = [...userInput, num];
    setUserInput(newInput);

    if (newInput.length === sequence.length) {
      const rt = Math.round((Date.now() - startTime) / 1000);
      const correct = newInput.every((v, i) => v === sequence[i]);
      const roundScore = correct ? Math.max(10, 30 - rt * 2) : 0;
      if (!correct) setMistakes(m => m + 1);
      setLastCorrect(correct);
      setScores(s => [...s, roundScore]);
      setResponseTimes(r => [...r, rt]);
      setPhase('feedback');

      setTimeout(() => {
        if (round >= totalRounds) {
          setPhase('finished');
        } else {
          setRound(r => r + 1);
          startRound(difficulty);
        }
      }, 1200);
    }
  }, [phase, userInput, sequence, startTime, round, totalRounds, difficulty, startRound]);

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const accuracy = scores.length > 0 ? Math.round((scores.filter(s => s > 0).length / scores.length) * 100) : 0;
  const avgRT = responseTimes.length > 0 ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) : 0;

  const speakResult = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(
        `Sequence recall complete! Your accuracy was ${accuracy} percent. ${accuracy >= 80 ? 'Wonderful memory skills!' : 'Keep practising to improve your recall.'}`
      );
      msg.lang = 'en-IN'; msg.rate = 0.85;
      window.speechSynthesis.speak(msg);
    }
  }, [accuracy]);

  useEffect(() => { if (phase === 'finished') speakResult(); }, [phase, speakResult]);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

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
            <h1 className="text-2xl font-bold text-foreground">🔢 Sequence Recall</h1>
            <p className="text-muted-foreground text-sm">Watch the sequence, then recall it</p>
          </div>
        </div>

        {phase === 'idle' && (
          <div className="card-elevated p-8 text-center space-y-6">
            <div className="text-6xl">🔢</div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Choose Difficulty</h2>
              <p className="text-muted-foreground">{totalRounds} rounds per game</p>
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 ${difficulty === d ? (d === 'Easy' ? 'difficulty-easy border-green-400' : d === 'Medium' ? 'difficulty-medium border-yellow-400' : 'difficulty-hard border-red-400') : 'border-transparent bg-secondary text-muted-foreground hover:bg-muted'}`}>
                  <div>{d}</div>
                  <div className="text-xs font-normal mt-0.5 opacity-75">{DIFFICULTY_CONFIG[d].label}</div>
                </button>
              ))}
            </div>
            <button onClick={startGame} className="btn-primary px-10 py-4 text-lg font-bold rounded-2xl">Start Game 🎮</button>
          </div>
        )}

        {(phase === 'showing' || phase === 'input' || phase === 'feedback') && (
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

            <div className="card-elevated p-8 text-center space-y-6">
              {phase === 'showing' && (
                <>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Remember this sequence</p>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {sequence.map((n, i) => (
                      <div key={i} className="w-16 h-16 rounded-2xl bg-primary text-white text-3xl font-bold flex items-center justify-center shadow-lg">
                        {n}
                      </div>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm animate-pulse">Memorise the numbers...</p>
                </>
              )}

              {phase === 'input' && (
                <>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Now enter the sequence</p>
                  <div className="flex justify-center gap-3 flex-wrap min-h-[64px]">
                    {Array.from({ length: sequence.length }).map((_, i) => (
                      <div key={i} className={`w-16 h-16 rounded-2xl text-3xl font-bold flex items-center justify-center border-2 ${i < userInput.length ? 'bg-blue-50 border-blue-300 text-primary' : 'bg-gray-50 border-dashed border-gray-300 text-gray-300'}`}>
                        {i < userInput.length ? userInput[i] : '?'}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                    {[1,2,3,4,5,6,7,8,9].map(n => (
                      <button key={n} onClick={() => handleNumberPress(n)}
                        className="w-full h-16 rounded-2xl bg-secondary text-foreground text-2xl font-bold hover:bg-primary hover:text-white transition-all active:scale-95 border border-border">
                        {n}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {phase === 'feedback' && (
                <div className={`rounded-2xl p-6 ${lastCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="text-5xl mb-3">{lastCorrect ? '✅' : '❌'}</div>
                  <p className={`text-xl font-bold ${lastCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {lastCorrect ? 'Correct!' : 'Not quite...'}
                  </p>
                  {!lastCorrect && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Sequence was: {sequence.join(' → ')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {phase === 'finished' && (
          <div className="card-elevated p-8 text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-foreground">All Rounds Complete!</h2>
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
              {accuracy >= 80 ? `Great recall! Try ${difficulty === 'Hard' ? 'Hard' : difficulty === 'Medium' ? 'Hard' : 'Medium'} next.`
                : accuracy >= 60 ? `Good effort! Stay at ${difficulty} to build confidence.`
                : `Keep practising at Easy level. Your memory is improving!`}
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
