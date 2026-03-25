import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

// Word categories
const CATEGORIES = [
  {
    name: 'Animals',
    words: ['ELEPHANT','GIRAFFE','PENGUIN','DOLPHIN','CHEETAH','HAMSTER','PANTHER','SPARROW'],
  },
  {
    name: 'Countries',
    words: ['FRANCE','BRAZIL','CANADA','TURKEY','JORDAN','MEXICO','GREECE','SWEDEN'],
  },
  {
    name: 'Science',
    words: ['PHYSICS','BIOLOGY','NEUTRON','GRAVITY','PROTON','OXYGEN','CARBON','MAGNET'],
  },
  {
    name: 'Fruits',
    words: ['MANGO','PEACH','GRAPE','LEMON','MELON','GUAVA','PAPAYA','CHERRY'],
  },
];

function scramble(word) {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  const s = arr.join('');
  return s === word ? scramble(word) : s;
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is the Word Puzzle Game?', acceptedAnswer: { '@type': 'Answer', text: 'The Word Puzzle Game challenges you to unscramble jumbled letters to form the correct word. It builds vocabulary, spelling, and pattern recognition skills.' } },
    { '@type': 'Question', name: 'Does word puzzles improve vocabulary?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Word puzzles are proven to improve vocabulary, spelling accuracy, and language processing — all critical academic skills.' } },
    { '@type': 'Question', name: 'How do I play the Word Puzzle Game?', acceptedAnswer: { '@type': 'Answer', text: 'You are shown scrambled letters from a hidden word. Type your guess in the input box and submit. Use the hint if you are stuck!' } },
    { '@type': 'Question', name: 'Is this Word Puzzle Game free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Play free indefinitely in your browser. No download or sign-up required.' } },
  ],
};

