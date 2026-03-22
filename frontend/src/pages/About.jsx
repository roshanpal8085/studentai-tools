import { Helmet } from 'react-helmet-async';
import { GraduationCap, Heart, Zap, Globe } from 'lucide-react';


const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950">
      <Helmet><title>About Us - StudentAI Tools</title></Helmet>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-900/30 text-primary mb-6">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Our Mission</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            We believe that every student deserves access to premium, cutting-edge AI tools without the premium price tag.
          </p>
        </div>



        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-12 my-12 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Who We Are</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            StudentAI Tools was born out of a simple necessity: students spend countless hours formatting resumes, writing boilerplate emails, and wrestling with PDFs instead of focusing on what actually matters—learning and creating.
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            By leveraging advanced AI frameworks, we've built a unified platform that solves these problems instantaneously. Best of all, it's completely free to use.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Powered by modern MERN stack and an optimized AI Load Balancer for instant generation.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">100% Free</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Ad-supported infrastructure allows us to grant universally free access.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Built for You</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Designed specifically around the pain points of modern university and college students.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
