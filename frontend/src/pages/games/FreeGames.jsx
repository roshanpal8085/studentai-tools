import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { initAudio } from '../../utils/gameAudio';
import { Gamepad2, Zap, Brain, Coffee, Trophy, Star, ArrowRight, Clock } from 'lucide-react';

const gameCategories = [
  {
    id: 'brain-training',
    title: 'Brain Training',
    emoji: '🧠',
    description: 'Sharpen your mind with logic, math, and strategy games.',
    color: 'from-violet-600 to-indigo-600',
    glow: 'shadow-violet-500/20',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/10',
    iconColor: 'text-violet-400',
    icon: Brain,
    games: [
      { name: 'Sudoku', path: '/sudoku-game', emoji: '🔍', desc: 'Classic number puzzle. Train logic and concentration.', difficulty: 'Medium', time: '10–30 min', color: 'from-violet-500 to-purple-600' },
      { name: 'Math Quiz', path: '/math-quiz-game', emoji: '➕', desc: 'Test arithmetic speed under a 30-second timer.', difficulty: 'Easy', time: '1 min', color: 'from-blue-500 to-indigo-600' },
      { name: 'Logic Puzzle', path: '/logic-puzzle-game', emoji: '🧩', desc: 'Solve mind-bending logical puzzles that stretch reasoning.', difficulty: 'Hard', time: '5–15 min', color: 'from-fuchsia-500 to-purple-600' },
      { name: 'Memory Match', path: '/memory-card-game', emoji: '🃏', desc: 'Flip and match hidden card pairs to test your memory.', difficulty: 'Easy', time: '2–5 min', color: 'from-pink-500 to-rose-600' },
      { name: 'Word Puzzle', path: '/word-puzzle-game', emoji: '📝', desc: 'Expand vocabulary with clever word challenges.', difficulty: 'Medium', time: '3–5 min', color: 'from-teal-500 to-cyan-600' },
    ],
  },
  {
    id: 'classic-games',
    title: 'Classic Games',
    emoji: '🕹️',
    description: 'Timeless arcade games students have loved for generations.',
    color: 'from-sky-600 to-blue-600',
    glow: 'shadow-sky-500/20',
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/10',
    iconColor: 'text-sky-400',
    icon: Gamepad2,
    games: [
      { name: 'Snake', path: '/snake-game', emoji: '🐍', desc: 'Control the snake, eat food, avoid walls.', difficulty: 'Easy', time: '∞', color: 'from-emerald-500 to-green-600' },
      { name: 'Tic Tac Toe', path: '/tic-tac-toe', emoji: '⭕', desc: 'Challenge the AI in this classic X&O strategy game.', difficulty: 'Easy', time: '2 min', color: 'from-sky-500 to-blue-600' },
      { name: 'Flappy Bird', path: '/flappy-bird-game', emoji: '🐦', desc: 'Tap to fly through pipes in this addictive arcade classic.', difficulty: 'Hard', time: '∞', color: 'from-yellow-500 to-orange-500' },
      { name: 'Stack Game', path: '/stack-game', emoji: '🏗️', desc: 'Stack blocks perfectly to build the tallest tower.', difficulty: 'Medium', time: '∞', color: 'from-indigo-500 to-blue-600' },
    ],
  },
  {
    id: 'study-break',
    title: 'Study Break',
    emoji: '☕',
    description: 'Quick, refreshing games for a perfect 5-minute study break.',
    color: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/20',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    icon: Coffee,
    games: [
      { name: 'Typing Test', path: '/typing-speed-test', emoji: '⌨️', desc: 'Measure WPM and improve your keyboard speed.', difficulty: 'Easy', time: '1 min', color: 'from-amber-500 to-yellow-500' },
      { name: 'Color Switch', path: '/color-switch-game', emoji: '🎨', desc: 'Match colors to pass through rotating obstacles.', difficulty: 'Medium', time: '∞', color: 'from-rose-500 to-pink-600' },
    ],
  },
];

