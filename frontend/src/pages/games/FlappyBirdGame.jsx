import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const W = 360, H = 550;
const GRAVITY = 0.35, JUMP = -7.5;
const PIPE_W = 65, PIPE_GAP = 155, PIPE_SPEED = 2.8;
const BIRD_X = 80, BIRD_R = 15;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is Flappy Bird?', acceptedAnswer: { '@type': 'Answer', text: 'Flappy Bird is a tap-to-fly arcade game where you guide a bird through gaps between green pipes without hitting them.' } },
    { '@type': 'Question', name: 'How do you play Flappy Bird?', acceptedAnswer: { '@type': 'Answer', text: 'Tap the screen, click, or press Space to make the bird flap upward. Release to let gravity pull it down. Navigate through pipe gaps to score.' } },
    { '@type': 'Question', name: 'Why is Flappy Bird so popular with students?', acceptedAnswer: { '@type': 'Answer', text: 'Flappy Bird is simple to learn, challenging to master, and gives intense satisfaction when you beat your high score. It trains focus and timing.' } },
    { '@type': 'Question', name: 'Is this Flappy Bird Game free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Completely free to play in your browser. No download, no sign-up, no in-app purchases.' } },
  ],
};

export default function FlappyBirdGame() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const animRef = useRef(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('flappybest') || '0'));
  const [status, setStatus] = useState('idle');

  const initState = () => ({
    bird: { y: H / 2, vy: 0 },
    pipes: [{ x: W + 100, gapY: 150 + Math.random() * 200 }],
    score: 0, over: false, frame: 0,
  });

  const drawBird = (ctx, y, frame) => {
    const bob = Math.sin(frame * 0.05) * 2;
    // Body
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(BIRD_X, y + bob, BIRD_R, 0, Math.PI * 2);
    ctx.fill();
    // Eye
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(BIRD_X + 6, y + bob - 4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(BIRD_X + 7, y + bob - 5, 1.5, 0, Math.PI * 2);
    ctx.fill();
    // Beak
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(BIRD_X + BIRD_R, y + bob);
    ctx.lineTo(BIRD_X + BIRD_R + 10, y + bob + 3);
    ctx.lineTo(BIRD_X + BIRD_R, y + bob + 6);
    ctx.fill();
    // Wing
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(BIRD_X - 3, y + bob + 5, 9, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();
  };

  const draw = (ctx, s) => {
    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#0ea5e9');
    sky.addColorStop(1, '#7dd3fc');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);
    // Ground
    ctx.fillStyle = '#86efac';
    ctx.fillRect(0, H - 30, W, 30);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(0, H - 45, W, 15);
    // Pipes
    s.pipes.forEach(p => {
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(p.x, 0, PIPE_W, p.gapY);
      ctx.fillRect(p.x, p.gapY + PIPE_GAP, PIPE_W, H);
      ctx.fillStyle = '#15803d';
      ctx.fillRect(p.x - 5, p.gapY - 25, PIPE_W + 10, 25);
      ctx.fillRect(p.x - 5, p.gapY + PIPE_GAP, PIPE_W + 10, 25);
    });
    drawBird(ctx, s.bird.y, s.frame);
    // Score
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeText(s.score, W / 2, 55);
    ctx.fillText(s.score, W / 2, 55);
  };

  const loop = () => {
    const s = stateRef.current;
    if (!s || s.over) return;
    s.frame++;
    s.bird.vy += GRAVITY;
    s.bird.y += s.bird.vy;
    // Move pipes
    s.pipes.forEach(p => { p.x -= PIPE_SPEED; });
    if (s.pipes[0].x + PIPE_W < 0) {
      s.pipes.shift();
      s.pipes.push({ x: W + 50, gapY: 100 + Math.random() * 250 });
    }
    // Spawn more pipes
    if (s.pipes.length < 2 && s.pipes[0].x < W * 0.4) {
      s.pipes.push({ x: s.pipes[s.pipes.length - 1].x + W * 0.6, gapY: 100 + Math.random() * 250 });
    }
    // Score
    s.pipes.forEach(p => {
      if (!p.scored && p.x + PIPE_W < BIRD_X) {
        p.scored = true; s.score++;
        setScore(s.score);
      }
    });
    // Collision
    const bird = s.bird;
    if (bird.y + BIRD_R > H - 45 || bird.y - BIRD_R < 0) {
      s.over = true; setStatus('over');
      if (s.score > best) { setBest(s.score); localStorage.setItem('flappybest', s.score); }
    }
    for (const p of s.pipes) {
      if (BIRD_X + BIRD_R > p.x && BIRD_X - BIRD_R < p.x + PIPE_W) {
        if (bird.y - BIRD_R < p.gapY || bird.y + BIRD_R > p.gapY + PIPE_GAP) {
          s.over = true; setStatus('over');
          if (s.score > best) { setBest(s.score); localStorage.setItem('flappybest', s.score); }
        }
      }
    }
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) draw(ctx, s);
    if (!s.over) animRef.current = requestAnimationFrame(loop);
  };

  const flap = () => {
    if (status !== 'running') { start(); return; }
    if (stateRef.current?.over) { start(); return; }
    if (stateRef.current) stateRef.current.bird.vy = JUMP;
  };

  const start = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    stateRef.current = initState();
    setScore(0); setStatus('running');
    animRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) { const sky = ctx.createLinearGradient(0,0,0,H); sky.addColorStop(0,'#0ea5e9'); sky.addColorStop(1,'#7dd3fc'); ctx.fillStyle = sky; ctx.fillRect(0,0,W,H); }
    const onKey = (e) => { if (e.code === 'Space') { e.preventDefault(); flap(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [status]);

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current); }, []);

  return (
    <>
      <Helmet>
        <title>Flappy Bird Game Online — Free Classic Arcade | StudentAI Tools</title>
        <meta name="description" content="Play Flappy Bird online for free! Tap to fly through pipes in this classic arcade game. A perfect study break game for students. No download required." />
        <meta name="keywords" content="flappy bird game, flappy bird online free, classic arcade game, study break game for students, free browser game" />
        <link rel="canonical" href="https://studentaitools.in/flappy-bird-game" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900/20 to-slate-900 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white mb-2">🐦 Flappy Bird</h1>
            <p className="text-slate-400">Tap to flap through the pipes. How far can you go?</p>
          </div>

          <div className={status !== 'idle' ? "fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-4 touch-none overflow-hidden" : ""}>
            <div className={status !== 'idle' ? "w-full max-w-lg" : ""}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-3">
                  <div className="bg-sky-900/60 rounded-xl px-4 py-2 text-center"><div className="text-sky-300 text-xs">Score</div><div className="text-white text-xl font-bold">{score}</div></div>
                  <div className="bg-slate-700 rounded-xl px-4 py-2 text-center"><div className="text-slate-400 text-xs">Best</div><div className="text-white text-xl font-bold">{best}</div></div>
                </div>
                <button onClick={start} className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-5 py-2.5 rounded-xl transition-colors">↺ Restart</button>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-700 cursor-pointer touch-none" onClick={flap} onTouchStart={e => { e.preventDefault(); flap(); }}>
                <canvas ref={canvasRef} width={W} height={H} className="w-full block" />
                {status === 'idle' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="text-center">
                      <div className="text-6xl mb-3">🐦</div>
                      <p className="text-white text-xl font-bold mb-2">Tap to Start</p>
                      <p className="text-slate-200 text-sm">Or press Space</p>
                    </div>
                  </div>
                )}
                {status === 'over' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center bg-slate-900/90 rounded-2xl p-6 mx-4">
                      <div className="text-5xl mb-3">💀</div>
                      <h2 className="text-2xl font-bold text-white mb-1">Game Over!</h2>
                      <p className="text-slate-400 mb-1">Score: <span className="text-sky-400 font-bold text-xl">{score}</span></p>
                      <p className="text-slate-400 mb-3 text-sm">Best: <span className="text-yellow-400 font-bold">{best}</span></p>
                      <button onClick={start} className="bg-sky-500 text-white font-bold px-5 py-2.5 rounded-xl">Play Again</button>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-slate-500 text-sm text-center mt-3">Tap / <kbd className="bg-slate-700 px-2 py-0.5 rounded text-slate-300">Space</kbd> to flap</p>

              {status !== 'idle' && (
                <button onClick={() => setStatus('idle')} className="mt-6 mx-auto block text-slate-400 hover:text-white font-semibold underline">
                  Exit Fullscreen
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6 text-slate-300 mt-8">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">What is Flappy Bird?</h2>
              <p><strong>Flappy Bird</strong> was a wildly popular mobile game created by Dong Nguyen in 2013. Players tap to keep a small bird airborne while navigating through gaps between green pipes. Despite its simple concept, it became one of the most downloaded <strong>free browser games</strong> ever, beloved by students and casual gamers worldwide for its addictive, one-more-try gameplay loop.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Why Students Love Flappy Bird</h2>
              <p>Flappy Bird offers the perfect <strong>study break gaming</strong> experience: it takes 10 seconds to learn, lasts 30 seconds average, and consistently makes you want to try again. This creates a natural micro-break cycle. The game also builds <strong>focus, timing, and persistence</strong> — all traits that help students push through difficult academic challenges.</p>
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
                {[['🎨 Color Switch', '/color-switch-game'], ['🏗️ Stack Game', '/stack-game'], ['🐍 Snake', '/snake-game'], ['⭕ Tic Tac Toe', '/tic-tac-toe'], ['🎮 All Games', '/free-games']].map(([l, p]) => (
                  <Link key={p} to={p} className="bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 rounded-lg px-3 py-1.5 text-sky-300 text-sm transition-colors">{l}</Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
