import { Helmet } from 'react-helmet-async';
import { GraduationCap, Heart, Zap, Globe, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      <Helmet><title>About Us - StudentAI Tools</title></Helmet>
      
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[100px] point-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[100px] point-events-none transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Hero */}
        <div className="text-center mb-20 md:mb-24">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-8 shadow-lg shadow-indigo-500/20 shadow-inner">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Democratizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-sky-500">Academic AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto font-medium">
            We believe that every student, regardless of their background or budget, deserves uninterrupted access to premium, cutting-edge AI tools without the premium price tag.
          </p>
        </div>

        {/* Core Philosophy Section */}
        <div className="glass-card rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-16 mb-24 bg-white/60 dark:bg-slate-900/60">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">The Origin Story</h2>
            <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                StudentAI Tools was born out of a simple, undeniable necessity: students globally spend countless hours formatting basic resumes, wrestling with incompatible PDFs, writing boilerplate emails, and fighting burnout instead of focusing on what actually matters—deep learning and genuine creation.
              </p>
              <p>
                As AI revolutionized the enterprise sector, we watched highly capable academic tools get locked behind harsh subscription paywalls. By leveraging advanced modern web frameworks and optimized AI architectures, we built a unified suite of tools that solve daily academic friction instantaneously. 
              </p>
              <p className="font-bold text-slate-900 dark:text-slate-300">
                Best of all? We committed to making it 100% free for everyone, supported gently by non-intrusive AdSense placements.
              </p>
            </div>
          </div>
        </div>
        
        {/* Core Pillars Grid */}
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-12">Our Core Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-24">
            <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 mx-auto">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="font-black text-xl text-slate-900 dark:text-white mb-3">Lightning Fast</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Powered by a globally edge-cached MERN stack and optimized load balancers for instant, zero-lag generation.</p>
            </div>
            
            <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 mx-auto">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="font-black text-xl text-slate-900 dark:text-white mb-3">100% Free</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Sustained by advertising revenue, allowing us to grant universally free access without strict monthly token limits or credit cards.</p>
            </div>
            
            <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-black text-xl text-slate-900 dark:text-white mb-3">Built for Students</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Features purposefully designed around the exact pain points of modern university, college, and high school academic life.</p>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-black text-xl text-slate-900 dark:text-white mb-3">Privacy First</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Your assays and PDFs are completely transient. Uploads are strictly processed in local memory and instantly purged.</p>
            </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-indigo-600 to-sky-600 rounded-[3rem] p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <h2 className="text-3xl md:text-5xl font-black mb-6 relative z-10">Ready to boost your productivity?</h2>
             <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 relative z-10 font-medium">Join thousands of students who have upgraded their academic workflow using our integrated suite of AI tools.</p>
             <Link to="/free-tools" className="inline-block px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl hover:scale-105 transition-transform shadow-xl relative z-10 text-lg">
                Explore All Free Tools
             </Link>
        </div>

      </div>
    </div>
  );
};

export default About;
