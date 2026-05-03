import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import {
  BookOpen, CheckCircle2, Calendar, MessageSquare, Brain, Wand2,
  FileText, MonitorPlay, ShieldCheck, FilePlus, ArrowRight,
  Zap, Users, Star, ChevronRight
} from 'lucide-react';

const WORKFLOW_STEPS = [
  { step: '01', icon: BookOpen,     title: 'Generate Notes',    desc: 'Paste your lecture text or topic. Get structured, exam-ready notes instantly.', to: '/ai-notes-generator', color: 'from-indigo-500 to-violet-500' },
  { step: '02', icon: CheckCircle2, title: 'Practice with Quiz', desc: 'Turn those notes into MCQs and short-answer questions for active recall.', to: '/ai-quiz-generator',   color: 'from-emerald-500 to-teal-500' },
  { step: '03', icon: Calendar,     title: 'Plan Your Schedule', desc: 'Input your exam dates and get a personalised week-by-week study plan.', to: '/ai-study-planner',    color: 'from-amber-500 to-orange-500' },
  { step: '04', icon: MessageSquare,title: 'Chat with Your PDF', desc: 'Upload textbooks and research papers. Ask anything, get instant answers.', to: '/chat-pdf',            color: 'from-purple-500 to-pink-500' },
];

const CORE_TOOLS = [
  { icon: BookOpen,     label: 'AI Notes Generator',  desc: 'Struggling to make sense of your lecture recordings or dense textbook chapters? Our AI Notes Generator converts any raw text, topic, or study material into structured, exam-ready notes in seconds — formatted with headings, bullet points, and key definitions automatically highlighted.', problem: 'The Problem It Solves', problemText: 'You spend 2 hours making notes and still miss key concepts. This tool does it in 30 seconds.', to: '/ai-notes-generator',  color: 'from-indigo-500 to-violet-500' },
  { icon: CheckCircle2, label: 'AI Quiz Generator',   desc: 'Reading your notes twice is passive learning — it feels productive but doesn\'t build real memory. The AI Quiz Generator transforms your study material into MCQs, true/false, and short-answer questions that force active recall, the most effective study technique known to science.', problem: 'The Problem It Solves', problemText: 'You read the same chapter 3 times and still fail the test. Active recall via quizzes fixes this.', to: '/ai-quiz-generator',   color: 'from-emerald-500 to-teal-500' },
  { icon: Calendar,     label: 'AI Study Planner',    desc: 'When exam season hits, most students open a blank calendar and guess. Our AI Study Planner takes your exam dates, subjects, and current confidence level, then generates a week-by-week schedule that prioritises your weakest subjects without overwhelming you.', problem: 'The Problem It Solves', problemText: 'You don\'t know where to start when you have 6 subjects and 3 weeks. This creates your road map.', to: '/ai-study-planner',    color: 'from-amber-500 to-orange-500' },
  { icon: MessageSquare,label: 'Chat with PDF',       desc: 'Stop reading 300-page textbooks cover-to-cover hoping to find the answer. Chat with PDF lets you upload any academic document and ask it direct questions — ideal for literature reviews, research papers, case studies, and dense academic texts.', problem: 'The Problem It Solves', problemText: 'You have a 400-page textbook and 2 days left. Chat with PDF finds answers in seconds.', to: '/chat-pdf',            color: 'from-purple-500 to-pink-500' },
];

const ALL_TOOLS = [
  { icon: Brain,       label: 'AI Essay Writer',       desc: 'Structured, cited essays from any prompt.', to: '/ai-essay-writer',          color: 'from-blue-500 to-cyan-500' },
  { icon: Wand2,       label: 'Paraphrasing Tool',     desc: 'Rewrite text in 6 AI modes. Cite sources with original language.', to: '/tools/paraphrasing-tool', color: 'from-rose-500 to-pink-500' },
  { icon: ShieldCheck, label: 'Grammar Checker',       desc: 'AI-powered grammar and style correction.', to: '/tools/grammar-checker',    color: 'from-teal-500 to-emerald-500' },
  { icon: FileText,    label: 'AI Resume Builder',     desc: 'ATS-friendly resumes in minutes.', to: '/ai-resume-generator',        color: 'from-indigo-500 to-violet-500' },
  { icon: MonitorPlay, label: 'Presentation Builder',  desc: 'AI-generated slide outlines, beautifully structured.', to: '/presentation-generator',  color: 'from-amber-500 to-yellow-500' },
  { icon: BookOpen,    label: 'AI Text Summarizer',    desc: 'Long articles into concise, exam-ready notes.', to: '/ai-text-summarizer',   color: 'from-sky-500 to-blue-500' },
  { icon: Brain,       label: 'Homework Helper',       desc: 'Step-by-step solutions and explanations.', to: '/ai-homework-helper',       color: 'from-violet-500 to-purple-500' },
  { icon: FilePlus,    label: 'PDF Tools',             desc: 'Merge, split, compress and watermark PDFs.', to: '/free-pdf-tools',           color: 'from-rose-500 to-orange-500' },
];

