import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { initAudio, playSound } from '../../utils/gameAudio';

const WIN = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function checkWinner(b) {
  for (const [a,c,d] of WIN) if (b[a] && b[a]===b[c] && b[a]===b[d]) return { winner: b[a], line: [a,c,d] };
  if (b.every(Boolean)) return { winner: 'draw' };
  return null;
}

function minimax(b, isX) {
  const r = checkWinner(b);
  if (r) return r.winner === 'O' ? 10 : r.winner === 'X' ? -10 : 0;
  const scores = [];
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      const nb = [...b]; nb[i] = isX ? 'X' : 'O';
      scores.push(minimax(nb, !isX));
    }
  }
  return isX ? Math.max(...scores) : Math.min(...scores);
}

function bestMove(b, difficulty = 'Hard') {
  // Hard = 100% Minimax, Medium = 60% Minimax, Easy = 20% Minimax
  const threshold = difficulty === 'Hard' ? 1.0 : difficulty === 'Medium' ? 0.6 : 0.2;
  
  if (Math.random() > threshold) {
    // Random move
    const emptyIndices = [];
    for (let i = 0; i < 9; i++) if (!b[i]) emptyIndices.push(i);
    if (emptyIndices.length > 0) return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }
  
  // Minimax move
  let best = -Infinity, move = -1;
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      const nb = [...b]; nb[i] = 'O';
      const s = minimax(nb, true);
      if (s > best) { best = s; move = i; }
    }
  }
  return move;
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is Tic Tac Toe?', acceptedAnswer: { '@type': 'Answer', text: 'Tic Tac Toe is a classic 2-player game played on a 3×3 grid. Players take turns marking X or O. The first to get three in a row wins.' } },
    { '@type': 'Question', name: 'Can I play Tic Tac Toe against the computer?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Our Tic Tac Toe has a smart AI opponent powered by the Minimax algorithm that plays perfectly.' } },
    { '@type': 'Question', name: 'Is Tic Tac Toe good for students?', acceptedAnswer: { '@type': 'Answer', text: 'Tic Tac Toe teaches strategic thinking, pattern recognition, and logical planning — perfect quick brain exercises for students.' } },
    { '@type': 'Question', name: 'Is this Tic Tac Toe game free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, completely free. No download, no sign-up. Play instantly in your browser.' } },
  ],
};

