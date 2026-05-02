import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import {
  BookOpen, CheckCircle2, Calendar, MessageSquare, Brain, Wand2,
  FileText, MonitorPlay, ShieldCheck, ArrowRight,
  Zap, Star, ListChecks,
  FilePlus, Scissors, UploadCloud, Type as TypeIcon, Trash2, FileEdit, Image as ImageIcon
} from 'lucide-react';

const SECTIONS = [
  {
    id: 'study-notes',
    emoji: '📚',
    title: 'Study & Prep',
    subtitle: 'Capture knowledge faster, understand deeper',
    color: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-200 dark:border-indigo-700/40',
    tools: [
      {
        icon: BookOpen,
        label: 'AI Notes Generator',
        to: '/ai-notes-generator',
        who: 'Every student who attends lectures or reads textbooks',
        when: 'After class, before revision, when starting a new chapter',
        scenario: 'You just sat through a 90-minute Chemistry lecture on Organic Reactions. Instead of spending 3 hours rewriting your scribbled notes, paste the key content into AI Notes Generator. Within seconds, you receive a clean, structured study guide with headings, definitions, and exam-likely concepts highlighted.',
        tip: 'Works best when you paste 200–800 words of raw text. Add your subject for more targeted notes.',
      },
      {
        icon: CheckCircle2,
        label: 'AI Quiz Generator',
        to: '/ai-quiz-generator',
        who: 'Students preparing for exams, tests, or assessments',
        when: '3–7 days before your exam for maximum active recall benefit',
        scenario: 'Paste your History notes on World War II. Select "Multiple Choice + Short Answer" and difficulty "Hard". The AI creates 15 targeted practice questions — complete with explanations for wrong answers. Testing yourself this way boosts retention by up to 50% compared to re-reading.',
        tip: 'Generate fresh quiz sets daily on the same topic. Spaced repetition through new question formats deepens memory.',
      },
      {
        icon: Calendar,
        label: 'AI Study Planner',
        to: '/ai-study-planner',
        who: 'Students with multiple exams, tight deadlines, or poor time management',
        when: '2–4 weeks before your exam period begins',
        scenario: 'You have 6 exams across 14 days. Enter each exam date, the subject, and your current confidence level (1–10). The AI Study Planner allocates daily study blocks — giving more time to your weakest subject (say, Statistics at 3/10) and maintenance sessions for your strongest (say, English at 8/10). The result: a realistic, balanced schedule you can actually follow.',
        tip: 'Update your confidence scores weekly as you improve. The plan becomes more accurate the more you interact with it.',
      },
      {
        icon: MessageSquare,
        label: 'Chat with PDF',
        to: '/chat-pdf',
        who: 'Students researching, reading textbooks, or reviewing case studies',
        when: 'Before an exam when you need specific answers fast',
        scenario: 'You have a 400-page Economics textbook and your exam covers 6 chapters. Upload the PDF and ask: "What are the three main causes of market failure according to Chapter 4?" You get a direct, cited answer in under 10 seconds — no more skimming.',
        tip: 'Ask specific questions rather than vague ones. "Explain Keynesian economics" is good; "tell me everything" is too broad.',
      },
      {
        icon: Zap,
        label: 'AI Homework Helper',
        to: '/ai-homework-helper',
        who: 'Students stuck on complex problems or concepts',
        when: 'When you hit a roadblock and need a step-by-step breakdown',
        scenario: 'You\'re stuck on a difficult calculus problem at 11 PM and your professor isn\'t available. Enter the problem into the AI Homework Helper. Instead of just giving you the answer, it breaks down the logic step-by-step, explaining the exact formula used at each stage so you actually learn how to solve it.',
        tip: 'Ask the AI to explain the concept to a 5-year-old if you are completely lost. Simplicity builds foundation.',
      },
      {
        icon: BookOpen,
        label: 'AI Text Summarizer',
        to: '/ai-text-summarizer',
        who: 'Students dealing with massive reading loads',
        when: 'Before seminars or when compiling literature reviews',
        scenario: 'Your professor assigned a dense 30-page research paper for tomorrow\'s seminar. Paste the text into the Summarizer, set the length to "Medium", and get a concise overview of the methodology, key findings, and conclusion in 3 paragraphs.',
        tip: 'Use the summarizer to verify if a paper is worth reading in full before dedicating 2 hours to it.',
      }
    ],
  },
  {
    id: 'writing-projects',
    emoji: '✍️',
    title: 'Writing & Projects',
    subtitle: 'Write better, present confidently, apply successfully',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-700/40',
    tools: [
      {
        icon: Brain,
        label: 'AI Essay Writer',
        to: '/ai-essay-writer',
        who: 'Students struggling with writer\'s block or structure',
        when: 'When starting a new essay or needing a solid first draft outline',
        scenario: 'You have to write a 1500-word essay on the impact of the Industrial Revolution, but you\'re staring at a blank page. Enter your topic and requirements. The AI generates a structured, academic draft with a clear thesis, topic sentences, and logical flow. Now you have a strong foundation to edit and expand upon.',
        tip: 'Use the output as a structural guide. Always inject your own critical analysis and peer-reviewed sources.',
      },
      {
        icon: ListChecks,
        label: 'Assignment Generator',
        to: '/ai-assignment-generator',
        who: 'Students needing structured reports and assignments',
        when: 'When formatting long-form academic work',
        scenario: 'You need to structure a lab report on osmosis. Input your experiment details and the tool will structure the exact format required: Abstract, Methodology, Results, Discussion, and Conclusion, ensuring you don\'t miss any critical sections.',
        tip: 'Specify your academic level (e.g., Undergraduate vs High School) for the appropriate tone and depth.',
      },
      {
        icon: MonitorPlay,
        label: 'Presentation Builder',
        to: '/presentation-generator',
        who: 'Students with seminar presentations, project defences, or class assignments',
        when: '3–5 days before your presentation date',
        scenario: 'Your professor assigned a 10-slide presentation on Climate Change and Renewable Energy. Enter your topic, key points, and audience (undergraduate). The Presentation Builder generates a complete slide-by-slide outline with talking points, data suggestions, and a logical narrative arc — so you spend your time practising, not designing from scratch.',
        tip: 'Use the generated outline as a skeleton. Add your own research, examples, and personal perspective to make it authentic.',
      },
      {
        icon: FileText,
        label: 'AI Resume Builder',
        to: '/ai-resume-generator',
        who: 'Students applying for internships, jobs, or graduate programs',
        when: '2 weeks before application deadlines',
        scenario: 'You did 3 months of volunteer work, completed 2 online certifications, and managed a college project — but you don\'t know how to make these sound impressive on paper. The AI Resume Builder transforms your raw experiences into ATS-optimised bullet points that highlight real impact. "Managed social media" becomes "Grew Instagram engagement by 40% in one semester through a video-first strategy."',
        tip: 'Tailor your resume for each job description. Use our tool to regenerate bullet points that match specific role keywords.',
      },
      {
        icon: Wand2,
        label: 'Paraphrasing Tool',
        to: '/tools/paraphrasing-tool',
        who: 'Students writing assignments, reports, or essays',
        when: 'When you want to use a source\'s idea without copying exact wording',
        scenario: 'You\'ve found a perfect paragraph in a journal article, but you can\'t quote it verbatim in your essay. Paste it into the Paraphrasing Tool, choose "Academic" mode, and get a rewritten version that expresses the same idea in original language — maintaining your academic integrity.',
        tip: 'Always review the paraphrased output and add your own analysis. Paraphrasing changes words; your insight adds value.',
      },
      {
        icon: ShieldCheck,
        label: 'Grammar Checker',
        to: '/tools/grammar-checker',
        who: 'Every student submitting written work',
        when: 'Final review before any submission',
        scenario: 'Your essay is written but you\'re not confident about commas after introductory clauses and passive voice usage. Paste it into the Grammar Checker — it flags each issue, explains why it\'s a problem, and suggests the correction. Your essay goes from a B+ draft to an A-worthy submission.',
        tip: 'Run it after you\'ve finished writing, not during. Editing while writing breaks your flow.',
      }
    ],
  },
  {
    id: 'pdf-tools',
    emoji: '📄',
    title: 'PDF Toolkit',
    subtitle: 'Manage, edit, and convert documents freely',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-700/40',
    tools: [
      {
        icon: FilePlus,
        label: 'Merge PDF',
        to: '/tools/merge-pdf',
        who: 'Students compiling final submissions',
        when: 'When combining essays, title pages, and appendices',
        scenario: 'You have a title page in Word, an essay in Google Docs, and an appendix scanned from a textbook. Convert them all to PDF and use this tool to seamlessly combine them into a single, cohesive submission file.',
        tip: 'Ensure all pages are oriented correctly before merging.',
      },
      {
        icon: Scissors,
        label: 'Split PDF',
        to: '/tools/split-pdf',
        who: 'Students dealing with massive textbook PDFs',
        when: 'When extracting specific chapters for a study session',
        scenario: 'Your professor uploaded a 500-page textbook, but you only need Chapter 4 for this week\'s assignment. Use Split PDF to extract pages 45-80, creating a lightweight file that\'s easy to read and annotate.',
        tip: 'Splitting large files makes them easier to email and upload to LMS platforms.',
      },
      {
        icon: UploadCloud,
        label: 'Compress PDF',
        to: '/tools/compress-pdf',
        who: 'Students facing file size limits on university portals',
        when: 'Before uploading large assignments or portfolios',
        scenario: 'You\'ve finished your design portfolio, but the PDF is 25MB and Canvas only accepts 10MB. Run it through our compressor to reduce the size by up to 80% without losing readable quality.',
        tip: 'Always double-check image clarity after compression if your assignment is highly visual.',
      },
      {
        icon: FileEdit,
        label: 'PDF Footer Editor',
        to: '/tools/pdf-footer-editor',
        who: 'Students adhering to strict university formatting guidelines',
        when: 'Before final submission of multi-page assignments',
        scenario: 'Your syllabus explicitly states: "Every page must have your Student ID in the footer." Instead of going back to Word and re-exporting, use the Footer Editor to instantly stamp your ID across all 50 pages of your PDF.',
        tip: 'You can also add page numbers simultaneously.',
      },
      {
        icon: ImageIcon,
        label: 'Image to PDF',
        to: '/tools/image-to-pdf',
        who: 'Students submitting handwritten assignments or diagrams',
        when: 'When digitising physical homework',
        scenario: 'You\'ve drawn complex circuit diagrams for Physics. Take photos with your phone, upload the JPGs to this tool, and convert them into a single, professional PDF document ready for submission.',
        tip: 'Ensure good lighting and high contrast when taking photos of handwritten work.',
      },
      {
        icon: FileText,
        label: 'PDF to Word',
        to: '/tools/pdf-to-word',
        who: 'Students needing to edit read-only documents',
        when: 'When you need to copy or alter locked PDF text',
        scenario: 'You received a PDF syllabus or worksheet but need to edit the text directly for your own notes. Convert the PDF back into an editable Word document instantly, preserving the layout and fonts.',
        tip: 'Best used on text-heavy PDFs rather than scanned images.',
      }
    ]
  }
];

