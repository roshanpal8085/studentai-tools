import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const GRID = 4;

function newGrid() {
  const g = Array.from({ length: GRID }, () => Array(GRID).fill(0));
  return addTile(addTile(g));
}

function copy(g) { return g.map(r => [...r]); }

function addTile(g) {
  const empties = [];
  for (let r = 0; r < GRID; r++) for (let c = 0; c < GRID; c++) if (!g[r][c]) empties.push([r, c]);
  if (!empties.length) return g;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  const ng = copy(g);
  ng[r][c] = Math.random() < 0.9 ? 2 : 4;
  return ng;
}

function slideRow(row) {
  let arr = row.filter(Boolean);
  let score = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) { arr[i] *= 2; score += arr[i]; arr[i + 1] = 0; }
  }
  arr = arr.filter(Boolean);
  while (arr.length < GRID) arr.push(0);
  return { row: arr, score };
}

function move(g, dir) {
  let ng = copy(g), total = 0, moved = false;
  if (dir === 'left') {
    for (let r = 0; r < GRID; r++) {
      const { row, score } = slideRow(ng[r]);
      if (row.join() !== ng[r].join()) moved = true;
      ng[r] = row; total += score;
    }
  } else if (dir === 'right') {
    for (let r = 0; r < GRID; r++) {
      const { row, score } = slideRow([...ng[r]].reverse());
      const rev = row.reverse();
      if (rev.join() !== ng[r].join()) moved = true;
      ng[r] = rev; total += score;
    }
  } else if (dir === 'up') {
    for (let c = 0; c < GRID; c++) {
      const col = ng.map(r => r[c]);
      const { row, score } = slideRow(col);
      if (row.join() !== col.join()) moved = true;
      row.forEach((v, r) => { ng[r][c] = v; }); total += score;
    }
  } else if (dir === 'down') {
    for (let c = 0; c < GRID; c++) {
      const col = ng.map(r => r[c]).reverse();
      const { row, score } = slideRow(col);
      const rev = row.reverse();
      if (rev.join() !== ng.map(r => r[c]).join()) moved = true;
      rev.forEach((v, r) => { ng[r][c] = v; }); total += score;
    }
  }
  return { grid: moved ? addTile(ng) : ng, score: total, moved };
}

const colors = {
  0: 'bg-slate-700 text-transparent',
  2: 'bg-yellow-100 text-slate-800',
  4: 'bg-yellow-200 text-slate-800',
  8: 'bg-orange-300 text-white',
  16: 'bg-orange-400 text-white',
  32: 'bg-orange-500 text-white',
  64: 'bg-red-500 text-white',
  128: 'bg-yellow-400 text-white',
  256: 'bg-yellow-500 text-white',
  512: 'bg-yellow-600 text-white',
  1024: 'bg-amber-600 text-white',
  2048: 'bg-amber-400 text-white shadow-lg shadow-amber-400/50',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is 2048 game?', acceptedAnswer: { '@type': 'Answer', text: '2048 is a single-player sliding tile puzzle game. The objective is to slide numbered tiles on a 4×4 grid to combine them and create a tile with the number 2048.' } },
    { '@type': 'Question', name: 'How do you win 2048?', acceptedAnswer: { '@type': 'Answer', text: 'You win 2048 by combining tiles of the same number until you create a tile with the value 2048. Use arrow keys or swipe to slide all tiles in a direction.' } },
    { '@type': 'Question', name: 'Is 2048 good for your brain?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! 2048 improves strategic thinking, planning, and spatial reasoning. It is a great brain training game for students.' } },
    { '@type': 'Question', name: 'Can I play 2048 for free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! This 2048 game is completely free to play in your browser. No download or sign-up required.' } },
  ],
};

