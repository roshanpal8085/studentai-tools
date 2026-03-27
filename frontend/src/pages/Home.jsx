import SEO from '../components/SEO';
import QuickToolsFloat from '../components/QuickToolsFloat';
import { 
  FileText, MonitorPlay, Image as ImageIcon, LayoutTemplate, MessageSquare, 
  Mail, Zap, CheckCircle2, TrendingUp, Users, ShieldCheck, Search, 
  Calendar, Clock, Hash, Type, QrCode, Lock, Ruler, Percent, Flame,
  User, Lightbulb, Terminal, Timer, BookOpen, Brain, ListChecks, Quote, Calculator, FileEdit, Wifi, Gamepad2, LayoutGrid, FileMinus, FilePlus, Star, Sparkles, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';

const allTools = [
  // Core AI Tools
  { name: 'AI Text Summarizer', description: 'Turn long articles and documents into concise, readable summaries.', icon: BookOpen, to: '/ai-text-summarizer', category: 'AI Tools' },
  { name: 'AI Resume Builder', description: 'Create professional, ATS-friendly resumes in seconds with AI.', icon: LayoutTemplate, to: '/ai-resume-generator', category: 'AI Tools', hot: true },
  { name: 'AI Homework Helper', description: 'Get instant help and explanations for any homework problem.', icon: Zap, to: '/ai-homework-helper', category: 'AI Tools' },
  { name: 'AI Essay Writer', description: 'Draft high-quality essays with proper citations and structure.', icon: FileText, to: '/ai-essay-writer', category: 'AI Tools', isNew: true },
  { name: 'AI Study Planner', description: 'Generate personalized study schedules based on your exams.', icon: Calendar, to: '/ai-study-planner', category: 'AI Tools' },
  { name: 'AI Notes Generator', description: 'Turn your lecture recordings or text into concise notes.', icon: MessageSquare, to: '/ai-notes-generator', category: 'AI Tools' },
  { name: 'AI Quiz Generator', description: 'Create practice quizzes from your study material instantly.', icon: CheckCircle2, to: '/ai-quiz-generator', category: 'AI Tools' },
  { name: 'AI Assignment Generator', description: 'Generate structured assignments and rubrics for any topic.', icon: ListChecks, to: '/ai-assignment-generator', category: 'AI Tools' },
  { name: 'Chat with PDF', description: 'Upload books or papers and ask the AI questions about them.', icon: MessageSquare, to: '/chat-pdf', category: 'AI Tools', hot: true },
  { name: 'Presentation Builder', description: 'Generate complete, beautifully structured PowerPoint outlines.', icon: MonitorPlay, to: '/presentation-generator', category: 'AI Tools' },
  { name: 'AI Email Writer', description: 'Draft professional, perfectly toned emails for any situation.', icon: Mail, to: '/email-writer', category: 'AI Tools' },

  // Text & Writing Tools
  { name: 'Grammar Checker', description: 'Ensure your writing is flawless with our AI checker.', icon: ShieldCheck, to: '/tools/grammar-checker', category: 'Writing', hot: true },
  { name: 'Word Counter', description: 'Fast and accurate word and character counting tool.', icon: Type, to: '/tools/word-counter', category: 'Writing' },
  { name: 'Citation Generator', description: 'Perfect APA, MLA, and Chicago style citations instantly.', icon: Quote, to: '/tools/citation-generator', category: 'Writing' },
  { name: 'Essay Topic Generator', description: "Beat writer's block with 10 fresh ideas for your topic.", icon: Lightbulb, to: '/tools/essay-topic-generator', category: 'Writing' },
  
  // Study & Productivity
  { name: 'Free Student Games', description: 'Take a productive study break with 12 free brain-training games.', icon: Flame, to: '/free-games', category: 'Study', isNew: true },
  { name: 'Pomodoro Timer', description: 'Boost focus with 25-minute study sprints and breaks.', icon: BookOpen, to: '/tools/study-timer', category: 'Study' },
  { name: 'Exam Countdown', description: 'Track your deadlines in real-time. Never miss an exam.', icon: Timer, to: '/tools/exam-countdown', category: 'Study' },
  { name: 'Homework Planner', description: 'Organize your assignments and set priorities efficiently.', icon: ListChecks, to: '/tools/homework-planner', category: 'Study' },
  { name: 'Study Timetable', description: 'AI-generated personalized weekly study schedules.', icon: Calendar, to: '/tools/study-timetable-generator', category: 'Study' },
  { name: 'GPA Calculator', description: 'Calculate your semester and cumulative GPA accurately.', icon: Calculator, to: '/tools/gpa-calculator', category: 'Study' },
  { name: 'Practice Questions', description: 'Generate random practice questions to test your knowledge.', icon: Brain, to: '/tools/random-question-generator', category: 'Study' },
  
  // Free Utilities
  { name: 'QR Code Generator', description: 'Create free QR codes for links, text, and documents.', icon: QrCode, to: '/tools/qr-generator', category: 'Utilities' },
  { name: 'Image to PDF', description: 'Convert your photos into high-quality PDF documents.', icon: FileText, to: '/tools/image-to-pdf', category: 'Utilities' },
  { name: 'PDF Footer Editor', description: 'Stamp your name & enrollment number on every PDF page footer.', icon: FileEdit, to: '/tools/pdf-footer-editor', category: 'Utilities', isNew: true },
  { name: 'Image Compressor', description: 'Reduce image file size without losing quality.', icon: ImageIcon, to: '/tools/image-compressor', category: 'Utilities' },
  { name: 'Unit Converter', description: 'Switch between metric and imperial units with ease.', icon: Ruler, to: '/total-unit-converter', category: 'Utilities' },
  { name: 'Password Generator', description: 'Generate secure, random passwords for your accounts.', icon: Lock, to: '/tools/password-generator', category: 'Utilities' },
  { name: 'Age Calculator', description: 'Find out exactly how old you are in days and months.', icon: Clock, to: '/tools/age-calculator', category: 'Utilities' },
  { name: 'Percent Calculator', description: 'Quickly find percentages for math and grades.', icon: Percent, to: '/tools/percentage-calculator', category: 'Utilities' },
  { name: 'Name Generator', description: 'Random names for creative projects and personas.', icon: User, to: '/tools/random-name-generator', category: 'Utilities' },
  { name: 'AI Prompt Gen', description: 'Master AI tools with perfectly engineered prompts.', icon: Terminal, to: '/tools/ai-prompt-generator', category: 'Utilities' },
  { name: 'Internet Speed Test', description: 'Measure your real-time download/upload Mbps and ping latency.', icon: Wifi, to: '/tools/internet-speed-test', category: 'Utilities', hot: true },
  { name: 'Instagram Captions', description: 'Generate engaging hashtags and captions for social media.', icon: Hash, to: '/instagram-caption-generator', category: 'Utilities' },
];

const TRENDING = [
  { name: 'Internet Speed Test', icon: Wifi, to: '/tools/internet-speed-test', color: 'from-sky-500 to-indigo-500' },
  { name: 'AI Resume Builder', icon: LayoutTemplate, to: '/ai-resume-generator', color: 'from-indigo-500 to-violet-500' },
  { name: 'Grammar Checker', icon: ShieldCheck, to: '/tools/grammar-checker', color: 'from-emerald-500 to-teal-500' },
  { name: 'Chat with PDF', icon: MessageSquare, to: '/chat-pdf', color: 'from-purple-500 to-pink-500' },
  { name: 'PDF Merge', icon: FilePlus, to: '/free-pdf-tools', color: 'from-rose-500 to-orange-400' },
  { name: 'GPA Calculator', icon: Calculator, to: '/tools/gpa-calculator', color: 'from-amber-500 to-yellow-400' },
  { name: 'Memory Game', icon: Gamepad2, to: '/memory-card-game', color: 'from-blue-500 to-cyan-400' },
  { name: 'Essay Writer', icon: FileText, to: '/ai-essay-writer', color: 'from-fuchsia-500 to-pink-500' },
];

const categories = ['All', 'AI Tools', 'Utilities', 'Writing', 'Study'];

const stats = [
  { value: '50+', name: 'Free Tools', icon: Zap },
  { value: '100K+', name: 'Students Helped', icon: Users },
  { value: '0', name: 'Registration Required', icon: ShieldCheck },
  { value: '24/7', name: 'Always Available', icon: TrendingUp },
];

const testimonials = [
  { content: 'StudentAI saved my semester. I used the AI Essay Writer to structure my 3000-word paper in 20 minutes. Absolute lifesaver.', author: 'Priya S.', role: 'Engineering Student', image: 'https://i.pravatar.cc/100?img=47' },
  { content: 'The AI Resume Builder is incredible. Got 3 interview calls in a week after updating my resume using this tool.', author: 'Marcus J.', role: 'MBA Graduate', image: 'https://i.pravatar.cc/100?img=68' },
  { content: 'Chat with PDF is the best study tool I have found. I asked my 400-page textbook questions and got instant answers.', author: 'Aisha K.', role: 'Pre-Med Student', image: 'https://i.pravatar.cc/100?img=32' },
];

const CATEGORY_COLORS = {
  'AI Tools':    { grad: 'from-indigo-500 to-violet-500', light: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
  'Utilities':   { grad: 'from-sky-500 to-cyan-500',     light: 'bg-sky-50 dark:bg-sky-900/20',       text: 'text-sky-600 dark:text-sky-400' },
  'Writing':     { grad: 'from-emerald-500 to-teal-500', light: 'bg-emerald-50 dark:bg-emerald-900/20',text: 'text-emerald-600 dark:text-emerald-400' },
  'Study':       { grad: 'from-amber-500 to-orange-500', light: 'bg-amber-50 dark:bg-amber-900/20',   text: 'text-amber-600 dark:text-amber-400' },
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTools = useMemo(() => {
    return allTools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen pt-16 pb-12 flex flex-col items-center overflow-hidden">
      <SEO 
        title="Home" 
        description="Access free AI tools for students: resume generator, homework helper, essay writer, presentation builder, and PDF utilities to boost your productivity." 
      />

      {/* ──────────── HERO ──────────── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10 mb-16 relative overflow-visible">
        {/* Floating orbs */}
        <div className="hero-orb w-[600px] h-[400px] bg-indigo-500/15 -left-40 -top-20 opacity-60" style={{ animationDelay: '0s' }} />
        <div className="hero-orb w-[400px] h-[400px] bg-purple-500/15 right-0 top-10 opacity-50" style={{ animationDelay: '2s' }} />
        <div className="hero-orb w-[300px] h-[300px] bg-pink-500/10 left-1/3 bottom-0 opacity-40" style={{ animationDelay: '4s' }} />

        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700/50 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4" />
          50+ Free Tools for Students
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          All-in-One Free<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            Student AI Tools
          </span>
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          PDF tools, AI writing, study helpers and games — everything in one place. 100% free, no sign-up needed.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Link to="/ai-resume-generator" className="btn-primary btn-glow px-8 py-4 text-lg flex items-center gap-2 w-full sm:w-auto justify-center">
            <Zap className="w-5 h-5" />
            Try AI Tools Free
          </Link>
          <Link to="/free-pdf-tools" className="flex items-center gap-2 w-full sm:w-auto justify-center px-8 py-4 rounded-xl text-lg font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:-translate-y-0.5 transition-all shadow-sm">
            Explore Tools <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {['100% Free', 'No Registration', 'Student Optimized', 'Works on Mobile'].map(b => (
            <div key={b} className="flex items-center gap-1.5 bg-white dark:bg-slate-800/50 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700/50 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {b}
            </div>
          ))}
        </div>
      </section>

      {/* ──────────── TRENDING TOOLS SCROLL ──────────── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-gradient-to-br from-rose-500 to-orange-400 rounded-xl text-white shadow-lg shadow-rose-500/30">
            <Flame className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">🔥 Trending Tools</h2>
        </div>

        <div className="overflow-x-auto trending-scroll pb-3">
          <div className="flex gap-3 w-max">
            {TRENDING.map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all group whitespace-nowrap"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{tool.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* ──────────── FREE GAMES (Gamified) ──────────── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl text-white shadow-lg shadow-indigo-500/30">
              <Gamepad2 className="w-5 h-5 animate-bounce" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              🎮 Free Games
              <span className="badge-new ml-3">NEW</span>
            </h2>
          </div>
          <Link to="/free-games" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Logic Puzzle', desc: 'Sharpen deduction skills.', icon: Brain, to: '/logic-puzzle-game', color: 'from-orange-500 to-amber-400' },
            { name: 'Typing Test', desc: 'Boost your WPM speed.', icon: Hash, to: '/typing-speed-test', color: 'from-blue-600 to-indigo-500' },
            { name: 'Sudoku Pro', desc: 'Daily math challenge.', icon: LayoutGrid, to: '/sudoku-game', color: 'from-purple-500 to-pink-500' },
            { name: 'Snake Retro', desc: 'Classic focus game.', icon: Gamepad2, to: '/snake-game', color: 'from-emerald-500 to-teal-400' }
          ].map((game, idx) => (
            <Link key={idx} to={game.to} className="group relative bg-white dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-100 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer shadow-sm">
              <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-25 rounded-full blur-xl transition-all`} />
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${game.color} text-white flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                <game.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1.5">{game.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{game.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ──────────── ALL TOOLS GRID ──────────── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            All Tools for Academic Success
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Everything you need to study faster, write better, and succeed — all in one place.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-8 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search tools like 'Resume AI, Grammar, Speed Test...'"
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => {
              const colors = CATEGORY_COLORS[tool.category] || CATEGORY_COLORS['AI Tools'];
              return (
                <Link
                  key={tool.name}
                  to={tool.to}
                  className="group relative bg-white dark:bg-slate-800/60 p-7 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 border border-slate-100 dark:border-slate-700/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden"
                >
                  {/* Hover bg glow */}
                  <div className={`absolute -right-10 -top-10 w-36 h-36 bg-gradient-to-br ${colors.grad} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-all duration-300`} />

                  {/* Badges */}
                  <div className="absolute top-5 right-5 flex gap-1.5">
                    {tool.hot && <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-500">🔥 HOT</span>}
                    {tool.isNew && <span className="badge-new">NEW</span>}
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.grad} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <tool.icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Category  */}
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${colors.light} ${colors.text} mb-3 self-start`}>
                    {tool.category}
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{tool.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed flex-grow">{tool.description}</p>

                  <div className="mt-5 flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-sm font-bold opacity-0 group-hover:opacity-100 group-hover:gap-2 transition-all duration-200">
                    Open tool <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No tools found</h3>
              <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or category filters.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="mt-6 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ──────────── STATS ──────────── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800/60 p-8 rounded-3xl text-center border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-slate-500 dark:text-slate-400 font-medium text-sm">{stat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────── TESTIMONIALS ──────────── */}
      <section className="w-full bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-24 my-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Loved by Students Worldwide</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Don't just take our word for it.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-1 mb-5">
                  {Array(5).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-lg leading-relaxed text-slate-300 mb-7 font-medium italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.image} alt={testimonial.author} className="w-12 h-12 rounded-full border-2 border-indigo-500/30" />
                  <div>
                    <h4 className="font-bold text-white">{testimonial.author}</h4>
                    <span className="text-slate-400 text-sm">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── CTA ──────────── */}
      <section className="w-full max-w-5xl mx-auto px-4 text-center mt-6 mb-24 relative">
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[3rem] p-12 md:p-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5">Ready to study smarter?</h2>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students saving hours every week using our AI suite. 100% free, always.
            </p>
            <Link
              to="/ai-resume-generator"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-extrabold px-10 py-5 rounded-2xl text-lg transition-all shadow-2xl hover:shadow-white/20 hover:-translate-y-1 active:scale-95"
            >
              <Zap className="w-5 h-5" />
              Get Started For Free
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Quick Tools */}
      <QuickToolsFloat />
    </div>
  );
}
