import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { initAudio, playSound } from '../../utils/gameAudio';

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

const gameSchema = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "Academic Word Scramble Puzzle",
  "description": "Unscramble words in categories like Science, Animals, and Countries. A fun way for students to build vocabulary.",
  "genre": "Brain Game",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
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

  const start = () => { initAudio(); setStatus('playing'); };
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
      playSound('score');
      setFeedback('correct');
      setScore(s => s + (hintUsed ? 5 : 10) + streak * 2);
      setStreak(s => s + 1);
      setSolved(s => s + 1);
      setTimeout(next, 800);
    } else {
      playSound('error');
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
        <script type="application/ld+json">{JSON.stringify(gameSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900/20 to-slate-900 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white mb-2">📝 Word Puzzle</h1>
            <p className="text-slate-400">Unscramble the letters to form the hidden word!</p>
          </div>

          <div className={status !== 'idle' ? "fixed inset-0 z-[100] bg-slate-900 overflow-y-auto lg:overflow-hidden" : "max-w-md mx-auto"}>
            <div className={status !== 'idle' ? "flex flex-col items-center justify-center h-screen py-4 px-4" : "relative flex flex-col bg-slate-800/50 rounded-3xl p-4 border border-white/10 shadow-2xl overflow-hidden min-h-[600px]"}>
              <div className={status !== 'idle' ? "w-full max-w-lg h-full max-h-[95vh] flex flex-col" : "w-full flex-1 flex flex-col"}>
                {status === 'idle' && (
                  <div className="absolute inset-0 z-10 bg-[#080c14]/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center rounded-3xl border border-white/10 overflow-hidden">
                    {/* Animated Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-600/20 rounded-full blur-[80px] animate-pulse pointer-events-none" />

                    <div className="relative z-20 flex flex-col items-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl shadow-teal-500/20 mb-6 animate-bounce">
                        🔠
                      </div>
                      <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">Word Unscramble</h2>
                      <p className="text-slate-400 mb-8 max-w-sm text-sm sm:text-base font-medium leading-relaxed">
                        Decode the scrambled letters. Pick a category to begin generating words!
                      </p>
                      
                      {/* Category Selector */}
                      <div className="flex gap-2 flex-wrap justify-center mb-10 bg-white/[0.03] p-2 rounded-2xl border border-white/[0.08] backdrop-blur-md max-w-sm">
                        {CATEGORIES.map((c, i) => (
                          <button 
                            key={i} 
                            onClick={() => setCatIdx(i)} 
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                              catIdx === i 
                                ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/25' 
                                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <span>{i === 0 ? '🦁' : i === 1 ? '🌍' : i === 2 ? '🔬' : '🍎'}</span> {c.name}
                          </button>
                        ))}
                      </div>

                      {/* Play Button */}
                      <button 
                        onClick={() => setStatus('playing')} 
                        className="group relative w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-black px-12 py-4 rounded-2xl shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:shadow-[0_0_50px_rgba(20,184,166,0.4)] transform hover:-translate-y-1 active:scale-95 transition-all duration-300 text-lg flex items-center justify-center gap-3 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <span className="relative z-10 flex items-center gap-2">
                          ▶ Start Game
                        </span>
                      </button>
                    </div>
                  </div>
                )}


              <div className="grid grid-cols-3 gap-2 mb-6">
                {[{ l: 'Score', v: score, c: 'text-teal-400' }, { l: '🔥 Streak', v: streak, c: 'text-yellow-400' }, { l: 'Solved', v: solved, c: 'text-green-400' }].map((s, i) => (
                  <div key={i} className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
                    <div className="text-slate-400 text-xs uppercase mb-1">{s.l}</div>
                    <div className={`text-xl font-bold ${s.c}`}>{s.v}</div>
                  </div>
                ))}
              </div>

              <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
                <div className={`bg-slate-800 border-2 rounded-2xl p-4 md:p-8 text-center w-full max-w-full max-h-full overflow-y-auto transition-colors relative ${feedback === 'correct' ? 'border-green-500' : feedback === 'wrong' ? 'border-red-500' : 'border-slate-700'}`}>
                  <div className="text-slate-400 text-sm mb-2 uppercase tracking-wider">{cat.name}</div>
                  <div className="text-3xl md:text-5xl font-extrabold tracking-widest text-white mb-2 flex justify-center gap-2 flex-wrap">
                    {currentScrambled.split('').map((ch, i) => (
                      <span key={i} className="bg-teal-500/20 border border-teal-400/30 rounded-xl w-10 h-12 md:w-12 md:h-14 inline-flex items-center justify-center">{ch}</span>
                    ))}
                  </div>
                  {showHint && <p className="text-yellow-400 text-sm mt-3">💡 Hint: Starts with <strong>{word[0]}</strong>, has <strong>{word.length}</strong> letters</p>}
                  {status === 'idle' && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                      <button onClick={start} className="bg-teal-500 hover:bg-teal-400 text-white font-bold px-8 py-3 rounded-2xl shadow-xl transform active:scale-95 transition-all">Start Puzzle</button>
                    </div>
                  )}
                </div>
              </div>

              <input
                value={input}
                onChange={e => { setInput(e.target.value.toUpperCase()); playSound('move'); }}
                onFocus={() => { if (status === 'idle') { initAudio(); setStatus('playing'); } }}
                onKeyDown={e => e.key === 'Enter' && check()}
                placeholder="Type your answer..."
                maxLength={word.length + 2}
                className="w-full bg-slate-800 border-2 border-slate-600 focus:border-teal-500 rounded-xl px-5 py-4 text-white text-xl font-bold text-center uppercase tracking-widest outline-none mb-3 transition-colors"
                autoFocus={status === 'playing'}
              />

              <div className="flex gap-3 mb-6">
                <button onClick={check} className="flex-1 bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 rounded-xl transition-colors">✓ Check</button>
                <button onClick={hint} disabled={hintUsed} className="bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 text-white font-bold px-4 py-3 rounded-xl transition-colors">💡 Hint</button>
                <button onClick={skip} className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold px-4 py-3 rounded-xl transition-colors">Skip</button>
              </div>

              {status !== 'idle' && (
                <button 
                  onClick={exit} 
                  className="mt-4 mb-2 flex-shrink-0 mx-auto flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-6 py-2.5 rounded-2xl text-red-400 font-bold transition-all hover:scale-105 active:scale-95"
                >
                  <span>✕</span> Exit Game
                </button>
              )}
              </div>
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
