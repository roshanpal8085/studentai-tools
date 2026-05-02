import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';

// ── Core Pages ──────────────────────────────────────────────
const Home              = lazy(() => import('./pages/Home'));
const About             = lazy(() => import('./pages/About'));
const Contact           = lazy(() => import('./pages/Contact'));
const Privacy           = lazy(() => import('./pages/Privacy'));
const Terms             = lazy(() => import('./pages/Terms'));
const Disclaimer        = lazy(() => import('./pages/Disclaimer'));
const NotFound          = lazy(() => import('./pages/NotFound'));

// ── The 12 Premium AI Study Tools ────────────────────────────
const AiResume          = lazy(() => import('./pages/AiResume'));
const PresentationGen   = lazy(() => import('./pages/PresentationGen'));
const ChatPdf           = lazy(() => import('./pages/ChatPdf'));
const HomeworkHelper    = lazy(() => import('./pages/tools/HomeworkHelper'));
const EssayWriter       = lazy(() => import('./pages/tools/EssayWriter'));
const StudyPlanner      = lazy(() => import('./pages/tools/StudyPlanner'));
const NotesGenerator    = lazy(() => import('./pages/tools/NotesGenerator'));
const QuizGenerator     = lazy(() => import('./pages/tools/QuizGenerator'));
const AssignmentGenerator = lazy(() => import('./pages/tools/AssignmentGenerator'));
const TextSummarizer    = lazy(() => import('./pages/tools/TextSummarizer'));
const ParaphrasingTool  = lazy(() => import('./pages/tools/ParaphrasingTool'));
const GrammarChecker    = lazy(() => import('./pages/tools/GrammarChecker'));

// ── Blog ─────────────────────────────────────────────────────
const Blog              = lazy(() => import('./pages/Blog'));
const BlogPost          = lazy(() => import('./pages/BlogPost'));

// ── PDF Tools ────────────────────────────────────────────────
const PdfTools          = lazy(() => import('./pages/PdfTools'));
const ImageToPdf        = lazy(() => import('./pages/tools/ImageToPdf'));
const PdfToWord         = lazy(() => import('./pages/tools/PdfToWord'));
const PdfFooterEditor   = lazy(() => import('./pages/tools/PdfFooterEditor'));

// ── /free-tools SEO Pillar Page ──────────────────────────────
const FreeUtilities     = lazy(() => import('./pages/FreeUtilities'));

// Loading Fallback
const Loader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* ── Home ── */}
                <Route path="/" element={<Home />} />

                {/* ── The 12 Premium AI Study Tools ── */}
                <Route path="/ai-resume-generator"       element={<AiResume />} />
                <Route path="/presentation-generator"    element={<PresentationGen />} />
                <Route path="/chat-pdf"                  element={<ChatPdf />} />
                <Route path="/ai-homework-helper"        element={<HomeworkHelper />} />
                <Route path="/ai-essay-writer"           element={<EssayWriter />} />
                <Route path="/ai-study-planner"          element={<StudyPlanner />} />
                <Route path="/ai-notes-generator"        element={<NotesGenerator />} />
                <Route path="/ai-quiz-generator"         element={<QuizGenerator />} />
                <Route path="/ai-assignment-generator"   element={<AssignmentGenerator />} />
                <Route path="/ai-text-summarizer"        element={<TextSummarizer />} />
                <Route path="/tools/paraphrasing-tool"   element={<ParaphrasingTool />} />
                <Route path="/tools/grammar-checker"     element={<GrammarChecker />} />

                {/* ── Trust / Legal Pages ── */}
                <Route path="/about"            element={<About />} />
                <Route path="/privacy-policy"   element={<Privacy />} />
                <Route path="/terms-conditions" element={<Terms />} />
                <Route path="/disclaimer"       element={<Disclaimer />} />
                <Route path="/contact"          element={<Contact />} />

                {/* ── /free-tools SEO Pillar Page ── */}
                <Route path="/free-tools" element={<FreeUtilities />} />

                {/* ── Blog ── */}
                <Route path="/blog"       element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />

                {/* ─────────────────────────────────────────────────
                    SMART 301 REDIRECTS for removed low-value tools
                    (topic-matched, NOT blindly to homepage)
                ───────────────────────────────────────────────── */}

                {/* Deprecated Tools -> 404 or Redirects */}
                <Route path="/tools/internet-speed-test"   element={<NotFound />} />
                <Route path="/tools/age-calculator"        element={<NotFound />} />
                <Route path="/total-unit-converter"        element={<NotFound />} />
                <Route path="/tools/percentage-calculator" element={<NotFound />} />
                <Route path="/tools/random-name-generator" element={<Navigate to="/ai-essay-writer" replace />} />
                <Route path="/tools/password-generator"    element={<NotFound />} />
                <Route path="/tools/qr-generator"          element={<NotFound />} />
                <Route path="/instagram-caption-generator" element={<NotFound />} />
                <Route path="/tools/ai-prompt-generator"   element={<Navigate to="/ai-homework-helper" replace />} />
                
                <Route path="/tools/word-counter"               element={<NotFound />} />
                <Route path="/tools/citation-generator"         element={<NotFound />} />
                <Route path="/tools/essay-topic-generator"      element={<Navigate to="/ai-essay-writer" replace />} />
                <Route path="/tools/homework-planner"           element={<Navigate to="/ai-study-planner" replace />} />
                <Route path="/tools/study-timetable-generator"  element={<Navigate to="/ai-study-planner" replace />} />
                <Route path="/tools/gpa-calculator"             element={<NotFound />} />
                <Route path="/tools/exam-countdown"             element={<NotFound />} />
                <Route path="/tools/study-timer"                element={<NotFound />} />
                <Route path="/tools/random-question-generator"  element={<Navigate to="/ai-quiz-generator" replace />} />
                <Route path="/email-writer"                     element={<NotFound />} />

                {/* PDF Tools */}
                <Route path="/free-pdf-tools"                element={<PdfTools />} />
                <Route path="/tools/merge-pdf"               element={<PdfTools />} />
                <Route path="/tools/split-pdf"               element={<PdfTools />} />
                <Route path="/tools/pdf-watermark"           element={<PdfTools />} />
                <Route path="/tools/delete-pdf-pages"        element={<PdfTools />} />
                <Route path="/tools/compress-pdf"            element={<PdfTools />} />
                <Route path="/tools/pdf-footer-editor"       element={<PdfFooterEditor />} />
                <Route path="/tools/image-to-pdf"            element={<ImageToPdf />} />
                <Route path="/tools/pdf-to-word"             element={<PdfToWord />} />
                <Route path="/tools/image-compressor"        element={<NotFound />} />

                {/* Games — removed entirely → 404 via NotFound */}
                <Route path="/free-games"         element={<NotFound />} />
                <Route path="/snake-game"         element={<NotFound />} />
                <Route path="/sudoku-game"         element={<NotFound />} />
                <Route path="/tic-tac-toe"         element={<NotFound />} />
                <Route path="/memory-card-game"    element={<NotFound />} />
                <Route path="/typing-speed-test"   element={<NotFound />} />
                <Route path="/math-quiz-game"      element={<Navigate to="/ai-quiz-generator" replace />} />
                <Route path="/logic-puzzle-game"   element={<Navigate to="/ai-quiz-generator" replace />} />
                <Route path="/stack-game"          element={<NotFound />} />
                <Route path="/color-switch-game"   element={<NotFound />} />
                <Route path="/word-puzzle-game"    element={<NotFound />} />
                <Route path="/flappy-bird-game"    element={<NotFound />} />

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <CookieConsent />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