const TESTIMONIALS = [
  { text: 'The AI Notes Generator saved my semester. I converted 4 hours of lecture recordings into structured notes in under a minute.', name: 'Priya S.', role: 'Engineering Student' },
  { text: 'Chat with PDF is unreal. I asked my 400-page textbook questions and got cited answers instantly. My exam prep dropped from 3 weeks to 5 days.', name: 'Aisha K.', role: 'Pre-Med Student' },
  { text: 'The AI Resume Builder got me 3 interview calls in a week. It knew exactly what recruiters want to see.', name: 'Marcus J.', role: 'MBA Graduate' },
];

export default function Home() {
  return (
    <div className="min-h-screen pt-16 pb-12 flex flex-col items-center overflow-hidden">
      <SEO
        title="Your AI Study Assistant — Free AI Tools for Students"
        canonical="/"
        description="StudentAI Tools is a focused AI Study Assistant for students. Generate notes, create quizzes, plan your study schedule, and chat with your textbooks — all free, no sign-up."
      />

      {/* ── HERO ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-8 mb-16 relative overflow-hidden">
        <div className="hero-grid absolute inset-0 -z-10" />
        <div className="hero-orb w-[500px] h-[350px] bg-indigo-500/20 -left-32 -top-16" style={{ animationDelay: '0s' }} />
        <div className="hero-orb w-[380px] h-[380px] bg-purple-500/15 right-0 top-8" style={{ animationDelay: '2.5s' }} />

        <div className="relative z-10 py-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700/50 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-8 animate-fade-in-up">
            <Zap className="w-4 h-4" />
            Built for students — 100% Free · No Login Required
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Your AI<br />
            <span className="text-shimmer">Study Assistant</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-500 dark:text-slate-300 mb-6 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Upload notes → Generate summaries → Practice quizzes → Plan your study schedule.
            <span className="block mt-1 font-semibold text-slate-700 dark:text-slate-200">Study smarter, not harder.</span>
          </p>

          {/* Workflow pill */}
          <div className="flex flex-wrap justify-center items-center gap-2 mb-10 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            {['📝 Upload Notes', '→', '🧠 Generate Summary', '→', '❓ Practice Quiz', '→', '📅 Plan Schedule'].map((s, i) => (
              s === '→'
                ? <ChevronRight key={i} className="w-4 h-4 text-slate-400 hidden sm:block" />
                : <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm">{s}</span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/ai-notes-generator" className="btn-primary btn-glow px-8 py-4 text-lg flex items-center gap-2 w-full sm:w-auto justify-center">
              <BookOpen className="w-5 h-5" /> Start with Notes AI
            </Link>
            <Link to="/free-tools" className="flex items-center gap-2 w-full sm:w-auto justify-center px-8 py-4 rounded-xl text-lg font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:-translate-y-0.5 transition-all shadow-sm">
              Explore All Tools <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {['100% Free', 'No Registration', 'Works on Mobile', 'Student Optimized', 'AdSense Safe'].map(b => (
              <div key={b} className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/60 backdrop-blur px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700/50 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />{b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4-STEP WORKFLOW ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">How StudentAI Works</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">A proven 4-step study system. Follow it once and you'll never study the old way again.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORKFLOW_STEPS.map((step) => (
            <Link key={step.step} to={step.to} className="group relative bg-white dark:bg-slate-800/60 p-7 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className={`absolute -right-8 -top-8 w-28 h-28 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-all`} />
              <div className="text-6xl font-extrabold text-slate-100 dark:text-slate-700/50 leading-none mb-3 tabular-nums">{step.step}</div>
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                <step.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all">Try it free <ArrowRight className="w-3 h-3" /></div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CORE 4 TOOLS SPOTLIGHT ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">The Core 4 Study Tools</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">These four tools, used together, cover 90% of what makes a successful student. Start here.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {CORE_TOOLS.map((tool) => (
            <div key={tool.to} className="group bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${tool.color}`} />
              <div className="p-8">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{tool.label}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4 text-sm">{tool.desc}</p>
                <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-4 mb-5">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{tool.problem}</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{tool.problemText}</p>
                </div>
                <Link to={tool.to} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${tool.color} text-white font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all`}>
                  Try it free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MORE TOOLS GRID ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">More Study Tools</h2>
          <Link to="/free-tools" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 group">
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ALL_TOOLS.map((tool) => (
            <Link key={tool.to} to={tool.to} className="group bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                <tool.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{tool.label}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { value: '20+', label: 'AI Study Tools', icon: Zap },
            { value: '100K+', label: 'Students Helped', icon: Users },
            { value: '0', label: 'Registration Required', icon: CheckCircle2 },
            { value: '24/7', label: 'Always Available', icon: Star },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-800/60 p-8 rounded-3xl text-center border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <s.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1 tabular-nums">{s.value}</div>
              <div className="text-slate-500 dark:text-slate-400 font-medium text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-20 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Loved by Students Worldwide</h2>
            <p className="text-slate-400">Real stories from real students.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md p-7 rounded-3xl border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {Array(5).fill(0).map((_, j) => <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-slate-300 italic leading-relaxed mb-5 text-sm">"{t.text}"</p>
                <div>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-slate-400 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full max-w-5xl mx-auto px-4 text-center mb-16">
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[3rem] p-12 md:p-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Ready to study smarter?</h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">Join thousands of students saving hours every week. 100% free, always.</p>
            <Link to="/ai-notes-generator" className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-extrabold px-10 py-4 rounded-2xl text-lg transition-all shadow-2xl hover:-translate-y-0.5">
              <BookOpen className="w-5 h-5" /> Start with AI Notes — Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
