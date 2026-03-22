import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy loading Pages for performance optimization
const Home = lazy(() => import('./pages/Home'));
const AiResume = lazy(() => import('./pages/AiResume'));
const PresentationGen = lazy(() => import('./pages/PresentationGen'));
const ChatPdf = lazy(() => import('./pages/ChatPdf'));
const EmailWriter = lazy(() => import('./pages/EmailWriter'));
const CaptionGen = lazy(() => import('./pages/CaptionGen'));
const PdfTools = lazy(() => import('./pages/PdfTools'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));

// Blog System Lazy Loads
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

// Loading Fallback Component
const Loader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ai-resume-generator" element={<AiResume />} />
                <Route path="/presentation-generator" element={<PresentationGen />} />
                <Route path="/chat-pdf" element={<ChatPdf />} />
                <Route path="/email-writer" element={<EmailWriter />} />
                <Route path="/instagram-caption-generator" element={<CaptionGen />} />
                <Route path="/free-pdf-tools" element={<PdfTools />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<Privacy />} />
                <Route path="/terms-conditions" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Blog Routes */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                
                <Route path="*" element={
                  <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
                    <h1 className="text-7xl font-extrabold text-indigo-100 dark:text-indigo-900/50 mb-4 tracking-tighter">404</h1>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Page Not Found</h2>
                    <p className="text-lg text-slate-500 mb-8 max-w-md mx-auto">We couldn't find the page you were looking for. It might have been moved or doesn't exist.</p>
                    <a href="/" className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">Return Home</a>
                  </div>
                } />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
