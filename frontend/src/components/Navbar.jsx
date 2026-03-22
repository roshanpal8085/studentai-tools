import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-slate-900 shadow-sm z-50 transition-colors duration-200 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">StudentAI Tools</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link to="/free-pdf-tools" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors hover:-translate-y-0.5 transform duration-150">PDF Tools</Link>
            <Link to="/ai-resume-generator" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors hover:-translate-y-0.5 transform duration-150">Resume AI</Link>
            <Link to="/chat-pdf" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors hover:-translate-y-0.5 transform duration-150">Chat w/ PDF</Link>
            <Link to="/email-writer" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors hover:-translate-y-0.5 transform duration-150">Email Writer</Link>
            <Link to="/presentation-generator" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors hover:-translate-y-0.5 transform duration-150">Presentations</Link>
            <Link to="/instagram-caption-generator" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors hover:-translate-y-0.5 transform duration-150">Captions</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/ai-resume-generator" className="bg-primary hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg active:scale-95 hidden sm:block">
              Try AI Tools Free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
