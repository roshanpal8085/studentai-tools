import { useState, useRef } from 'react';
import { FileType, UploadCloud, FileDown, Loader2, CheckCircle, HelpCircle, ShieldCheck, Zap, Info, FileCode2 } from 'lucide-react';
import SEO from '../../components/SEO';
import mammoth from 'mammoth';
import html2pdf from 'html2pdf.js';

const WordToPdf = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const hiddenHtmlContainerRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || selectedFile.name.endsWith('.docx'))) {
      setFile(selectedFile);
      setSuccess(false);
    } else {
      alert('Please select a valid Word (.docx) file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || droppedFile.name.endsWith('.docx'))) {
      setFile(droppedFile);
      setSuccess(false);
    } else {
      alert('Please drop a valid Word (.docx) file.');
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    
    try {
      // 1. Read Word file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // 2. Convert DOCX to HTML using mammoth
      const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
      const html = result.value; // The generated HTML
      
      if (!html) {
        throw new Error("No text or content extracted from Word document.");
      }

      // 3. Inject HTML into hidden container to render for PDF generation
      const container = hiddenHtmlContainerRef.current;
      container.innerHTML = html;

      // 4. Configure html2pdf
      const opt = {
        margin:       1,
        filename:     file.name.replace('.docx', '.pdf'),
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // 5. Generate and download PDF
      await html2pdf().from(container).set(opt).save();
      
      setSuccess(true);
    } catch (error) {
      console.error("Conversion error:", error);
      alert("Failed to convert Word file. Ensure it is a valid .docx format.");
    } finally {
      setLoading(false);
      // Clean up the hidden container
      if (hiddenHtmlContainerRef.current) {
         hiddenHtmlContainerRef.current.innerHTML = '';
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Free Word to PDF Converter - Convert DOCX to PDF Instantly (2026)" 
        canonical="/tools/word-to-pdf"
        description="Convert Word (.docx) documents to PDF files instantly for free. No upload required — 100% browser-based, private, and fast. Perfect for students and professionals."
        keywords="word to pdf, docx to pdf, convert word to pdf free, document converter, student tools"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Word to PDF Converter",
            "operatingSystem": "Web",
            "applicationCategory": "UtilitiesApplication",
            "description": "Fast and secure conversion of Word documents (.docx) into PDF files. Completely browser-based with no server uploads.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
          }
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 mb-4 transition-transform hover:-translate-y-1 shadow-lg shadow-indigo-500/20">
            <FileType className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Word to <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(to right, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>PDF Converter</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Instantly convert your editable Word documents into professional, shareable PDF files. 100% free and private.
          </p>
        </div>

        {/* Converter Tool Card */}
        <div className="glass-card rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-14 mb-16 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl point-events-none"></div>

          <div
            className={`relative z-10 w-full max-w-3xl mx-auto border-4 border-dashed rounded-[2.5rem] p-12 transition-all duration-300 flex flex-col items-center justify-center text-center ${
              file ? 'border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 block'
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="w-full animate-in fade-in zoom-in duration-300">
                <FileType className="w-20 h-20 text-indigo-500 mx-auto mb-6 drop-shadow-md" />
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 truncate max-w-sm mx-auto">{file.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button 
                    onClick={handleConvert}
                    disabled={loading}
                    className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
                    >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (success ? <CheckCircle className="w-6 h-6" /> : <FileDown className="w-6 h-6" />)}
                    <span className="text-lg tracking-tight">{loading ? 'Converting to PDF...' : (success ? 'Success! Downloaded.' : 'Convert to PDF')}</span>
                    </button>
                    <button 
                    onClick={() => {setFile(null); setSuccess(false);}}
                    disabled={loading}
                    className="px-6 py-4 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300 font-bold rounded-2xl transition-all"
                    >
                    Cancel
                    </button>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center mx-auto mb-6">
                  <UploadCloud className="w-10 h-10 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Drag & Drop your DOCX</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">or click to browse your computer (Max 15MB)</p>
                <input 
                  type="file" 
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden" 
                  ref={fileInputRef}
                />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-black rounded-2xl transition-all shadow-xl hover:-translate-y-1"
                >
                  Select Word File
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hidden container for rendering HTML before converting to PDF */}
        <div 
          ref={hiddenHtmlContainerRef} 
          style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '800px' }} 
          className="prose max-w-none bg-white p-10 text-black"
        />

        {/* Ad Space Placement */}
        <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - PDF Utilities Banner
        </div>

        {/* ── E-E-A-T Content Section ──────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto space-y-14 mb-20">

          <section className="bg-white dark:bg-slate-800/50 rounded-[3rem] p-10 md:p-14 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Why Convert Word to PDF?</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
              Word documents are excellent for editing, but they are terrible for sharing. If you send a `.docx` file to a professor or a recruiter, there is a high chance the formatting will break depending on what version of Microsoft Word or Google Docs they use to open it.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
              PDF (Portable Document Format) solves this by "freezing" your document. When you convert your Word document to a PDF, it guarantees that your layout, fonts, and images will look exactly the same on every single device, whether it's an iPhone, a Windows PC, or a Mac.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Use this tool to lock your assignments, resumes, and reports before submitting them. Our client-side processor ensures your document never leaves your computer.
            </p>
          </section>

          {/* Features + FAQ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Why Choose Our Converter?</h2>
              {[
                { title: 'Zero Server Upload', desc: 'Your Word document never leaves your device. All parsing happens in-browser, guaranteeing complete data privacy for your sensitive essays and resumes.', icon: ShieldCheck },
                { title: 'No Installation Required', desc: 'Works directly in your browser — Chrome, Firefox, Edge, or Safari. No desktop app, no plugin, no sign-up required.', icon: Zap },
                { title: 'Universal Compatibility', desc: 'The generated PDF is compatible with all standard PDF readers, grading systems (like Canvas and Blackboard), and Applicant Tracking Systems (ATS).', icon: Info }
              ].map((item, i) => (
                <div className="flex gap-5" key={i}>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-[2rem] p-8 relative overflow-hidden h-fit">
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-indigo-500/8 rounded-full blur-3xl"></div>
              <h2 className="text-2xl font-extrabold dark:text-white mb-6 relative z-10">Frequently Asked Questions</h2>
              <div className="space-y-5 relative z-10">
                {[
                  { q: 'Is it completely free?', a: 'Yes. 100% free, no account required, and no hidden limits. It is supported by non-intrusive educational advertising.' },
                  { q: 'Is my file uploaded to a server?', a: 'Never. The file is read and converted locally in your browser. Your data stays on your device.' },
                  { q: 'Does it support images?', a: 'Basic text and simple formatting are supported best. Very complex Word documents with floating images may not render perfectly.' },
                  { q: 'What is the file size limit?', a: 'We recommend files under 15MB.' },
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

      </div>
    </div>
  );
};

export default WordToPdf;
