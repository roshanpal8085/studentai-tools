import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { 
  Calculator, Type, FileText, CheckCircle, Clock, 
  QrCode, Lock, Ruler, Percent, User, Lightbulb, 
  Terminal, Timer, BookOpen, Brain, ListChecks, Quote, ShieldCheck
} from 'lucide-react';

const utilityCategories = [
  {
    title: 'Text & Writing Tools',
    icon: <Type className="w-6 h-6 text-indigo-500" />,
    tools: [
      { name: 'Word & Character Counter', path: '/tools/word-counter', desc: 'Instantly count words, characters, sentences, and reading time.' },
      { name: 'AI Text Summarizer', path: '/ai-text-summarizer', desc: 'Turn long articles and documents into concise, readable summaries.' },
      { name: 'Grammar Checker', path: '/tools/grammar-checker', desc: 'Find and fix grammatical errors in your essays using AI.' },
      { name: 'Citation Generator', path: '/tools/citation-generator', desc: 'Generate APA, MLA, and Chicago style citations in seconds.' },
      { name: 'Essay Topic Generator', path: '/tools/essay-topic-generator', desc: 'Get 10 fresh essay ideas tailored to your subject.' },
      { name: 'Random Name Generator', path: '/tools/random-name-generator', desc: 'Generate names for creative projects and personas.' },
    ]
  },
  {
    title: 'Math & Calculators',
    icon: <Calculator className="w-6 h-6 text-emerald-500" />,
    tools: [
      { name: 'GPA Calculator', path: '/tools/gpa-calculator', desc: 'Calculate your semester or cumulative GPA easily.' },
      { name: 'Percentage Calculator', path: '/tools/percentage-calculator', desc: 'Quick percentage calculations for grades and math.' },
      { name: 'Age Calculator', path: '/tools/age-calculator', desc: 'Calculate exact age in years, months, and days.' },
      { name: 'Unit Converter', path: '/total-unit-converter', desc: 'Switch between metric and imperial units with ease.' },
    ]
  },
  {
    title: 'Productivity & Study Tools',
    icon: <Clock className="w-6 h-6 text-amber-500" />,
    tools: [
      { name: 'Pomodoro Study Timer', path: '/tools/study-timer', desc: 'Boost focus with 25-minute study sprints and breaks.' },
      { name: 'Exam Countdown', path: '/tools/exam-countdown', desc: 'Track days remaining until your big exams.' },
      { name: 'Homework Planner', path: '/tools/homework-planner', desc: 'Organize your school assignments and deadlines.' },
      { name: 'Timetable Generator', path: '/tools/study-timetable-generator', desc: 'AI-generated personalized weekly study schedules.' },
      { name: 'Random Question Gen', path: '/tools/random-question-generator', desc: 'Test your knowledge with random practice questions.' },
    ]
  },
  {
    title: 'Media & Security Utilities',
    icon: <ShieldCheck className="w-6 h-6 text-rose-500" />,
    tools: [
      { name: 'QR Code Generator', path: '/tools/qr-generator', desc: 'Create free QR codes for links and documents.' },
      { name: 'Image to PDF', path: '/tools/image-to-pdf', desc: 'Convert your photos into high-quality PDF documents.' },
      { name: 'PDF to Word', path: '/tools/pdf-to-word', desc: 'Extract text from PDFs to editable documents instantly.' },
      { name: 'Image Compressor', path: '/tools/image-compressor', desc: 'Reduce image file size without losing quality.' },
      { name: 'Password Generator', path: '/tools/password-generator', desc: 'Generate secure, random passwords for your accounts.' },
      { name: 'AI Prompt Generator', path: '/tools/ai-prompt-generator', desc: 'Master AI tools with perfectly engineered prompts.' },
    ]
  }
];

const FreeUtilities = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Free Utility Tools for Students" 
        description="Access 30+ free AI and utility tools for students: word counters, GPA calculators, Pomodoro timers, and more. Boost your academic productivity today." 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Free Utilities <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-sky-500">& Calculators</span></h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A massive collection of completely free online tools designed to save students time on homework, writing, and calculations. No signup required.
          </p>
        </div>

        <div className="space-y-16">
          {utilityCategories.map((category, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3 mb-8 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{category.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools.map((tool, tIdx) => (
                  <Link 
                    key={tIdx} 
                    to={tool.path}
                    className="group block p-6 rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all h-full flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {tool.name}
                      </h3>
                      <CheckCircle className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-grow">
                      {tool.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FreeUtilities;
