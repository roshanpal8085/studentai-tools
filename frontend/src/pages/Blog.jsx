import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BookOpen, Calendar, Clock, ArrowRight, Search, Star } from 'lucide-react';
import { blogPosts } from '../data/blogData';

const CATEGORIES = ['All', 'Productivity', 'Exam Prep', 'Study Hacks', 'Writing', 'Career', 'Resources'];

const CATEGORY_COLORS = {
  'Productivity': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  'Exam Prep':    'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  'Study Hacks':  'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  'Writing':      'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  'Career':       'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  'Resources':    'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
};

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return blogPosts.filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const featured = blogPosts[0];
  const rest = filtered.filter(p => p.id !== featured.id);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-slate-50 dark:bg-slate-900">
      <SEO
        title="StudentAI Blog — Study Guides, AI Tips & Academic Advice"
        canonical="/blog"
        description="Explore 20+ in-depth articles on AI study tools, exam prep strategies, essay writing, and academic productivity. Written for students, by educators who understand the struggle."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700/50 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-5">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {blogPosts.length} articles — all free, no paywall
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">StudentAI Study Blog</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            In-depth guides on AI study strategies, exam preparation, and academic writing — designed to help you study smarter, not harder.
          </p>
        </div>

        {/* ── FEATURED POST ── */}
        <Link to={`/blog/${featured.slug}`} className="group block bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-all duration-500 mb-12">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 h-64 lg:h-auto overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
              <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-5 left-5 z-20">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${CATEGORY_COLORS[featured.category] || 'bg-indigo-100 text-indigo-700'}`}>{featured.category}</span>
              </div>
              <div className="absolute top-5 right-5 z-20">
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">⭐ Featured</span>
              </div>
            </div>
            <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col justify-center">
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4 gap-5">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-indigo-500" />{featured.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-indigo-500" />{featured.readTime}</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">{featured.title}</h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-5">{featured.excerpt}</p>
              <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold group-hover:gap-3 transition-all">
                Read Article <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>

        {/* ── SEARCH + FILTERS ── */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => {
              const count = cat === 'All' ? blogPosts.length : blogPosts.filter(p => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                  }`}
                >
                  {cat} <span className="opacity-70 text-xs">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── ARTICLES GRID ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">No articles found</p>
            <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="mt-3 text-indigo-500 font-bold hover:underline text-sm">Clear filters</button>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{filtered.length} article{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {(activeCategory === 'All' && !searchQuery ? rest : filtered).map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col bg-white dark:bg-slate-800 rounded-[1.75rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 border border-slate-100 dark:border-slate-700 hover:-translate-y-1.5 transition-all duration-400">
                  <div className="h-44 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/40 transition-colors z-10" />
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 z-20">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${CATEGORY_COLORS[post.category] || 'bg-slate-100 text-slate-700'}`}>{post.category}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-xs text-slate-400 mb-3 gap-4">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug flex-grow">{post.title}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-bold group-hover:gap-2.5 transition-all mt-auto">
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
