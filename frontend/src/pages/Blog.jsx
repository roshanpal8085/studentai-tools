import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blogData';

const Blog = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Student AI Blog - Guides, Tips & Tools" 
        description="Read our latest articles on AI study tools, productivity hacks, and student success stories. Stay updated with the best free AI resources for your academic journey." 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">StudentAI Blog</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Insights, guides, and study hacks to help you maximize your potential using Artificial Intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {blogPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 border border-slate-100 dark:border-slate-700 hover:-translate-y-2">
              <div className="h-72 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/40 transition-colors z-10" />
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6 z-20">
                     <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-primary px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg">{post.category}</span>
                </div>
              </div>
              <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-6 gap-6 font-medium">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary"/> {post.date}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary"/> {post.readTime}</div>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors leading-tight">{post.title}</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-8 flex-grow leading-relaxed text-lg">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto">
                    <div className="text-primary font-bold flex items-center gap-2 group-hover:gap-4 transition-all text-lg">
                        Read Story <ArrowRight className="w-6 h-6 shadow-[4px_0_10px_rgba(79,70,229,0.2)] rounded-full" />
                    </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
