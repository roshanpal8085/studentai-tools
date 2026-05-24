import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap, Menu, X, Search, ChevronDown,
  FileText, Brain, MessageSquare, MonitorPlay,
  ShieldCheck, Zap, BookOpen, ListChecks, Calendar, CheckCircle2, Wand2,
  FilePlus, Scissors, UploadCloud, Type as TypeIcon, Trash2, FileEdit, Image as ImageIcon
} from 'lucide-react';

const NAV_DROPDOWNS = [
  {
    label: 'Study & Prep',
    items: [
      { label: 'AI Notes Generator',    path: '/ai-notes-generator',     icon: BookOpen,      desc: 'Turn lectures into structured notes' },
      { label: 'AI Quiz Generator',     path: '/ai-quiz-generator',      icon: CheckCircle2,  desc: 'Practice quizzes from any material' },
      { label: 'AI Study Planner',      path: '/ai-study-planner',       icon: Calendar,      desc: 'Personalised exam schedules' },
      { label: 'Chat with PDF',         path: '/chat-pdf',               icon: MessageSquare, desc: 'Ask your textbooks anything' },
      { label: 'Homework Helper',       path: '/ai-homework-helper',     icon: Zap,           desc: 'Step-by-step problem explanations' },
      { label: 'AI Text Summarizer',    path: '/ai-text-summarizer',     icon: BookOpen,      desc: 'Long articles into concise notes' },
    ],
  },
  {
    label: 'Writing & Projects',
    wide: true,
    items: [
      { label: 'AI Essay Writer',       path: '/ai-essay-writer',        icon: Brain,         desc: 'Structured essays instantly' },
      { label: 'Assignment Generator',  path: '/ai-assignment-generator',icon: ListChecks,    desc: 'Structured assignments in seconds' },
      { label: 'Presentation Builder',  path: '/presentation-generator', icon: MonitorPlay,   desc: 'Beautiful slide decks with AI' },
      { label: 'AI Resume Builder',     path: '/ai-resume-generator',    icon: FileText,      desc: 'ATS-friendly resumes in seconds' },
      { label: 'Paraphrasing Tool',     path: '/tools/paraphrasing-tool',icon: Wand2,         desc: 'Rewrite text in 6 AI modes' },
      { label: 'Grammar Checker',       path: '/tools/grammar-checker',  icon: ShieldCheck,   desc: 'Flawless writing guaranteed' },
    ],
  },
  {
    label: 'PDF Tools',
    wide: true,
    items: [
      { label: 'Merge PDF',             path: '/tools/merge-pdf',        icon: FilePlus,      desc: 'Combine multiple PDFs into one' },
      { label: 'Split PDF',             path: '/tools/split-pdf',        icon: Scissors,      desc: 'Extract specific page ranges' },
      { label: 'Compress PDF',          path: '/tools/compress-pdf',     icon: UploadCloud,   desc: 'Reduce file size, keep quality' },
      { label: 'Add Watermark',         path: '/tools/pdf-watermark',    icon: TypeIcon,      desc: 'Stamp text on all pages' },
      { label: 'Delete Pages',          path: '/tools/delete-pdf-pages', icon: Trash2,        desc: 'Remove unwanted pages' },
      { label: 'PDF Footer Editor',     path: '/tools/pdf-footer-editor',icon: FileEdit,      desc: 'Add name & enrollment number' },
      { label: 'Image to PDF',          path: '/tools/image-to-pdf',     icon: ImageIcon,     desc: 'Convert photos to PDF' },
    ]
  }
];

