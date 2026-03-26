import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const gameCategories = [
  {
    id: 'brain-training',
    title: '🧠 Brain Training Games',
    description: 'Sharpen your mind with logic, math, and strategy games designed to boost cognitive skills.',
    games: [
      { name: 'Sudoku Game', path: '/sudoku-game', emoji: '🔍', desc: 'Classic number puzzle to train logic and concentration.' },
      { name: 'Math Quiz Game', path: '/math-quiz-game', emoji: '➕', desc: 'Test your arithmetic speed with fun math challenges.' },
      { name: 'Logic Puzzle Game', path: '/logic-puzzle-game', emoji: '🧩', desc: 'Solve mind-bending logical puzzles to improve reasoning.' },
      { name: 'Memory Card Game', path: '/memory-card-game', emoji: '🃏', desc: 'Test your memory by matching pairs of hidden cards.' },
      { name: 'Word Puzzle Game', path: '/word-puzzle-game', emoji: '📝', desc: 'Expand your vocabulary with fun word challenges.' },
    ],
  },
  {
    id: 'classic-games',
    title: '🕹️ Classic Games',
    description: 'Relive timeless browser games that generations of students have loved.',
    games: [
      { name: 'Snake Game', path: '/snake-game', emoji: '🐍', desc: 'Control the snake, eat food, avoid walls — pure classic fun.' },
      { name: 'Tic Tac Toe', path: '/tic-tac-toe', emoji: '⭕', desc: 'Challenge a friend or AI in the ultimate classic strategy game.' },
      { name: 'Flappy Bird Game', path: '/flappy-bird-game', emoji: '🐦', desc: 'Tap to fly through pipes in this addictive arcade classic.' },
      { name: 'Stack Game', path: '/stack-game', emoji: '🏗️', desc: 'Stack blocks perfectly to build the tallest tower.' },
    ],
  },
  {
    id: 'study-break',
    title: '☕ Study Break Games',
    description: 'Quick, refreshing games for a perfect 5-minute study break.',
    games: [
      { name: 'Typing Speed Test', path: '/typing-speed-test', emoji: '⌨️', desc: 'Measure your words per minute and improve typing speed.' },
      { name: 'Color Switch Game', path: '/color-switch-game', emoji: '🎨', desc: 'Match colors to pass through rotating obstacles.' },
    ],
  },
];

const allGames = gameCategories.flatMap(c => c.games);

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are these browser games free to play?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes! All games on StudentAI Tools are completely free to play in your browser — no download, no sign-up required.' },
    },
    {
      '@type': 'Question',
      name: 'Do these games work on mobile?',
      acceptedAnswer: { '@type': 'Answer', text: 'Absolutely. All our games are mobile-responsive and work on smartphones, tablets, and desktops.' },
    },
    {
      '@type': 'Question',
      name: 'Are these games good for students?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes! Brain training games improve focus, logic, memory, and problem-solving skills — all critical for academic success.' },
    },
    {
      '@type': 'Question',
      name: 'Can I play without internet?',
      acceptedAnswer: { '@type': 'Answer', text: 'All games are built with HTML5 and JavaScript and run entirely in your browser. Once the page loads, they work offline too.' },
    },
  ],
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Free Student Brain Games Collection",
  "description": "Explore 11+ free brain-training and educational games for students. Play Sudoku, Snake, Typing Test, and more in your browser.",
  "url": "https://studentaitools.in/free-games",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "item": { "@type": "VideoGame", "name": "Snake Game", "url": "https://studentaitools.in/snake-game" } },
    { "@type": "ListItem", "position": 2, "item": { "@type": "VideoGame", "name": "Sudoku", "url": "https://studentaitools.in/sudoku-game" } },
    { "@type": "ListItem", "position": 3, "item": { "@type": "VideoGame", "name": "Tic Tac Toe", "url": "https://studentaitools.in/tic-tac-toe" } },
    { "@type": "ListItem", "position": 4, "item": { "@type": "VideoGame", "name": "Memory Card Game", "url": "https://studentaitools.in/memory-card-game" } },
    { "@type": "ListItem", "position": 5, "item": { "@type": "VideoGame", "name": "Typing Speed Test", "url": "https://studentaitools.in/typing-speed-test" } },
    { "@type": "ListItem", "position": 6, "item": { "@type": "VideoGame", "name": "Math Quiz", "url": "https://studentaitools.in/math-quiz-game" } },
    { "@type": "ListItem", "position": 7, "item": { "@type": "VideoGame", "name": "Logic Puzzle", "url": "https://studentaitools.in/logic-puzzle-game" } },
    { "@type": "ListItem", "position": 8, "item": { "@type": "VideoGame", "name": "Stack Game", "url": "https://studentaitools.in/stack-game" } },
    { "@type": "ListItem", "position": 9, "item": { "@type": "VideoGame", "name": "Color Switch", "url": "https://studentaitools.in/color-switch-game" } },
    { "@type": "ListItem", "position": 10, "item": { "@type": "VideoGame", "name": "Word Puzzle", "url": "https://studentaitools.in/word-puzzle-game" } },
    { "@type": "ListItem", "position": 11, "item": { "@type": "VideoGame", "name": "Flappy Bird", "url": "https://studentaitools.in/flappy-bird-game" } }
  ]
};

