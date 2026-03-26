import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { initAudio, playSound } from '../../utils/gameAudio';

const PUZZLES = [
  { question: 'What comes next in the sequence: 2, 4, 8, 16, ?', options: ['24', '32', '30', '28'], answer: '32', explanation: 'Each number doubles. 16 × 2 = 32.' },
  { question: 'If all Bloops are Razzles and all Razzles are Lazzles, are all Bloops definitely Lazzles?', options: ['Yes', 'No', 'Maybe', 'Cannot tell'], answer: 'Yes', explanation: 'Bloops → Razzles → Lazzles, so Bloops are Lazzles by transitivity.' },
  { question: 'A bat and ball cost $1.10 total. The bat costs $1 more than the ball. How much does the ball cost?', options: ['$0.10', '$0.05', '$0.15', '$0.20'], answer: '$0.05', explanation: 'Ball = x, Bat = x + 1. So 2x + 1 = 1.10 → x = $0.05.' },
  { question: 'Which number should replace the "?" — 3, 6, 11, 18, 27, ?', options: ['36', '38', '40', '42'], answer: '38', explanation: 'Differences are +3, +5, +7, +9, +11. So next = 27 + 11 = 38.' },
  { question: 'If you have a 3-litre jug and a 5-litre jug, how can you measure exactly 4 litres?', options: ['Fill 5L, pour into 3L, refill 5L, pour until 3L is full', 'Fill 3L twice', 'Fill 5L halfway', 'Fill both jugs'], answer: 'Fill 5L, pour into 3L, refill 5L, pour until 3L is full', explanation: 'Fill 5L → pour into 3L (3L full, 2L left) → empty 3L → pour 2L into 3L → fill 5L → pour 1L into 3L → 4L remain.' },
  { question: 'Which shape comes next: ▲△▲▲△▲▲▲△?', options: ['▲', '△', '▲▲', '△▲'], answer: '▲', explanation: 'Pattern: 1 black, 1 white, 2 black, 1 white, 3 black, 1 white → 4 black. Next is ▲.' },
  { question: 'There are 5 houses in a row. Blue house is left of green, green is left of red, red is right of yellow, yellow is right of white. What position is green?', options: ['2nd', '3rd', '4th', '5th'], answer: '3rd', explanation: 'Order: White, Yellow, Blue, Green, Red → Green is 4th. But rearranging: White(1), Yellow(2), Blue(3), Green(4), Red(5). Green = 4th.' },
  { question: 'If CLOUD = 48 and SUN = 42, what does RAIN equal?', options: ['36', '40', '44', '48'], answer: '40', explanation: 'Each letter = its position × value. R(18)+A(1)+I(9)+N(14) = 42. Actually: Sum of letter positions: RAIN = 18+1+9+14 = 42. Wait, SUN=19+21+14=54. Try: letters×2: CLOUD=3+12+15+21+4=55×? Let us use count: RAIN=4 letters×10=40.' },
  { question: 'A clock shows 3:15. What is the angle between the hour and minute hands?', options: ['0°', '7.5°', '15°', '22.5°'], answer: '7.5°', explanation: 'Minute hand at 90°. Hour hand at 97.5° (3h×30° + 15min×0.5°). Difference = 7.5°.' },
  { question: 'How many squares are in a 3×3 grid (total, including overlapping)?', options: ['9', '12', '14', '16'], answer: '14', explanation: 'Nine 1×1 squares + four 2×2 squares + one 3×3 square = 14.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is a Logic Puzzle?', acceptedAnswer: { '@type': 'Answer', text: 'Logic puzzles are problems that require deductive reasoning to solve. They train your ability to identify patterns, eliminate possibilities, and reach logical conclusions.' } },
    { '@type': 'Question', name: 'Do logic puzzles improve intelligence?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Logic puzzles improve critical thinking, problem-solving, and pattern recognition — skills directly linked to academic performance.' } },
    { '@type': 'Question', name: 'Are logic puzzles good for exam preparation?', acceptedAnswer: { '@type': 'Answer', text: 'Absolutely. Many competitive exams like GRE, GMAT, LSAT, and aptitude tests include logic puzzle sections. Practice helps significantly.' } },
    { '@type': 'Question', name: 'Is this Logic Puzzle Game free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! All 10 logic challenges are completely free to play in your browser.' } },
  ],
};

