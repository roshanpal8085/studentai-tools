import { useState } from 'react';
import SEO from '../../components/SEO';
import { FileImage, FileText, Download, Loader2, CheckCircle, HelpCircle, Shield, Zap, Layout } from 'lucide-react';
import { jsPDF } from 'jspdf';

const ImageToPdf = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const convertToPdf = async () => {
        if (!selectedFile) return;
        setLoading(true);
        try {
            const img = new Image();
            img.src = previewUrl;
            await new Promise((resolve) => (img.onload = resolve));

            const pdf = new jsPDF({
                orientation: img.width > img.height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [img.width, img.height]
            });

            pdf.addImage(img, 'JPEG', 0, 0, img.width, img.height);
            pdf.save(`studentai_pdf_${Date.now()}.pdf`);
        } catch (err) {
            console.error('PDF Conversion Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
            <SEO 
                title="Free Image to PDF Converter - High Quality & Secure" 
                description="Convert JPG, PNG, and WebP images to high-quality PDF files instantly. 100% free, secure, browser-based conversion. Perfect for student assignments." 
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 mb-4 transition-transform hover:-translate-y-1 hover:scale-105 shadow-lg shadow-violet-500/20">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Image to <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(to right, #8b5cf6, #6366f1)', WebkitBackgroundClip: 'text', color: 'transparent' }}>PDF Converter</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Transform your photos, screenshots, and scanned notes into professional, high-quality PDF documents securely within your browser.
                    </p>
                </div>

                <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-16 h-full min-h-[400px]">
                    <div className="p-10 md:p-16 bg-white/30 dark:bg-slate-950/20 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-center">
                        
                        {!previewUrl ? (
                            <div className="max-w-2xl mx-auto border-4 border-dashed border-violet-200 dark:border-violet-900/50 bg-violet-50/50 dark:bg-violet-900/10 rounded-[2rem] p-16 hover:border-violet-500 dark:hover:border-violet-500 transition-all cursor-pointer relative group flex flex-col items-center justify-center shadow-inner hover:shadow-violet-500/10 hover:bg-violet-50 dark:hover:bg-violet-900/20">
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    aria-label="Upload Image"
                                />
                                <div className="w-24 h-24 mb-6 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                   <FileImage className="w-10 h-10 text-violet-500" />
                                </div>
                                <h3 className="text-2xl font-black dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">Select or Drop Image Here</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Supports JPG, PNG, WEBP (Max 10MB)</p>
                            </div>
                        ) : (
                            <div className="animate-in fade-in zoom-in-95 duration-500 max-w-3xl mx-auto">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 mb-10 max-h-[500px] flex justify-center bg-slate-100 dark:bg-slate-900">
                                    <img src={previewUrl} alt="Document Preview" className="object-contain max-h-[500px] w-auto mix-blend-multiply dark:mix-blend-normal" />
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-400" /> Ready to Convert
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <button 
                                        onClick={convertToPdf}
                                        disabled={loading}
                                        className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-violet-600/20 flex items-center justify-center gap-3 active:scale-[0.98] group disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Download className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />}
                                        <span className="text-lg tracking-tight">{loading ? 'Processing...' : 'Download PDF Now'}</span>
                                    </button>
                                    <button 
                                        onClick={() => {setSelectedFile(null); setPreviewUrl(null);}}
                                        disabled={loading}
                                        className="w-full sm:w-auto bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 font-bold py-4 px-8 rounded-2xl hover:border-violet-500 hover:text-violet-600 dark:hover:border-violet-500 dark:hover:text-violet-400 transition-all disabled:opacity-50"
                                    >
                                        Upload Different Image
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ad Space Placement */}
                <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
                    Ad Placement - Document Tools Hub
                </div>

                {/* Informational Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
                    <div className="space-y-12">
                        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Professional <span className="text-violet-600" style={{ backgroundImage: 'linear-gradient(to right, #8b5cf6, #6366f1)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Conversions</span></h2>
                        <div className="space-y-10">
                            {[
                                { title: '100% Privacy Preserved', desc: 'Our tool utilizes browser-side conversion. Your images never leave your device and are never uploaded to any external server.', icon: Shield },
                                { title: 'Lightning Fast', desc: 'Because the processing happens locally, PDF generation is instantaneous, completely bypassing upload and download wait times.', icon: Zap },
                                { title: 'Auto-Formatting', desc: 'The tool automatically detects the orientation of your image (Landscape or Portrait) and scales the PDF document to fit perfectly.', icon: Layout }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                   <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
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
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"></div>
                        <h2 className="text-2xl font-extrabold dark:text-white mb-8 relative z-10">Converter FAQ</h2>
                        <div className="space-y-6 relative z-10">
                            {[
                                { q: 'Can I convert multiple images at once?', a: 'Currently, this lightweight tool is optimized for single-image conversion, perfect for quick assignments or single document snaps.' },
                                { q: 'Does this compress the image quality?', a: 'No, our algorithm retains the original resolution and quality of your image, embedding it losslessly into the PDF container.' },
                                { q: 'Is there a file size limit?', a: 'We recommend keeping images under 10MB to prevent browser memory issues, though there is no hard server limit since processing is local.' }
                            ].map((faq, i) => (
                                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <HelpCircle className="w-4 h-4 text-violet-500" /> {faq.q}
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

export default ImageToPdf;
