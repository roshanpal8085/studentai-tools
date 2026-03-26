import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { initAudio, playSound } from '../../utils/gameAudio';

const CANVAS_W = 360, CANVAS_H = 500;
const BLOCK_H = 20, BLOCK_START_W = 160;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is the Stack Game?', acceptedAnswer: { '@type': 'Answer', text: 'Stack Game is a skill-based arcade game where you drop falling blocks to stack them perfectly. The more precise your stack, the taller your tower grows.' } },
    { '@type': 'Question', name: 'How do you play Stack Game?', acceptedAnswer: { '@type': 'Answer', text: 'Press Space, tap, or click when the moving block is aligned with the one below to drop it. The overhanging part is cut off. Stack perfectly to keep the full width.' } },
    { '@type': 'Question', name: 'Does Stack Game improve concentration?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Stack Game trains timing precision, concentration, and patience — great skills for focused study sessions.' } },
    { '@type': 'Question', name: 'Is Stack Game free to play?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Play instantly in your browser for free. No download, no sign-up.' } },
  ],
};

const gameSchema = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "Tower Stack Arcade Online",
  "description": "Test your timing with our free tower stacking game. Build the highest tower possible by dropping blocks with precision.",
  "genre": "Arcade Game",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
};

export default function StackGame() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const animRef = useRef(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('stackbest') || '0'));
  const [status, setStatus] = useState('idle');
  const [difficulty, setDifficulty] = useState('Medium');

  const getSettings = (diff) => {
    switch (diff) {
      case 'Easy': return { initSpeed: 1.5, inc: 0.3 };
      case 'Hard': return { initSpeed: 3.0, inc: 0.8 };
      default: return { initSpeed: 2.0, inc: 0.5 }; // Medium
    }
  };

  const initState = () => {
    const s = getSettings(difficulty);
    return {
      blocks: [{ x: (CANVAS_W - BLOCK_START_W) / 2, width: BLOCK_START_W, y: CANVAS_H - BLOCK_H }],
      current: { x: 0, width: BLOCK_START_W, dir: 1 },
      speed: s.initSpeed,
      score: 0,
      over: false,
    };
  };

  const drawGame = (ctx, s) => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    const colors = ['#6366f1','#8b5cf6','#a855f7','#c084fc','#e879f9','#f0abfc'];
    s.blocks.forEach((b, i) => {
      const idx = i % colors.length;
      ctx.fillStyle = colors[idx];
      const y = CANVAS_H - BLOCK_H - (i * BLOCK_H);
      if (y < -BLOCK_H) return;
      ctx.fillRect(b.x, y, b.width, BLOCK_H - 1);
    });
    if (!s.over) {
      const top = s.blocks[s.blocks.length - 1];
      const cy = CANVAS_H - BLOCK_H - (s.blocks.length * BLOCK_H);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(s.current.x, cy, s.current.width, BLOCK_H - 1);
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.score, CANVAS_W / 2, 40);
  };

  const drop = () => {
    const s = stateRef.current;
    if (!s || s.over) return;
    const top = s.blocks[s.blocks.length - 1];
    const cur = s.current;
    const overlapStart = Math.max(cur.x, top.x);
    const overlapEnd = Math.min(cur.x + cur.width, top.x + top.width);
    const overlapW = overlapEnd - overlapStart;
    if (overlapW <= 0) { 
      playSound('crash');
      s.over = true; setStatus('over'); const nb = s.score; if (nb > best) { setBest(nb); localStorage.setItem('stackbest', nb); } return; 
    }
    
    // Check if it's a perfect stack (or very close)
    if (Math.abs(overlapW - cur.width) < 2) {
      playSound('perfect');
    } else {
      playSound('drop');
    }

    s.blocks.push({ x: overlapStart, width: overlapW, y: CANVAS_H - BLOCK_H });
    s.score++;
    setScore(s.score);
    const setts = getSettings(difficulty);
    s.speed = setts.initSpeed + Math.floor(s.score / 5) * setts.inc;
    s.current = { x: -overlapW, width: overlapW, dir: 1 };
  };

  const loop = () => {
    const s = stateRef.current;
    if (!s || s.over) return;
    s.current.x += s.current.dir * s.speed;
    if (s.current.x + s.current.width > CANVAS_W) s.current.dir = -1;
    if (s.current.x < 0) s.current.dir = 1;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) drawGame(ctx, s);
    animRef.current = requestAnimationFrame(loop);
  };

  const start = () => {
    initAudio();
    if (animRef.current) cancelAnimationFrame(animRef.current);
    stateRef.current = initState();
    setScore(0); setStatus('running');
    animRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) { ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H); }
    const onKey = (e) => { if (e.code === 'Space') { e.preventDefault(); if (status !== 'running') start(); else drop(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [status]);

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current); }, []);

  const handleTap = () => { if (status !== 'running') start(); else drop(); };

  return (
    <>
      <Helmet>
        <title>Stack Game Online — Free Skill Arcade Game | StudentAI Tools</title>
        <meta name="description" content="Play Stack Game online for free! Drop falling blocks and build the tallest tower. A fun precision and concentration game for students. No download needed." />
        <meta name="keywords" content="stack game online, block stacking game, free arcade game for students, tower stacking game, study break game" />
        <link rel="canonical" href="https://studentaitools.in/stack-game" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(gameSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900/20 to-slate-900 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white mb-2">🏗️ Stack Game</h1>
            <p className="text-slate-400">Tap / Space / Click to drop the block. Stack perfectly to go higher!</p>
          </div>

          <div className={status !== 'idle' ? "fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center py-10 px-4 touch-none overflow-y-auto min-h-[100dvh]" : ""}>
            <div className={status !== 'idle' ? "w-full max-w-lg mb-10" : ""}>
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex justify-between items-center gap-3">
                  <div className="flex gap-3 flex-1">
                    <div className="bg-violet-800 rounded-xl px-4 py-2 text-center flex-1">
                      <div className="text-violet-200 text-xs">Score</div>
                      <div className="text-white text-xl font-bold">{score}</div>
                    </div>
                    <div className="bg-slate-700 rounded-xl px-4 py-2 text-center flex-1">
                      <div className="text-slate-400 text-xs">Best</div>
                      <div className="text-white text-xl font-bold">{best}</div>
                    </div>
                  </div>
                  <button onClick={start} className="bg-violet-500 hover:bg-violet-400 text-white font-bold px-5 py-2.5 rounded-xl transition-colors h-full">↺ Restart</button>
                </div>
                
                {status === 'idle' && (
                  <div className="flex gap-2 justify-center">
                    {['Easy', 'Medium', 'Hard'].map(d => (
                      <button 
                        key={d} 
                        onClick={() => setDifficulty(d)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                          difficulty === d 
                            ? 'bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]' 
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-700 cursor-pointer touch-none" onClick={handleTap}>
                <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="w-full block touch-none" />
                {status === 'idle' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <div className="text-center">
                      <div className="text-6xl mb-3">🏗️</div>
                      <p className="text-white text-xl font-bold mb-2">Tap to Start</p>
                      <p className="text-slate-400 text-sm">Or press Space</p>
                    </div>
                  </div>
                )}
                {status === 'over' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10" onClick={e => { e.stopPropagation(); start(); }}>
                    <div className="text-center">
                      <div className="text-5xl mb-3">💥</div>
                      <h2 className="text-2xl font-bold text-white mb-1">Game Over</h2>
                      <p className="text-slate-400 mb-3">Score: <span className="text-violet-400 font-bold">{score}</span></p>
                      <button className="bg-violet-500 text-white font-bold px-5 py-2.5 rounded-xl">Play Again</button>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-slate-500 text-sm text-center mt-3">Press <kbd className="bg-slate-700 px-2 py-0.5 rounded text-slate-300">Space</kbd> or tap the board to drop</p>

              {status !== 'idle' && (
                <button 
                  onClick={() => setStatus('idle')} 
                  className="mt-8 mx-auto flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-6 py-2.5 rounded-2xl text-red-400 font-bold transition-all hover:scale-105 active:scale-95"
                >
                  <span>✕</span> Exit Game
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6 text-slate-300 mt-8">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">What is the Stack Game?</h2>
              <p>The <strong>Stack Game</strong> is a minimalist precision arcade game where blocks slide back and forth. You must tap or click at exactly the right moment to drop the block squarely on top of the previous one. The overhanging part is cut off, making each block potentially narrower. It is a perfect <strong>study break game for students</strong> — quick, satisfying, and endlessly replayable.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Why Students Love Stack Game</h2>
              <p>Stack Game is deceptively simple but deeply engaging. Its clean aesthetic, increasing difficulty, and "just one more try" nature make it one of the most popular <strong>free browser games</strong> for quick breaks. The game also builds <strong>timing precision and focused attention</strong>, skills that directly transfer to exam performance and detail-oriented academic work.</p>
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
                {[['🐦 Flappy Bird', '/flappy-bird-game'], ['🎨 Color Switch', '/color-switch-game'], ['🐍 Snake', '/snake-game'], ['⭕ Tic Tac Toe', '/tic-tac-toe'], ['🎮 All Games', '/free-games']].map(([l, p]) => (
                  <Link key={p} to={p} className="bg-violet-500/20 hover:bg-violet-500/30 border border-violet-400/30 rounded-lg px-3 py-1.5 text-violet-300 text-sm transition-colors">{l}</Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