export default function Game2048() {
  const [grid, setGrid] = useState(newGrid);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('2048best') || '0'));
  const [won, setWon] = useState(false);
  const [over, setOver] = useState(false);
  const [status, setStatus] = useState('idle');
  const touchStart = useRef(null);

  const handleMove = (dir) => {
    if (status !== 'running' || over) return;
    const { grid: ng, score: s, moved } = move(grid, dir);
    if (!moved) return;
    const newScore = score + s;
    setGrid(ng);
    setScore(newScore);
    if (newScore > best) { setBest(newScore); localStorage.setItem('2048best', newScore); }
    if (ng.flat().includes(2048)) setWon(true);
    const canMove = ['left', 'right', 'up', 'down'].some(d => move(ng, d).moved);
    if (!canMove) setOver(true);
  };

  useEffect(() => {
    const onKey = (e) => {
      const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
      if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const onTouchStart = (e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return; // Prevent accidental taps
    if (Math.abs(dx) > Math.abs(dy)) handleMove(dx > 0 ? 'right' : 'left');
    else handleMove(dy > 0 ? 'down' : 'up');
  };

  const restart = () => { setGrid(newGrid()); setScore(0); setWon(false); setOver(false); setStatus('running'); };

  return (
    <>
      <Helmet>
        <title>2048 Game Online — Free Brain Training Game | StudentAI Tools</title>
        <meta name="description" content="Play 2048 game online for free! The classic brain training tile puzzle game. No download required. Merge tiles, reach 2048, and sharpen your strategic thinking." />
        <meta name="keywords" content="2048 game, 2048 online, free brain training game, tile puzzle game, 2048 for students" />
        <link rel="canonical" href="https://studentaitools.in/2048-game" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white mb-2">🔢 2048 Game</h1>
            <p className="text-slate-400">Merge tiles to reach <span className="text-amber-400 font-bold">2048</span>! Use arrow keys or swipe.</p>
          </div>

          <div className={status !== 'idle' ? "fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-4 touch-none overflow-hidden" : ""}>
            <div className={`w-full max-w-lg ${status !== 'idle' ? "mt-auto mb-auto" : ""}`}>
              {/* Score Bar */}
              <div className="flex justify-between items-center mb-4 gap-3">
                <div className="flex gap-3 flex-1">
                  <div className="bg-amber-700 rounded-xl p-3 text-center flex-1">
                    <div className="text-amber-200 text-xs uppercase tracking-wider">Score</div>
                    <div className="text-white text-xl font-bold">{score}</div>
                  </div>
                  <div className="bg-slate-700 rounded-xl p-3 text-center flex-1">
                    <div className="text-slate-400 text-xs uppercase tracking-wider">Best</div>
                    <div className="text-white text-xl font-bold">{best}</div>
                  </div>
                </div>
                <button onClick={restart} className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-5 py-3 rounded-xl transition-colors">
                  {status === 'idle' ? 'Start' : 'New Game'}
                </button>
              </div>

              {/* Game Board */}
              <div className="relative">
                <div
                  className="bg-slate-700 rounded-2xl p-3 select-none touch-none cursor-pointer"
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                >
                  <div className="grid grid-cols-4 gap-2">
                    {grid.flat().map((val, i) => (
                      <div key={i} className={`${colors[val] || 'bg-amber-300 text-white'} rounded-xl aspect-square flex items-center justify-center text-xl md:text-3xl font-extrabold shadow-sm ${val ? 'scale-100 transition-transform' : 'scale-95 opacity-50'} duration-150`}>
                        {val || ''}
                      </div>
                    ))}
                  </div>
                </div>
                {status === 'idle' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl cursor-pointer touch-none" onClick={restart}>
                    <div className="text-center">
                      <div className="text-6xl mb-3">🔢</div>
                      <p className="text-white text-xl font-bold mb-2">Tap to Start</p>
                      <p className="text-slate-200 text-sm">Merge tiles to 2048</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls hint */}
              <div className="flex justify-center gap-4 mt-6">
                {['←', '↑', '↓', '→'].map((k, i) => (
                  <button key={i} onClick={() => handleMove(['left','up','down','right'][i])}
                    className="w-12 h-12 bg-slate-700 hover:bg-slate-600 text-white text-xl rounded-xl transition-colors font-bold touch-none">
                    {k}
                  </button>
                ))}
              </div>

              {/* Win / Over Overlay */}
              {(won || over) && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 rounded-2xl" onClick={restart}>
                  <div className="bg-slate-800 border border-amber-500/30 rounded-2xl p-8 text-center max-w-sm mx-4">
                    <div className="text-6xl mb-3">{won ? '🏆' : '😔'}</div>
                    <h2 className="text-2xl font-bold text-white mb-2">{won ? 'You reached 2048!' : 'Game Over'}</h2>
                    <p className="text-slate-400 mb-4">Score: <span className="text-amber-400 font-bold">{score}</span></p>
                    <button className="bg-amber-500 text-white font-bold px-6 py-3 rounded-xl">Play Again</button>
                  </div>
                </div>
              )}

              {status !== 'idle' && (
                <button onClick={() => setStatus('idle')} className="mt-8 mx-auto block text-slate-400 hover:text-white font-semibold underline touch-none">
                  Exit Fullscreen
                </button>
              )}
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-10 space-y-6 text-slate-300">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">What is the 2048 Game?</h2>
              <p>The <strong>2048 game</strong> is a single-player sliding tile puzzle created by Gabriele Cirulli in 2014. Played on a 4×4 grid, the goal is to slide numbered tiles and combine matching numbers to eventually create a tile with the value <strong>2048</strong>. It became one of the most popular <strong>free browser games</strong> among students worldwide due to its simple rules but deep strategy.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">How to Play 2048</h2>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Use <strong>arrow keys</strong> (desktop) or <strong>swipe</strong> (mobile) to move all tiles</li>
                <li>When two tiles with the same number touch, they <strong>merge into one</strong></li>
                <li>A new tile (2 or 4) appears after every move</li>
                <li>Reach the <strong>2048 tile</strong> to win — or keep going for a higher score!</li>
                <li>Game ends when no more moves are possible</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Benefits of 2048 for Brain Training</h2>
              <p>Playing 2048 regularly sharpens <strong>strategic planning</strong>, <strong>spatial reasoning</strong>, and <strong>decision-making</strong>. Students find it especially useful as a <strong>study break game</strong> that re-engages the mind without requiring heavy cognitive load. The game rewards forward-thinking — a skill directly applicable to exams and problem-solving.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Why Students Love 2048</h2>
              <p>2048 strikes the perfect balance between accessible and challenging. It takes seconds to learn but months to master. Students love it because it's a <strong>free online game for students</strong> that feels rewarding — every merge brings satisfaction, and beating your best score keeps you coming back. It's also great on mobile, making it ideal for quick breaks between classes.</p>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqSchema.mainEntity.map((faq, i) => (
                  <details key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <summary className="text-white font-semibold cursor-pointer">{faq.name}</summary>
                    <p className="text-slate-400 mt-2 text-sm">{faq.acceptedAnswer.text}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* Internal Links */}
            <section className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h2 className="text-white font-bold mb-3">🎮 More Free Games</h2>
              <div className="flex flex-wrap gap-2">
                {[['🐍 Snake Game', '/snake-game'], ['🔍 Sudoku', '/sudoku-game'], ['⭕ Tic Tac Toe', '/tic-tac-toe'], ['🃏 Memory Cards', '/memory-card-game'], ['➕ Math Quiz', '/math-quiz-game'], ['🎮 All Games', '/free-games']].map(([l, p]) => (
                  <Link key={p} to={p} className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 rounded-lg px-3 py-1.5 text-amber-300 text-sm transition-colors">{l}</Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
