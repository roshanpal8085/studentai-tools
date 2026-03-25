import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

// --- Sudoku Generator ---
function generateSudoku() {
  const base = 3, side = 9;
  const range = (start, stop, step = 1) => Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const pattern = (r, c) => (base * (r % base) + Math.floor(r / base) + c) % side;
  const rBase = range(0, base), rows = [], cols = [];
  for (const g of shuffle(rBase)) for (const r of shuffle(rBase)) rows.push(g * base + r);
  for (const g of shuffle(rBase)) for (const c of shuffle(rBase)) cols.push(g * base + c);
  const nums = shuffle(range(1, side + 1));
  const board = rows.map(r => cols.map(c => nums[pattern(r, c)]));
  // Remove cells
  const puzzle = board.map(r => [...r]);
  const cells = shuffle(range(0, 81));
  let removed = 0;
  for (const cell of cells) {
    if (removed >= 45) break;
    const r = Math.floor(cell / 9), c = cell % 9;
    puzzle[r][c] = 0;
    removed++;
  }
  return { solution: board, puzzle };
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is Sudoku?', acceptedAnswer: { '@type': 'Answer', text: 'Sudoku is a number-placement puzzle where you fill a 9×9 grid so every row, column, and 3×3 box contains the digits 1 to 9 exactly once.' } },
    { '@type': 'Question', name: 'Is Sudoku good for the brain?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Sudoku improves logical thinking, concentration, memory, and problem-solving skills — all critical for academic success.' } },
    { '@type': 'Question', name: 'How do I play Sudoku online?', acceptedAnswer: { '@type': 'Answer', text: 'Click an empty cell, then click a number below the board to fill it in. Use auto-check to instantly see errors, or solve at your own pace.' } },
    { '@type': 'Question', name: 'Is this Sudoku game free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! This Sudoku game is completely free to play in your browser. No download, no sign-up, no ads.' } },
  ],
};