const DIFF_COLOR = {
  Easy:   'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  Medium: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  Hard:   'bg-rose-500/20 text-rose-300 border border-rose-500/30',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Are these browser games free to play?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! All games on StudentAI Tools are completely free to play in your browser — no download, no sign-up required.' } },
    { '@type': 'Question', name: 'Do these games work on mobile?', acceptedAnswer: { '@type': 'Answer', text: 'Absolutely. All our games are mobile-responsive and work on smartphones, tablets, and desktops.' } },
    { '@type': 'Question', name: 'Are these games good for students?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Brain training games improve focus, logic, memory, and problem-solving skills — all critical for academic success.' } },
    { '@type': 'Question', name: 'Can I play without internet?', acceptedAnswer: { '@type': 'Answer', text: 'All games are built with HTML5 and JavaScript and run entirely in your browser. Once the page loads, they work offline too.' } },
  ],
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Free Student Brain Games Collection",
  "description": "Explore 11+ free brain-training and educational games for students.",
  "url": "https://studentaitools.in/free-games",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "item": { "@type": "VideoGame", "name": "Snake Game", "url": "https://studentaitools.in/snake-game" } },
    { "@type": "ListItem", "position": 2, "item": { "@type": "VideoGame", "name": "Sudoku", "url": "https://studentaitools.in/sudoku-game" } },
    { "@type": "ListItem", "position": 3, "item": { "@type": "VideoGame", "name": "Tic Tac Toe", "url": "https://studentaitools.in/tic-tac-toe" } },
    { "@type": "ListItem", "position": 4, "item": { "@type": "VideoGame", "name": "Memory Card Game", "url": "https://studentaitools.in/memory-card-game" } },
    { "@type": "ListItem", "position": 5, "item": { "@type": "VideoGame", "name": "Typing Speed Test", "url": "https://studentaitools.in/typing-speed-test" } },
  ]
};

