import { useState } from 'react';
import SEO from '../../components/SEO';
import { Quote, Copy, CheckCircle, RefreshCw, HelpCircle, Book } from 'lucide-react';

const CitationGenerator = () => {
  const [style, setStyle] = useState('APA');
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generateCitation = () => {
    if (!author || !title || !year) return;
    
    let citation = '';
    const lastFirst = author.split(' ').reverse().join(', ');

    if (style === 'APA') {
      citation = `${lastFirst} (${year}). ${title}. ${source}.`;
    } else if (style === 'MLA') {
      citation = `${lastFirst}. "${title}." ${source}, ${year}.`;
    } else {
      citation = `${author}. ${title}. ${source}, ${year}.`;
    }

    setResult(citation);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Free Online Citation Generator" 
        description="Generate citations in APA, MLA, and Chicago styles instantly. A must-have free tool for students writing research papers and essays." 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-primary mb-4">
            <Quote className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">Universal Citation Gen</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Create perfect citations for your bibliography in seconds. APA, MLA, and more.</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-12">
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Citation Style</label>
                    <div className="flex gap-4">
                        {['APA', 'MLA', 'Chicago'].map(s => (
                            <button 
                                key={s}
                                onClick={() => setStyle(s)}
                                className={`px-8 py-2 rounded-xl border-2 transition-all font-bold ${style === s ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Author Name</label>
                  <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g., Albert Einstein" className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Source Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Theory of Relativity" className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Publisher/URL</label>
                  <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g., Oxford Press" className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Year</label>
                  <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:border-primary transition-all" />
                </div>
            </div>
            
            <button 
              onClick={generateCitation}
              disabled={!author || !title}
              className="w-full bg-primary hover:bg-indigo-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Generate Citation</span>
            </button>
          </div>

          <div className="p-8 md:p-12 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
             {result ? (
                <div className="flex flex-col md:flex-row items-center gap-6 animate-in fade-in duration-500">
                    <div className="flex-grow p-6 bg-white dark:bg-slate-800 rounded-2xl border-2 border-primary/20 italic dark:text-white">
                        {result}
                    </div>
                    <button 
                        onClick={copyResult}
                        className="bg-primary hover:bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg flex items-center gap-2"
                    >
                        {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
             ) : (
                <div className="text-center opacity-30 py-8">
                    <Book className="w-12 h-12 mx-auto mb-2" />
                    <p>Enter details above to generate citation.</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitationGenerator;
