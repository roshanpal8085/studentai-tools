import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import SEO from '../../components/SEO';
import {
  Wand2, Loader2, Copy, Check, ClipboardPaste, Trash2, Download,
  RefreshCw, History, Eye, EyeOff, Sliders, ChevronDown, Sparkles,
  Zap, Feather, GraduationCap, Scissors, Maximize2, BarChart2,
  HelpCircle, ShieldCheck, Lock, Star, ArrowRight, X
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const MODES = [
  { id: 'standard',  label: 'Standard',  icon: Wand2,        desc: 'Natural rewrite preserving meaning',     color: 'indigo',  gradient: 'from-indigo-500 to-purple-500' },
  { id: 'fluency',   label: 'Fluency',   icon: Feather,      desc: 'Smooth native-speaker flow',             color: 'sky',     gradient: 'from-sky-500 to-blue-500',     free: true },
  { id: 'creative',  label: 'Creative',  icon: Sparkles,     desc: 'Vivid, expressive rewriting',            color: 'violet',  gradient: 'from-violet-500 to-pink-500',  locked: true },
  { id: 'formal',    label: 'Formal',    icon: GraduationCap,desc: 'Academic & professional register',       color: 'teal',    gradient: 'from-teal-500 to-emerald-500' },
  { id: 'shorten',   label: 'Shorten',   icon: Scissors,     desc: 'Condenses without losing key points',   color: 'orange',  gradient: 'from-orange-500 to-amber-500' },
  { id: 'expand',    label: 'Expand',    icon: Maximize2,    desc: 'Enriches text with depth & examples',   color: 'rose',    gradient: 'from-rose-500 to-pink-500',    locked: true },
];

const TONES = [
  { id: 'casual',       label: 'Casual' },
  { id: 'professional', label: 'Professional' },
  { id: 'academic',     label: 'Academic' },
];

const MAX_CHARS = 1000;

// ─── Diff Highlighter ────────────────────────────────────────────────────────
const computeWordDiff = (original, paraphrased) => {
  const origWords  = original.trim().split(/\s+/);
  const paraWords  = paraphrased.trim().split(/\s+/);
  const origSet    = new Set(origWords.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')));
  return paraWords.map(word => {
    const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    const changed = clean.length > 2 && !origSet.has(clean);
    return { word, changed };
  });
};

const HighlightedOutput = ({ original, paraphrased, showHighlights }) => {
  const tokens = showHighlights ? computeWordDiff(original, paraphrased) : null;
  if (!showHighlights) {
    return <p className="text-slate-800 dark:text-slate-100 leading-relaxed font-medium whitespace-pre-wrap">{paraphrased}</p>;
  }
  return (
    <p className="text-slate-800 dark:text-slate-100 leading-relaxed font-medium whitespace-pre-wrap">
      {tokens.map((t, i) => (
        t.changed
          ? <mark key={i} className="bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 rounded px-0.5 mx-px transition-colors">{t.word} </mark>
          : <span key={i}>{t.word} </span>
      ))}
    </p>
  );
};

// ─── Score Ring ──────────────────────────────────────────────────────────────
const ScoreRing = ({ value, label, color }) => {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const fill = (value / 100) * circ;
  const colorMap = {
    indigo: '#6366f1', sky: '#0ea5e9', emerald: '#10b981',
  };
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-200 dark:text-slate-700" />
          <circle cx="36" cy="36" r={r} fill="none" stroke={colorMap[color] || '#6366f1'} strokeWidth="6"
            strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-slate-800 dark:text-white">{value}</span>
      </div>
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ParaphrasingTool = () => {
  const [inputText, setInputText]       = useState('');
  const [result, setResult]             = useState('');
  const [metadata, setMetadata]         = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [mode, setMode]                 = useState('standard');
  const [tone, setTone]                 = useState('professional');
  const [synonymLevel, setSynonymLevel] = useState(50);
  const [showHighlights, setShowHighlights] = useState(true);
  const [copied, setCopied]             = useState(false);
  const [history, setHistory]           = useState(() => {
    try { return JSON.parse(localStorage.getItem('para_history') || '[]'); } catch { return []; }
  });
  const [showHistory, setShowHistory]   = useState(false);
  const [lockedModal, setLockedModal]   = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const retryTimer = useRef(null);
  const textareaRef = useRef(null);

  const selectedMode = MODES.find(m => m.id === mode) || MODES[0];
  const wordCount    = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount    = inputText.length;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const startRetryCountdown = useCallback((secs, retryFn) => {
    setRetryCountdown(secs);
    let remaining = secs;
    retryTimer.current = setInterval(() => {
      remaining -= 1;
      setRetryCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(retryTimer.current);
        setRetryCountdown(0);
        retryFn();
      }
    }, 1000);
  }, []);

  const handleParaphrase = useCallback(async () => {
    if (!inputText.trim() || loading) return;
    const currentMode = MODES.find(m => m.id === mode);
    if (currentMode?.locked) { setLockedModal(true); return; }

    clearInterval(retryTimer.current);
    setRetryCountdown(0);
    setLoading(true);
    setError('');
    setResult('');
    setMetadata(null);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/paraphrase`,
        { text: inputText, mode, tone, synonymLevel }
      );
      const { paraphrased, metadata: meta } = res.data;
      setResult(paraphrased);
      setMetadata(meta);

      // Save to history
      const entry = { id: Date.now(), input: inputText.slice(0, 120), output: paraphrased, mode, tone, time: new Date().toLocaleTimeString() };
      const updated = [entry, ...history].slice(0, 10);
      setHistory(updated);
      localStorage.setItem('para_history', JSON.stringify(updated));
    } catch (err) {
      const msg = err.response?.data?.message || '';
      const isRateLimit = err.response?.status === 429 || msg.toLowerCase().includes('limit') || msg.toLowerCase().includes('exhausted') || msg.toLowerCase().includes('busy');
      if (isRateLimit) {
        setError('⏳ AI servers are busy right now. Auto-retrying in a few seconds…');
        // Auto-retry after 8 seconds
        startRetryCountdown(8, () => handleParaphrase());
      } else {
        setError(msg || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [inputText, mode, tone, synonymLevel, loading, history, startRetryCountdown]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text.slice(0, MAX_CHARS));
      textareaRef.current?.focus();
    } catch { /* non-critical */ }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'paraphrased.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('para_history');
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-20 pb-16 bg-slate-50 dark:bg-slate-900">
      <SEO
        title="Free AI Paraphrasing Tool (No Login Required) — Better than Quillbot"
        description="Rewrite any text instantly with AI. 6 paraphrasing modes (Standard, Fluency, Creative, Formal, Shorten, Expand), tone selector, highlight changes feature, readability score. 100% free."
        keywords="ai paraphrasing tool, paraphrase online, reword text, quillbot alternative, free paraphraser, rewrite text ai, paraphrase generator"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "AI Paraphrasing Tool",
          "operatingSystem": "Web",
          "applicationCategory": "EducationalApplication",
          "description": "Advanced AI paraphrasing tool with 6 rewriting modes, tone control, synonym intensity, and highlighted word changes.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Hero Header ──────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700/50 rounded-full px-4 py-1.5 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">No Login Required · 100% Free</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            AI <span style={{ backgroundImage: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Paraphrasing</span> Tool
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Rewrite smarter — 6 AI modes, tone control, synonym intensity, and live word-change highlights. The Quillbot alternative users actually prefer.
          </p>
        </div>

        {/* ── Mode Selector ──────────────────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => m.locked ? setLockedModal(true) : setMode(m.id)}
              title={m.desc}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border
                ${mode === m.id && !m.locked
                  ? `bg-gradient-to-r ${m.gradient} text-white border-transparent shadow-lg`
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                }`}
            >
              <m.icon className="w-4 h-4" />
              {m.label}
              {m.locked && <Lock className="w-3 h-3 text-amber-500 ml-0.5" />}
            </button>
          ))}
        </div>

        {/* ── Two-Panel Layout ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Input Panel */}
          <div className="glass-card rounded-[2rem] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 shadow-xl">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Your Text</span>
              <div className="flex items-center gap-2">
                <button onClick={handlePaste} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                  <ClipboardPaste className="w-3.5 h-3.5" /> Paste
                </button>
                <button onClick={() => { setInputText(''); setResult(''); setMetadata(null); setError(''); }} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={e => setInputText(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Paste or type your text here to paraphrase…"
              className="flex-grow min-h-[300px] p-6 bg-transparent border-none outline-none resize-none text-slate-800 dark:text-slate-200 text-base leading-relaxed custom-scrollbar placeholder-slate-400"
            />

            {/* Footer: counters + button */}
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>{wordCount} words · {charCount} chars</span>
                <span className={charCount > MAX_CHARS * 0.9 ? 'text-amber-500 font-bold' : ''}>{charCount} / {MAX_CHARS}</span>
              </div>

              <button
                onClick={handleParaphrase}
                disabled={loading || !inputText.trim() || charCount > MAX_CHARS}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-base uppercase tracking-wide transition-all disabled:opacity-50 active:scale-[0.98] text-white shadow-xl shadow-indigo-500/25"
                style={{ background: loading ? '#818cf8' : 'linear-gradient(135deg, #6366f1, #a855f7)' }}
              >
                {loading
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Paraphrasing…</>
                  : <><Wand2 className="w-5 h-5" /> Paraphrase Now</>
                }
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="glass-card rounded-[2rem] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 shadow-xl relative">
            <div className="absolute top-0 right-0 w-56 h-56 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />

            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-10">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Paraphrased Output</span>
              <div className="flex items-center gap-2">
                {result && (
                  <>
                    <button onClick={() => setShowHighlights(h => !h)} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                      {showHighlights ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {showHighlights ? 'Hide' : 'Show'} Changes
                    </button>
                    <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={handleDownload} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                      <Download className="w-3.5 h-3.5" /> .txt
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Output body */}
            <div className="flex-grow min-h-[300px] p-6 overflow-y-auto custom-scrollbar relative z-10">
              {error && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-2xl border border-amber-200 dark:border-amber-800/50 text-sm font-bold mb-4 text-center">
                  <p>{error}</p>
                  {retryCountdown > 0 && (
                    <div className="mt-3 flex items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-full border-4 border-amber-300 border-t-amber-600 animate-spin" />
                      <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{retryCountdown}s</span>
                      <button onClick={() => { clearInterval(retryTimer.current); setRetryCountdown(0); setError(''); }}
                        className="text-xs px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 transition-colors">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
              {loading && (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400 py-16">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
                  <p className="text-sm font-bold animate-pulse">AI is rewriting your text…</p>
                </div>
              )}
              {!loading && result && (
                <div className="animate-fade-in-up">
                  <HighlightedOutput original={inputText} paraphrased={result} showHighlights={showHighlights} />
                </div>
              )}
              {!loading && !result && !error && (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 dark:text-slate-700 py-16">
                  <Wand2 className="w-16 h-16 mb-4" />
                  <p className="text-base font-black">Output appears here</p>
                  <p className="text-sm text-center mt-2 max-w-xs">Choose a mode, configure settings, and click Paraphrase Now.</p>
                </div>
              )}
            </div>

            {/* Regenerate button */}
            {result && (
              <div className="px-6 pb-5 border-t border-slate-200 dark:border-slate-800 pt-4 bg-slate-50/80 dark:bg-slate-900/80 z-10">
                <button onClick={handleParaphrase} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Smart Controls ──────────────────────────────────────────── */}
        <div className="glass-card rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-xl mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Sliders className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-black uppercase tracking-widest text-slate-500">Smart Controls</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Tone</label>
              <div className="flex gap-2">
                {TONES.map(t => (
                  <button key={t.id} onClick={() => setTone(t.id)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all border
                      ${tone === t.id
                        ? 'bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-500/30'
                        : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                  >{t.label}</button>
                ))}
              </div>
            </div>

            {/* Synonym Level */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
                Synonym Intensity — <span className="text-indigo-500">{synonymLevel < 34 ? 'Subtle' : synonymLevel < 67 ? 'Moderate' : 'Aggressive'}</span>
              </label>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400">Low</span>
                <input type="range" min={0} max={100} value={synonymLevel}
                  onChange={e => setSynonymLevel(Number(e.target.value))}
                  className="flex-1 accent-indigo-600 h-2 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-400">High</span>
              </div>
            </div>

            {/* Scores (shown after result) */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Output Quality</label>
              {metadata ? (
                <div className="flex gap-4 justify-start">
                  <ScoreRing value={metadata.readability} label="Readability" color="indigo" />
                  <ScoreRing value={metadata.uniqueness}  label="Uniqueness"  color="sky" />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-400 font-medium h-16">
                  <BarChart2 className="w-4 h-4" /> Scores appear after paraphrasing
                </div>
              )}
            </div>
          </div>

          {/* Improvements suggestions */}
          {metadata?.improvements?.length > 0 && (
            <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">What AI improved</p>
              <div className="flex flex-wrap gap-2">
                {metadata.improvements.map((imp, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800/50">
                    <Check className="w-3 h-3" /> {imp}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── History ────────────────────────────────────────────────── */}
        {history.length > 0 && (
          <div className="glass-card rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl mb-8 overflow-hidden">
            <button
              onClick={() => setShowHistory(h => !h)}
              className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-black uppercase tracking-widest text-slate-500">Recent Paraphrases ({history.length})</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
            </button>
            {showHistory && (
              <div className="border-t border-slate-200 dark:border-slate-800">
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto custom-scrollbar">
                  {history.map(item => (
                    <div key={item.id}
                      onClick={() => { setInputText(item.input); setResult(item.output); setMode(item.mode); setTone(item.tone); setMetadata(null); setShowHistory(false); }}
                      className="flex items-start gap-4 px-6 py-4 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 cursor-pointer transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                        <History className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{item.input}…</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.mode} · {item.tone} · {item.time}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 flex-shrink-0 mt-1 transition-colors" />
                    </div>
                  ))}
                </div>
                <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800">
                  <button onClick={handleClearHistory} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Clear All History
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Ad placeholder ──────────────────────────────────────────── */}
        <div className="w-full h-20 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-10 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement — AI Writing Tools Hub
        </div>

        {/* ── Features + FAQ ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20 py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-10">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Why choose our <span style={{ backgroundImage: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Paraphraser?</span>
            </h2>
            <div className="space-y-8">
              {[
                { title: 'Live Change Highlights', desc: 'See exactly which words were replaced — toggle on/off to compare original vs rewritten text side by side with coloured highlights.', icon: Eye },
                { title: '6 Specialized Modes', desc: 'From academic formal rewrites to creative expansions — pick the mode that matches your exact goal, not a one-size-fits-all output.', icon: Zap },
                { title: 'Synonym Intensity Control', desc: 'A unique slider lets you dial from subtle rephrasing to an aggressive full rewrite, giving you precision no competitor offers.', icon: Sliders },
                { title: 'Privacy-First Architecture', desc: 'Your text is processed in real time and never stored. No account needed, no data logging — just instant rewrites.', icon: ShieldCheck },
              ].map((f, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold dark:text-white mb-1">{f.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-sm">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden h-fit">
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-2xl font-extrabold dark:text-white mb-6 relative z-10">Paraphraser FAQ</h2>
            <div className="space-y-5 relative z-10">
              {[
                { q: 'Is it completely free?', a: 'Yes. Our Standard, Fluency, and Formal modes are 100% free with no login or daily limit. Creative and Expand modes are available for power users.' },
                { q: 'How is this better than Quillbot?', a: 'We offer a live word-change highlighter, synonym intensity slider, tone control, local history, and a readability score — features that Quillbot locks behind a paywall.' },
                { q: 'Does it keep my text?', a: 'Never. Your text is processed on-the-fly by the AI and immediately discarded. We do not store, log, or use your content for training.' },
                { q: 'What is the word limit?', a: 'The free tier supports up to 1,000 characters (~150–200 words) per request, optimised for short paragraphs and fast responses.' },
                { q: 'Can it paraphrase academic writing?', a: 'Absolutely. Select "Formal" mode with "Academic" tone and set a moderate synonym level for scholarly-quality rewrites that preserve citations and technical terms.' },
              ].map((faq, i) => (
                <div key={i} className="pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2 text-sm">
                    <HelpCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" /> {faq.q}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Locked Mode Modal ──────────────────────────────────────────── */}
      {lockedModal && (
        <div className="fixed inset-0 z-[300] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setLockedModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700 animate-scale-in" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLockedModal(false)} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X className="w-4 h-4 text-slate-400" />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/30">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-extrabold text-center dark:text-white mb-2">Premium Mode</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center text-sm leading-relaxed mb-6">
              <strong>Creative</strong> and <strong>Expand</strong> modes are part of our daily usage limit for heavy users. Try Standard, Fluency, or Formal — they're fully free and surprisingly powerful.
            </p>
            <button onClick={() => setLockedModal(false)}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 transition-all">
              Continue with Free Modes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParaphrasingTool;
