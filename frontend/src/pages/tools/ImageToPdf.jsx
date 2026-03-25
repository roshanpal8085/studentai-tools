import { useState, useRef } from 'react';
import SEO from '../../components/SEO';
import { FileImage, FileText, Download, Loader2, CheckCircle, HelpCircle, Shield, Zap, Layout, Plus, Trash2, GripVertical } from 'lucide-react';
import { jsPDF } from 'jspdf';

const ImageToPdf = () => {
    const [images, setImages] = useState([]); // [{id, file, previewUrl}]
    const [loading, setLoading] = useState(false);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const dragItem = useRef(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const newImages = files.map((file) => ({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...newImages]);
        // reset input so same file can be added again
        e.target.value = '';
    };

    const removeImage = (id) => {
        setImages((prev) => {
            const removed = prev.find((img) => img.id === id);
            if (removed) URL.revokeObjectURL(removed.previewUrl);
            return prev.filter((img) => img.id !== id);
        });
    };

    const clearAll = () => {
        images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        setImages([]);
    };

    /* ---- drag-to-reorder ---- */
    const handleDragStart = (index) => { dragItem.current = index; };
    const handleDragEnter = (index) => { setDragOverIndex(index); };
    const handleDragEnd = () => {
        if (dragItem.current === null || dragOverIndex === null || dragItem.current === dragOverIndex) {
            dragItem.current = null;
            setDragOverIndex(null);
            return;
        }
        const reordered = [...images];
        const [moved] = reordered.splice(dragItem.current, 1);
        reordered.splice(dragOverIndex, 0, moved);
        setImages(reordered);
        dragItem.current = null;
        setDragOverIndex(null);
    };

    const convertToPdf = async () => {
        if (!images.length) return;
        setLoading(true);
        try {
            let pdf = null;

            for (let i = 0; i < images.length; i++) {
                const { previewUrl } = images[i];
                const img = new Image();
                img.src = previewUrl;
                await new Promise((resolve) => { img.onload = resolve; });

                const orientation = img.width > img.height ? 'landscape' : 'portrait';

                if (i === 0) {
                    pdf = new jsPDF({ orientation, unit: 'px', format: [img.width, img.height] });
                } else {
                    pdf.addPage([img.width, img.height], orientation);
                }
                pdf.addImage(img, 'JPEG', 0, 0, img.width, img.height);
            }

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
                title="Free Image to PDF Converter - Multiple Images, High Quality & Secure"
                description="Convert multiple JPG, PNG, and WebP images into a single high-quality PDF instantly. 100% free, secure, browser-based. Perfect for student assignments."
                keywords="image to pdf, jpg to pdf, png to pdf, multiple images to pdf, student assignment tool"
                schema={{
                  "@context": "https://schema.org",
                  "@type": "SoftwareApplication",
                  "name": "Image to PDF Converter",
                  "operatingSystem": "Web",
                  "applicationCategory": "UtilitiesApplication",
                  "description": "Professional-grade local image-to-PDF converter with support for multiple images and reordering.",
                  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
                }}
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
                        Add multiple images and merge them into one professional PDF — all inside your browser, nothing uploaded.
                    </p>
                </div>

                <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-16">
                    <div className="p-8 md:p-12 bg-white/30 dark:bg-slate-950/20 backdrop-blur-md">

                        {/* Drop zone / Add more */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="max-w-2xl mx-auto border-4 border-dashed border-violet-200 dark:border-violet-900/50 bg-violet-50/50 dark:bg-violet-900/10 rounded-[2rem] p-10 hover:border-violet-500 dark:hover:border-violet-500 transition-all cursor-pointer group flex flex-col items-center justify-center shadow-inner hover:bg-violet-50 dark:hover:bg-violet-900/20 mb-8"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={handleFileChange}
                                multiple
                                className="hidden"
                                aria-label="Upload Images"
                            />
                            <div className="w-20 h-20 mb-4 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                {images.length === 0
                                    ? <FileImage className="w-9 h-9 text-violet-500" />
                                    : <Plus className="w-9 h-9 text-violet-500" />}
                            </div>
                            <h3 className="text-xl font-black dark:text-white mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                {images.length === 0 ? 'Select or Drop Images Here' : 'Add More Images'}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Supports JPG, PNG, WEBP · Select multiple at once</p>
                        </div>

                        {/* Image grid with reorder */}
                        {images.length > 0 && (
                            <div className="animate-in fade-in duration-300">
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                        {images.length} Image{images.length > 1 ? 's' : ''} · Drag to reorder
                                    </p>
                                    <button
                                        onClick={clearAll}
                                        className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Clear All
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                                    {images.map((img, index) => (
                                        <div
                                            key={img.id}
                                            draggable
                                            onDragStart={() => handleDragStart(index)}
                                            onDragEnter={() => handleDragEnter(index)}
                                            onDragEnd={handleDragEnd}
                                            onDragOver={(e) => e.preventDefault()}
                                            className={`relative rounded-2xl overflow-hidden border-2 transition-all group cursor-grab active:cursor-grabbing shadow-md ${
                                                dragOverIndex === index
                                                    ? 'border-violet-500 scale-95 opacity-70'
                                                    : 'border-white dark:border-slate-700 hover:border-violet-400'
                                            }`}
                                        >
                                            <img
                                                src={img.previewUrl}
                                                alt={`Page ${index + 1}`}
                                                className="w-full h-32 object-cover"
                                            />
                                            {/* Page number badge */}
                                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                Page {index + 1}
                                            </div>
                                            {/* Drag handle */}
                                            <div className="absolute top-2 left-2 bg-black/40 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <GripVertical className="w-3.5 h-3.5" />
                                            </div>
                                            {/* Remove button */}
                                            <button
                                                onClick={() => removeImage(img.id)}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                                                title="Remove"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <button
                                        onClick={convertToPdf}
                                        disabled={loading}
                                        className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-violet-600/20 flex items-center justify-center gap-3 active:scale-[0.98] group disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Download className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />}
                                        <span className="text-lg tracking-tight">
                                            {loading ? 'Generating PDF...' : `Download PDF (${images.length} page${images.length > 1 ? 's' : ''})`}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ad Space */}
                <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
                    Ad Placement - Document Tools Hub
                </div>

                {/* Informational Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
                    <div className="space-y-12">
                        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Professional <span style={{ backgroundImage: 'linear-gradient(to right, #8b5cf6, #6366f1)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Conversions</span></h2>
                        <div className="space-y-10">
                            {[
                                { title: '100% Privacy Preserved', desc: 'Browser-side conversion only. Your images never leave your device and are never uploaded to any server.', icon: Shield },
                                { title: 'Lightning Fast', desc: 'Processing happens locally — PDF generation is instantaneous, with no upload/download wait times.', icon: Zap },
                                { title: 'Auto-Formatting', desc: 'Each page is sized automatically to match its image orientation (Landscape or Portrait) for a perfect fit.', icon: Layout }
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
                                { q: 'Can I convert multiple images at once?', a: 'Yes! You can add as many images as you want. Each image becomes a page in the final PDF. Drag to reorder them before downloading.' },
                                { q: 'Does this compress the image quality?', a: 'No — the original resolution and quality of each image is preserved and embedded losslessly into the PDF.' },
                                { q: 'Is there a file size limit?', a: 'We recommend keeping each image under 10MB to avoid browser memory issues. There is no hard server limit since processing is entirely local.' }
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
