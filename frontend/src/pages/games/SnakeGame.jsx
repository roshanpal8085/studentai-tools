import { useEffect, useRef, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const W = 20, H = 20, SIZE = 20;
const DIRS = { ArrowUp: [0,-1], ArrowDown: [0,1], ArrowLeft: [-1,0], ArrowRight: [1,0] };

function rand(max) { return Math.floor(Math.random() * max); }

const videoGameSchema = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  'name': 'Snake Retro',
  'description': 'Classic focus & reflex game for students. Eat food, grow longer, and avoid walls.',
  'operatingSystem': 'Web',
  'applicationCategory': 'Game',
  'genre': 'Arcade',
  'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'INR' }
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How do you play Snake game?', acceptedAnswer: { '@type': 'Answer', text: 'Use arrow keys or WASD to control the snake. Eat the red food to grow longer. Avoid hitting the walls or your own tail.' } },
    { '@type': 'Question', name: 'What skills does Snake game improve?', acceptedAnswer: { '@type': 'Answer', text: 'Snake improves hand-eye coordination, reaction time, spatial awareness, and planning — all great skills for students.' } },
    { '@type': 'Question', name: 'Is Snake game free to play?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! This Snake game is 100% free to play in your browser with no download required.' } },
    { '@type': 'Question', name: 'Can I play Snake on mobile?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, Snake supports swipe controls on mobile and tablet devices.' } },
  ],
};

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: rand(W), y: rand(H) },
    score: 0,
    running: false,
    over: false,
  });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('snakebest') || '0'));
  const [status, setStatus] = useState('idle'); // idle | running | over
  const [difficulty, setDifficulty] = useState('Medium');
  const animRef = useRef(null);
  const lastTime = useRef(0);
  
  const getSpeed = () => {
    switch(difficulty) {
      case 'Easy': return 160;
      case 'Hard': return 80;
      default: return 120;
    }
  };

  const touchStart = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W * SIZE, H * SIZE);
    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= W; x++) { ctx.beginPath(); ctx.moveTo(x * SIZE, 0); ctx.lineTo(x * SIZE, H * SIZE); ctx.stroke(); }
    for (let y = 0; y <= H; y++) { ctx.beginPath(); ctx.moveTo(0, y * SIZE); ctx.lineTo(W * SIZE, y * SIZE); ctx.stroke(); }
    // Glow Setup
    ctx.shadowBlur = 10;
    // Food
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.beginPath();
    ctx.arc(s.food.x * SIZE + SIZE / 2, s.food.y * SIZE + SIZE / 2, SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    // Snake
    s.snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#4ade80' : '#22c55e';
      ctx.shadowColor = i === 0 ? '#4ade80' : 'transparent';
      ctx.beginPath();
      ctx.roundRect(seg.x * SIZE + 1, seg.y * SIZE + 1, SIZE - 2, SIZE - 2, i === 0 ? 6 : 4);
      ctx.fill();
    });
    // Reset shadow
    ctx.shadowBlur = 0;
  }, []);

  const tick = useCallback((ts) => {
    if (ts - lastTime.current < getSpeed()) { animRef.current = requestAnimationFrame(tick); return; }
    lastTime.current = ts;
    const s = stateRef.current;
    if (!s.running) return;
    s.dir = s.nextDir;
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
    if (head.x < 0 || head.x >= W || head.y < 0 || head.y >= H || s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      s.running = false; s.over = true;
      setStatus('over');
      return;
    }
    s.snake.unshift(head);
    if (head.x === s.food.x && head.y === s.food.y) {
      s.score++;
      setScore(s.score);
      setBest(prev => { const nb = Math.max(prev, s.score); localStorage.setItem('snakebest', nb); return nb; });
      let fx, fy;
      do { fx = rand(W); fy = rand(H); } while (s.snake.some(seg => seg.x === fx && seg.y === fy));
      s.food = { x: fx, y: fy };
    } else { s.snake.pop(); }
    draw();
    animRef.current = requestAnimationFrame(tick);
  }, [draw]);

  const startGame = () => {
    const s = stateRef.current;
    s.snake = [{ x: 10, y: 10 }]; s.dir = { x: 1, y: 0 }; s.nextDir = { x: 1, y: 0 };
    s.food = { x: rand(W), y: rand(H) }; s.score = 0; s.running = true; s.over = false;
    setScore(0); setStatus('running'); lastTime.current = 0;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    draw();
    const onKey = (e) => {
      const d = DIRS[e.key];
      if (!d) return;
      e.preventDefault();
      const s = stateRef.current;
      if (!s.running && !s.over) { startGame(); return; }
      const [dx, dy] = d;
      if (dx !== -s.dir.x || dy !== -s.dir.y) s.nextDir = { x: dx, y: dy };
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [draw, tick]);

  const onTouchStart = (e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const s = stateRef.current;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20 && s.dir.x !== -1) s.nextDir = { x: 1, y: 0 };
      else if (dx < -20 && s.dir.x !== 1) s.nextDir = { x: -1, y: 0 };
    } else {
      if (dy > 20 && s.dir.y !== -1) s.nextDir = { x: 0, y: 1 };
      else if (dy < -20 && s.dir.y !== 1) s.nextDir = { x: 0, y: -1 };
    }
    if (!s.running && status !== 'over') startGame();
    touchStart.current = null;
  };

  return (
    <>
      <Helmet>
        <title>Snake Game Online — Free Classic Browser Game | StudentAI Tools</title>
        <meta name="description" content="Play the classic Snake game online for free! Control the snake, eat food, and grow longer. No download needed. A perfect study break game for students." />
        <meta name="keywords" content="snake game, snake game online, free classic browser game, study break game, snake for students" />
        <link rel="canonical" href="https://studentaitools.in/snake-game" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(videoGameSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white mb-2">🐍 Snake Game</h1>
            <p className="text-slate-400">Eat food, grow longer, avoid walls! Arrow keys or swipe to play.</p>
          </div>

          <div className={status !== 'idle' ? "fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-4 touch-none overflow-hidden" : ""}>
            <div className={status !== 'idle' ? "w-full max-w-lg" : ""}>
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex justify-between items-center gap-3">
                  <div className="flex gap-3 flex-1">
                    <div className="bg-green-800 rounded-xl p-3 text-center flex-1">
                      <div className="text-green-200 text-xs uppercase">Score</div>
                      <div className="text-white text-xl font-bold">{score}</div>
                    </div>
                    <div className="bg-slate-700 rounded-xl p-3 text-center flex-1">
                      <div className="text-slate-400 text-xs uppercase">Best</div>
                      <div className="text-white text-xl font-bold">{best}</div>
                    </div>
                  </div>
                  <button onClick={startGame} className="bg-green-500 hover:bg-green-400 text-white font-bold px-5 py-3 rounded-xl transition-colors h-full">
                    {status === 'idle' ? 'Start' : 'Restart'}
                  </button>
                </div>
                
                {status === 'idle' && (
                  <div className="flex gap-2 justify-center">
                    {['Easy', 'Medium', 'Hard'].map(d => (
                      <button 
                        key={d} 
                        onClick={() => setDifficulty(d)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                          difficulty === d 
                            ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-700">
                <canvas
                  ref={canvasRef}
                  width={W * SIZE}
                  height={H * SIZE}
                  className="w-full block touch-none"
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                />
                {status === 'idle' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center">
                      <div className="text-6xl mb-3">🐍</div>
                      <p className="text-white text-lg font-bold mb-2">Press Start or Arrow Key</p>
                      <p className="text-slate-400 text-sm">Swipe on mobile</p>
                    </div>
                  </div>
                )}
                {status === 'over' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60" onClick={startGame}>
                    <div className="text-center">
                      <div className="text-5xl mb-3">💀</div>
                      <h2 className="text-2xl font-bold text-white mb-1">Game Over!</h2>
                      <p className="text-slate-400 mb-3">Score: <span className="text-green-400 font-bold">{score}</span></p>
                      <button className="bg-green-500 text-white font-bold px-5 py-2.5 rounded-xl">Play Again</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 max-w-36 mx-auto">
                <div />
                <button onClick={() => { if (!stateRef.current.running) startGame(); else if (stateRef.current.dir.y !== 1) stateRef.current.nextDir = {x:0,y:-1}; }} className="bg-slate-700 hover:bg-slate-600 text-white rounded-xl p-3 text-lg font-bold transition-colors">↑</button>
                <div />
                <button onClick={() => { if (!stateRef.current.running) startGame(); else if (stateRef.current.dir.x !== 1) stateRef.current.nextDir = {x:-1,y:0}; }} className="bg-slate-700 hover:bg-slate-600 text-white rounded-xl p-3 text-lg font-bold transition-colors">←</button>
                <button onClick={() => { if (!stateRef.current.running) startGame(); else if (stateRef.current.dir.y !== -1) stateRef.current.nextDir = {x:0,y:1}; }} className="bg-slate-700 hover:bg-slate-600 text-white rounded-xl p-3 text-lg font-bold transition-colors">↓</button>
                <button onClick={() => { if (!stateRef.current.running) startGame(); else if (stateRef.current.dir.x !== -1) stateRef.current.nextDir = {x:1,y:0}; }} className="bg-slate-700 hover:bg-slate-600 text-white rounded-xl p-3 text-lg font-bold transition-colors">→</button>
              </div>

              {status !== 'idle' && (
                <button onClick={() => setStatus('idle')} className="mt-6 mx-auto block text-slate-400 hover:text-white font-semibold underline">
                  Exit Fullscreen
                </button>
              )}
            </div>
          </div>

          <div className="mt-10 space-y-6 text-slate-300">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">What is the Snake Game?</h2>
              <p>The <strong>Snake game</strong> is one of the most iconic <strong>free browser games</strong> in history. Originally popularized on Nokia phones in 1998, this classic arcade game challenges you to navigate a growing snake around the screen, eating food while avoiding collisions. It remains a beloved <strong>study break game for students</strong> worldwide.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">How to Play Snake</h2>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Press <strong>arrow keys</strong> or <strong>WASD</strong> to move the snake</li>
                <li>On mobile, <strong>swipe</strong> in the direction you want to go</li>
                <li>Eat the <strong>red food</strong> to score points and grow longer</li>
                <li>Avoid hitting the <strong>walls</strong> or your own <strong>tail</strong></li>
                <li>How long can you make your snake?</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Benefits for Students</h2>
              <p>Snake is an excellent <strong>brain training game</strong> that improves reaction time, spatial awareness, and planning. Students benefit from the focussed attention required, which translates into better concentration during study sessions. A quick 5-minute game makes a refreshing and productive study break.</p>
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
                {[['🔍 Sudoku', '/sudoku-game'], ['⭕ Tic Tac Toe', '/tic-tac-toe'], ['🃏 Memory Cards', '/memory-card-game'], ['⌨️ Typing Speed', '/typing-speed-test'], ['🎮 All Games', '/free-games']].map(([l, p]) => (
                  <Link key={p} to={p} className="bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg px-3 py-1.5 text-green-300 text-sm transition-colors">{l}</Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
