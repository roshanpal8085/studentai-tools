import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { initAudio, playSound } from '../../utils/gameAudio';

function gen(difficulty) {
  const ops = difficulty === 'easy' ? ['+', '-'] : difficulty === 'medium' ? ['+', '-', '×'] : ['+', '-', '×', '÷'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;
  if (op === '+') { a = Math.floor(Math.random() * (difficulty === 'hard' ? 100 : 50)) + 1; b = Math.floor(Math.random() * (difficulty === 'hard' ? 100 : 50)) + 1; answer = a + b; }
  else if (op === '-') { a = Math.floor(Math.random() * 80) + 20; b = Math.floor(Math.random() * a) + 1; answer = a - b; }
  else if (op === '×') { a = Math.floor(Math.random() * (difficulty === 'hard' ? 15 : 12)) + 2; b = Math.floor(Math.random() * (difficulty === 'hard' ? 15 : 12)) + 2; answer = a * b; }
  else { a = Math.floor(Math.random() * 11) + 2; b = Math.floor(Math.random() * 10) + 1; answer = a * b; a = answer; }
  const wrong = () => { let w; do { w = answer + Math.floor(Math.random() * 21) - 10; } while (w === answer || w < 0); return w; };
  const opts = [answer, wrong(), wrong(), wrong()].sort(() => Math.random() - 0.5);
  return { question: `${a} ${op} ${b}`, answer, options: opts };
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is the Math Quiz Game?', acceptedAnswer: { '@type': 'Answer', text: 'Math Quiz is a timed arithmetic challenge game. Answer addition, subtraction, multiplication, and division questions as fast as possible to score points.' } },
    { '@type': 'Question', name: 'Is Math Quiz good for students?', acceptedAnswer: { '@type': 'Answer', text: 'Absolutely! Regular mental math practice sharpens number sense, calculation speed, and confidence — essential for school exams.' } },
    { '@type': 'Question', name: 'How do I get better at mental math?', acceptedAnswer: { '@type': 'Answer', text: 'Practice daily with quick quizzes, learn multiplication tables, and use tricks like rounding and breaking numbers apart.' } },
    { '@type': 'Question', name: 'Is the Math Quiz free to play?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! The Math Quiz Game is completely free in your browser with no download required.' } },
  ],
};

const gameSchema = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "Fast Mental Math Quiz Online",
  "description": "Boost your calculation speed with our timed math quiz. Covers addition, subtraction, multiplication, and division.",
  "genre": "Educational Game",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
};