export default function SudokuGame() {
  const [{ puzzle, solution }, setGame] = useState(() => generateSudoku());
  const [board, setBoard] = useState(() => puzzle.map(r => [...r]));
  const [selected, setSelected] = useState(null);
  const [errors, setErrors] = useState(new Set());
  const [status, setStatus] = useState('idle'); // idle, playing, solved
  const [moves, setMoves] = useState(0);

  const start = () => setStatus('playing');
  const exit = () => setStatus('idle');

  const newGame = () => {
    const g = generateSudoku();
    setGame(g);
    setBoard(g.puzzle.map(r => [...r]));
    setSelected(null); setErrors(new Set()); setSolved(false); setMoves(0);
  };

  const isFixed = useCallback((r, c) => puzzle[r][c] !== 0, [puzzle]);

  const fill = (num) => {
    if (!selected || isFixed(selected[0], selected[1]) || solved) return;
    const [r, c] = selected;
    const nb = board.map(row => [...row]);
    nb[r][c] = num;
    setBoard(nb);
    setMoves(m => m + 1);
    if (autoCheck) {
      const errs = new Set();
      for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) {
        if (nb[i][j] !== 0 && nb[i][j] !== solution[i][j]) errs.add(`${i},${j}`);
      }
      setErrors(errs);
    }
    if (nb.flat().every((v, i) => v === solution[Math.floor(i / 9)][i % 9])) {
      setSolved(true);
      setStatus('solved');
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!selected || solved) return;
      const [r, c] = selected;
      if (e.key >= '1' && e.key <= '9') {
        fill(parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        fill(0);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault(); setSelected([Math.max(0, r - 1), c]);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault(); setSelected([Math.min(8, r + 1), c]);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault(); setSelected([r, Math.max(0, c - 1)]);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault(); setSelected([r, Math.min(8, c + 1)]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selected, solved, fill]);

  const cellColor = (r, c) => {
    if (selected && selected[0] === r && selected[1] === c) return 'bg-indigo-500 text-white';
    if (errors.has(`${r},${c}`)) return 'bg-red-500/30 text-red-300';
    if (isFixed(r, c)) return 'bg-slate-700 text-slate-100 font-bold';
    if (board[r][c] && board[r][c] === solution[r][c]) return 'bg-slate-800 text-green-400';
    return 'bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer';
  };

  const borderClass = (r, c) => {
    const t = r % 3 === 0 ? 'border-t-2 border-t-slate-400' : '';
    const l = c % 3 === 0 ? 'border-l-2 border-l-slate-400' : '';
    return `${t} ${l}`;
  };

  return (
    <>
      <Helmet>
        <title>Sudoku Game Online — Free Brain Puzzle | StudentAI Tools</title>
        <meta name="description" content="Play free Sudoku online! Fill the 9×9 grid with logic. A classic brain training puzzle game for students. No download needed — instant browser play." />
        <meta name="keywords" content="sudoku game online, free sudoku, brain puzzle game, logic game for students, sudoku no download" />
        <link rel="canonical" href="https://studentaitools.in/sudoku-game" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white mb-2">🔍 Sudoku</h1>
            <p className="text-slate-400">Fill every row, column, and 3×3 box with digits 1–9.</p>
          </div>

          <div className={status !== 'idle' ? "fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-4 touch-none overflow-hidden" : ""}>
            <div className={status !== 'idle' ? "w-full max-w-lg" : ""}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-slate-400 text-sm">Auto-Check</label>
                  <button onClick={() => setAutoCheck(a => !a)} className={`w-10 h-5 rounded-full transition-colors ${autoCheck ? 'bg-indigo-500' : 'bg-slate-600'} relative`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${autoCheck ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>
                <div className="text-slate-400 text-sm">Moves: <span className="text-white font-bold">{moves}</span></div>
                <button onClick={newGame} className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">New Game</button>
              </div>

              <div className="bg-slate-700 rounded-2xl p-2 border-2 border-slate-500 mb-4 relative overflow-hidden">
                <div className="grid grid-cols-9 border-2 border-slate-400">
                  {board.map((row, r) => row.map((val, c) => (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => { if (!isFixed(r, c) && status !== 'solved') { setSelected([r, c]); if (status === 'idle') setStatus('playing'); } }}
                      className={`aspect-square flex items-center justify-center text-sm md:text-base font-semibold border border-slate-600 transition-colors select-none ${cellColor(r, c)} ${borderClass(r, c)}`}
                    >
                      {val || ''}
                    </div>
                  )))}
                </div>
                {status === 'idle' && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                    <button onClick={start} className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-3 rounded-2xl shadow-xl transform active:scale-95 transition-all">Play Sudoku</button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-9 gap-1 mb-4">
                {[1,2,3,4,5,6,7,8,9].map(n => (
                  <button key={n} onClick={() => fill(n)} className="aspect-square bg-slate-700 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors text-sm md:text-base">{n}</button>
                ))}
              </div>
              <div className="flex gap-2 justify-center mb-6">
                <button onClick={() => fill(0)} className="bg-red-700/50 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">✕ Erase</button>
                <button onClick={() => { const nb = solution.map(r=>[...r]); setBoard(nb); setSolved(true); setStatus('solved'); }} className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-bold px-4 py-2 rounded-xl transition-colors">Solve</button>
              </div>

              {status === 'solved' && (
                <div className="bg-green-900/50 border border-green-500/30 rounded-2xl p-6 text-center mb-6">
                  <div className="text-5xl mb-2">🎉</div>
                  <h2 className="text-2xl font-bold text-white mb-1">Puzzle Solved!</h2>
                  <p className="text-slate-400 mb-3">Completed in <span className="text-green-400 font-bold">{moves} moves</span></p>
                  <button onClick={newGame} className="bg-green-500 text-white font-bold px-5 py-2.5 rounded-xl">New Puzzle</button>
                </div>
              )}

              {status !== 'idle' && (
                <button onClick={exit} className="mx-auto block text-slate-400 hover:text-white font-semibold underline">Exit Fullscreen</button>
              )}
            </div>
          </div>

          <div className="space-y-6 text-slate-300 mt-8">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">What is Sudoku?</h2>
              <p><strong>Sudoku</strong> is the world's most popular number-placement puzzle. Played on a 9×9 grid divided into nine 3×3 boxes, the goal is to fill every row, column, and box with the numbers 1 to 9 — each appearing exactly once. It is considered one of the best <strong>brain training games for students</strong> due to its pure reliance on logic.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">How to Play Sudoku</h2>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Click an <strong>empty cell</strong> to select it</li>
                <li>Click a <strong>number</strong> from the number pad to fill it</li>
                <li>Enable <strong>Auto-Check</strong> to highlight errors in real time</li>
                <li>Use <strong>Erase</strong> to clear a wrong entry</li>
                <li>Complete the puzzle without errors to win!</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Why Sudoku is Great for Students</h2>
              <p>Studies show Sudoku significantly improves <strong>logical reasoning, concentration, and working memory</strong>. Unlike many games, Sudoku engages the prefrontal cortex — the brain's center for planning and problem-solving. Regular play helps students develop the methodical thinking needed for exams and STEM subjects.</p>
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
                {[['🐍 Snake', '/snake-game'], ['⭕ Tic Tac Toe', '/tic-tac-toe'], ['➕ Math Quiz', '/math-quiz-game'], ['🧩 Logic Puzzle', '/logic-puzzle-game'], ['🎮 All Games', '/free-games']].map(([l, p]) => (
                  <Link key={p} to={p} className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 rounded-lg px-3 py-1.5 text-indigo-300 text-sm transition-colors">{l}</Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
