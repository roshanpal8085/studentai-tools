import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navLinks = [
    { label: 'PDF Tools', path: '/free-pdf-tools' },
    { label: 'Resume AI', path: '/ai-resume-generator' },
    { label: 'Chat w/ PDF', path: '/chat-pdf' },
    { label: 'Email Writer', path: '/email-writer' },
    { label: 'Presentations', path: '/presentation-generator' },
    { label: 'Captions', path: '/instagram-caption-generator' },
    { label: 'Speed Test', path: '/tools/internet-speed-test' },
    { label: '🎮 Free Games', path: '/free-games' },
    { label: 'Blog', path: '/blog' }
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="fixed top-0 w-full bg-white dark:bg-slate-900 shadow-sm z-50 transition-colors duration-200 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" onClick={closeMenu} className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">StudentAI Tools</span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors hover:-translate-y-0.5 transform duration-150">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Action Button & Mobile Menu Toggle */}
            <div className="flex items-center space-x-4">
              <Link to="/ai-resume-generator" className="bg-primary hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg active:scale-95 hidden sm:block">
                Try AI Tools Free
              </Link>
              
              <button 
                className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMenu}
      />

      {/* Mobile Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-slate-900 shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 flex flex-col h-full bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-8">
            <span className="font-bold text-lg text-slate-900 dark:text-white">Navigation</span>
            <button onClick={closeMenu} className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={closeMenu}
                className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium py-3 border-b border-slate-200 dark:border-slate-800 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            <Link 
              to="/ai-resume-generator" 
              onClick={closeMenu}
              className="mt-6 bg-primary text-white text-center py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
            >
              Try AI Tools Free
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