export default function WordPuzzleGame() {
  const [catIdx, setCatIdx] = useState(() => Math.floor(Math.random() * CATEGORIES.length));
  const [wordIdx, setWordIdx] = useState(() => Math.floor(Math.random() * CATEGORIES[0].words.length));
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [solved, setSolved] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, playing

  const start = () => setStatus('playing');
  const exit = () => setStatus('idle');

  const cat = CATEGORIES[catIdx];
  const word = cat.words[wordIdx];
  const [scrambled] = useState(() => scramble(word));
  const [scrambledMap, setScrambledMap] = useState({ [catIdx + '-' + wordIdx]: scramble(word) });

  const getScrambled = () => scrambledMap[catIdx + '-' + wordIdx] || scramble(word);

  const next = useCallback(() => {
    const nw = (wordIdx + 1) % cat.words.length;
    const key = catIdx + '-' + nw;
    if (!scrambledMap[key]) setScrambledMap(m => ({ ...m, [key]: scramble(cat.words[nw]) }));
    setWordIdx(nw);
    setInput('');
    setFeedback(null);
    setHintUsed(false);
    setShowHint(false);
  }, [wordIdx, cat.words.length, catIdx, scrambledMap]);

  const check = useCallback(() => {
    if (!input.trim()) return;
    if (input.trim().toUpperCase() === word) {
      setFeedback('correct');
      setScore(s => s + (hintUsed ? 5 : 10) + streak * 2);
      setStreak(s => s + 1);
      setSolved(s => s + 1);
      setTimeout(next, 800);
    } else {
      setFeedback('wrong');
      setStreak(0);
      setTimeout(() => setFeedback(null), 600);
    }
  }, [input, word, hintUsed, streak, next]);

  const skip = useCallback(() => { setStreak(0); next(); }, [next]);
  const hint = useCallback(() => { setHintUsed(true); setShowHint(true); }, []);
  const currentScrambled = scrambledMap[catIdx + '-' + wordIdx] || scramble(word);

  return (
    <>
      <Helmet>
        <title>Word Puzzle Game Online — Free Vocabulary Game | StudentAI Tools</title>
        <meta name="description" content="Play free Word Puzzle Game online! Unscramble words to boost your vocabulary and spelling. A fun brain training game for students. No download needed." />
        <meta name="keywords" content="word puzzle game, word scramble game, vocabulary game for students, free word game online, spelling game" />
        <link rel="canonical" href="https://studentaitools.in/word-puzzle-game" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900/20 to-slate-900 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white mb-2">📝 Word Puzzle</h1>
            <p className="text-slate-400">Unscramble the letters to form the hidden word!</p>
          </div>

          <div className={status !== 'idle' ? "fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-4 touch-none overflow-hidden" : ""}>
            <div className={status !== 'idle' ? "w-full max-w-lg" : ""}>
              {/* Category selector */}
              <div className="flex gap-2 flex-wrap justify-center mb-4">
                {CATEGORIES.map((c, i) => (
                  <button key={i} onClick={() => { setCatIdx(i); setWordIdx(0); setInput(''); setFeedback(null); setHintUsed(false); setShowHint(false); }}
                    className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-colors ${catIdx === i ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {[{ l: 'Score', v: score, c: 'text-teal-400' }, { l: '🔥 Streak', v: streak, c: 'text-yellow-400' }, { l: 'Solved', v: solved, c: 'text-green-400' }].map((s, i) => (
                  <div key={i} className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
                    <div className="text-slate-400 text-xs uppercase mb-1">{s.l}</div>
                    <div className={`text-xl font-bold ${s.c}`}>{s.v}</div>
                  </div>
                ))}
              </div>

              <div className={`bg-slate-800 border-2 rounded-2xl p-8 text-center mb-5 transition-colors relative overflow-hidden ${feedback === 'correct' ? 'border-green-500' : feedback === 'wrong' ? 'border-red-500' : 'border-slate-700'}`}>
                <div className="text-slate-400 text-sm mb-2 uppercase tracking-wider">{cat.name}</div>
                <div className="text-5xl font-extrabold tracking-widest text-white mb-2 flex justify-center gap-2 flex-wrap">
                  {currentScrambled.split('').map((ch, i) => (
                    <span key={i} className="bg-teal-500/20 border border-teal-400/30 rounded-xl w-12 h-14 inline-flex items-center justify-center">{ch}</span>
                  ))}
                </div>
                {showHint && <p className="text-yellow-400 text-sm mt-3">💡 Hint: Starts with <strong>{word[0]}</strong>, has <strong>{word.length}</strong> letters</p>}
                {status === 'idle' && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                    <button onClick={start} className="bg-teal-500 hover:bg-teal-400 text-white font-bold px-8 py-3 rounded-2xl shadow-xl transform active:scale-95 transition-all">Start Puzzle</button>
                  </div>
                )}
              </div>

              <input
                value={input}
                onChange={e => setInput(e.target.value.toUpperCase())}
                onFocus={() => { if (status === 'idle') setStatus('playing'); }}
                onKeyDown={e => e.key === 'Enter' && check()}
                placeholder="Type your answer..."
                maxLength={word.length + 2}
                className="w-full bg-slate-800 border-2 border-slate-600 focus:border-teal-500 rounded-xl px-5 py-4 text-white text-xl font-bold text-center uppercase tracking-widest outline-none mb-3 transition-colors"
              />

              <div className="flex gap-3 mb-6">
                <button onClick={check} className="flex-1 bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 rounded-xl transition-colors">✓ Check</button>
                <button onClick={hint} disabled={hintUsed} className="bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 text-white font-bold px-4 py-3 rounded-xl transition-colors">💡 Hint</button>
                <button onClick={skip} className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold px-4 py-3 rounded-xl transition-colors">Skip</button>
              </div>

              {status !== 'idle' && (
                <button onClick={exit} className="mx-auto block text-slate-400 hover:text-white font-semibold underline">Exit Fullscreen</button>
              )}
            </div>
          </div>

          <div className="space-y-6 text-slate-300 mt-10">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">What is the Word Puzzle Game?</h2>
              <p>The <strong>Word Puzzle Game</strong> scrambles the letters of hidden words and challenges you to unscramble them. With four vocabulary categories — Animals, Countries, Science, and Fruits — it is a versatile <strong>brain training game for students</strong> that builds spelling accuracy, pattern recognition, and vocabulary breadth across subjects.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Benefits for Students</h2>
              <p>Word puzzles are scientifically linked to <strong>improved language processing, spelling, and reading comprehension</strong>. Students who regularly engage with word games score higher on verbal sections of standardized tests. It is also one of the most enjoyable <strong>study break games</strong> — quick, satisfying, and directly educational.</p>
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
                {[['➕ Math Quiz', '/math-quiz-game'], ['🧩 Logic Puzzle', '/logic-puzzle-game'], ['🃏 Memory Cards', '/memory-card-game'], ['⌨️ Typing Speed', '/typing-speed-test'], ['🔍 Sudoku', '/sudoku-game'], ['🎮 All Games', '/free-games']].map(([l, p]) => (
                  <Link key={p} to={p} className="bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/30 rounded-lg px-3 py-1.5 text-teal-300 text-sm transition-colors">{l}</Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
