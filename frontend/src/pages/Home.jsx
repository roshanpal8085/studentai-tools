import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdBanner from '../components/AdBanner';
import { FileText, MonitorPlay, Image as ImageIcon, LayoutTemplate, MessageSquare, Mail } from 'lucide-react';

const features = [
  { name: 'Free PDF Utilities', description: 'Merge, compress, and convert PDFs instantly without watermarks.', icon: FileText, to: '/free-pdf-tools' },
  { name: 'AI Resume Generator', description: 'Create professional resumes in seconds. Ready for your dream job.', icon: LayoutTemplate, to: '/ai-resume-generator' },
  { name: 'Chat with PDF', description: 'Upload massive books or papers and instantly ask the AI questions about them.', icon: MessageSquare, to: '/chat-pdf' },
  { name: 'Presentation Builder', description: 'Generate complete, beautifully structured PowerPoint outlines in seconds.', icon: MonitorPlay, to: '/presentation-generator' },
  { name: 'AI Email Writer', description: 'Draft professional, perfectly toned emails for any situation instantly.', icon: Mail, to: '/email-writer' },
  { name: 'Instagram Captions', description: 'Generate engaging hashtags and captions for your social media posts.', icon: ImageIcon, to: '/instagram-caption-generator' }
];

const Home = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col items-center overflow-hidden">
      <Helmet>
        <title>StudentAI Tools | Free AI Productivity Platform</title>
        <meta name="description" content="Access free AI tools for students: resume generator, presentation builder, Instagram captions, and PDF utilities." />
      </Helmet>

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16 mb-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
          Supercharge Your <span className="text-primary bg-indigo-50 dark:bg-indigo-900/30 px-2 rounded-lg">Student Life</span>
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-slate-500 dark:text-slate-400 mx-auto mb-10 leading-relaxed">
          The all-in-one platform integrating AI to generate stunning resumes, build presentations, craft clever captions, and master your PDFs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/free-pdf-tools" className="w-full sm:w-auto bg-primary text-white hover:bg-indigo-600 px-8 py-3.5 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-primary/30 hover:-translate-y-1">
            Explore PDF Tools
          </Link>
          <Link to="/ai-resume-generator" className="w-full sm:w-auto bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-8 py-3.5 rounded-xl font-semibold text-lg transition-all shadow-sm">
            Try Resume Builder
          </Link>
        </div>
      </section>

      {/* Top Ad Banner */}
      <AdBanner format="horizontal" />

      {/* Features Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Powerful Tools at Your Fingertips</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">Everything you need to succeed, all in one place.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link key={feature.name} to={feature.to} className="group relative bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 border border-slate-100 dark:border-slate-700/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col h-full">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <feature.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed flex-grow">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Another Ad Banner */}
      <div className="w-full bg-slate-50 dark:bg-slate-900 py-10 border-y border-slate-200 dark:border-slate-800 flex justify-center">
        <AdBanner format="horizontal" />
      </div>
      
      {/* Call to action */}
      <section className="w-full max-w-5xl mx-auto px-4 text-center mt-20 mb-16">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-[3rem] p-12 md:p-20 shadow-inner border border-white/50 dark:border-slate-800 backdrop-blur-sm">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Ready to work smarter?</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">Join thousands of students saving hours every week using our AI suite and document tools.</p>
          <Link to="/free-pdf-tools" className="inline-block bg-primary text-white hover:bg-indigo-600 px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-primary/40 hover:-translate-y-1">
            Start Processing PDFs
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