export default function FreeGames() {
  const handleGameClick = () => initAudio();

  return (
    <>
      <Helmet>
        <title>Free Games for Students | Browser Games | StudentAI Tools</title>
        <meta name="description" content="Play free browser games for students — Snake, Sudoku, Tic Tac Toe, Typing Speed Test, Memory Card, Math Quiz, and more. No download needed. Perfect study break games!" />
        <meta name="keywords" content="free browser games, study break games, brain training games for students, free online games for students, educational games" />
        <link rel="canonical" href="https://studentaitools.in/free-games" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-[#080c14] text-slate-200 selection:bg-purple-500/30 overflow-x-hidden">

        {/* ─── Animated Background Blobs ─── */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-violet-700/15 rounded-full blur-[140px]" />
          <div className="absolute top-[30%] right-[-15%] w-[40%] h-[40%] bg-blue-700/12 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>

        {/* ─── HERO ─── */}
        <section className="relative pt-24 pb-20 px-4 text-center">
          {/* Shimmer grid */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 text-white/70 text-sm font-semibold mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500" />
              </span>
              11 Games Available — Free to Play
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-6 tracking-tight leading-[0.95]">
              Level Up Your{' '}
              <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-sky-400 bg-clip-text text-transparent">
                Study Breaks
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              A curated collection of premium browser games designed to sharpen your mind and refresh your focus. No download. No sign-up.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {[
                { label: 'Free Games', value: '11+', icon: Gamepad2 },
                { label: 'Always Free', value: '100%', icon: Zap },
                { label: 'No Sign-up', value: 'Zero', icon: Star },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-md">
                  <s.icon className="w-5 h-5 text-violet-400" />
                  <div className="text-left">
                    <div className="text-xl font-black text-white leading-none">{s.value}</div>
                    <div className="text-xs text-slate-400 font-semibold">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Category jump links */}
            <div className="flex flex-wrap justify-center gap-3">
              {gameCategories.map(cat => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <span>{cat.emoji}</span> {cat.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ─── GAME SECTIONS ─── */}
        <div className="max-w-7xl mx-auto px-4 pb-24 space-y-24">
          {gameCategories.map((cat) => (
            <section key={cat.id} id={cat.id} className="scroll-mt-20">

              {/* Section header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-xl ${cat.glow}`}>
                    <cat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                      {cat.emoji} {cat.title}
                    </h2>
                    <p className="text-slate-400 text-sm font-medium">{cat.description}</p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${cat.bg} ${cat.iconColor} border ${cat.border}`}>
                  {cat.games.length} Titles
                </div>
              </div>

              {/* Game Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {cat.games.map((game) => (
                  <Link
                    key={game.path}
                    to={game.path}
                    onClick={handleGameClick}
                    className="group relative bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/20 rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 overflow-hidden flex flex-col"
                  >
                    {/* Card glow */}
                    <div className={`absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-15 rounded-full blur-3xl transition-all duration-500`} />

                    {/* Top: emoji + difficulty */}
                    <div className="flex items-start justify-between mb-5">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        {game.emoji}
                      </div>
                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${DIFF_COLOR[game.difficulty]}`}>
                        {game.difficulty}
                      </span>
                    </div>

                    {/* Title + desc */}
                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-violet-300 transition-colors">{game.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed flex-grow mb-5">{game.desc}</p>

                    {/* Footer: time + play button */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        {game.time}
                      </div>
                      <div className={`flex items-center gap-1.5 text-sm font-black bg-gradient-to-r ${game.color} bg-clip-text text-transparent group-hover:gap-2.5 transition-all`}>
                        Play Now <ArrowRight className="w-4 h-4 text-violet-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {/* ─── SEO CONTENT ─── */}
          <section className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-extrabold text-white mb-6">Why Play Brain Training Games?</h2>
            <div className="grid md:grid-cols-2 gap-6 text-slate-400 leading-relaxed text-sm">
              <p>
                <strong className="text-white">Free online games for students</strong> aren't just entertainment — they're powerful tools for cognitive development.
                Brain training games improve working memory, attention span, and problem-solving speed, all of which directly benefit academic performance.
              </p>
              <p>
                Taking a <strong className="text-white">study break game</strong> session of just 5–10 minutes has been shown to restore focus and prevent burnout.
                Explore our <Link to="/ai-study-planner" className="text-violet-400 hover:underline">AI Study Planner</Link> and{' '}
                <Link to="/ai-quiz-generator" className="text-violet-400 hover:underline">Quiz Generator</Link> to combine learning with smart breaks.
              </p>
            </div>
          </section>

          {/* ─── FAQ ─── */}
          <section>
            <h2 className="text-2xl font-extrabold text-white mb-6">FAQs</h2>
            <div className="space-y-3">
              {faqSchema.mainEntity.map((faq, i) => (
                <details key={i} className="group bg-white/[0.03] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 cursor-pointer transition-all">
                  <summary className="text-white font-semibold list-none flex justify-between items-center">
                    {faq.name}
                    <span className="text-violet-400 text-xl group-open:rotate-45 transition-transform duration-200 flex-shrink-0">+</span>
                  </summary>
                  <p className="text-slate-400 mt-3 leading-relaxed text-sm">{faq.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </section>

          {/* ─── CTA ─── */}
          <section className="relative bg-gradient-to-br from-violet-900/40 via-indigo-900/30 to-blue-900/40 border border-violet-500/20 rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-600/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-5 animate-float" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Also Try Our Free AI Study Tools</h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">Power up your studies with AI-powered tools. 100% free, no sign-up needed.</p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label: '✍️ AI Essay Writer', path: '/ai-essay-writer' },
                  { label: '📅 AI Study Planner', path: '/ai-study-planner' },
                  { label: '🧠 Quiz Generator', path: '/ai-quiz-generator' },
                  { label: '📋 Notes Generator', path: '/ai-notes-generator' },
                  { label: '🔧 All Free Tools', path: '/free-tools' },
                ].map(l => (
                  <Link key={l.path} to={l.path} className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-5 py-2.5 text-white text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-violet-400/40">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
