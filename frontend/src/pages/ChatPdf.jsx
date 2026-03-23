import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import SEO from '../components/SEO';
import { 
  UploadCloud, MessageSquare, Send, RefreshCw, Loader2, 
  Bot, User, FileText, Sparkles, Brain, Zap, HelpCircle, 
  ShieldCheck, Search 
} from 'lucide-react';

const ChatPdf = () => {
  const [file, setFile] = useState(null);
  const [pdfText, setPdfText] = useState('');
  const [pdfInfo, setPdfInfo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Hello! I've successfully processed your document. What would you like to know about it?" }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF document.');
      return;
    }
    
    setFile(selectedFile);
    setError('');
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload/parse-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPdfText(res.data.text);
      setPdfInfo({ pages: res.data.pages });
    } catch (err) {
      setError(err.response?.data?.message || `Upload Error: Local backend might not be configured for PDF parsing yet.`);
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setError('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/chat-pdf`, {
        question: userMsg.content,
        pdfText: pdfText,
        history: messages.slice(1) // exclude default greeting
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.answer }]);
    } catch (err) {
      setError(err.response?.data?.message || `AI Connection Error: Check if server is running.`);
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered a network problem. Please try asking again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetChat = () => {
    setFile(null);
    setPdfText('');
    setPdfInfo(null);
    setMessages([{ role: 'assistant', content: "Hello! I've successfully processed your document. What would you like to know about it?" }]);
    setError('');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900 flex flex-col items-center">
      <SEO 
        title="Chat with PDF - Talk to any Document with AI" 
        description="Upload research papers, textbooks, or manuals and instantly get answers. Our AI understands PDF context for accurate summaries and explanations." 
      />
      
      <div className="w-full max-w-6xl px-4 sm:px-6 flex-grow flex flex-col">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 mb-4 transition-transform hover:scale-110">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Chat <span className="text-gradient">with PDF</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop scrolling through hundreds of pages. Upload any document and ask questions to get instant, precise answers from the text.
          </p>
        </div>

        <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col flex-grow h-[75vh] min-h-[650px] mb-12">
          {/* Top Bar Navigation */}
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-5 flex justify-between items-center z-10">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${pdfText ? 'bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                {pdfText ? `Context Primed (${pdfInfo?.pages} Pages)` : 'Awaiting Document'}
              </h2>
            </div>
            
            {pdfText && (
              <button onClick={resetChat} className="flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                <RefreshCw className="w-4 h-4" />
                <span>Reset Engine</span>
              </button>
            )}
          </div>

          {/* Conditional Work Area */}
          {!pdfText ? (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-slate-50/20 dark:bg-transparent">
              {isUploading ? (
                <div className="space-y-8">
                  <div className="relative inline-flex">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
                    <div className="relative bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 p-8 rounded-full shadow-inner">
                      <Loader2 className="w-16 h-16 animate-spin" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">Analyzing Brain...</h3>
                    <p className="text-slate-500 mt-3 font-medium">Extracting semantic markers and building AI context.</p>
                  </div>
                </div>
              ) : (
                <div className="max-w-lg w-full">
                  <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner group transition-transform hover:scale-110">
                    <UploadCloud className="w-12 h-12 text-indigo-200 dark:text-indigo-800 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Prime the AI</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                    Drag your PDF here or browse your files. We support research papers, ebooks, and complex manuals up to 50MB.
                  </p>
                  
                  {error && <div className="bg-red-50 text-red-600 p-5 rounded-2xl mb-8 border border-red-100 text-sm font-bold flex items-center gap-3 justify-center">
                    <HelpCircle className="w-5 h-5 flex-shrink-0" /> {error}
                  </div>}
                  
                  <label className="cursor-pointer flex items-center justify-center gap-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-8 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]">
                    <FileText className="w-6 h-6" />
                    <span className="text-lg">Select PDF Document</span>
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Chat View */}
              <div className="flex-grow overflow-y-auto p-6 md:p-10 space-y-8 scroll-smooth custom-scrollbar bg-white/30 dark:bg-transparent">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                        msg.role === 'user' 
                        ? 'ml-4 bg-indigo-600 text-white' 
                        : 'mr-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-indigo-500'
                      }`}>
                        {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                      </div>
                      
                      {/* Bubble */}
                      <div className={`px-6 py-5 rounded-3xl shadow-xl leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-slate-900 border border-slate-800 text-white rounded-tr-sm' 
                        : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-sm'
                      }`}>
                        <div className={`prose prose-sm md:prose-base max-w-none ${msg.role === 'user' ? 'prose-invert prose-p:text-slate-300' : 'dark:prose-invert prose-indigo'}`}>
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex flex-row">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg mr-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-indigo-500">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div className="px-8 py-6 rounded-3xl shadow-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-sm flex items-center space-x-3">
                        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Box */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-6">
                <form onSubmit={handleSendMessage} className="relative flex items-center max-w-5xl mx-auto group">
                   <div className="absolute left-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                     <Search className="w-5 h-5" />
                   </div>
                  <input
                    type="text"
                    disabled={isTyping}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about conclusions, methodology, or specific facts..."
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-[2rem] py-5 pl-14 pr-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner transition-all disabled:opacity-50 font-medium"
                  />
                  <button 
                    type="submit" 
                    disabled={!input.trim() || isTyping}
                    className="absolute right-3 p-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-full transition-all shadow-lg hover:shadow-indigo-500/30 active:scale-90"
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </form>
                <div className="text-center mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> Private AI Context Engine - Powered by StudentAI
                </div>
              </div>
            </>
          )}
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-32 glass-card rounded-3xl flex items-center justify-center text-slate-400 text-sm mb-24 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Academic Research Hubs
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Interactive <span className="text-indigo-600">Research</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Semantic Extraction', desc: 'Our AI doesn\'t just search for keywords; it understands the semantic relationships between concepts in your document.', icon: Brain },
                { title: 'Citational Precision', desc: 'Ask for specific page numbers or sections to verify AI claims directly against the source material.', icon: ShieldCheck },
                { title: 'Infinite Context', desc: 'Whether it\'s a 2-page essay or a 500-page medical textbook, the AI maintains a consistent global view of the content.', icon: Zap }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                     <item.icon className="w-7 h-7" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold dark:text-white mb-2">{item.title}</h3>
                     <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[3rem] p-10 md:p-14 relative overflow-hidden h-fit">
            <h2 className="text-2xl font-extrabold dark:text-white mb-8">Chat PDF FAQ</h2>
            <div className="space-y-6">
              {[
                { q: 'Is my data secure?', a: 'Document context is processed in a secure sandbox and is never used to train global AI models. Your data remains yours.' },
                { q: 'Can it summarize entire books?', a: 'Yes! The AI can provide high-level summaries or dive deep into specific chapters of large texts.' },
                { q: 'Does it support scanned PDFs?', a: 'It works best with text-based PDFs. For scanned images, we recommend running OCR before uploading.' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-500" /> {faq.q}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPdf;
