import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, CheckCircle2, Calendar, MessageSquare, Brain, Wand2, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-14 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-slate-900 dark:text-white mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span>StudentAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Tools</span></span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Your AI Study Assistant. Built for students — free, focused, and designed to help you study smarter, write better, and succeed academically.
            </p>
          </div>

          {/* AI Study Tools */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Core Study Tools</h3>
            <ul className="space-y-2.5">
              <li><Link to="/ai-notes-generator" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><BookOpen className="w-3.5 h-3.5" />AI Notes Generator</Link></li>
              <li><Link to="/ai-quiz-generator" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><CheckCircle2 className="w-3.5 h-3.5" />AI Quiz Generator</Link></li>
              <li><Link to="/ai-study-planner" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Calendar className="w-3.5 h-3.5" />AI Study Planner</Link></li>
              <li><Link to="/chat-pdf" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><MessageSquare className="w-3.5 h-3.5" />Chat with PDF</Link></li>
              <li><Link to="/ai-homework-helper" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Zap className="w-3.5 h-3.5" />Homework Helper</Link></li>
              <li><Link to="/ai-text-summarizer" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><BookOpen className="w-3.5 h-3.5" />Text Summarizer</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Writing & Projects</h3>
            <ul className="space-y-2.5">
              <li><Link to="/ai-essay-writer" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Brain className="w-3.5 h-3.5" />AI Essay Writer</Link></li>
              <li><Link to="/ai-assignment-generator" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Assignment Generator</Link></li>
              <li><Link to="/presentation-generator" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Presentation Builder</Link></li>
              <li><Link to="/ai-resume-generator" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Resume Builder</Link></li>
              <li><Link to="/tools/paraphrasing-tool" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Wand2 className="w-3.5 h-3.5" />Paraphrasing Tool</Link></li>
              <li><Link to="/tools/grammar-checker" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Grammar Checker</Link></li>
            </ul>
          </div>

          {/* PDF Tools */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">PDF Tools</h3>
            <ul className="space-y-2.5">
              <li><Link to="/free-pdf-tools" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">All PDF Tools</Link></li>
              <li><Link to="/tools/merge-pdf" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Merge PDF</Link></li>
              <li><Link to="/tools/split-pdf" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Split PDF</Link></li>
              <li><Link to="/tools/compress-pdf" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Compress PDF</Link></li>
              <li><Link to="/tools/pdf-footer-editor" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">PDF Footer Editor</Link></li>
              <li><Link to="/tools/image-to-pdf" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Image to PDF</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Study Blog</Link></li>
              <li><Link to="/contact" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/disclaimer" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} StudentAI Tools. All rights reserved. Built for students, by students.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">🎓 Free forever · No registration · 100% student-focused</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
