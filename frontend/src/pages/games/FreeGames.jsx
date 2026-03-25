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

export default function FreeGames() {
  return (
    <>
      <Helmet>
        <title>Free Games for Students | Browser Games | StudentAI Tools</title>
        <meta name="description" content="Play free browser games for students — Snake, Sudoku, Tic Tac Toe, Typing Speed Test, Memory Card, Math Quiz, and more. No download needed. Perfect study break games!" />
        <meta name="keywords" content="free browser games, study break games, brain training games for students, free online games for students, educational games" />
        <link rel="canonical" href="https://studentaitools.in/free-games" />
        <meta property="og:title" content="Free Games for Students | StudentAI Tools" />
        <meta property="og:description" content="Play 12 free browser games — brain training, classics, and study break games. No download needed!" />
        <meta property="og:url" content="https://studentaitools.in/free-games" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoLTZ2LTZoNnptMCAwdi02aDZ2Nmgtfm0tMTIgMHY2aC02di02aDZ6bTAgMHYtNmg2djZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
          <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-4 py-2 text-purple-300 text-sm font-medium mb-6">
              🎮 100% Free · No Download · Browser Playable
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Free Games for{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Students
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Play 12 handpicked <strong className="text-white">free browser games</strong> — brain training, classic arcade, and study break games. 
              Zero downloads, instant play, mobile-friendly. Perfect for a <strong className="text-white">5-minute study break</strong>!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['🧠 Brain Training', '🕹️ Classic Games', '☕ Study Break', '📱 Mobile Friendly'].map(tag => (
                <span key={tag} className="bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/80 text-sm">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* All Games Quick Grid */}
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 backdrop-blur-sm">
            <h2 className="text-white font-bold text-lg mb-4">⚡ Quick Play — All {allGames.length} Games</h2>
            <div className="flex flex-wrap gap-2">
              {allGames.map(g => (
                <Link key={g.path} to={g.path} className="bg-white/10 hover:bg-purple-500/30 border border-white/15 hover:border-purple-400/50 rounded-xl px-3 py-2 text-white/90 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5">
                  {g.emoji} {g.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Category Sections */}
          {gameCategories.map(cat => (
            <section key={cat.id} id={cat.id} className="mb-16">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">{cat.title}</h2>
                <p className="text-slate-400 text-lg">{cat.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cat.games.map(game => (
                  <Link
                    key={game.path}
                    to={game.path}
                    className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/30 backdrop-blur-sm"
                  >
                    <div className="text-4xl mb-3">{game.emoji}</div>
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-300 transition-colors">{game.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{game.desc}</p>
                    <span className="inline-flex items-center gap-1 text-purple-400 text-sm font-medium group-hover:gap-2 transition-all">
                      Play Now <span>→</span>
                    </span>
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