import { initAudio } from '../../utils/gameAudio';

export default function FreeGames() {
  const handleGameClick = () => {
    initAudio();
  };

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

      <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-purple-500/30">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Hero */}
        <div className="relative pt-20 pb-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-white/10 rounded-full px-4 py-2 text-white/80 text-sm font-medium mb-8 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Gaming Console Hub v2.0
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Level Up Your <br/>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent italic">
                Study Breaks
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              A curated collection of pixel-perfect browser games designed to sharpen your mind and refresh your focus.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <a href="#brain-training" className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95">🧠 Brain</a>
               <a href="#classic-games" className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95">🕹️ Classic</a>
               <a href="#study-break" className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95">☕ Break</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-20 relative z-10">
          {/* Category Sections */}
          {gameCategories.map(cat => (
            <section key={cat.id} id={cat.id} className="mb-24 scroll-mt-24">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-l-4 border-purple-500 pl-6">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">{cat.title.split(' ')[1] + ' ' + cat.title.split(' ')[2]}</h2>
                  <p className="text-slate-400 font-medium max-w-xl">{cat.description}</p>
                </div>
                <div className="text-xs font-black text-purple-500/50 uppercase tracking-[0.2em]">{cat.games.length} Titles Loaded</div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cat.games.map(game => (
                  <Link
                    key={game.path}
                    to={game.path}
                    onClick={handleGameClick}
                    className="group relative bg-[#1e293b]/40 hover:bg-[#1e293b]/60 border border-white/5 hover:border-purple-500/40 rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)] backdrop-blur-xl overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-purple-500/10 transition-colors" />
                    
                    <div className="relative z-10">
                      <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 inline-block">{game.emoji}</div>
                      <h3 className="text-2xl font-black text-white mb-3 group-hover:text-purple-300 transition-colors tracking-tight">{game.name}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium line-clamp-2">{game.desc}</p>
                      
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 text-purple-400 text-xs font-black uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                            Start Game <span className="text-lg">→</span>
                         </div>
                         <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500">
                            <span className="text-xl">🎮</span>
                         </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {/* SEO Content */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-4">Why Play Brain Training Games for Students?</h2>
            <div className="grid md:grid-cols-2 gap-6 text-slate-300 leading-relaxed">
              <div>
                <p className="mb-4">
                  <strong className="text-white">Free online games for students</strong> aren't just entertainment — they're powerful tools for cognitive development. 
                  Research shows that brain training games improve working memory, attention span, and problem-solving speed, all of which directly benefit academic performance.
                </p>
                <p>
                  Games like <Link to="/sudoku-game" className="text-purple-400 hover:underline">Sudoku</Link> and <Link to="/logic-puzzle-game" className="text-purple-400 hover:underline">Logic Puzzles</Link> are 
                  proven to enhance logical thinking, while <Link to="/typing-speed-test" className="text-purple-400 hover:underline">Typing Speed Tests</Link> build 
                  a practical skill used every day in college and careers.
                </p>
              </div>
              <div>
                <p className="mb-4">
                  Taking a <strong className="text-white">study break game</strong> session of just 5–10 minutes has been shown to restore focus and prevent burnout during long study sessions. 
                  Our curated collection of <strong className="text-white">free browser games</strong> is designed exactly for this purpose.
                </p>
                <p>
                  Explore our <Link to="/ai-study-planner" className="text-purple-400 hover:underline">AI Study Planner</Link>, 
                  <Link to="/ai-quiz-generator" className="text-purple-400 hover:underline"> Quiz Generator</Link>, and 
                  <Link to="/free-tools" className="text-purple-400 hover:underline"> Free Study Tools</Link> to combine learning with smart breaks.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqSchema.mainEntity.map((faq, i) => (
                <details key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 cursor-pointer group backdrop-blur-sm">
                  <summary className="text-white font-semibold list-none flex justify-between items-center">
                    {faq.name}
                    <span className="text-purple-400 text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-slate-300 mt-3 leading-relaxed">{faq.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Internal links to tools */}
          <section className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/20 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Also Try Our Free AI Study Tools</h2>
            <p className="text-slate-300 mb-6">Power up your studies with our AI-powered tools. 100% free, no sign-up needed.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: '📝 AI Essay Writer', path: '/ai-essay-writer' },
                { label: '📚 AI Study Planner', path: '/ai-study-planner' },
                { label: '🧠 AI Quiz Generator', path: '/ai-quiz-generator' },
                { label: '📋 Notes Generator', path: '/ai-notes-generator' },
                { label: '🔧 All Free Tools', path: '/free-tools' },
              ].map(l => (
                <Link key={l.path} to={l.path} className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm font-medium transition-all hover:-translate-y-0.5">
                  {l.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
