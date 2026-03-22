import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';

export const blogPosts = [
  {
    id: 1,
    title: "Best AI Tools for Students",
    slug: "best-ai-tools-for-students",
    excerpt: "Discover the ultimate list of AI tools that every student needs to boost productivity, write better essays, and save hours of studying.",
    date: "Mar 20, 2026",
    readTime: "5 min read",
    category: "Productivity",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "How to Write Resume Using AI",
    slug: "how-to-write-resume-using-ai",
    excerpt: "Learn how to craft an ATS-friendly, professional resume using artificial intelligence that will instantly get you noticed by recruiters.",
    date: "Mar 18, 2026",
    readTime: "4 min read",
    category: "Career",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Top Free AI Tools for College Students",
    slug: "top-free-ai-tools-for-college-students",
    excerpt: "College is expensive. Fortunately, these incredibly powerful AI AI assistants are completely free for students on a budget.",
    date: "Mar 15, 2026",
    readTime: "6 min read",
    category: "Resources",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "AI Tools to Save Study Time",
    slug: "ai-tools-to-save-study-time",
    excerpt: "Stop pulling all-nighters. These AI study companions will summarize your textbooks and generate practice quizzes in seconds.",
    date: "Mar 10, 2026",
    readTime: "4 min read",
    category: "Study Hacks",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-slate-900">
      <Helmet>
        <title>Blog | StudentAI Tools</title>
        <meta name="description" content="Read our latest articles on the best free AI tools for students, how to use AI to study faster, write resumes, and boost productivity." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">StudentAI Blog</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Insights, guides, and study hacks to help you maximize your potential using Artificial Intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {blogPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 hover:-translate-y-1">
              <div className="h-64 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4 gap-4">
                  <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full font-medium">{post.category}</span>
                  <div className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {post.date}</div>
                  <div className="flex items-center gap-1"><Clock className="w-4 h-4"/> {post.readTime}</div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">{post.title}</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6 flex-grow leading-relaxed">{post.excerpt}</p>
                <div className="text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read Article <ArrowRight className="w-5 h-5" />
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
