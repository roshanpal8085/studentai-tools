import { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. Practice makes perfect and typing faster will help you in every part of your academic journey.",
  "Students who type faster can take better notes during lectures and complete assignments more efficiently throughout their educational career.",
  "Learning to type without looking at the keyboard is called touch typing and it significantly improves your productivity and typing speed.",
  "Consistent daily practice of just ten minutes can dramatically increase your words per minute and reduce errors in your typing performance.",
  "Reading books and typing passages from them is one of the best ways to simultaneously improve your vocabulary and your typing speed.",
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is a good typing speed for students?', acceptedAnswer: { '@type': 'Answer', text: 'A good typing speed for students is 40–60 WPM. Professional typists reach 80–100 WPM. Anything above 60 WPM is considered above average.' } },
    { '@type': 'Question', name: 'How can I improve my typing speed?', acceptedAnswer: { '@type': 'Answer', text: 'Practice daily with typing tests, use all 10 fingers (touch typing), maintain posture, and focus on accuracy before speed.' } },
    { '@type': 'Question', name: 'What does WPM mean?', acceptedAnswer: { '@type': 'Answer', text: 'WPM stands for Words Per Minute — a standard measure of typing speed. Each "word" is counted as 5 characters including spaces.' } },
    { '@type': 'Question', name: 'Is this typing speed test free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! This typing speed test is 100% free to use in your browser. No account or download required.' } },
  ],
};