const SEARCH_SHORTCUTS = [
  { label: 'AI Notes Generator',    path: '/ai-notes-generator' },
  { label: 'AI Quiz Generator',     path: '/ai-quiz-generator' },
  { label: 'AI Study Planner',      path: '/ai-study-planner' },
  { label: 'Chat with PDF',         path: '/chat-pdf' },
  { label: 'Homework Helper',       path: '/ai-homework-helper' },
  { label: 'Text Summarizer',       path: '/ai-text-summarizer' },
  { label: 'AI Essay Writer',       path: '/ai-essay-writer' },
  { label: 'Assignment Generator',  path: '/ai-assignment-generator' },
  { label: 'Presentation Builder',  path: '/presentation-generator' },
  { label: 'Resume AI',             path: '/ai-resume-generator' },
  { label: 'Paraphrasing Tool',     path: '/tools/paraphrasing-tool' },
  { label: 'Grammar Checker',       path: '/tools/grammar-checker' },
  { label: 'Merge PDF',             path: '/tools/merge-pdf' },
  { label: 'Compress PDF',          path: '/tools/compress-pdf' },
  { label: 'Image to PDF',          path: '/tools/image-to-pdf' },
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

  useEffect(() => {
    let prevScrollPos = window.scrollY;

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Handle styling based on scroll position
      setScrolled(currentScrollPos > 20);

      // Visibility logic
      if (currentScrollPos <= 50) {
        // Always show at the top
        setVisible(true);
      } else {
        // Determine direction: true if scrolling UP
        const isScrollingUp = currentScrollPos < prevScrollPos;
        setVisible(isScrollingUp);
        
        if (!isScrollingUp) {
          setActiveDropdown(null);
        }
      }

      // Update previous position for next event
      prevScrollPos = currentScrollPos;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }
      if (e.key === 'Escape') { setSearchOpen(false); setActiveDropdown(null); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const closeAll = () => { setIsOpen(false); setActiveDropdown(null); setSearchOpen(false); };
  const handleSearchNavigate = (path) => { navigate(path); setSearchOpen(false); setSearchQuery(''); };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'} ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border-b border-white/20 dark:border-slate-700/50' : 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/10 dark:border-slate-800/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link to="/" onClick={closeAll} className="flex items-center gap-2 flex-shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white hidden sm:block">
                StudentAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Tools</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_DROPDOWNS.map((group) => (
                <div key={group.label} className="relative" onMouseEnter={() => setActiveDropdown(group.label)} onMouseLeave={() => setActiveDropdown(null)}>
                  <button className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${activeDropdown === group.label ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    {group.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === group.label ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`absolute top-full left-0 pt-2 transition-all duration-200 ${activeDropdown === group.label ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                    <div className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-slate-300/30 dark:shadow-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 p-3 ${group.wide ? 'min-w-[540px] grid grid-cols-2 gap-x-2' : 'min-w-[280px]'}`}>
                      {group.items.map((item) => (
                        <Link key={item.label} to={item.path} onClick={closeAll} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group/item transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 group-hover/item:bg-indigo-500 transition-all">
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
              <Link to="/blog" onClick={closeAll} className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Blog</Link>
              <Link to="/free-tools" onClick={closeAll} className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">All Tools</Link>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm">
                <Search className="w-4 h-4" />
                <span className="hidden md:block text-sm">Search tools...</span>
                <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 text-[10px] font-medium">⌘K</kbd>
              </button>
              <Link to="/ai-notes-generator" onClick={closeAll} className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 active:scale-95">
                <Zap className="w-4 h-4" /> Start Studying
              </Link>
              <button className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4" onClick={(e) => { if (e.target === e.currentTarget) { setSearchOpen(false); setSearchQuery(''); } }}>
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <Search className="w-5 h-5 text-slate-400" />
              <input ref={searchRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Search study tools — "Notes AI, Quiz, Grammar..."' className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none text-base" />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div className="py-2 max-h-72 overflow-y-auto">
              {filteredSearch.length > 0 ? filteredSearch.map((item) => (
                <button key={item.path} onClick={() => handleSearchNavigate(item.path)} className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group transition-colors">
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

      {/* Mobile Drawer Overlay */}
      <div className={`fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)} />

      {/* Mobile Drawer */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-slate-900 shadow-2xl z-50 lg:hidden transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="font-extrabold text-slate-900 dark:text-white text-lg">Menu</span>
            <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
          </div>
          <button onClick={() => { setIsOpen(false); setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mb-4 text-sm">
            <Search className="w-4 h-4" /><span>Search tools...</span>
          </button>
          {NAV_DROPDOWNS.map((group) => (
            <div key={group.label} className="mb-2">
              <button onClick={() => setMobileExpanded(mobileExpanded === group.label ? null : group.label)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm">
                {group.label}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileExpanded === group.label ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${mobileExpanded === group.label ? 'max-h-[600px]' : 'max-h-0'}`}>
                <div className="pl-3 pt-1 space-y-1">
                  {group.items.map((item) => (
                    <Link key={item.label} to={item.path} onClick={closeAll} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                      <item.icon className="w-4 h-4 flex-shrink-0" />{item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <Link to="/blog" onClick={closeAll} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mb-1">Blog</Link>
          <Link to="/free-tools" onClick={closeAll} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mb-4">All Tools</Link>
          <Link to="/ai-notes-generator" onClick={closeAll} className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/30">
            <Zap className="w-4 h-4" />Start Studying Free
          </Link>
        </div>
      </div>
    </>
  );
}
