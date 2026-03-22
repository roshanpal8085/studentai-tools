import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { FileText, MonitorPlay, Image as ImageIcon, LayoutTemplate, MessageSquare, Mail, Zap, CheckCircle2, TrendingUp, Users, ShieldCheck } from 'lucide-react';

const features = [
  { name: 'Free PDF Utilities', description: 'Merge, compress, and convert PDFs instantly without watermarks.', icon: FileText, to: '/free-pdf-tools' },
  { name: 'AI Resume Generator', description: 'Create professional resumes in seconds. Ready for your dream job.', icon: LayoutTemplate, to: '/ai-resume-generator' },
  { name: 'Chat with PDF', description: 'Upload massive books or papers and instantly ask the AI questions about them.', icon: MessageSquare, to: '/chat-pdf' },
  { name: 'Presentation Builder', description: 'Generate complete, beautifully structured PowerPoint outlines in seconds.', icon: MonitorPlay, to: '/presentation-generator' },
  { name: 'AI Email Writer', description: 'Draft professional, perfectly toned emails for any situation instantly.', icon: Mail, to: '/email-writer' },
  { name: 'Instagram Captions', description: 'Generate engaging hashtags and captions for your social media posts.', icon: ImageIcon, to: '/instagram-caption-generator' }
];

const stats = [
  { name: 'Active Students', value: '10,000+', icon: Users },
  { name: 'Documents Processed', value: '500k+', icon: FileText },
  { name: 'Hours Saved', value: '2.5M+', icon: Zap },
  { name: 'Data Privacy', value: '100%', icon: ShieldCheck },
];

const testimonials = [
  {
    content: "The Chat with PDF tool is a lifesaver! I upload my 500-page textbooks and get direct answers for my assignments in seconds.",
    author: "Sarah Jenkins",
    role: "Computer Science Major",
    image: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    content: "I used the AI Resume Generator for my internship applications. It formatted everything perfectly and I landed 3 interviews!",
    author: "David Chen",
    role: "Business Student",
    image: "https://i.pravatar.cc/150?u=david"
  },
  {
    content: "As someone who struggles with writing professional emails to professors, the Email Writer tool has completely removed my anxiety.",
    author: "Emily Thompson",
    role: "Literature Major",
    image: "https://i.pravatar.cc/150?u=emily"
  }
];

const steps = [
  { title: "Select a Tool", description: "Choose from our suite of AI-powered utilities designed specifically for student needs." },
  { title: "Input your Request", description: "Upload your document, enter your prompt, or provide the basic details required." },
  { title: "Get Instant Results", description: "Our AI processes your request in seconds, delivering high-quality, formatted results ready to use." }
];

const Home = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col items-center overflow-hidden">
      <Helmet>
        <title>StudentAI Tools | Free AI Productivity Platform for Students</title>
        <meta name="description" content="Access free AI tools for students: resume generator, presentation builder, Instagram captions, PDF utilities, and AI document chat to boost your productivity." />
      </Helmet>

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16 mb-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full point-events-none -z-10" />
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
          Supercharge Your <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Student Life</span>
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-slate-600 dark:text-slate-300 mx-auto mb-12 leading-relaxed font-medium">
          The all-in-one platform integrating AI to generate stunning resumes, build presentations, craft clever captions, and master your PDFs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/free-pdf-tools" className="w-full sm:w-auto bg-primary text-white hover:bg-indigo-700 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_8px_30px_rgb(79,70,229,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_40px_rgb(79,70,229,0.4)]">
            Explore AI Tools
          </Link>
          <Link to="/ai-resume-generator" className="w-full sm:w-auto bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-sm flex items-center justify-center gap-2">
            Try Resume Builder <TrendingUp className="w-5 h-5" />
          </Link>
        </div>
        
        {/* Quick Stats below hero */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-500" /> Free to use</div>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-500" /> No credit card</div>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-500" /> Instant results</div>
        </div>
      </section>

      {/* Top Ad Banner */}


      {/* Features Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Powerful Tools at Your Fingertips</h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Everything you need to study faster, write better, and succeed—all in one place.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link key={feature.name} to={feature.to} className="group relative bg-white dark:bg-slate-800/50 p-8 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 border border-slate-100 dark:border-slate-700/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col h-full backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
                 <feature.icon className="h-24 w-24 text-indigo-50/50 dark:text-indigo-900/10" />
              </div>
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">{feature.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed flex-grow text-lg relative z-10">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full bg-slate-50 dark:bg-slate-900/50 py-24 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">How It Works</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Three simple steps to save hours of your time.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 dark:from-indigo-800 dark:via-purple-800 dark:to-indigo-800 -z-10 transform -translate-y-1/2 rounded-full border-dashed" border-style="dashed"></div>
            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-xl mb-6 ring-4 ring-white dark:ring-slate-900">
                  {idx + 1}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
           {stats.map((stat, idx) => (
             <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-3xl text-center border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
               <div className="mx-auto w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
                 <stat.icon className="h-6 w-6 text-primary" />
               </div>
               <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{stat.value}</div>
               <div className="text-slate-500 dark:text-slate-400 font-medium">{stat.name}</div>
             </div>
           ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full bg-slate-900 text-white py-24 my-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full point-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full point-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Loved by Students Worldwide</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Don't just take our word for it. Here's what your peers are saying.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl border border-slate-700">
                <div className="flex items-center gap-1 mb-6 text-yellow-400">
                  {Array(5).fill(0).map((_, i) => <Zap key={i} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="text-lg leading-relaxed text-slate-300 mb-8 font-medium italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.image} alt={testimonial.author} className="w-14 h-14 rounded-full border-2 border-indigo-500/30" />
                  <div>
                    <h4 className="font-bold text-white text-lg">{testimonial.author}</h4>
                    <span className="text-slate-400">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Another Ad Banner */}
      <div className="w-full py-10 flex justify-center">

      </div>
      
      {/* Call to action */}
      <section className="w-full max-w-5xl mx-auto px-4 text-center mt-10 mb-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3rem] transform rotate-1 opacity-20 dark:opacity-40 blur-lg"></div>
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-[3rem] p-12 md:p-20 shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)] border border-white dark:border-slate-700 relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Ready to study smarter?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">Join thousands of students saving hours every week using our AI suite and document tools. It's 100% free.</p>
          <Link to="/ai-resume-generator" className="inline-block bg-primary text-white hover:bg-indigo-600 px-12 py-5 rounded-full font-bold text-xl transition-all shadow-[0_8px_30px_rgb(79,70,229,0.3)] hover:-translate-y-1">
            Get Started For Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