export default function TypingSpeedTest() {
  const [textIdx, setTextIdx] = useState(0);
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [time, setTime] = useState(60);
  const [elapsed, setElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('typingbest') || '0'));
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const text = SAMPLE_TEXTS[textIdx];

  const start = useCallback(() => {
    if (started) return;
    setStarted(true);
    timerRef.current = setInterval(() => {
      setElapsed(e => {
        if (e + 1 >= time) {
          clearInterval(timerRef.current);
          setFinished(true);
        }
        return e + 1;
      });
    }, 1000);
  }, [started, time]);

  const handleInput = (e) => {
    if (finished) return;
    if (!started) start();
    const val = e.target.value;
    setInput(val);
    // Calculate stats
    const words = val.trim().split(/\s+/).filter(Boolean).length;
    const elapsedMin = (elapsed + 0.01) / 60;
    setWpm(Math.round(words / elapsedMin));
    // Accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) { if (val[i] === text[i]) correct++; }
    setAccuracy(val.length > 0 ? Math.round((correct / val.length) * 100) : 100);
    if (val === text) {
      clearInterval(timerRef.current);
      setFinished(true);
    }
  };

  useEffect(() => {
    if (finished) {
      const finalWpm = Math.round((input.trim().split(/\s+/).filter(Boolean).length / Math.max(elapsed, 1)) * 60);
      setWpm(finalWpm);
      if (finalWpm > best) { setBest(finalWpm); localStorage.setItem('typingbest', finalWpm); }
    }
  }, [finished]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const reset = () => {
    clearInterval(timerRef.current);
    setInput(''); setStarted(false); setFinished(false); setElapsed(0); setWpm(0); setAccuracy(100);
    setTextIdx(Math.floor(Math.random() * SAMPLE_TEXTS.length));
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const remaining = Math.max(0, time - elapsed);
  const progress = (elapsed / time) * 100;

  const renderText = () => text.split('').map((ch, i) => {
    let cls = 'text-slate-400';
    if (i < input.length) cls = input[i] === ch ? 'text-green-400' : 'text-red-400 underline';
    else if (i === input.length) cls = 'text-white bg-white/20 rounded';
    return <span key={i} className={cls}>{ch}</span>;
  });

  return (
    <>
      <Helmet>
        <title>Typing Speed Test Online — Free WPM Test | StudentAI Tools</title>
        <meta name="description" content="Test your typing speed online for free! Measure your WPM, accuracy, and improve your typing with daily practice. A useful skill-building game for students." />
        <meta name="keywords" content="typing speed test, WPM test online, typing test for students, free typing test, improve typing speed" />
        <link rel="canonical" href="https://studentaitools.in/typing-speed-test" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900/20 to-slate-900 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white mb-2">⌨️ Typing Speed Test</h1>
            <p className="text-slate-400">Type the text below as fast and accurately as you can!</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: 'WPM', value: wpm, color: 'text-cyan-400' },
              { label: 'Accuracy', value: `${accuracy}%`, color: accuracy >= 90 ? 'text-green-400' : 'text-red-400' },
              { label: 'Time Left', value: remaining, color: remaining <= 10 ? 'text-red-400' : 'text-white' },
              { label: 'Best WPM', value: best || '--', color: 'text-yellow-400' },
            ].map((s, i) => (
              <div key={i} className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
                <div className="text-slate-400 text-xs uppercase mb-1">{s.label}</div>
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-slate-700 rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>

          {/* Text display */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mb-4 font-mono text-lg leading-relaxed tracking-wide min-h-24">
            {renderText()}
          </div>

          {/* Input */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInput}
            disabled={finished}
            placeholder={started ? '' : '🖊️ Click here and start typing...'}
            className="w-full bg-slate-800 border-2 border-slate-600 focus:border-cyan-500 rounded-xl p-4 text-white font-mono text-lg outline-none resize-none h-28 transition-colors disabled:opacity-50 mb-4"
            onFocus={() => !started && !finished && inputRef.current?.focus()}
          />

          <div className="flex gap-3 mb-2">
            <select onChange={e => setTime(parseInt(e.target.value))} value={time} className="bg-slate-700 border border-slate-600 text-white rounded-xl px-3 py-2 text-sm flex-1">
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={120}>2 minutes</option>
            </select>
            <button onClick={reset} className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-5 py-2 rounded-xl transition-colors flex-1">Reset</button>
          </div>

          {finished && (
            <div className="bg-cyan-900/50 border border-cyan-500/30 rounded-2xl p-6 text-center mt-4 mb-6">
              <div className="text-5xl mb-2">🏁</div>
              <h2 className="text-2xl font-bold text-white mb-1">Test Complete!</h2>
              <div className="grid grid-cols-2 gap-3 mt-3 mb-4">
                <div className="bg-slate-800 rounded-xl p-3">
                  <div className="text-slate-400 text-sm">Speed</div>
                  <div className="text-cyan-400 text-2xl font-bold">{wpm} WPM</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-3">
                  <div className="text-slate-400 text-sm">Accuracy</div>
                  <div className="text-green-400 text-2xl font-bold">{accuracy}%</div>
                </div>
              </div>
              <button onClick={reset} className="bg-cyan-500 text-white font-bold px-5 py-2.5 rounded-xl">Try Again</button>
            </div>
          )}

          {/* SEO Content */}
          <div className="space-y-6 text-slate-300 mt-8">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">What is a Typing Speed Test?</h2>
              <p>A <strong>typing speed test</strong> measures how many words per minute (WPM) you can type with a given level of accuracy. It is one of the most practical <strong>study break games for students</strong> because it builds a real-world skill used daily in college assignments, coding, emailing, and professional work.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">How to Use This Typing Test</h2>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Click the text area and start typing the passage shown above</li>
                <li>Your <strong>WPM</strong> and <strong>accuracy</strong> update in real time</li>
                <li>Green = correct, Red = error, White cursor = current position</li>
                <li>Choose 30s, 1 min, or 2 min test duration</li>
                <li>Click Reset for a new passage and fresh attempt</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Benefits of Improving Typing Speed</h2>
              <p>Students who type at <strong>60+ WPM</strong> complete assignments up to 2× faster, take more complete notes during lectures, and experience less fatigue during long writing sessions. Improving from 30 WPM to 60 WPM can save you <strong>hours per week</strong> — time you can spend studying or relaxing.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-4">FAQs</h2>
              <div className="space-y-3">
                {faqSchema.mainEntity.map((faq, i) => (
                  <details key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <summary className="text-white font-semibold cursor-pointer">{faq.name}</summary>
                    <p className="text-slate-400 mt-2 text-sm">{faq.acceptedAnswer.text}</p>
                  </details>
                ))}
              </div>
            </section>
            <section className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h2 className="text-white font-bold mb-3">🎮 More Free Games</h2>
              <div className="flex flex-wrap gap-2">
                {[['🔢 2048', '/2048-game'], ['🃏 Memory Cards', '/memory-card-game'], ['➕ Math Quiz', '/math-quiz-game'], ['📝 Word Puzzle', '/word-puzzle-game'], ['🎨 Color Switch', '/color-switch-game'], ['🎮 All Games', '/free-games']].map(([l, p]) => (
                  <Link key={p} to={p} className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 rounded-lg px-3 py-1.5 text-cyan-300 text-sm transition-colors">{l}</Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
