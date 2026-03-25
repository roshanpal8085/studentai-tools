import SEO from '../components/SEO';

import { 
  FileText, MonitorPlay, Image as ImageIcon, LayoutTemplate, MessageSquare, 
  Mail, Zap, CheckCircle2, TrendingUp, Users, ShieldCheck, Search, 
  Calendar, Clock, Hash, Type, QrCode, Lock, Ruler, Percent, Flame,
  User, Lightbulb, Terminal, Timer, BookOpen, Brain, ListChecks, Quote, Calculator, FileEdit
} from 'lucide-react';

import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';

const allTools = [
  // Core AI Tools
  { name: 'AI Text Summarizer', description: 'Turn long articles and documents into concise, readable summaries.', icon: BookOpen, to: '/ai-text-summarizer', category: 'AI Tools' },
  { name: 'AI Resume Builder', description: 'Create professional, ATS-friendly resumes in seconds with AI.', icon: LayoutTemplate, to: '/ai-resume-generator', category: 'AI Tools' },
  { name: 'AI Homework Helper', description: 'Get instant help and explanations for any homework problem.', icon: Zap, to: '/ai-homework-helper', category: 'AI Tools' },
  { name: 'AI Essay Writer', description: 'Draft high-quality essays with proper citations and structure.', icon: FileText, to: '/ai-essay-writer', category: 'AI Tools' },
  { name: 'AI Study Planner', description: 'Generate personalized study schedules based on your exams.', icon: Calendar, to: '/ai-study-planner', category: 'AI Tools' },
  { name: 'AI Notes Generator', description: 'Turn your lecture recordings or text into concise notes.', icon: MessageSquare, to: '/ai-notes-generator', category: 'AI Tools' },
  { name: 'AI Quiz Generator', description: 'Create practice quizzes from your study material instantly.', icon: CheckCircle2, to: '/ai-quiz-generator', category: 'AI Tools' },
  { name: 'AI Assignment Generator', description: 'Generate structured assignments and rubrics for any topic.', icon: ListChecks, to: '/ai-assignment-generator', category: 'AI Tools' },
  { name: 'Chat with PDF', description: 'Upload books or papers and ask the AI questions about them.', icon: MessageSquare, to: '/chat-pdf', category: 'AI Tools' },
  { name: 'Presentation Builder', description: 'Generate complete, beautifully structured PowerPoint outlines.', icon: MonitorPlay, to: '/presentation-generator', category: 'AI Tools' },
  { name: 'AI Email Writer', description: 'Draft professional, perfectly toned emails for any situation.', icon: Mail, to: '/email-writer', category: 'AI Tools' },

  // Text & Writing Tools
  { name: 'Grammar Checker', description: 'Ensure your writing is flawless with our AI checker.', icon: ShieldCheck, to: '/tools/grammar-checker', category: 'Writing' },
  { name: 'Word Counter', description: 'Fast and accurate word and character counting tool.', icon: Type, to: '/tools/word-counter', category: 'Writing' },
  { name: 'Citation Generator', description: 'Perfect APA, MLA, and Chicago style citations instantly.', icon: Quote, to: '/tools/citation-generator', category: 'Writing' },
  { name: 'Essay Topic Generator', description: 'Beat writer\'s block with 10 fresh ideas for your topic.', icon: Lightbulb, to: '/tools/essay-topic-generator', category: 'Writing' },
  
  // Study & Productivity
  { name: 'Free Student Games', description: 'Take a productive study break with 12 free brain-training games.', icon: Flame, to: '/free-games', category: 'Study' },
  { name: 'Pomodoro Timer', description: 'Boost focus with 25-minute study sprints and breaks.', icon: BookOpen, to: '/tools/study-timer', category: 'Study' },
  { name: 'Exam Countdown', description: 'Track your deadlines in real-time. Never miss an exam.', icon: Timer, to: '/tools/exam-countdown', category: 'Study' },
  { name: 'Homework Planner', description: 'Organize your assignments and set priorities efficiently.', icon: ListChecks, to: '/tools/homework-planner', category: 'Study' },
  { name: 'Study Timetable', description: 'AI-generated personalized weekly study schedules.', icon: Calendar, to: '/tools/study-timetable-generator', category: 'Study' },
  { name: 'GPA Calculator', description: 'Calculate your semester and cumulative GPA accurately.', icon: Calculator, to: '/tools/gpa-calculator', category: 'Study' },
  { name: 'Practice Questions', description: 'Generate random practice questions to test your knowledge.', icon: Brain, to: '/tools/random-question-generator', category: 'Study' },
  
  // Free Utilities
  { name: 'QR Code Generator', description: 'Create free QR codes for links, text, and documents.', icon: QrCode, to: '/tools/qr-generator', category: 'Utilities' },
  { name: 'Image to PDF', description: 'Convert your photos into high-quality PDF documents.', icon: FileText, to: '/tools/image-to-pdf', category: 'Utilities' },
  { name: 'PDF Footer Editor', description: 'Stamp your name & enrollment number on every PDF page footer.', icon: FileEdit, to: '/tools/pdf-footer-editor', category: 'Utilities' },
  { name: 'Image Compressor', description: 'Reduce image file size without losing quality.', icon: ImageIcon, to: '/tools/image-compressor', category: 'Utilities' },
  { name: 'Unit Converter', description: 'Switch between metric and imperial units with ease.', icon: Ruler, to: '/total-unit-converter', category: 'Utilities' },
  { name: 'Password Generator', description: 'Generate secure, random passwords for your accounts.', icon: Lock, to: '/tools/password-generator', category: 'Utilities' },
  { name: 'Age Calculator', description: 'Find out exactly how old you are in days and months.', icon: Clock, to: '/tools/age-calculator', category: 'Utilities' },
  { name: 'Percent Calculator', description: 'Quickly find percentages for math and grades.', icon: Percent, to: '/tools/percentage-calculator', category: 'Utilities' },
  { name: 'Name Generator', description: 'Random names for creative projects and personas.', icon: User, to: '/tools/random-name-generator', category: 'Utilities' },
  { name: 'AI Prompt Gen', description: 'Master AI tools with perfectly engineered prompts.', icon: Terminal, to: '/tools/ai-prompt-generator', category: 'Utilities' },
  { name: 'Instagram Captions', description: 'Generate engaging hashtags and captions for social media.', icon: Hash, to: '/instagram-caption-generator', category: 'Utilities' },
];

