'use client';
import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';

const voiceCommands: Record<string, { route: string; response: string }> = {
  'start memory game': { route: '/games/memory-match', response: 'Opening Memory Match game. Good luck!' },
  'play memory match': { route: '/games/memory-match', response: 'Starting Memory Match. Have fun!' },
  'start sequence game': { route: '/games/sequence-recall', response: 'Opening Sequence Recall game. Get ready!' },
  'play sequence recall': { route: '/games/sequence-recall', response: 'Starting Sequence Recall. Concentrate!' },
  'start pattern game': { route: '/games/pattern-recognition', response: 'Opening Pattern Recognition. Think carefully!' },
  'play pattern recognition': { route: '/games/pattern-recognition', response: 'Starting Pattern Recognition. Good luck!' },
  'show my progress': { route: '/patient-dashboard#performance', response: 'Showing your progress dashboard.' },
  'show reminders': { route: '/patient-dashboard#reminders', response: 'Here are your reminders.' },
  'go home': { route: '/patient-dashboard', response: 'Going to your home dashboard.' },
  'play game': { route: '/games-selection', response: 'Opening game selection.' },
  'open games': { route: '/games-selection', response: 'Here are all your games.' },
};

function speakText(text: string, lang = 'en-IN') {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = lang;
    msg.rate = 0.9;
    msg.pitch = 1;
    window.speechSynthesis.speak(msg);
  }
}

export default function VoiceCommandButton() {
  const [isListening, setIsListening] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const startVoice = useCallback(() => {
    const SpeechRecognition =
      (typeof window !== 'undefined' &&
        ((window as Window & { SpeechRecognition?: unknown }).SpeechRecognition ||
          (window as Window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition)) ||
      null;

    if (!SpeechRecognition) {
      toast.error('Voice commands are not supported in this browser. Please use Chrome or Edge.', { duration: 4000 });
      speakText('Voice support is unavailable in this browser. You can continue using the buttons.');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognition as any)();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    setIsListening(true);
    speakText('Listening. Say a command.');
    toast.info('🎙️ Listening... Say a command', { duration: 3000 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      const matched = voiceCommands[transcript];
      if (matched) {
        toast.success(`"${transcript}" — navigating...`, { duration: 2000 });
        speakText(matched.response);
        setTimeout(() => { window.location.href = matched.route; }, 1200);
      } else {
        const msg = `Command "${transcript}" not recognised. Try: Start memory game, Show reminders, or Go home.`;
        toast.warning(msg, { duration: 4000 });
        speakText(`Sorry, I did not understand. Try saying: Start memory game, or Show reminders.`);
      }
      setIsListening(false);
    };

    recognition.onerror = () => {
      toast.error('Could not hear you. Please try again.', { duration: 3000 });
      speakText('Could not hear you. Please try again.');
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  }, []);

  return (
    <>
      <div className="fixed bottom-24 md:bottom-8 right-6 z-50 flex flex-col items-end gap-3">
        {showHelp && (
          <div className="card-elevated p-4 w-72 mb-2 slide-up">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-foreground text-sm">🎙️ Voice Commands</p>
              <button onClick={() => setShowHelp(false)} className="text-muted-foreground hover:text-foreground">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-1.5">
              {Object.keys(voiceCommands).slice(0, 7).map((cmd) => (
                <div key={`cmd-${cmd}`} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">🗣</span>
                  <span className="text-sm font-medium text-foreground capitalize">&quot;{cmd}&quot;</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">Tap the mic button and speak clearly. Works best in Chrome/Edge.</p>
          </div>
        )}

        <button
          onClick={() => setShowHelp(!showHelp)}
          className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-150 hover:bg-secondary"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 2px 8px rgba(15,23,42,0.1)' }}
          title="Voice command help"
        >
          <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <button
          onClick={startVoice}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all duration-200 active:scale-95 ${isListening ? 'voice-pulse-active' : 'voice-pulse'}`}
          style={{
            backgroundColor: isListening ? 'var(--danger)' : 'var(--primary)',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.35)',
          }}
          title={isListening ? 'Listening...' : 'Tap to speak a command'}
        >
          {isListening ? (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}