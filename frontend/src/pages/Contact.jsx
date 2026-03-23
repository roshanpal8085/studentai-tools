import { Helmet } from 'react-helmet-async';
import { Send, Mail, MapPin, MessageSquare, Loader2 } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [status, setStatus] = useState('ideal'); // ideal, submitting, success
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate form submission
    setTimeout(() => {
      setStatus('success');
      e.target.reset();
      setTimeout(() => setStatus('ideal'), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-900 relative">
      <Helmet><title>Contact Us - StudentAI Tools</title></Helmet>
      
      {/* Background decoration */}
      <div className="absolute top-40 left-0 w-full overflow-hidden pointer-events-none opacity-40 dark:opacity-20 flex justify-center">
         <div className="w-[1000px] h-[400px] bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-[100%] blur-[80px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 mb-6 shadow-sm">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Get in Touch</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have questions about our tools, spotted a bug, or want to discuss a partnership? We'd love to hear from you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Contact Info Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Email Us</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">Our team usually responds within 24 hours.</p>
              <a href="mailto:roshanpal8085@gmail.com" className="text-lg font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                roshanpal8085@gmail.com
              </a>
            </div>

            <div className="glass-card rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Headquarters</h3>
              <p className="text-slate-500 dark:text-slate-400">
                Digital Remote Network<br />
                Global Access
              </p>
            </div>
            
            {/* FAQ Teaser */}
            <div className="glass-card rounded-[2rem] p-8 bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700">
               <h3 className="font-bold text-slate-900 dark:text-white mb-3">Quick Question?</h3>
               <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                 Are the tools actually free? Yes, 100%. We support our servers through minimal AdSense placements, ensuring students never hit a paywall.
               </p>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Send a Message</h2>
              
              {status === 'success' ? (
                <div className="h-64 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-6">
                    <Send className="w-10 h-10 text-green-600 dark:text-green-400 ml-1" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-500 dark:text-slate-400">Thanks for reaching out. We will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Your Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:text-white outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:text-white outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:text-white outline-none"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message</label>
                    <textarea 
                      required
                      rows={5}
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:text-white outline-none resize-none custom-scrollbar"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                  >
                    {status === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