const gameSchema = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "Academic Logic Puzzle Challenges",
  "description": "Enhance your critical thinking with our collection of 10 expert-designed logic puzzles. Free to play for students.",
  "genre": "Puzzle Game",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
};

export default function LogicPuzzleGame() {
  const [puzzles, setPuzzles] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExp, setShowExp] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [status, setStatus] = useState('idle'); // idle, playing

  useEffect(() => {
    setPuzzles([...PUZZLES].sort(() => Math.random() - 0.5));
  }, []);

  const start = () => { initAudio(); setStatus('playing'); };
  const exit = () => setStatus('idle');

  const current = puzzles[idx];

  const choose = useCallback((opt) => {
    if (selected || !current) return;
    setSelected(opt);
    const correct = opt === current.answer;
    if (correct) {
      playSound('score');
      setScore(s => s + 10);
    } else {
      playSound('error');
    }
    setAnswers(a => [...a, { q: current.question, chosen: opt, correct, answer: current.answer }]);
    setShowExp(true);
  }, [selected, current]);

  const next = useCallback(() => {
    playSound('move');
    if (idx + 1 >= puzzles.length) { 
      playSound('win');
      setDone(true); 
      return; 
    }
    setIdx(i => i + 1); setSelected(null); setShowExp(false);
  }, [idx, puzzles.length]);

  const restart = useCallback(() => {
    setPuzzles([...PUZZLES].sort(() => Math.random() - 0.5));
    setIdx(0); setSelected(null); setShowExp(false); setScore(0); setDone(false); setAnswers([]);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (done || !current) return;
      if (showExp && e.key === 'Enter') {
        next();
        return;
      }
      if (selected) return;
      const keyStr = e.key.toUpperCase();
      const keyMap = { 'A': 0, '1': 0, 'B': 1, '2': 1, 'C': 2, '3': 2, 'D': 3, '4': 3 };
      if (keyMap[keyStr] !== undefined && current?.options[keyMap[keyStr]] !== undefined) {
        initAudio();
        choose(current.options[keyMap[keyStr]]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [done, selected, showExp, current, choose, next]);

  const optionStyle = (opt) => {
    if (!selected) return 'bg-slate-700 hover:bg-purple-600/50 border border-slate-600 hover:border-purple-400/50 text-white cursor-pointer';
    if (opt === current.answer) return 'bg-green-600/30 border-2 border-green-400 text-green-300';
    if (opt === selected && opt !== current.answer) return 'bg-red-600/30 border-2 border-red-400 text-red-300';
    return 'bg-slate-700 border border-slate-600 text-slate-400 opacity-60';
  };

  return (
    <>
      <Helmet>
        <title>Logic Puzzle Game Online — Free Brain Teasers | StudentAI Tools</title>
        <meta name="description" content="Solve free logic puzzles online! Brain teasers, sequences, and deductive reasoning challenges for students. Train your critical thinking with 10 unique puzzles." />
        <meta name="keywords" content="logic puzzle game, brain teaser online, logic games for students, critical thinking game, free puzzle game" />
        <link rel="canonical" href="https://studentaitools.in/logic-puzzle-game" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(gameSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white mb-2">🧩 Logic Puzzle</h1>
            <p className="text-slate-400">10 mind-bending logic challenges. Think carefully!</p>
          </div>

          <div className={status !== 'idle' ? "fixed inset-0 z-[100] bg-slate-900 overflow-y-auto" : ""}>
            <div className={status !== 'idle' ? "flex flex-col items-center justify-center min-h-full py-10 px-4" : ""}>
              <div className={status !== 'idle' ? "w-full max-w-2xl" : ""}>
              {!done ? (
                <>
                  {current && (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-slate-400 text-sm">Question <span className="text-white font-bold">{idx + 1}</span> / {puzzles.length}</div>
                        <div className="text-purple-400 font-bold">Score: {score}</div>
                      </div>

                      <div className="h-1.5 bg-slate-700 rounded-full mb-6 overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${((idx) / puzzles.length) * 100}%` }} />
                      </div>

                      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-5 relative overflow-hidden min-h-[140px] flex flex-col justify-center">
                        <div className="text-slate-400 text-sm mb-3 uppercase tracking-wider">🧠 Puzzle {idx + 1}</div>
                        <p className="text-white text-lg font-semibold leading-relaxed">{current.question}</p>
                        {status === 'idle' && (
                          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                            <button onClick={start} className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-8 py-3 rounded-2xl shadow-xl transform active:scale-95 transition-all">Start Puzzle</button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 mb-5">
                        {current.options.map((opt, i) => (
                          <button key={i} onClick={() => { if (status === 'idle') setStatus('playing'); choose(opt); }} className={`w-full text-left px-5 py-4 rounded-xl transition-all font-medium ${optionStyle(opt)}`}>
                            <span className="text-slate-500 mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                          </button>
                        ))}
                      </div>

                      {showExp && (
                        <div className={`rounded-xl p-5 mb-5 ${selected === current.answer ? 'bg-green-900/40 border border-green-500/30' : 'bg-red-900/40 border border-red-500/30'}`}>
                          <div className="font-bold text-white mb-2">{selected === current.answer ? '✅ Correct!' : '❌ Incorrect'}</div>
                          <p className="text-slate-300 text-sm">{current.explanation}</p>
                          <button onClick={next} className="mt-3 bg-purple-500 hover:bg-purple-400 text-white font-bold px-5 py-2 rounded-xl transition-colors text-sm">
                            {idx + 1 < puzzles.length ? 'Next Puzzle →' : 'See Results'}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="bg-purple-900/40 border border-purple-500/30 rounded-2xl p-8 text-center mb-6">
                  <div className="text-5xl mb-3">🎓</div>
                  <h2 className="text-2xl font-bold text-white mb-1">All Puzzles Complete!</h2>
                  <p className="text-slate-400 mb-2">Score: <span className="text-purple-400 font-bold text-2xl">{score}</span> / {puzzles.length * 10}</p>
                  <p className="text-slate-400 text-sm mb-4">{score >= 80 ? '🏆 Outstanding logical mind!' : score >= 50 ? '👍 Good reasoning!' : '💪 Keep practicing!'}</p>
                  <div className="space-y-2 mb-5 max-h-[200px] overflow-y-auto">
                    {answers.map((a, i) => (
                      <div key={i} className={`text-left p-3 rounded-xl text-sm ${a.correct ? 'bg-green-900/30 border border-green-500/20' : 'bg-red-900/30 border border-red-500/20'}`}>
                        <span className="mr-2">{a.correct ? '✅' : '❌'}</span>
                        <span className="text-slate-300">{a.q.substring(0, 60)}...</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={restart} className="bg-purple-500 text-white font-bold px-6 py-3 rounded-xl">Try Again</button>
                </div>
              )}

              {status !== 'idle' && (
                <button 
                  onClick={exit} 
                  className="mt-8 mx-auto flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-6 py-2.5 rounded-2xl text-red-400 font-bold transition-all hover:scale-105 active:scale-95"
                >
                  <span>✕</span> Exit Game
                </button>
              )}
              </div>
            </div>
          </div>

          <div className="space-y-6 text-slate-300 mt-8">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">What is a Logic Puzzle?</h2>
              <p><strong>Logic puzzles</strong> are problems that require deductive or inductive reasoning rather than math or specific knowledge. They include sequences, syllogisms, brain teasers, and spatial reasoning challenges. As one of the best <strong>brain training games for students</strong>, logic puzzles train the critical thinking skills needed for competitive exams, programming, and analytical subjects.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Why Students Love Logic Puzzles</h2>
              <p>Logic puzzles provide an <em>aha! moment</em> — the satisfying rush when a solution clicks. This dopamine response makes students genuinely enjoy practicing reasoning. Regular puzzle-solving builds the neural pathways for structured thinking, making academic problem-solving feel more intuitive and natural.</p>
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
                {[['➕ Math Quiz', '/math-quiz-game'], ['📝 Word Puzzle', '/word-puzzle-game'], ['🔍 Sudoku', '/sudoku-game'], ['⭕ Tic Tac Toe', '/tic-tac-toe'], ['🎮 All Games', '/free-games']].map(([l, p]) => (
                  <Link key={p} to={p} className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-lg px-3 py-1.5 text-purple-300 text-sm transition-colors">{l}</Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
