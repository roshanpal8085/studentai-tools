import { useState } from 'react';
import SEO from '../../components/SEO';
import { Image, Download, Loader2, CheckCircle, HelpCircle, FileImage, Zap, ShieldCheck, Minimize } from 'lucide-react';
import imageCompression from 'browser-image-compression';

const ImageCompressor = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [compressedFile, setCompressedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState({ maxHeightMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setCompressedFile(null);
        }
    };

    const compressImage = async () => {
        if (!selectedFile) return;
        setLoading(true);
        try {
            const compressed = await imageCompression(selectedFile, options);
            setCompressedFile(compressed);
        } catch (err) {
            console.error('Compression Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = () => {
        if (!compressedFile) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(compressedFile);
        link.download = `compressed_${selectedFile.name}`;
        link.click();
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
            <SEO 
                title="Free Image Compressor - Reduce Photo Size Online" 
                description="Compress JPG, PNG, and WebP images instantly online without losing quality. Free tool to reduce file size for fast uploads and storage saving."
                keywords="image compressor, reduce image size, photo compressor, online image shrinker, free student tool"
                schema={{
                  "@context": "https://schema.org",
                  "@type": "SoftwareApplication",
                  "name": "Smart Image Compressor",
                  "operatingSystem": "Web",
                  "applicationCategory": "UtilitiesApplication",
                  "description": "Fast and secure local image compressor to reduce file sizes for JPG, PNG, and WebP.",
                  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
                }}
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-900/30 text-sky-500 mb-4 transition-transform hover:-translate-y-1 hover:scale-105 shadow-lg shadow-sky-500/20">
                        <Minimize className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Smart <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(to right, #0ea5e9, #3b82f6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Image Compressor</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Radically reduce your image file size without noticeable loss in quality. Optimized for web uploads, email attachments, and assignment portals.
                    </p>
                </div>

                <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-16 h-full min-h-[400px]">
                    <div className="p-10 md:p-16 bg-white/30 dark:bg-slate-950/20 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-center">
                        
                        {!selectedFile && (
                            <div className="max-w-2xl mx-auto border-4 border-dashed border-sky-200 dark:border-sky-900/50 bg-sky-50/50 dark:bg-sky-900/10 rounded-[2rem] p-16 hover:border-sky-500 dark:hover:border-sky-500 transition-all cursor-pointer relative group flex flex-col items-center justify-center shadow-inner hover:shadow-sky-500/10 hover:bg-sky-50 dark:hover:bg-sky-900/20">
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    aria-label="Upload Image to Compress"
                                />
                                <div className="w-24 h-24 mb-6 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                   <FileImage className="w-10 h-10 text-sky-500" />
                                </div>
                                <h3 className="text-2xl font-black dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">Select or Drop Image Here</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Supports JPG, PNG, WEBP (Max 20MB)</p>
                            </div>
                        )}

                        {selectedFile && (
                            <div className="animate-in fade-in zoom-in-95 duration-500">
                                {/* Size Comparison Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center relative shadow-sm">
                                        <div className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Original</div>
                                        <p className="text-slate-500 font-bold mb-2 uppercase tracking-widest text-xs">File Size</p>
                                        <p className="text-4xl font-black text-slate-800 dark:text-white">{(selectedFile.size / 1024 / 1024).toFixed(2)} <span className="text-xl text-slate-400">MB</span></p>
                                    </div>
                                    
                                    <div className={`bg-white dark:bg-slate-900 border-2 rounded-3xl p-8 flex flex-col items-center justify-center relative shadow-md transition-colors duration-500 ${compressedFile ? 'border-sky-400 dark:border-sky-500/50' : 'border-slate-200 dark:border-slate-800'}`}>
                                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${compressedFile ? 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>Compressed</div>
                                        <p className="text-slate-500 font-bold mb-2 uppercase tracking-widest text-xs">New Size</p>
                                        {compressedFile ? (
                                            <div className="flex flex-col items-center">
                                                <p className="text-4xl font-black text-sky-600 dark:text-sky-400">{(compressedFile.size / 1024 / 1024).toFixed(2)} <span className="text-xl text-sky-400/70">MB</span></p>
                                                <div className="mt-3 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                                                    <CheckCircle className="w-4 h-4" /> 
                                                    Saved {((1 - (compressedFile.size / selectedFile.size)) * 100).toFixed(0)}%
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-4xl font-black text-slate-300 dark:text-slate-700">---</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    {!compressedFile ? (
                                        <button 
                                            onClick={compressImage}
                                            disabled={loading}
                                            className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 text-white font-black py-4 px-12 rounded-2xl transition-all shadow-xl shadow-sky-500/20 flex items-center justify-center gap-3 active:scale-[0.98] group disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Minimize className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                                            <span className="text-lg tracking-tight">{loading ? 'Compressing...' : 'Compress Image Now'}</span>
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={downloadImage}
                                            className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-white font-black py-4 px-12 rounded-2xl transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 active:scale-[0.98] group"
                                        >
                                            <Download className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                                            <span className="text-lg tracking-tight">Download Compressed Image</span>
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => {setSelectedFile(null); setCompressedFile(null);}}
                                        disabled={loading}
                                        className="w-full sm:w-auto bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 font-bold py-4 px-8 rounded-2xl hover:border-sky-500 hover:text-sky-600 dark:hover:border-sky-500 dark:hover:text-sky-400 transition-all disabled:opacity-50"
                                    >
                                        Upload Another
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ad Space Placement */}
                <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
                    Ad Placement - Utility Tools Hub
                </div>

                {/* Informational Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
                    <div className="space-y-12">
                        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Optimization <span className="text-sky-500" style={{ backgroundImage: 'linear-gradient(to right, #0ea5e9, #3b82f6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Made Simple</span></h2>
                        <div className="space-y-10">
                            {[
                                { title: 'Lossless Visual Quality', desc: 'Our smart compression algorithm analyzes your image and reduces file size by optimizing data structure, keeping the visual quality intact.', icon: Zap },
                                { title: '100% Secure & Private', desc: 'All compression operations happen locally within your browser using Web Workers. Your sensitive photos are never sent to a cloud server.', icon: ShieldCheck },
                                { title: 'Faster Web Uploads', desc: 'Perfect for students uploading large scanned assignments to university portals that have strictly enforced 2MB or 5MB file limits.', icon: Image }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                   <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-900/30 text-sky-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
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
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl"></div>
                        <h2 className="text-2xl font-extrabold dark:text-white mb-8 relative z-10">Compressor FAQ</h2>
                        <div className="space-y-6 relative z-10">
                            {[
                                { q: 'How much smaller will my image get?', a: 'Savings vary by image content and format, but typically you can expect an 80% to 90% reduction in file size (e.g. 10MB down to 1MB) without noticeable artifacting.' },
                                { q: 'Do you keep a copy of my images?', a: 'Absolutely not. This entire platform is built with a privacy-first architecture. The compression library runs strictly on your device.' },
                                { q: 'Can I compress WebP formats?', a: 'Yes! We support JPEG, PNG, and Modern WebP formats for both input and highly-optimized output.' }
                            ].map((faq, i) => (
                                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <HelpCircle className="w-4 h-4 text-sky-500" /> {faq.q}
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

export default ImageCompressor;
