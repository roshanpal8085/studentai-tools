import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, ArrowLeft, Share2, Copy, CheckCircle } from 'lucide-react';
import { blogPosts } from '../data/blogData';
import SEO from '../components/SEO';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const foundPost = blogPosts.find(p => p.slug === slug);
    if (foundPost) {
      setPost(foundPost);
    }
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold dark:text-white">Article not found</h1>
        <Link to="/blog" className="mt-4 text-indigo-600 hover:underline">Return to Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-20">
      <SEO 
        title={post.title} 
        description={post.excerpt} 
      />
      
      {/* Article Header */}
      <div className="w-full h-[400px] relative">
        <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 z-20 flex flex-col justify-end max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Link to="/blog" className="text-white/80 hover:text-white flex items-center gap-2 mb-6 font-medium w-fit transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <div className="flex items-center gap-4 text-sm text-indigo-200 mb-4">
            <span className="bg-indigo-600/80 text-white px-3 py-1 rounded-full font-semibold backdrop-blur-sm">{post.category}</span>
            <div className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {post.date}</div>
            <div className="flex items-center gap-1"><Clock className="w-4 h-4"/> {post.readTime}</div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">{post.title}</h1>
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3">
           <div className="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:text-slate-900 dark:prose-headings:text-white 
                prose-p:text-slate-600 dark:prose-p:text-slate-300
                prose-a:text-primary hover:prose-a:text-indigo-500
                prose-strong:text-slate-900 dark:prose-strong:text-white
                prose-blockquote:border-primary prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800/50 
                prose-blockquote:p-4 prose-blockquote:rounded-r-xl
                prose-code:text-primary prose-code:bg-indigo-50 dark:prose-code:bg-indigo-900/30 
                prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-img:rounded-3xl">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
        
        {/* Sidebar */}
        <aside className="lg:w-1/3">
          <div className="sticky top-24 space-y-8">
            {/* Share Card */}
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6 text-xl">Share Article</h3>
              <div className="flex items-center gap-4">
                <button 
                    onClick={handleShare}
                    className="flex-grow py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-sm"
                >
                  {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5"/>}
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Newsletter/Ad Card */}
            <div className="bg-indigo-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <h3 className="text-2xl font-bold mb-4 relative z-10">Study Smarter, Not Harder</h3>
                <p className="text-indigo-200 mb-8 text-sm leading-relaxed relative z-10">Get the best AI tools and productivity hacks delivered to your inbox every week.</p>
                <div className="space-y-4 relative z-10">
                    <input type="email" placeholder="student@example.com" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:bg-white/20 transition-all placeholder:text-indigo-300" />
                    <button className="w-full bg-white text-indigo-900 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-all">Join 10k+ Students</button>
                </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPost;
