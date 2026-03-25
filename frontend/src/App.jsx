import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Lazy loading Pages for performance optimization
const Home = lazy(() => import('./pages/Home'));
const AiResume = lazy(() => import('./pages/AiResume'));
const PresentationGen = lazy(() => import('./pages/PresentationGen'));
const ChatPdf = lazy(() => import('./pages/ChatPdf'));
const EmailWriter = lazy(() => import('./pages/EmailWriter'));
const CaptionGen = lazy(() => import('./pages/CaptionGen'));
const PdfTools = lazy(() => import('./pages/PdfTools'));
const Privacy = lazy(() => import('./pages/Privacy'));

// New AI Tools
const HomeworkHelper = lazy(() => import('./pages/tools/HomeworkHelper'));
const EssayWriter = lazy(() => import('./pages/tools/EssayWriter'));
const StudyPlanner = lazy(() => import('./pages/tools/StudyPlanner'));
const NotesGenerator = lazy(() => import('./pages/tools/NotesGenerator'));
const QuizGenerator = lazy(() => import('./pages/tools/QuizGenerator'));
const AssignmentGenerator = lazy(() => import('./pages/tools/AssignmentGenerator'));
const TextSummarizer = lazy(() => import('./pages/tools/TextSummarizer'));

const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Terms = lazy(() => import('./pages/Terms'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));

// SEO Utility Tools Lazy Loads
const FreeUtilities = lazy(() => import('./pages/FreeUtilities'));
const WordCounter = lazy(() => import('./pages/tools/WordCounter'));
const GrammarChecker = lazy(() => import('./pages/tools/GrammarChecker'));
const QRGenerator = lazy(() => import('./pages/tools/QRGenerator'));
const PasswordGenerator = lazy(() => import('./pages/tools/PasswordGenerator'));
const AgeCalculator = lazy(() => import('./pages/tools/AgeCalculator'));
const ImageCompressor = lazy(() => import('./pages/tools/ImageCompressor'));
const UnitConverter = lazy(() => import('./pages/tools/UnitConverter'));
const PercentageCalculator = lazy(() => import('./pages/tools/PercentageCalculator'));
const RandomNameGenerator = lazy(() => import('./pages/tools/RandomNameGenerator'));
const EssayTopicGenerator = lazy(() => import('./pages/tools/EssayTopicGenerator'));
const AiPromptGenerator = lazy(() => import('./pages/tools/AiPromptGenerator'));
const ExamCountdown = lazy(() => import('./pages/tools/ExamCountdown'));
const StudyTimer = lazy(() => import('./pages/tools/StudyTimer'));
const ImageToPdf = lazy(() => import('./pages/tools/ImageToPdf'));
const PdfToWord = lazy(() => import('./pages/tools/PdfToWord'));
const RandomQuestionGenerator = lazy(() => import('./pages/tools/RandomQuestionGenerator'));
const HomeworkPlanner = lazy(() => import('./pages/tools/HomeworkPlanner'));
const StudyTimetableGenerator = lazy(() => import('./pages/tools/StudyTimetableGenerator'));
const CitationGenerator = lazy(() => import('./pages/tools/CitationGenerator'));
const GpaCalculator = lazy(() => import('./pages/tools/GpaCalculator'));
const PdfFooterEditor = lazy(() => import('./pages/tools/PdfFooterEditor'));

// Blog System Lazy Loads
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

