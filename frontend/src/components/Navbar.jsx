import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap, Menu, X, Search, ChevronDown,
  FileText, Brain, Mail, MessageSquare, MonitorPlay, Hash,
  FileMinus, FilePlus, FileEdit, Image as ImageIcon, Scissors, Type as TypeIcon, Trash2, Upload, UploadCloud,
  ShieldCheck, Timer, Calculator, Type, Wifi, Gamepad2, Zap, BookOpen, ListChecks, Calendar, Lightbulb, Quote, CheckCircle2, Wand2
} from 'lucide-react';

const NAV_DROPDOWNS = [
  {
    label: 'AI Tools',
    wide: true,
    items: [
      { label: 'Resume AI', path: '/ai-resume-generator', icon: FileText, desc: 'ATS-friendly resumes in seconds' },
      { label: 'Email Writer', path: '/email-writer', icon: Mail, desc: 'Professional emails instantly' },
      { label: 'Caption Generator', path: '/instagram-caption-generator', icon: Hash, desc: 'Viral captions for social media' },
      { label: 'Chat with PDF', path: '/chat-pdf', icon: MessageSquare, desc: 'Ask your textbooks anything' },
      { label: 'Presentation Builder', path: '/presentation-generator', icon: MonitorPlay, desc: 'Beautiful slide decks with AI' },
      { label: 'Essay Writer', path: '/ai-essay-writer', icon: Brain, desc: 'Structured essays instantly' },
      { label: 'Homework Helper', path: '/ai-homework-helper', icon: Zap, desc: 'Instant help on any problem' },
      { label: 'Text Summarizer', path: '/ai-text-summarizer', icon: BookOpen, desc: 'Long articles into concise notes' },
      { label: 'Assignment Generator', path: '/ai-assignment-generator', icon: ListChecks, desc: 'Structured assignments in seconds' },
      { label: 'Study Planner', path: '/ai-study-planner', icon: Calendar, desc: 'Personalized study schedules' },
      { label: 'Essay Topic Generator', path: '/tools/essay-topic-generator', icon: Lightbulb, desc: "Beat writer's block instantly" },
      { label: 'Quiz Generator', path: '/ai-quiz-generator', icon: CheckCircle2, desc: 'Practice quizzes from any topic' },
      { label: 'Paraphrasing Tool', path: '/tools/paraphrasing-tool', icon: Wand2, desc: 'Rewrite text in 6 AI modes' },
    ]
  },
  {
    label: 'PDF Tools',
    items: [
      { label: 'Merge PDF', path: '/free-pdf-tools', icon: FilePlus, desc: 'Combine multiple PDFs into one' },
      { label: 'Split PDF', path: '/free-pdf-tools', icon: Scissors, desc: 'Extract specific page ranges' },
      { label: 'Compress PDF', path: '/free-pdf-tools', icon: UploadCloud, desc: 'Reduce file size, keep quality' },
      { label: 'Add Watermark', path: '/free-pdf-tools', icon: TypeIcon, desc: 'Stamp text on all pages' },
      { label: 'Delete Pages', path: '/free-pdf-tools', icon: Trash2, desc: 'Remove unwanted pages' },
      { label: 'PDF Footer Editor', path: '/tools/pdf-footer-editor', icon: FileEdit, desc: 'Add name & enrollment number' },
      { label: 'Image to PDF', path: '/tools/image-to-pdf', icon: ImageIcon, desc: 'Convert photos to PDF' },
    ]
  },
  {
    label: 'Study Tools',
    items: [
      { label: 'Grammar Checker', path: '/tools/grammar-checker', icon: ShieldCheck, desc: 'Flawless writing guaranteed' },
      { label: 'Pomodoro Timer', path: '/tools/study-timer', icon: Timer, desc: 'Focused 25-min study sprints' },
      { label: 'GPA Calculator', path: '/tools/gpa-calculator', icon: Calculator, desc: 'Calculate semester GPA' },
      { label: 'Word Counter', path: '/tools/word-counter', icon: Type, desc: 'Fast word & character count' },
      { label: 'Speed Test', path: '/tools/internet-speed-test', icon: Wifi, desc: 'Measure real-time Mbps' },
      { label: 'Study Notes AI', path: '/ai-notes-generator', icon: BookOpen, desc: 'Turn lectures into notes' },
    ]
  }
];