const categories = ['All', 'AI Tools', 'Utilities', 'Writing', 'Study'];

const steps = [
  { title: 'Choose Your Tool', description: 'Browse our suite of 50+ free AI and utility tools. From resume builders to PDF converters, find exactly what you need.' },
  { title: 'Enter Your Input', description: 'Provide your topic, text, or file. Our tools are designed to work with just a few clicks—no complex setup required.' },
  { title: 'Download & Use', description: 'Get instant, high-quality AI-generated output. Copy, download, or share your results in seconds.' },
];

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

const Home = () => {
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
    <div className="min-h-screen pt-20 pb-12 flex flex-col items-center overflow-hidden">
      <SEO 
        title="Home" 
        description="Access free AI tools for students: resume generator, homework helper, essay writer, presentation builder, and PDF utilities to boost your productivity." 
      />

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16 mb-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full point-events-none -z-10" />
        <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
          Supercharge Your <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Student Life</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-300 mx-auto mb-12 leading-relaxed font-medium">
          The all-in-one platform integrating AI to generate stunning resumes, build presentations, craft clever captions, and master your PDFs.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search for AI tools (e.g. Resume, Essay, PDF...)"
            className="block w-full pl-14 pr-4 py-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-xl shadow-indigo-500/5 group-hover:shadow-indigo-500/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-4 flex items-center">
            <kbd className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-xs text-slate-400 font-medium">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/free-tools" className="w-full sm:w-auto bg-primary text-white hover:bg-indigo-700 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_8px_30px_rgb(79,70,229,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_40px_rgb(79,70,229,0.4)]">
            Explore 50+ Tools
          </Link>
          <Link to="/blog" className="w-full sm:w-auto bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-sm flex items-center justify-center gap-2">
            Read AI Blog <TrendingUp className="w-5 h-5" />
          </Link>
        </div>
        
        {/* Quick Stats below hero */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-500" /> 100% Free</div>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-500" /> No Registration</div>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-500" /> Student Optimized</div>
        </div>
      </section>

      {/* Ad Space Placeholder */}
      <div className="w-full max-w-4xl mx-auto h-24 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 text-sm mb-12">
        Ad Placement - Header
      </div>

      {/* Trending Tools Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-500">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Trending Now</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Free Web Games', desc: '12 awesome study break games.', icon: Flame, to: '/free-games', color: 'from-orange-400 to-rose-500' },
            { name: 'AI Essay Writer', desc: 'Draft high-quality essays fast.', icon: FileText, to: '/ai-essay-writer', color: 'from-blue-500 to-indigo-500' },
            { name: 'Chat with PDF', desc: 'Ask your textbooks questions.', icon: MessageSquare, to: '/chat-pdf', color: 'from-purple-500 to-pink-500' },
            { name: 'Grammar Checker', desc: 'Flawless writing instantly.', icon: ShieldCheck, to: '/tools/grammar-checker', color: 'from-emerald-400 to-teal-500' }
          ].map((tool, idx) => (
            <Link key={idx} to={tool.to} className="group glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-2 transition-all overflow-hidden relative">
              <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-10 group-hover:opacity-20 rounded-full blur-2xl transition-all`}></div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 relative z-10">{tool.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium relative z-10">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Tools for Academic Success</h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12">Everything you need to study faster, write better, and succeed—all in one place.</p>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat 
                  ? 'bg-primary text-white shadow-lg shadow-indigo-500/25 scale-105' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <Link key={tool.name} to={tool.to} className="group relative bg-white dark:bg-slate-800/50 p-8 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 border border-slate-100 dark:border-slate-700/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col h-full backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
                   <tool.icon className="h-24 w-24 text-indigo-50/50 dark:text-indigo-900/10" />
                </div>
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <tool.icon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
                    {tool.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">{tool.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed flex-grow text-lg relative z-10">{tool.description}</p>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No tools found</h3>
              <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or category filters.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="mt-6 text-primary font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full bg-slate-50 dark:bg-slate-900/50 py-24 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">How It Works</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Three simple steps to save hours of your time.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 dark:from-indigo-800 dark:via-purple-800 dark:to-indigo-800 -z-10 transform -translate-y-1/2 rounded-full border-dashed" border-style="dashed"></div>
            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-xl mb-6 ring-4 ring-white dark:ring-slate-900">
                  {idx + 1}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
           {stats.map((stat, idx) => (
             <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-3xl text-center border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
               <div className="mx-auto w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
                 <stat.icon className="h-6 w-6 text-primary" />
               </div>
               <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{stat.value}</div>
               <div className="text-slate-500 dark:text-slate-400 font-medium">{stat.name}</div>
             </div>
           ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full bg-slate-900 text-white py-24 my-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full point-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full point-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Loved by Students Worldwide</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Don't just take our word for it. Here's what your peers are saying.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl border border-slate-700">
                <div className="flex items-center gap-1 mb-6 text-yellow-400">
                  {Array(5).fill(0).map((_, i) => <Zap key={i} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="text-lg leading-relaxed text-slate-300 mb-8 font-medium italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.image} alt={testimonial.author} className="w-14 h-14 rounded-full border-2 border-indigo-500/30" />
                  <div>
                    <h4 className="font-bold text-white text-lg">{testimonial.author}</h4>
                    <span className="text-slate-400">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Another Ad Banner */}
      <div className="w-full py-10 flex justify-center">

      </div>
      
      {/* Call to action */}
      <section className="w-full max-w-5xl mx-auto px-4 text-center mt-10 mb-20 relative overflow-hidden md:overflow-visible">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3rem] transform rotate-1 opacity-20 dark:opacity-40 blur-lg"></div>
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-[3rem] p-12 md:p-20 shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)] border border-white dark:border-slate-700 relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Ready to study smarter?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">Join thousands of students saving hours every week using our AI suite and document tools. It's 100% free.</p>
          <Link to="/ai-resume-generator" className="inline-block bg-primary text-white hover:bg-indigo-600 px-12 py-5 rounded-full font-bold text-xl transition-all shadow-[0_8px_30px_rgb(79,70,229,0.3)] hover:-translate-y-1">
            Get Started For Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
