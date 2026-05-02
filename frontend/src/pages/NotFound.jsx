import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import {
  BookOpen, Brain, Calendar, FileText, MessageSquare,
  CheckCircle2, Wand2, ShieldCheck, ArrowRight, Home, Search
} from 'lucide-react';

const SUGGESTIONS = [
  {
    icon: BookOpen,
    label: 'AI Notes Generator',
    desc: 'Turn any topic or lecture into structured notes.',
    to: '/ai-notes-generator',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    icon: CheckCircle2,
    label: 'AI Quiz Generator',
    desc: 'Create practice quizzes from your study material.',
    to: '/ai-quiz-generator',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Calendar,
    label: 'AI Study Planner',
    desc: 'Generate a personalised study schedule for your exams.',
    to: '/ai-study-planner',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: MessageSquare,
    label: 'Chat with PDF',
    desc: 'Ask questions about any textbook or research paper.',
    to: '/chat-pdf',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Brain,
    label: 'AI Homework Helper',
    desc: 'Step-by-step explanations for any problem.',
    to: '/ai-homework-helper',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Wand2,
    label: 'Paraphrasing Tool',
    desc: 'Rewrite text in 6 AI modes to avoid plagiarism.',
    to: '/tools/paraphrasing-tool',
    color: 'from-rose-500 to-pink-500',
  },
];

export default function NotFound() {
  return (
    <div className="min-h-screen pt-16 pb-20 bg-slate-50 dark:bg-slate-900 flex flex-col items-center">
      <SEO
        title="Page Not Found — StudentAI Tools"
        description="This page has been removed or upgraded. Explore our core AI Study Tools — Notes Generator, Quiz Generator, Study Planner, and more."
        canonical="/404"
      />

      {/* ── Hero ── */}
      <section className="w-full max-w-3xl mx-auto px-4 text-center pt-20 pb-12">
        {/* Big 404 */}
        <div className="relative inline-block mb-6">
          <span className="text-[120px] md:text-[160px] font-extrabold text-indigo-100 dark:text-indigo-900/40 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-16 h-16 text-indigo-400 dark:text-indigo-500 opacity-70" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          This Tool Has Been Upgraded
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-3 leading-relaxed">
          We're constantly improving StudentAI Tools. Some low-value utilities have been
          replaced with <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          smarter, student-focused AI tools
          </span> that deliver real academic results.
        </p>
        <p className="text-base text-slate-400 dark:text-slate-500 mb-10">
          Try one of our core AI study tools below — they're free and built specifically for students.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <Link
            to="/ai-notes-generator"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all text-sm"
          >
            <BookOpen className="w-4 h-4" />
            Try AI Notes Generator
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:-translate-y-0.5 transition-all text-sm"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </section>

      {/* ── Suggestions Grid ── */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
            🎯 What Were You Looking For?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            These are our most popular AI Study Tools — better than anything that was here before.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SUGGESTIONS.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group flex flex-col bg-white dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden relative"
            >
              <div className={`absolute -right-8 -top-8 w-28 h-28 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-all duration-300`} />
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                <tool.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{tool.label}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-grow">{tool.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-xs font-bold opacity-0 group-hover:opacity-100 group-hover:gap-2 transition-all">
                Open tool <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* ── All Tools CTA ── */}
        <div className="text-center mt-12">
          <Link
            to="/free-tools"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline group"
          >
            View all AI Study Tools <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ── Removed Tool Notice ── */}
      <section className="w-full max-w-2xl mx-auto px-4 pb-10">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-2xl p-6 text-center">
          <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
            <span className="font-bold">Looking for a specific tool?</span> Some general utilities (speed tests, calculators, games) have been removed to keep
            StudentAI focused on what helps you most: studying, writing, and academic success.
          </p>
          <Link
            to="/contact"
            className="inline-block mt-3 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
          >
            Request a tool via Contact →
          </Link>
        </div>
      </section>
    </div>
  );
}