const SEARCH_SHORTCUTS = [
  { label: 'Resume AI', path: '/ai-resume-generator' },
  { label: 'Chat with PDF', path: '/chat-pdf' },
  { label: 'Grammar Checker', path: '/tools/grammar-checker' },
  { label: 'Speed Test', path: '/tools/internet-speed-test' },
  { label: 'PDF Merge', path: '/free-pdf-tools' },
  { label: 'GPA Calculator', path: '/tools/gpa-calculator' },
  { label: 'Email Writer', path: '/email-writer' },
  { label: 'Essay Writer', path: '/ai-essay-writer' },
  { label: 'Paraphrasing Tool', path: '/tools/paraphrasing-tool' },
  { label: 'Presentation Builder', path: '/presentation-generator' },
  { label: 'Free Games', path: '/free-games' },
  { label: 'Sudoku', path: '/sudoku-game' },
  { label: 'Snake Game', path: '/snake-game' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const lastScrollY = useRef(0);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const filteredSearch = SEARCH_SHORTCUTS.filter(s =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 20);
      if (current > lastScrollY.current && current > 80) {
        setVisible(false);
        setActiveDropdown(null);
      } else {
        setVisible(true);
      }
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cmd+K for search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const closeAll = () => { setIsOpen(false); setActiveDropdown(null); setSearchOpen(false); };

  const handleSearchNavigate = (path) => {
    navigate(path);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      {/* ──── NAVBAR ──── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${visible ? 'translate-y-0' : '-translate-y-full'}
          ${scrolled
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border-b border-white/20 dark:border-slate-700/50'
            : 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/10 dark:border-slate-800/50'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link to="/" onClick={closeAll} className="flex items-center gap-2 flex-shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white hidden sm:block">
                StudentAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Tools</span>
              </span>
            </Link>

            {/* Desktop Nav - Dropdowns */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_DROPDOWNS.map((group) => (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(group.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all
                    ${activeDropdown === group.label
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {group.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === group.label ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Mega Dropdown */}
                  <div className={`absolute top-full left-0 pt-2 transition-all duration-200
                    ${activeDropdown === group.label ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                  >
                  <div className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-slate-300/30 dark:shadow-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 p-3 ${group.wide ? 'min-w-[520px] grid grid-cols-2 gap-x-2' : 'min-w-[280px]'}`}>
                      {group.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={closeAll}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group/item transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all">
                            <item.icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover/item:text-white transition-colors" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800 dark:text-white">{item.label}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <Link
                to="/free-games"
                onClick={closeAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <Gamepad2 className="w-4 h-4" />
                Games
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white leading-none">NEW</span>
              </Link>

              <Link to="/blog" onClick={closeAll} className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                Blog
              </Link>
            </div>

            {/* Right: Search + CTA + Hamburger */}
            <div className="flex items-center gap-2">
              {/* Search trigger */}
              <button
                onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm"
              >
                <Search className="w-4 h-4" />
                <span className="hidden md:block text-sm">Search tools...</span>
                <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 text-[10px] font-medium">⌘K</kbd>
              </button>

              {/* CTA */}
              <Link
                to="/ai-resume-generator"
                onClick={closeAll}
                className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:scale-95"
              >
                <Zap className="w-4 h-4" />
                Try AI Tools
              </Link>

              {/* Hamburger */}
              <button
                className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ──── SEARCH OVERLAY ──── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) { setSearchOpen(false); setSearchQuery(''); } }}
        >
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search tools like "Resume AI, Speed test, PDF merge..."'
                className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none text-base"
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="py-2 max-h-72 overflow-y-auto">
              {filteredSearch.length > 0 ? filteredSearch.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleSearchNavigate(item.path)}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group transition-colors"
                >
                  <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{item.label}</span>
                </button>
              )) : (
                <div className="py-8 text-center text-slate-400 text-sm">No tools found for "{searchQuery}"</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ──── MOBILE DRAWER OVERLAY ──── */}
      <div
        className={`fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* ──── MOBILE DRAWER ──── */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-slate-900 shadow-2xl z-50 lg:hidden transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="font-extrabold text-slate-900 dark:text-white text-lg">Menu</span>
            <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Search on mobile */}
          <button
            onClick={() => { setIsOpen(false); setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mb-4 text-sm"
          >
            <Search className="w-4 h-4" />
            <span>Search tools...</span>
          </button>

          {/* Dropdown groups */}
          {NAV_DROPDOWNS.map((group) => (
            <div key={group.label} className="mb-2">
              <button
                onClick={() => setMobileExpanded(mobileExpanded === group.label ? null : group.label)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
              >
                {group.label}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileExpanded === group.label ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${mobileExpanded === group.label ? 'max-h-96' : 'max-h-0'}`}>
                <div className="pl-3 pt-1 space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeAll}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Games + Blog */}
          <Link to="/free-games" onClick={closeAll} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mb-1">
            <Gamepad2 className="w-4 h-4" />
            Games
            <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white">NEW</span>
          </Link>
          <Link to="/blog" onClick={closeAll} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mb-4">
            Blog
          </Link>

          {/* CTA */}
          <Link
            to="/ai-resume-generator"
            onClick={closeAll}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/30"
          >
            <Zap className="w-4 h-4" />
            Try AI Tools Free
          </Link>
        </div>
      </div>
    </>
  );
}