export default function MathQuizGame() {
  const [difficulty, setDifficulty] = useState('medium');
  const [q, setQ] = useState(() => gen('medium'));
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('mathbest') || '0'));
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [total, setTotal] = useState(0);
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTime(s => {
      if (s <= 1) { clearInterval(t); setFinished(true); setRunning(false); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [running]);

  const answer = (opt) => {
    if (!running || finished) return;
    setTotal(t => t + 1);
    if (opt === q.answer) {
      playSound('score');
      setScore(s => s + 10 + streak * 2);
      setStreak(s => s + 1);
      setFeedback('correct');
    } else {
      playSound('error');
      setStreak(0);
      setFeedback('wrong');
    }
    setTimeout(() => { setFeedback(null); setQ(gen(difficulty)); }, 500);
  };

  const start = () => {
    initAudio();
    setScore(0); setStreak(0); setTotal(0); setTime(30);
    setRunning(true); setFinished(false); setFeedback(null); setQ(gen(difficulty));
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!running || finished || feedback) return;
      const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3 };
      if (keyMap[e.key] !== undefined && q?.options[keyMap[e.key]] !== undefined) {
        initAudio();
        answer(q.options[keyMap[e.key]]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [running, finished, feedback, q, answer]);

  useEffect(() => {
    if (finished && score > best) { 
      playSound('win');
      setBest(score); 
      localStorage.setItem('mathbest', score); 
    } else if (finished) {
      playSound('over');
    }
  }, [finished]);

  return (
    <>
      <Helmet>
        <title>Math Quiz Game Online — Free Mental Math Game | StudentAI Tools</title>
        <meta name="description" content="Test your mental math skills with free Math Quiz! Addition, subtraction, multiplication, division. A fun brain training game for students. No download needed." />
        <meta name="keywords" content="math quiz game, mental math game, free math game for students, arithmetic quiz, brain training math" />
        <link rel="canonical" href="https://studentaitools.in/math-quiz-game" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(gameSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white mb-2">➕ Math Quiz Game</h1>
            <p className="text-slate-400">Answer as many math questions as possible in 30 seconds!</p>
          </div>

          <div className={running || finished ? "fixed inset-0 z-[100] bg-slate-900 overflow-y-auto lg:overflow-hidden" : "max-w-md mx-auto"}>
            <div className={running || finished ? "flex flex-col items-center justify-center h-screen py-4 px-4" : "relative flex flex-col bg-slate-800/50 rounded-3xl p-4 border border-white/10 shadow-2xl overflow-hidden min-h-[600px]"}>
              <div className={running || finished ? "w-full max-w-lg h-full max-h-[95vh] flex flex-col" : "w-full flex-1 flex flex-col"}>
                {!running && !finished && (
                  <div className="absolute inset-0 z-10 bg-[#080c14]/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center rounded-3xl border border-white/10 overflow-hidden">
                    {/* Animated Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] animate-pulse pointer-events-none" />

                    <div className="relative z-20 flex flex-col items-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl shadow-blue-500/20 mb-6 animate-bounce">
                        ➕
                      </div>
                      <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">Math Quiz</h2>
                      <p className="text-slate-400 mb-10 max-w-sm text-sm sm:text-base font-medium leading-relaxed">
                        How many questions can you answer in 30 seconds? Choose your level and start the timer!
                      </p>
                      
                      {/* Difficulty Selector */}
                      <div className="flex gap-2 mb-10 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.08] backdrop-blur-md">
                        {['easy', 'medium', 'hard'].map(d => (
                          <button 
                            key={d} 
                            onClick={() => { setDifficulty(d); }} 
                            className={`px-6 py-2.5 text-sm font-bold capitalize rounded-xl transition-all duration-300 ${
                              difficulty === d 
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
                                : 'text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>

                      {/* Play Button */}
                      <button 
                        onClick={start} 
                        className="group relative w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black px-12 py-4 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] transform hover:-translate-y-1 active:scale-95 transition-all duration-300 text-lg flex items-center justify-center gap-3 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <span className="relative z-10 flex items-center gap-2">
                          ▶ Start Quiz
                        </span>
                      </button>
                    </div>
                  </div>
                )}


              <div className="grid grid-cols-4 gap-2 mb-6">
                {[{ l: 'Score', v: score, c: 'text-orange-400' }, { l: 'Time', v: time, c: time <= 10 ? 'text-red-400' : 'text-white' }, { l: 'Streak', v: `🔥${streak}`, c: 'text-yellow-400' }, { l: 'Best', v: best, c: 'text-green-400' }].map((s, i) => (
                  <div key={i} className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
                    <div className="text-slate-400 text-xs uppercase mb-1">{s.l}</div>
                    <div className={`text-lg font-bold ${s.c}`}>{s.v}</div>
                  </div>
                ))}
              </div>

              {!running && !finished && (
                <div className="text-center mb-6">
                  <button onClick={start} className="bg-orange-500 hover:bg-orange-400 text-white font-bold text-xl px-10 py-4 rounded-2xl transition-colors shadow-lg shadow-orange-900/30">▶ Start Game</button>
                </div>
              )}

              {running && !finished && (
              <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
                <div className={`bg-slate-800 border-2 rounded-2xl p-6 md:p-8 text-center w-full max-w-full max-h-full overflow-y-auto transition-colors ${feedback === 'correct' ? 'border-green-500' : feedback === 'wrong' ? 'border-red-500' : 'border-slate-700'}`}>
                  <div className="text-slate-400 text-sm mb-1 uppercase tracking-wider">What is...</div>
                  <div className="text-3xl md:text-5xl font-extrabold text-white mb-6">{q.question} = ?</div>
                  <div className="grid grid-cols-2 gap-3">
                    {q.options.map((opt, i) => (
                      <button key={i} onClick={() => answer(opt)} className="bg-slate-700 hover:bg-orange-500 text-white text-xl md:text-2xl font-bold py-3 md:py-4 rounded-xl transition-all active:scale-95 touch-none">
                        {opt}
                      </button>
                    ))}
                  </div>
                  {feedback && (
                    <div className={`mt-4 text-xl md:text-2xl font-bold ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                      {feedback === 'correct' ? '✅ Correct!' : `❌ Answer: ${q.answer}`}
                    </div>
                  )}
                </div>
              </div>
              )}

              {finished && (
                <div className="bg-orange-900/40 border border-orange-500/30 rounded-2xl p-8 text-center mb-6">
                  <div className="text-5xl mb-3">🏆</div>
                  <h2 className="text-2xl font-bold text-white mb-2">Time's Up!</h2>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-800 rounded-xl p-3"><div className="text-slate-400 text-sm">Final Score</div><div className="text-orange-400 text-2xl font-bold">{score}</div></div>
                    <div className="bg-slate-800 rounded-xl p-3"><div className="text-slate-400 text-sm">Answered</div><div className="text-white text-2xl font-bold">{total}</div></div>
                  </div>
                  <button onClick={start} className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl touch-none">Play Again</button>
                </div>
              )}

              {(running || finished) && (
                <button 
                  onClick={() => { setRunning(false); setFinished(false); }} 
                  className="mt-4 mb-2 flex-shrink-0 mx-auto flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-6 py-2.5 rounded-2xl text-red-400 font-bold transition-all hover:scale-105 active:scale-95"
                >
                  <span>✕</span> Exit Game
                </button>
              )}
            </div>
          </div>
        </div>

          <div className="space-y-6 text-slate-300 mt-8">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">What is the Math Quiz Game?</h2>
              <p>The <strong>Math Quiz Game</strong> is a timed mental arithmetic challenge perfect for students who want to sharpen their calculation speed. With three difficulty levels — Easy, Medium, and Hard — and operations covering addition, subtraction, multiplication, and division, it is one of the best <strong>brain training games for students</strong> at all academic levels.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Benefits of Mental Math Practice</h2>
              <p>Regular mental math practice strengthens <strong>number sense, calculation speed, and mathematical confidence</strong>. Students who train with quick arithmetic games consistently perform better on timed exams and standardized tests. Even 5 minutes of daily math quiz practice can yield dramatic improvements in calculation speed within weeks.</p>
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
                {[['🧩 Logic Puzzle', '/logic-puzzle-game'], ['📝 Word Puzzle', '/word-puzzle-game'], ['🔍 Sudoku', '/sudoku-game'], ['⌨️ Typing Speed', '/typing-speed-test'], ['🎮 All Games', '/free-games']].map(([l, p]) => (
                  <Link key={p} to={p} className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/30 rounded-lg px-3 py-1.5 text-orange-300 text-sm transition-colors">{l}</Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
