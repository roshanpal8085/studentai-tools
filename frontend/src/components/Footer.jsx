import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-slate-900 dark:text-white mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span>StudentAI Tools</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
              The ultimate productivity platform for students. AI-powered resumes, presentations, captions, and free PDF utilities.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/ai-resume-generator" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Resume Generator</Link></li>
              <li><Link to="/presentation-generator" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Presentation Builder</Link></li>
              <li><Link to="/chat-pdf" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Chat w/ PDF</Link></li>
              <li><Link to="/email-writer" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">AI Email Writer</Link></li>
              <li><Link to="/instagram-caption-generator" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Caption Generator</Link></li>
              <li><Link to="/free-pdf-tools" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">PDF Toolkit</Link></li>
              <li><Link to="/blog" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/privacy-policy" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-8 flex justify-center items-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} StudentAI Tools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
