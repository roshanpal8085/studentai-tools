import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const W = 360, H = 550;
const COLORS = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#a855f7'];
const RING_R = 80, RING_T = 22, BALL_R = 12;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is Color Switch Game?', acceptedAnswer: { '@type': 'Answer', text: 'Color Switch is a reflex game where a ball must pass through rotating color wheels. The ball can only pass through the matching color section.' } },
    { '@type': 'Question', name: 'How do you play Color Switch?', acceptedAnswer: { '@type': 'Answer', text: 'Tap or press Space to make the ball jump upward. Time your taps to pass through the rotating ring only through the section that matches your ball color.' } },
    { '@type': 'Question', name: 'Does Color Switch improve reflexes?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Color Switch trains reaction time, color recognition, and focus — great cognitive exercises for students.' } },
    { '@type': 'Question', name: 'Is Color Switch Game free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Play for free in your browser. No download or account needed.' } },
  ],
};

export default function ColorSwitchGame() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const animRef = useRef(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('colorbest') || '0'));
  const [status, setStatus] = useState('idle');

  const initState = () => ({
    ball: { x: W / 2, y: H - 80, vy: 0, colorIdx: 0 },
    rings: [{ y: H / 2, angle: 0, speed: 0.02 }],
    score: 0, over: false, gravity: 0.25, jump: -7,
  });

  const draw = (ctx, s) => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);
    // Draw rings
    s.rings.forEach(ring => {
      const segs = 4;
      for (let i = 0; i < segs; i++) {
        ctx.beginPath();
        ctx.arc(W / 2, ring.y, RING_R, ring.angle + (i / segs) * Math.PI * 2, ring.angle + ((i + 1) / segs) * Math.PI * 2);
        ctx.lineWidth = RING_T;
        ctx.strokeStyle = COLORS[i % COLORS.length];
        ctx.stroke();
      }
    });
    // Draw ball
    const ball = s.ball;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = COLORS[ball.colorIdx % COLORS.length];
    ctx.fill();
    // Score
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.score, W / 2, 50);
  };

  const loop = () => {
    const s = stateRef.current;
    if (!s || s.over) return;
    // update ball
    s.ball.vy += s.gravity;
    s.ball.y += s.ball.vy;
    // rotate rings
    s.rings.forEach(r => { r.angle += r.speed; });
    // check ring collision
    const ctx = canvasRef.current?.getContext('2d');
    for (const ring of s.rings) {
      const dx = s.ball.x - W / 2, dy = s.ball.y - ring.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const inner = RING_R - RING_T / 2 - BALL_R, outer = RING_R + RING_T / 2 + BALL_R;
      if (dist > inner && dist < outer) {
        const angle = (Math.atan2(dy, dx) - ring.angle + Math.PI * 2) % (Math.PI * 2);
        const seg = Math.floor(angle / (Math.PI * 2 / 4));
        if (seg !== s.ball.colorIdx % 4) {
          s.over = true; setStatus('over');
          const nb = s.score;
          if (nb > best) { setBest(nb); localStorage.setItem('colorbest', nb); }
          if (ctx) draw(ctx, s);
          return;
        }
      }
    }
    // passed a ring → spawn next
    if (s.rings.length > 0 && s.ball.y < s.rings[0].y - RING_R * 2) {
      s.score++;
      setScore(s.score);
      s.ball.colorIdx = Math.floor(Math.random() * 4);
      s.rings.shift();
      s.rings.push({ y: s.ball.y - H / 2, angle: Math.random() * Math.PI * 2, speed: 0.02 + s.score * 0.002 });
    }
    // out of bounds
    if (s.ball.y > H + 20 || s.ball.y < -20) {
      s.over = true; setStatus('over');
      const nb = s.score;
      if (nb > best) { setBest(nb); localStorage.setItem('colorbest', nb); }
    }
    if (ctx) draw(ctx, s);
    animRef.current = requestAnimationFrame(loop);
  };

  const jump = () => {
    if (!stateRef.current) return;
    if (status !== 'running') { start(); return; }
    if (stateRef.current.over) { start(); return; }
    stateRef.current.ball.vy = stateRef.current.jump;
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
    if (ctx) { ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H); }
    const onKey = (e) => { if (e.code === 'Space') { e.preventDefault(); jump(); } };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [status]);

  return (
    <>
      <Helmet>
        <title>Color Switch Game Online — Free Reflex Game | StudentAI Tools</title>
        <meta name="description" content="Play Color Switch Game online for free! Match your ball color to pass through spinning rings. A fun reflex and focus game for students. No download needed." />
        <meta name="keywords" content="color switch game, color match game, free reflex game, study break game for students, reaction game online" />
        <link rel="canonical" href="https://studentaitools.in/color-switch-game" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900/20 to-slate-900 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white mb-2">🎨 Color Switch</h1>
            <p className="text-slate-400">Pass through the ring only where your ball color matches!</p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-3">
              <div className="bg-pink-900/60 rounded-xl px-4 py-2 text-center"><div className="text-pink-300 text-xs">Score</div><div className="text-white text-xl font-bold">{score}</div></div>
              <div className="bg-slate-700 rounded-xl px-4 py-2 text-center"><div className="text-slate-400 text-xs">Best</div><div className="text-white text-xl font-bold">{best}</div></div>
            </div>
            <button onClick={start} className="bg-pink-500 hover:bg-pink-400 text-white font-bold px-5 py-2.5 rounded-xl transition-colors">↺ Restart</button>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-700 cursor-pointer" onClick={jump}>
            <canvas ref={canvasRef} width={W} height={H} className="w-full block" />
            {status === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="text-center">
                  <div className="text-6xl mb-3">🎨</div>
                  <p className="text-white text-xl font-bold mb-2">Tap to Start</p>
                  <p className="text-slate-400 text-sm">Match ball color to ring section</p>
                </div>
              </div>
            )}
            {status === 'over' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="text-center">
                  <div className="text-5xl mb-3">💥</div>
                  <h2 className="text-2xl font-bold text-white mb-1">Game Over!</h2>
                  <p className="text-slate-400 mb-3">Score: <span className="text-pink-400 font-bold">{score}</span></p>
                  <button onClick={start} className="bg-pink-500 text-white font-bold px-5 py-2.5 rounded-xl">Play Again</button>
                </div>
              </div>
            )}
          </div>

          <p className="text-slate-500 text-sm text-center mt-3">Tap / <kbd className="bg-slate-700 px-2 py-0.5 rounded text-slate-300">Space</kbd> to jump</p>

          <div className="space-y-6 text-slate-300 mt-8">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">What is Color Switch Game?</h2>
              <p><strong>Color Switch</strong> is an addictive reflex-based <strong>free browser game</strong> where a colored ball must navigate through spinning rings. The trick: your ball can only pass through the section of the ring that matches its color. Each successful pass scores a point and slightly increases the ring's speed, making it progressively challenging.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Benefits for Focus and Reflexes</h2>
              <p>Color Switch trains <strong>color recognition speed, reaction time, and sustained concentration</strong> — all vital cognitive skills for students. The game's demand for split-second decisions under time pressure mimics the mental state required during timed exams, making it a surprisingly effective cognitive warm-up.</p>
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
                {[['🐦 Flappy Bird', '/flappy-bird-game'], ['🏗️ Stack Game', '/stack-game'], ['🔢 2048', '/2048-game'], ['🃏 Memory Cards', '/memory-card-game'], ['⌨️ Typing Speed', '/typing-speed-test'], ['🎮 All Games', '/free-games']].map(([l, p]) => (
                  <Link key={p} to={p} className="bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/30 rounded-lg px-3 py-1.5 text-pink-300 text-sm transition-colors">{l}</Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
