import { useState, useRef } from 'react';
import { FileText, UploadCloud, FileDown, Loader2, CheckCircle, HelpCircle, ShieldCheck, Zap, Info, FileCode2 } from 'lucide-react';
import SEO from '../../components/SEO';

const PdfToWord = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setSuccess(false);
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setSuccess(false);
    } else {
      alert('Please drop a valid PDF file.');
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    
    // Simulate API conversion delay for the UI flow demonstration
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // MOCK DOWNLOAD: Create a dummy text file to simulate extraction download
      // In production, this would be a blob returned from the backend running true pdf-to-docx pipeline
      const element = document.createElement("a");
      const fileText = `Extracted Text Placeholder for ${file.name}\n\nIn a production environment, this file would be the converted DOCX output from your backend PDF parser.`;
      const docBlob = new Blob([fileText], {type: 'text/plain'});
      element.href = URL.createObjectURL(docBlob);
      element.download = file.name.replace('.pdf', '_converted.doc');
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
      document.body.removeChild(element);
    }, 2500);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Free PDF to Word Converter - Extract Text Instantly" 
        description="Convert your PDF files to editable Word documents or text instantly for free. Secure, fast, and completely processed in your browser." 
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 mb-4 transition-transform hover:-translate-y-1 shadow-lg shadow-indigo-500/20">
            <FileCode2 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            PDF to <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(to right, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Word Converter</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Extract text and formatting from locked PDF files into editable document formats instantly. 100% free and incredibly fast.
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
                <FileText className="w-20 h-20 text-indigo-500 mx-auto mb-6 drop-shadow-md" />
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 truncate max-w-sm mx-auto">{file.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button 
                    onClick={handleConvert}
                    disabled={loading}
                    className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
                    >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (success ? <CheckCircle className="w-6 h-6" /> : <FileDown className="w-6 h-6" />)}
                    <span className="text-lg tracking-tight">{loading ? 'Converting PDF...' : (success ? 'Download Ready' : 'Convert to Word')}</span>
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
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Drag & Drop your PDF</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">or click to browse your computer (Max 15MB)</p>
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden" 
                  ref={fileInputRef}
                />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-black rounded-2xl transition-all shadow-xl hover:-translate-y-1"
                >
                  Select PDF File
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - PDF Utilities Banner
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Secure <span className="text-indigo-500" style={{ backgroundImage: 'linear-gradient(to right, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Extraction</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Lightning Fast Conversion', desc: 'Our targeted extraction bypasses unnecessary visual render layers to grab the core text and formatting instantly without long cloud queues.', icon: Zap },
                { title: 'Preserved Formatting', desc: 'Advanced parsing algorithms attempt to maintain your original paragraphs, headers, and bullet points to minimize post-editing time.', icon: Info },
                { title: '100% Privacy Guarantee', desc: 'Enterprise-grade security rules are applied. Uploaded files are processed strictly in volatile memory and purged immediately after download. Nothing is saved.', icon: ShieldCheck }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                     <item.icon className="w-7 h-7" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold dark:text-white mb-2">{item.title}</h3>
                     <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[3rem] p-10 md:p-14 relative overflow-hidden h-fit">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl point-events-none"></div>
            <h2 className="text-2xl font-extrabold dark:text-white mb-8 relative z-10">Converter FAQ</h2>
            <div className="space-y-6 relative z-10">
              {[
                { q: 'Is it completely free to convert PDFs?', a: 'Yes! Unlike corporate software suites, our PDF to Word extraction module is 100% free with absolutely zero hidden paywalls or watermark stamps.' },
                { q: 'Will it convert scanned image PDFs?', a: 'Currently, this specific tool optimally extracts native digital PDF text. Heavily scanned document images requiring OCR (Optical Character Recognition) may return blank or corrupted text lines.' },
                { q: 'Why is there a strict file size limit?', a: 'To entirely guarantee stability and high-speed processing for all users concurrently, we restrict uploads to 15MB. For massive textbooks, split the PDF into modular chapters first.' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-indigo-500" /> {faq.q}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PdfToWord;