const WORKFLOW = [
  { step: 1, icon: BookOpen,     label: 'Generate Notes',     desc: 'Convert raw material into structured study notes.', to: '/ai-notes-generator' },
  { step: 2, icon: CheckCircle2, label: 'Create a Quiz',      desc: 'Test yourself with AI-generated practice questions.', to: '/ai-quiz-generator' },
  { step: 3, icon: Calendar,     label: 'Plan Your Week',     desc: 'Build a balanced schedule around your exam dates.', to: '/ai-study-planner' },
  { step: 4, icon: Wand2,        label: 'Revise & Paraphrase',desc: 'Consolidate learning and write with original language.', to: '/tools/paraphrasing-tool' },
];

export default function FreeUtilities() {
  return (
    <div className="min-h-screen pt-20 pb-20 bg-slate-50 dark:bg-slate-900">
      <SEO
        title="12 Premium AI Study Tools for Students — Free & Practical Guide"
        canonical="/free-tools"
        description="Discover the ultimate 12 premium free AI tools for students. Structured by study workflow: notes, quizzes, planning, and writing — each with real use cases and tips."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HERO ── */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700/50 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-6">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            12 Premium AI Tools · No Registration Required
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
            The Ultimate AI Study Arsenal
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            A practical guide to the 12 most powerful free AI tools on StudentAI — organised by how you actually study. Each tool is explained with a real student scenario, so you know exactly when and how to use it.
          </p>
        </div>

        {/* ── INTRO ── */}
        <div className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-8 mb-14 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Why We Only Built 12 Tools</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Most websites offer dozens of generic calculators and gimmicky generators that provide zero academic value. We took a different approach. We deleted the noise and focused entirely on the <strong>12 core challenges</strong> students face: reading dense texts, retaining information, planning schedules, and writing academic papers.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            The tools on this page are not shortcuts. They are <strong className="text-slate-900 dark:text-white">multipliers</strong>. They handle the time-consuming mechanical parts of studying — formatting notes, creating questions, structuring essays — so you can focus entirely on understanding and applying the material.
          </p>
        </div>

        {/* ── WORKFLOW ── */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">The 4-Step AI Study Workflow</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Follow this sequence for any subject. It works whether you have 3 weeks or 3 days before your exam.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WORKFLOW.map((w) => (
              <Link key={w.step} to={w.to} className="group bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="text-4xl font-extrabold text-indigo-100 dark:text-indigo-900/60 leading-none mb-2">{String(w.step).padStart(2,'0')}</div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform">
                  <w.icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{w.label}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{w.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all">Open <ArrowRight className="w-3 h-3" /></div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── TOOL SECTIONS ── */}
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="mb-16">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-6 ${section.bg} border ${section.border}`}>
              <span>{section.emoji}</span>
              <span className="text-slate-700 dark:text-slate-200">{section.title}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">{section.title}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">{section.subtitle}</p>

            <div className="space-y-6">
              {section.tools.map((tool) => (
                <div key={tool.to} className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${section.color}`} />
                  <div className="p-7">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                          <tool.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tool.label}</h3>
                      </div>
                      <Link to={tool.to} className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${section.color} text-white font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all flex-shrink-0`}>
                        Open Tool <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div className={`rounded-2xl p-4 ${section.bg} border ${section.border}`}>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">👤 Who Should Use This</p>
                        <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{tool.who}</p>
                      </div>
                      <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600/40">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">⏰ When to Use It</p>
                        <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{tool.when}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-5 mb-4 border border-slate-200 dark:border-slate-600/40">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">📖 Real Student Scenario</p>
                      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{tool.scenario}</p>
                    </div>

                    <div className="flex items-start gap-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700/40">
                      <Zap className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-indigo-700 dark:text-indigo-300"><strong>Pro Tip:</strong> {tool.tip}</p>
                    </div>

                    <Link to={tool.to} className={`mt-5 sm:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${section.color} text-white font-bold text-sm shadow-md`}>
                      Open Tool <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* ── FAQ ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Are all these 12 tools really free?', a: 'Yes. Every premium tool on StudentAI is 100% free with no credit card, no account creation, and no hidden usage limits. The site is supported by non-intrusive advertising, which keeps everything free for students.' },
              { q: 'Why only 12 tools?', a: 'Quality over quantity. We removed dozens of low-value, generic calculators to focus exclusively on building the 12 most powerful AI study tools that actually help you get better grades and save time.' },
              { q: 'Is using AI tools considered cheating?', a: 'No — as long as you use them as study aids, not as a replacement for your own thinking. Using AI to generate notes, quiz yourself, or structure an essay is equivalent to using a calculator or a tutor. You are still responsible for understanding and producing the final work.' },
              { q: 'Do these tools work on mobile?', a: 'All tools are fully mobile-responsive and work in any modern browser — Chrome, Safari, Firefox. No app installation required.' },
              { q: 'Which tool should I start with?', a: 'Start with the AI Notes Generator if you have study material to process. Start with the AI Study Planner if you have an exam coming up. Start with the AI Quiz Generator if you want to test what you already know.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Q: {faq.q}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="text-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-white mb-3">Ready to study smarter?</h2>
            <p className="text-white/80 mb-7">Pick your first tool and start in 30 seconds. No signup needed.</p>
            <Link to="/ai-notes-generator" className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-extrabold px-8 py-4 rounded-2xl text-base transition-all shadow-xl hover:-translate-y-0.5">
              <BookOpen className="w-5 h-5" /> Start with AI Notes Generator
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
