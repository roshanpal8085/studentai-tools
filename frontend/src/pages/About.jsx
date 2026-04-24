import { Helmet } from 'react-helmet-async';
import { GraduationCap, Heart, Zap, Globe, ShieldCheck, BookOpen, Users, Award, Target, TrendingUp, CheckCircle, Star, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { value: '50+', label: 'Free AI & Utility Tools', icon: Zap },
  { value: '2M+', label: 'Tool Uses Per Month', icon: TrendingUp },
  { value: '180+', label: 'Countries Reached', icon: Globe },
  { value: '4.8★', label: 'Average User Rating', icon: Star },
];

const coreValues = [
  {
    icon: Target, color: 'indigo', title: 'Student-First Mission',
    body: "Every product decision is filtered through a single question: 'Does this genuinely reduce a student's cognitive load?' We build tools that handle academic friction so students can focus on learning.",
  },
  {
    icon: BookOpen, color: 'sky', title: 'Pedagogical Integrity',
    body: "We design for learning, not for bypassing it. Our AI Homework Helper explains every reasoning step. Our Essay Writer helps structure arguments. AI should amplify understanding, not replace it.",
  },
  {
    icon: ShieldCheck, color: 'emerald', title: 'Privacy by Architecture',
    body: "Your documents, essays, and notes are never stored on our servers. All AI processing is session-scoped and purged on completion. We are funded by advertising — not by selling student data.",
  },
  {
    icon: Lightbulb, color: 'amber', title: 'Democratizing Access',
    body: "Students at under-resourced schools deserve the same tools as students at elite universities. Our 100% free model — supported by advertising — eliminates the financial barrier to world-class AI assistance.",
  },
];

const milestones = [
  { year: '2024', event: 'StudentAI Tools launched with core AI suite. Reached 50,000 users in 90 days purely through organic search.' },
  { year: '2025 Q1', event: 'Expanded to 30+ tools. Integrated the full PDF suite. Crossed 500,000 monthly active users.' },
  { year: '2025 Q3', event: 'Launched free Games & Brain Training. Added Citation Generator, Paraphrasing Tool, and AI Prompt Generator.' },
  { year: '2026', event: 'Serving 2M+ tool uses per month across 180+ countries. Maintaining 100% free access and expanding content quality.' },
];