const gameSchema = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "Smart Tic Tac Toe AI",
  "description": "Play the classic Tic Tac Toe game against our unbeatable AI or a friend. Perfect strategic break for students.",
  "genre": "Strategy Game",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
};

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsHuman, setXIsHuman] = useState(true);
  const [mode, setMode] = useState('pvai'); // pvai | pvp
  const [difficulty, setDifficulty] = useState('Medium'); // Easy | Medium | Hard
  const [scores, setScores] = useState({ X: 0, O: 0, D: 0 });
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, playing, over

  const start = () => { initAudio(); setStatus('playing'); };
  const exit = () => setStatus('idle');

  const current = history[step];
  const result = checkWinner(current);
  const xIsNext = step % 2 === 0;

  const handleClick = (i) => {
    if (current[i] || result) return;
    if (mode === 'pvai' && !xIsNext) return;
    doMove(i);
  };

  const doMove = (i, fromAI = false) => {
    const nb = [...current]; nb[i] = xIsNext ? 'X' : 'O';
    const newHistory = [...history.slice(0, step + 1), nb];
    setHistory(newHistory); setStep(newHistory.length - 1);
    const res = checkWinner(nb);
    if (res) {
      if (res.winner === 'X') setScores(s => ({ ...s, X: s.X+1 }));
      else if (res.winner === 'O') setScores(s => ({ ...s, O: s.O+1 }));
      else setScores(s => ({ ...s, D: s.D+1 }));
      return;
    }
    if (mode === 'pvai' && !fromAI) {
      const m = bestMove(nb, difficulty);
      if (m !== -1) setTimeout(() => {
        const nb2 = [...nb]; nb2[m] = 'O';
        playSound('move');
        const h2 = [...newHistory, nb2];
        setHistory(h2); setStep(h2.length - 1);
        const r2 = checkWinner(nb2);
        if (r2) {
          if (r2.winner === 'O') { playSound('over'); setScores(s => ({ ...s, O: s.O+1 })); }
          else { playSound('move'); setScores(s => ({ ...s, D: s.D+1 })); }
        }
      }, 300);
    }
  };

  const reset = () => { setHistory([Array(9).fill(null)]); setStep(0); };

  const cellStyle = (i) => {
    const base = 'aspect-square flex items-center justify-center text-5xl font-extrabold rounded-2xl transition-all duration-200 ';
    if (result?.line?.includes(i)) return base + 'bg-yellow-500/30 border-2 border-yellow-400';
    if (current[i]) return base + (current[i] === 'X' ? 'bg-blue-500/20 border border-blue-400/40 text-blue-400' : 'bg-rose-500/20 border border-rose-400/40 text-rose-400');
    return base + 'bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer text-transparent';
  };

  const status_text = result ? (result.winner === 'draw' ? "It's a draw! 🤝" : `${result.winner} wins! 🎉`) : `${xIsNext ? 'X' : 'O'}'s turn`;

  return (
    <>
      <Helmet>
        <title>Tic Tac Toe Online — Play vs AI Free | StudentAI Tools</title>
        <meta name="description" content="Play Tic Tac Toe online for free! Challenge a smart AI or a friend. Classic X and O game in your browser. No download needed — perfect student study break game." />
        <meta name="keywords" content="tic tac toe online, tic tac toe vs computer, free tic tac toe, classic game for students, study break game" />
        <link rel="canonical" href="https://studentaitools.in/tic-tac-toe" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(gameSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white mb-2">⭕ Tic Tac Toe</h1>
            <p className="text-slate-400">Challenge the AI or play with a friend!</p>
          </div>

          <div className={status !== 'idle' ? "fixed inset-0 z-[100] bg-slate-900 overflow-y-auto lg:overflow-hidden" : "max-w-md mx-auto"}>
            <div className={status !== 'idle' ? "flex flex-col items-center justify-center h-screen py-4 px-4" : "relative flex flex-col bg-slate-800/50 rounded-3xl p-4 border border-white/10 shadow-2xl overflow-hidden min-h-[600px]"}>
              <div className={status !== 'idle' ? "w-full max-w-lg h-full max-h-[95vh] flex flex-col" : "w-full flex-1 flex flex-col"}>
                {status === 'idle' && (
                  <div className="absolute inset-0 z-10 bg-[#080c14]/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center rounded-3xl border border-white/10 overflow-hidden">
                    {/* Animated Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-600/20 rounded-full blur-[80px] animate-pulse pointer-events-none" />

                    <div className="relative z-20 flex flex-col items-center w-full max-w-xs">
                      <div className="w-24 h-24 bg-gradient-to-br from-sky-500 to-blue-600 rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl shadow-sky-500/20 mb-6 animate-bounce">
                        ⭕
                      </div>
                      <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Tic Tac Toe</h2>
                      <p className="text-slate-400 mb-8 text-sm sm:text-base font-medium leading-relaxed">
                        Challenge our smart AI or play with a friend. Strategy is key!
                      </p>
                      
                      <div className="flex flex-col gap-4 mb-10 w-full">
                        <div className="flex gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.08] backdrop-blur-md">
                          <button onClick={() => { setMode('pvai'); reset(); }} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${mode === 'pvai' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>🤖 vs AI</button>
                          <button onClick={() => { setMode('pvp'); reset(); }} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${mode === 'pvp' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>👥 2 Players</button>
                        </div>

                        {mode === 'pvai' && (
                          <div className="flex gap-2 justify-center bg-white/[0.02] p-1.5 rounded-xl border border-white/[0.05]">
                            {['Easy', 'Medium', 'Hard'].map(d => (
                              <button 
                                key={d} 
                                onClick={() => setDifficulty(d)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${difficulty === d ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                              >
                                {d}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Play Button */}
                      <button 
                        onClick={start} 
                        className="group relative w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black px-12 py-4 rounded-2xl shadow-[0_0_40px_rgba(14,165,233,0.3)] hover:shadow-[0_0_50px_rgba(14,165,233,0.4)] transform hover:-translate-y-1 active:scale-95 transition-all duration-300 text-lg flex items-center justify-center gap-3 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <span className="relative z-10 flex items-center gap-2">
                          ▶ Start Game
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              {/* Mode indicator */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="px-4 py-1.5 bg-slate-800 rounded-xl border border-white/5 text-slate-300 text-xs font-bold uppercase tracking-widest">
                  {mode === 'pvai' ? `🤖 AI (${difficulty})` : '👥 2 Players'}
                </div>
                <button onClick={reset} className="bg-blue-500 hover:bg-blue-400 text-white text-[10px] uppercase tracking-tighter font-black px-3 py-1.5 rounded-lg transition-colors">Reset</button>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-3">
                  <div className="bg-blue-900/50 border border-blue-400/20 rounded-xl px-4 py-2 text-center">
                    <div className="text-blue-300 text-xs">X (You)</div>
                    <div className="text-white font-bold text-lg">{scores.X}</div>
                  </div>
                  <div className="bg-slate-700 rounded-xl px-4 py-2 text-center">
                    <div className="text-slate-400 text-xs">Draw</div>
                    <div className="text-white font-bold text-lg">{scores.D}</div>
                  </div>
                  <div className="bg-rose-900/50 border border-rose-400/20 rounded-xl px-4 py-2 text-center">
                    <div className="text-rose-300 text-xs">{mode === 'pvai' ? '🤖 AI' : 'O'}</div>
                    <div className="text-white font-bold text-lg">{scores.O}</div>
                  </div>
                </div>
                <button onClick={reset} className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">New Game</button>
              </div>

              <div className="text-center text-white font-bold mb-4 text-lg">{status === 'idle' ? 'Ready to play?' : status_text}</div>

              <div className="flex-1 min-h-0 w-full flex items-center justify-center p-4 overflow-hidden">
                <div className="grid grid-cols-3 gap-3 relative overflow-hidden rounded-2xl h-full max-h-full aspect-square w-auto mx-auto shadow-2xl">
                  {Array(9).fill(null).map((_, i) => (
                    <button key={i} className={cellStyle(i)} onClick={() => { if (status === 'idle') setStatus('playing'); handleClick(i); }}>
                      <span className="text-3xl md:text-5xl">{current[i] || ''}</span>
                    </button>
                  ))}
                </div>
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

          <div className="space-y-6 text-slate-300 mt-8">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">What is Tic Tac Toe?</h2>
              <p><strong>Tic Tac Toe</strong> (also called Noughts and Crosses) is a timeless two-player strategy game played on a 3×3 grid. Players alternate placing X or O, and the first to align three of their marks horizontally, vertically, or diagonally wins. It is one of the most beloved <strong>classic browser games for students</strong>.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">How to Play</h2>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>You are <strong>X</strong>, the AI is <strong>O</strong> (or Player 2 in 2-player mode)</li>
                <li>Click an empty square to place your mark</li>
                <li>Get <strong>three in a row</strong> (row, column, or diagonal) to win</li>
                <li>The AI uses the <strong>Minimax algorithm</strong> — play perfectly to draw!</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Benefits for Students</h2>
              <p>Tic Tac Toe teaches <strong>strategic thinking, pattern recognition, and logical planning</strong> in a very approachable format. Trying to beat an AI that plays perfectly is a great exercise in understanding game theory — a concept used in economics, computer science, and mathematics courses.</p>
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
                {[['🐍 Snake', '/snake-game'], ['🔍 Sudoku', '/sudoku-game'], ['🃏 Memory Cards', '/memory-card-game'], ['⌨️ Typing Speed', '/typing-speed-test'], ['🎮 All Games', '/free-games']].map(([l, p]) => (
                  <Link key={p} to={p} className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg px-3 py-1.5 text-blue-300 text-sm transition-colors">{l}</Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
