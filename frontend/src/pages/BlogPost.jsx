import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { blogPosts } from './Blog';

const articleContent = {
  'best-ai-tools-for-students': `
## The Rise of AI in Education
Artificial Intelligence is no longer just a futuristic concept; it's a daily reality for millions of students worldwide. Whether you're struggling with complex calculus or trying to draft a 15-page research paper, AI tools can act as your personal tutor, available 24/7.

### 1. ChatGPT & Claude (Brainstorming & Tutoring)
These large language models are the bread and butter of student AI. Use them to explain complex topics like you're five years old, or brainstorm ideas for your next creative writing assignment.

### 2. Perplexity AI (Research)
Unlike standard generative models, Perplexity acts as an AI search engine. It answers questions with direct citations from the web, making it incredibly useful for finding reliable sources for your essays.

### 3. StudentAI Tools (All-in-One Utility)
Our very own platform offers specialized student tools. From formatting your resume to chatting directly with your 300-page PDF textbooks, it's designed specifically for college workflows.

### Conclusion
The key to using AI as a student is leveraging it as a collaborator, not a replacement for your own brain. Use these tools to augment your learning, save time on busywork, and focus on truly understanding your course material.
  `,
  'how-to-write-resume-using-ai': `
## Escaping the Blank Page Syndrome
Writing a resume from scratch is daunting. What format do you use? How do you make "worked at a coffee shop" sound like "managed multi-tiered logistical operations under high-pressure scenarios"? This is where AI excels.

### Step 1: Brain dump your experience
Don't worry about formatting. Just write down everything you did at your jobs, clubs, or projects in plain English. For example: "I led a team of 4 for a hackathon and we built an app."

### Step 2: Use an AI Resume Generator
Input your brain dump into an AI Resume tool (like the one available on StudentAI Tools). The AI knows what recruiters are looking for (action verbs, quantifiable results, ATS-friendly terminology). It will transform your plain text into professional bullet points:
* "Spearheaded a cross-functional team of 4 developers during a 48-hour hackathon to launch a full-stack mobile application."

### Step 3: Beat the ATS (Applicant Tracking System)
AI can help you tailor your resume to specific job descriptions. Paste the job description and your generated resume into the AI and ask it: "What keywords am I missing?" Add those keywords organically to ensure human recruiters actually see your application!
  `,
  'top-free-ai-tools-for-college-students': `
## High Tech Without the High Cost
College tuition is expensive enough. You shouldn't have to pay $20/month subscriptions for ten different AI applications. Here are the most powerful AI tools you can use safely for free.

### 1. StudentAI Free PDF Tools
Most PDF editors charge exorbitant fees just to merge or compress files. Our platform provides these utilities entirely free, alongside an AI Chat-to-PDF feature that lets you interrogate your textbooks.

### 2. Grammarly Basic
While the premium version costs money, the free tier of Grammarly uses powerful AI to catch embarrassing typos, punctuation errors, and basic grammatical mistakes before you submit your final draft.

### 3. DeepL Translator
If you're taking language classes or reading foreign research papers, DeepL offers significantly more nuanced and accurate translations than Google Translate, and the web interface is completely free.

### The Bottom Line
Don't let paywalls gatekeep your productivity. The best stack for college students is completely free if you know where to look.
  `,
  'ai-tools-to-save-study-time': `
## Work Smarter, Not Harder
If you're pulling all-nighters, you are not studying effectively. Sleep is critical for memory consolidation. Here is how AI can cut your study time in half.

### Generating Practice Tests
Active recall is the most effective way to study. Instead of passively re-reading your notes, paste them into an AI and ask it: "Generate a 20-question multiple-choice quiz based on these notes, with an answer key at the bottom."

### Summarizing Heavy Reading
Assigned 50 pages of reading for tomorrow's lecture? Upload the document to an AI PDF reader. Ask for a 2-page executive summary covering the main themes, key terminology, and historical context. You'll go into the lecture fully prepared in a fraction of the time.

### Flashcard Creation
Tools like Anki are great, but making the cards takes forever. You can use AI to instantly generate CSV files of flashcards from your syllabus, which you can then import directly into your favorite flashcard app.
  `
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const foundPost = blogPosts.find(p => p.slug === slug);
    if (foundPost) {
      setPost({ ...foundPost, content: articleContent[slug] });
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold dark:text-white">Article not found</h1>
        <Link to="/blog" className="mt-4 text-indigo-600 hover:underline">Return to Blog</Link>
      </div>
    );
  }

  // A very basic markdown-esque parser for the static blog content
  const renderContent = (text) => {
    return text.split('\\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-2xl font-bold mt-8 mb-4 text-slate-800 dark:text-slate-100">{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-3xl font-extrabold mt-10 mb-6 text-slate-900 dark:text-white">{line.replace('## ', '')}</h2>;
      if (line.startsWith('* ')) return <li key={i} className="ml-6 mb-2 text-slate-700 dark:text-slate-300 list-disc">{line.replace('* ', '')}</li>;
      if (line.trim() === '') return <div key={i} className="h-4"></div>;
      return <p key={i} className="mb-4 text-lg text-slate-700 dark:text-slate-300 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-20">
      <Helmet>
        <title>{post.title} | StudentAI Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>
      
      {/* Article Header */}
      <div className="w-full h-[400px] relative">
        <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 z-20 flex flex-col justify-end max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col md:flex-row gap-12">
        <div className="md:w-3/4 article-content prose prose-lg prose-indigo dark:prose-invert max-w-none">
          {renderContent(post.content)}
        </div>
        
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="sticky top-24">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Share this article</h3>
              <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-colors">
                  <Share2 className="w-5 h-5"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