const testimonials = [
  { quote: "I used the AI Study Planner to prepare for my GATE exam. The adaptive scheduling was a game changer — I went from struggling to passing in one attempt.", name: "Arjun S.", role: "M.Tech Student, IIT Bombay" },
  { quote: "The AI Essay Writer doesn't write essays for you — it teaches you how to structure arguments. I genuinely improved as a writer after one semester.", name: "Priya K.", role: "BA English, Delhi University" },
  { quote: "Our entire hostel group uses the free Homework Helper for Physics. It explains every step like a real professor. And it's completely free!", name: "Rahul M.", role: "Class 12 Student, Jaipur" },
];

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      <Helmet>
        <title>About Us — StudentAI Tools | Our Mission, Team &amp; Story</title>
        <meta name="description" content="Learn about the team behind StudentAI Tools — a curated directory of free AI tools built exclusively for students. Discover our mission, values, and commitment to making AI education accessible to everyone." />
        <link rel="canonical" href="https://studentaitools.in/about" />
      </Helmet>

      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* HERO */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-6 border border-indigo-200 dark:border-indigo-800">
            <GraduationCap className="w-4 h-4" />
            Established 2024 · India-Based · Student-Centric
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-none">
            We're on a Mission to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500">
              Democratize Academic AI
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
            StudentAI Tools is a free, curated platform of AI-powered tools built exclusively for students — from Class 10 to PhD. No subscriptions. No credit cards. No data harvesting.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 p-6 text-center bg-white/60 dark:bg-slate-900/60 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 mx-auto">
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1">{value}</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
            </div>
          ))}
        </div>

        {/* OUR STORY */}
        <div className="glass-card rounded-[3rem] shadow-xl border border-slate-200 dark:border-slate-800 p-8 md:p-16 mb-24 bg-white/60 dark:bg-slate-900/60">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">The Origin Story</h2>
            <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>In 2024, our founder — a software engineer and former university student — noticed a frustrating pattern: the most powerful AI tools for education were locked behind $20–$50/month subscriptions. Students at elite institutions with research grants could access them. Students at government colleges in smaller Indian cities could not.</p>
              <p>The irony was undeniable: the students who needed the most help — those without private tutors, expensive coaching centres, or academic mentors — were being systematically excluded from the AI revolution reshaping education globally.</p>
              <p><strong className="text-slate-900 dark:text-slate-200">StudentAI Tools was built to close that gap.</strong> By using modern web architecture, optimized AI API integrations, and an advertising-supported free model, we created a platform where every student — regardless of income, institution, or geography — can access professional-grade AI tools instantly in a browser, with zero signup required.</p>
              <p>Our content philosophy is equally deliberate. Every tool page, every blog article, and every feature is written to <em>teach students how to learn with AI</em>, not bypass learning with it. We follow Google's Helpful Content guidelines because our users deserve information that is genuinely useful — not SEO-optimized filler.</p>
            </div>
          </div>
        </div>

        {/* CORE VALUES */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-4">What We Stand For</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto">Our four core values guide every product, content, and technology decision we make.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {coreValues.map(({ icon: Icon, title, body }) => (
              <div key={title} className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-black text-xl text-slate-900 dark:text-white mb-3">{title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FOUNDER / TEAM (E-E-A-T) */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-12">The Team</h2>
          <div className="glass-card rounded-[3rem] border border-slate-200 dark:border-slate-800 p-8 md:p-14 bg-white/60 dark:bg-slate-900/60">
            <div className="flex flex-col md:flex-row items-start gap-10">
              <div className="flex-shrink-0">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-400 to-sky-500 flex items-center justify-center text-white font-black text-4xl shadow-xl">RP</div>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Roshan Pal</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-4">Founder &amp; Lead Engineer</p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-lg">A software engineer and former university student who experienced firsthand the gap between "premium AI tools" and what most students could actually afford. Built the first version of StudentAI Tools in 2024 to solve real academic pain points — starting with the AI Resume Builder and expanding to the full 50+ tool suite through continuous user feedback and research.</p>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Areas of Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {['Full-Stack Development', 'AI/ML Integration', 'SEO Architecture', 'UX for Education'].map(skill => (
                      <span key={skill} className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium border border-indigo-200 dark:border-indigo-800">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-12">Our Journey</h2>
          <div className="relative border-l-2 border-indigo-200 dark:border-indigo-800 pl-8 space-y-10 ml-4">
            {milestones.map(({ year, event }) => (
              <div key={year} className="relative">
                <div className="absolute -left-[2.85rem] top-1 w-5 h-5 rounded-full bg-indigo-500 border-4 border-white dark:border-slate-900 shadow-md" />
                <span className="inline-block px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-bold mb-2 border border-indigo-200 dark:border-indigo-800">{year}</span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{event}</p>
              </div>
            ))}
          </div>
        </div>

        {/* EDITORIAL STANDARDS */}
        <div className="glass-card rounded-[3rem] border border-slate-200 dark:border-slate-800 p-8 md:p-16 mb-24 bg-white/60 dark:bg-slate-900/60">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Award className="w-7 h-7" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Our Editorial &amp; Content Standards</h2>
            </div>
            <div className="space-y-5 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>Every article published on StudentAI Tools is written by experienced educators, content strategists, or software engineers with direct experience in educational technology. We do not publish AI-generated articles without thorough human review, editing, and original insight injection.</p>
              <p>Our content follows <strong className="text-slate-900 dark:text-slate-200">Google's Helpful Content guidelines</strong> — we write for students first and search engines second. If an article doesn't provide genuine value to a real student with a real academic problem, it doesn't get published.</p>
              <p>All product recommendations are based on independent evaluation. We do not accept paid placements that compromise our editorial integrity. When we recommend a tool, it's because our team has tested it and found it genuinely valuable for students.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {['Human-Reviewed Content', 'No Paid Placements', 'Student-First Writing'].map(label => (
                  <div key={label} className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-12">What Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name, role }) => (
              <div key={name} className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white/60 dark:bg-slate-900/60">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-5 italic">"{quote}"</p>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-sky-600 rounded-[3rem] p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10">
            <Users className="w-14 h-14 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-5xl font-black mb-6">Join 2 Million+ Students</h2>
            <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">Access 50+ free AI tools designed around real academic needs. No subscription. No signup. No data sold. Ever.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="inline-block px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl hover:scale-105 transition-transform shadow-xl text-lg">Explore Free Tools</Link>
              <Link to="/blog" className="inline-block px-10 py-5 bg-white/20 hover:bg-white/30 text-white font-black rounded-2xl hover:scale-105 transition-transform text-lg border border-white/30">Read Our Blog</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