// Free Games Section
const FreeGames = lazy(() => import('./pages/games/FreeGames'));
const Game2048 = lazy(() => import('./pages/games/Game2048'));
const SnakeGame = lazy(() => import('./pages/games/SnakeGame'));
const SudokuGame = lazy(() => import('./pages/games/SudokuGame'));
const TicTacToe = lazy(() => import('./pages/games/TicTacToe'));
const MemoryCardGame = lazy(() => import('./pages/games/MemoryCardGame'));
const TypingSpeedTest = lazy(() => import('./pages/games/TypingSpeedTest'));
const MathQuizGame = lazy(() => import('./pages/games/MathQuizGame'));
const LogicPuzzleGame = lazy(() => import('./pages/games/LogicPuzzleGame'));
const StackGame = lazy(() => import('./pages/games/StackGame'));
const ColorSwitchGame = lazy(() => import('./pages/games/ColorSwitchGame'));
const WordPuzzleGame = lazy(() => import('./pages/games/WordPuzzleGame'));
const FlappyBirdGame = lazy(() => import('./pages/games/FlappyBirdGame'));

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
        <ScrollToTop />
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
                
                {/* AI Tools Expansion */}
                <Route path="/ai-homework-helper" element={<HomeworkHelper />} />
                <Route path="/ai-essay-writer" element={<EssayWriter />} />
                <Route path="/ai-study-planner" element={<StudyPlanner />} />
                <Route path="/ai-notes-generator" element={<NotesGenerator />} />
                <Route path="/ai-quiz-generator" element={<QuizGenerator />} />
                <Route path="/ai-assignment-generator" element={<AssignmentGenerator />} />
                <Route path="/ai-text-summarizer" element={<TextSummarizer />} />

                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<Privacy />} />
                <Route path="/terms-conditions" element={<Terms />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Utilities Hub & Batch A */}
                <Route path="/free-tools" element={<FreeUtilities />} />
                <Route path="/tools/word-counter" element={<WordCounter />} />
                <Route path="/tools/grammar-checker" element={<GrammarChecker />} />
                <Route path="/tools/qr-generator" element={<QRGenerator />} />
                <Route path="/tools/password-generator" element={<PasswordGenerator />} />
                <Route path="/tools/age-calculator" element={<AgeCalculator />} />
                <Route path="/tools/image-compressor" element={<ImageCompressor />} />
                <Route path="/total-unit-converter" element={<UnitConverter />} />
                <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
                <Route path="/tools/random-name-generator" element={<RandomNameGenerator />} />
                <Route path="/tools/essay-topic-generator" element={<EssayTopicGenerator />} />
                <Route path="/tools/ai-prompt-generator" element={<AiPromptGenerator />} />
                <Route path="/tools/exam-countdown" element={<ExamCountdown />} />
                <Route path="/tools/study-timer" element={<StudyTimer />} />
                <Route path="/tools/image-to-pdf" element={<ImageToPdf />} />
                <Route path="/tools/pdf-to-word" element={<PdfToWord />} />
                <Route path="/tools/random-question-generator" element={<RandomQuestionGenerator />} />
                <Route path="/tools/homework-planner" element={<HomeworkPlanner />} />
                <Route path="/tools/study-timetable-generator" element={<StudyTimetableGenerator />} />
                <Route path="/tools/citation-generator" element={<CitationGenerator />} />
                <Route path="/tools/gpa-calculator" element={<GpaCalculator />} />
                <Route path="/tools/pdf-footer-editor" element={<PdfFooterEditor />} />
                
                {/* Blog Routes */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />

                {/* Free Games Routes */}
                <Route path="/free-games" element={<FreeGames />} />
                <Route path="/2048-game" element={<Game2048 />} />
                <Route path="/snake-game" element={<SnakeGame />} />
                <Route path="/sudoku-game" element={<SudokuGame />} />
                <Route path="/tic-tac-toe" element={<TicTacToe />} />
                <Route path="/memory-card-game" element={<MemoryCardGame />} />
                <Route path="/typing-speed-test" element={<TypingSpeedTest />} />
                <Route path="/math-quiz-game" element={<MathQuizGame />} />
                <Route path="/logic-puzzle-game" element={<LogicPuzzleGame />} />
                <Route path="/stack-game" element={<StackGame />} />
                <Route path="/color-switch-game" element={<ColorSwitchGame />} />
                <Route path="/word-puzzle-game" element={<WordPuzzleGame />} />
                <Route path="/flappy-bird-game" element={<FlappyBirdGame />} />
                
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
