import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const EMOJIS = ['🐶','🐱','🦊','🐸','🦄','🐧','🦋','🌸','⭐','🎸','🍕','🎯','🚀','🌈','💎','🔥'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function makeCards(pairs = 8) {
  const pool = EMOJIS.slice(0, pairs);
  return shuffle([...pool, ...pool]).map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is the Memory Card Game?', acceptedAnswer: { '@type': 'Answer', text: 'The Memory Card game (also called Concentration) challenges players to find matching pairs of face-down cards by remembering their positions.' } },
    { '@type': 'Question', name: 'Does Memory Card game improve memory?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Memory card games directly train short-term memory, concentration, and visual recognition — all important academic skills.' } },
    { '@type': 'Question', name: 'How do you play the Memory Card Game?', acceptedAnswer: { '@type': 'Answer', text: 'Click any face-down card to flip it. Then click another card. If they match, they stay revealed. If not, they flip back. Find all pairs to win.' } },
    { '@type': 'Question', name: 'Is this Memory Card Game free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Play instantly for free in your browser. No account, no download needed.' } },
  ],
};

export default function MemoryCardGame() {
  const [cards, setCards] = useState(() => makeCards(8));
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [locked, setLocked] = useState(false);
  const [time, setTime] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('memorybest') || '9999'));
  const [status, setStatus] = useState('idle'); // idle, playing, won

  const start = () => setStatus('playing');
  const exit = () => setStatus('idle');

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const handleFlip = useCallback((id) => {
    if (locked || cards[id].flipped || cards[id].matched) return;
    if (!running) setRunning(true);
    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    const newFlipped = [...flipped, id];
    setCards(newCards);
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newFlipped;
      if (newCards[a].emoji === newCards[b].emoji) {
        const final = newCards.map(c => newFlipped.includes(c.id) ? { ...c, matched: true } : c);
        setTimeout(() => { setCards(final); setFlipped([]); setLocked(false); setMatched(m => m + 1); }, 400);
        if (matched + 1 === 8) {
          setRunning(false);
          const total = moves + 1;
          if (total < best) { setBest(total); localStorage.setItem('memorybest', total); }
          setStatus('won');
        }
      } else {
        setTimeout(() => {
          setCards(c => c.map(card => newFlipped.includes(card.id) ? { ...card, flipped: false } : card));
          setFlipped([]); setLocked(false);
        }, 900);
      }
    }
  }, [cards, flipped, locked, running, moves, matched, best]);

  const restart = () => {
    setCards(makeCards(8)); setFlipped([]); setMoves(0); setMatched(0);
    setLocked(false); setTime(0); setRunning(false);
  };

  const won = matched === 8;
  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  return (
    <>
      <Helmet>
        <title>Memory Card Game Online — Free Brain Training | StudentAI Tools</title>
        <meta name="description" content="Play free Memory Card Game online! Test your memory by matching emoji pairs. A fun brain training game for students. No download required — instant browser play." />
        <meta name="keywords" content="memory card game, memory game online, brain training game, concentration game for students, free card matching game" />
        <link rel="canonical" href="https://studentaitools.in/memory-card-game" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900/20 to-slate-900 py-8 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white mb-2">🃏 Memory Card Game</h1>
            <p className="text-slate-400">Find all matching pairs to win! Test your memory.</p>
          </div>

          <div className={status !== 'idle' ? "fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-4 touch-none overflow-hidden" : ""}>
            <div className={status !== 'idle' ? "w-full max-w-xl" : ""}>
              <div className="flex justify-between items-center mb-4 gap-2">
                <div className="flex gap-2">
                  <div className="bg-pink-900/50 border border-pink-400/20 rounded-xl px-3 py-2 text-center">
                    <div className="text-pink-300 text-xs">Moves</div>
                    <div className="text-white font-bold">{moves}</div>
                  </div>
                  <div className="bg-slate-700 rounded-xl px-3 py-2 text-center">
                    <div className="text-slate-400 text-xs">Time</div>
                    <div className="text-white font-bold font-mono">{fmt(time)}</div>
                  </div>
                  <div className="bg-slate-700 rounded-xl px-3 py-2 text-center">
                    <div className="text-slate-400 text-xs">Pairs</div>
                    <div className="text-white font-bold">{matched}/8</div>
                  </div>
                  <div className="bg-slate-700 rounded-xl px-3 py-2 text-center">
                    <div className="text-slate-400 text-xs">Best</div>
                    <div className="text-white font-bold">{best === 9999 ? '--' : best}</div>
                  </div>
                </div>
                <button onClick={restart} className="bg-pink-500 hover:bg-pink-400 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">Restart</button>
              </div>

              <div className="grid grid-cols-4 gap-2 md:gap-3 mb-6 relative overflow-hidden rounded-2xl">
                {cards.map(card => (
                  <button
                    key={card.id}
                    onClick={() => { if (status === 'idle') setStatus('playing'); handleFlip(card.id); }}
                    className={`aspect-square rounded-xl md:rounded-2xl text-3xl md:text-4xl font-bold transition-all duration-300 flex items-center justify-center ${
                      card.flipped || card.matched
                        ? card.matched ? 'bg-green-500/30 border-2 border-green-400/50 scale-95' : 'bg-pink-500/20 border-2 border-pink-400/50'
                        : 'bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:-translate-y-0.5 cursor-pointer'
                    }`}
                  >
                    {card.flipped || card.matched ? card.emoji : '?'}
                  </button>
                ))}
                {status === 'idle' && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                    <button onClick={start} className="bg-pink-500 hover:bg-pink-400 text-white font-bold px-8 py-3 rounded-2xl shadow-xl transform active:scale-95 transition-all">Start Game</button>
                  </div>
                )}
              </div>

              {status === 'won' && (
                <div className="bg-green-900/50 border border-green-500/30 rounded-2xl p-6 text-center mb-6">
                  <div className="text-5xl mb-2">🎉</div>
                  <h2 className="text-2xl font-bold text-white mb-1">You Win!</h2>
                  <p className="text-slate-400 mb-3">{moves} moves in {fmt(time)}</p>
                  <button onClick={restart} className="bg-green-500 text-white font-bold px-5 py-2.5 rounded-xl">Play Again</button>
                </div>
              )}

              {status !== 'idle' && (
                <button onClick={exit} className="mx-auto block text-slate-400 hover:text-white font-semibold underline">Exit Fullscreen</button>
              )}
            </div>
          </div>

          <div className="space-y-6 text-slate-300 mt-8">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">What is the Memory Card Game?</h2>
              <p>The <strong>Memory Card Game</strong> (also called Concentration or Matching) is a classic brain training game where you flip cards face-down and must remember the location of pairs. With 16 emoji cards (8 pairs), the challenge is to match all pairs using the fewest moves. It is one of the most effective <strong>free online games for students</strong> to improve memory.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">How to Play</h2>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Click any face-down card to <strong>flip it</strong></li>
                <li>Click a second card to try and find its match</li>
                <li>If both cards match, they stay face up (✅)</li>
                <li>If not, both cards <strong>flip back face-down</strong></li>
                <li>Remember the positions to find all 8 pairs with fewer moves!</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Benefits for Brain and Focus</h2>
              <p>Memory matching games directly train <strong>short-term memory, visual pattern recognition, and sustained attention</strong>. Research shows that regular memory game play can delay cognitive decline and improve recall speed — crucial for students who need to memorize formulas, vocabulary, and key concepts for exams.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-4">FAQs</h2>
              <div className="space-y-3">
                {faqSchema.mainEntity.map((faq, i) => (
                  <details key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <summary className="text-white font-semibold cursor-pointer">{faq.name}</summary>
                    <p className="text-slate-400 mt-2 text-sm">{faq.acceptedAnswer.text}</p>
                  </details>
                ))}
              </div>
            </section>
            <section className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h2 className="text-white font-bold mb-3">🎮 More Free Games</h2>
              <div className="flex flex-wrap gap-2">
                {[['🔍 Sudoku', '/sudoku-game'], ['⭕ Tic Tac Toe', '/tic-tac-toe'], ['📝 Word Puzzle', '/word-puzzle-game'], ['➕ Math Quiz', '/math-quiz-game'], ['🎮 All Games', '/free-games']].map(([l, p]) => (
                  <Link key={p} to={p} className="bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/30 rounded-lg px-3 py-1.5 text-pink-300 text-sm transition-colors">{l}</Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
