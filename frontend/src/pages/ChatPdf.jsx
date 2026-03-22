import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import AdBanner from '../components/AdBanner';
import { UploadCloud, MessageSquare, Send, RefreshCw, Loader2, Bot, User, FileText } from 'lucide-react';

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
      setError(err.response?.data?.message || `Upload Error (${err.response?.status || err.message}): Make sure your local backend is running, or deploy the backend changes before testing!`);
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
      setError(err.response?.data?.message || `AI Connection Error (${err.response?.status || err.message})`);
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
      <Helmet><title>Chat with PDF - StudentAI Tools</title></Helmet>
      
      <div className="w-full max-w-5xl px-4 sm:px-6 flex-grow flex flex-col">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">Chat with PDF</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Upload any book, paper, or document and instantly talk to it. The AI understands the entire context instantly.</p>
        </div>

        <AdBanner format="horizontal" />

        <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col flex-grow h-[75vh] min-h-[600px] mb-8">
          
          {/* Top Bar Navigation */}
          <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center z-10">
            <div className="flex items-center space-x-3">
              {pdfText ? (
                 <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
                   <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                   PDF Loaded {pdfInfo?.pages && `(${pdfInfo.pages} Pages)`}
                 </div>
              ) : (
                <span className="text-slate-500 font-medium flex items-center">
                   <FileText className="w-4 h-4 mr-2" /> No PDF Selected
                </span>
              )}
            </div>
            
            {pdfText && (
              <button onClick={resetChat} className="flex items-center space-x-2 text-sm text-slate-500 hover:text-red-500 font-medium transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Upload New</span>
              </button>
            )}
          </div>

          {/* Conditional Work Area */}
          {!pdfText ? (
            <div className="flex-grow flex flex-col items-center justify-center p-8">
              {isUploading ? (
                <div className="text-center space-y-6">
                  <div className="relative inline-flex">
                    <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/50 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 p-6 rounded-full">
                      <Loader2 className="w-12 h-12 animate-spin" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Analyzing Document...</h3>
                    <p className="text-slate-500 mt-2">Extracting pages and building AI context.</p>
                  </div>
                </div>
              ) : (
                <div className="max-w-md w-full text-center">
                  <UploadCloud className="w-20 h-20 text-indigo-200 dark:text-indigo-900 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Upload your PDF</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">Drag and drop your file here, or click to browse. We support massively long books and research papers!</p>
                  
                  {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">{error}</div>}
                  
                  <label className="cursor-pointer flex items-center justify-center space-x-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-indigo-500/30">
                    <FileText className="w-5 h-5" />
                    <span>Select PDF Document</span>
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Chat View */}
              <div className="flex-grow overflow-y-auto p-4 md:p-6 bg-slate-50/50 dark:bg-slate-900/50 space-y-6 scroll-smooth">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'ml-3 bg-indigo-100 text-indigo-600' : 'mr-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>
                      
                      {/* Bubble */}
                      <div className={`px-5 py-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'}`}>
                        <div className={`prose max-w-none ${msg.role === 'user' ? 'prose-invert prose-p:text-white prose-a:text-indigo-200' : 'dark:prose-invert prose-slate'}`}>
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex flex-row max-w-[85%]">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm mr-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="px-5 py-5 rounded-2xl shadow-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-sm flex items-center space-x-2">
                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="text-center font-medium text-red-500 bg-red-50 p-3 rounded-lg w-fit mx-auto">{error}</div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Box */}
              <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4">
                <form onSubmit={handleSendMessage} className="relative flex items-center max-w-4xl mx-auto">
                  <input
                    type="text"
                    disabled={isTyping}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask questions about your PDF here..."
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-full py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner transition-all disabled:opacity-50"
                  />
                  <button 
                    type="submit" 
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-full transition-colors shadow-sm"
                  >
                    <Send className="w-5 h-5 ml-0.5" />
                  </button>
                </form>
                <div className="text-center mt-3 text-xs font-medium text-slate-400">
                  AI can sometimes make mistakes. Always verify important claims by checking the document yourself.
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ChatPdf;
