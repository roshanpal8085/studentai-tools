import { useState, useRef } from 'react';
import SEO from '../../components/SEO';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {
    FileText, Download, Loader2, Upload, CheckCircle,
    Shield, Sliders, User, Hash, AlignLeft, AlignCenter, AlignRight, Eye, HelpCircle, PaintBucket
} from 'lucide-react';

const POSITIONS = [
    { id: 'left',   label: 'Left',   Icon: AlignLeft },
    { id: 'center', label: 'Center', Icon: AlignCenter },
    { id: 'right',  label: 'Right',  Icon: AlignRight },
];

const PdfFooterEditor = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError]   = useState('');

    // Footer settings
    const [name,         setName]         = useState('');
    const [enrollment,   setEnrollment]   = useState('');
    const [position,     setPosition]     = useState('center');
    const [fontSize,     setFontSize]     = useState(11);
    const [bottomMargin, setBottomMargin] = useState(20);
    const [addPageNum,     setAddPageNum]     = useState(true);
    const [textColor,      setTextColor]      = useState('#6366f1');
    // Cover existing footer
    const [coverOldFooter, setCoverOldFooter] = useState(false);
    const [coverHeight,    setCoverHeight]    = useState(40);

    const fileInputRef = useRef(null);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setError('Please upload a valid PDF file.');
            return;
        }
        setError('');
        setDone(false);
        setPdfFile(file);
    };

    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1,3),16) / 255;
        const g = parseInt(hex.slice(3,5),16) / 255;
        const b = parseInt(hex.slice(5,7),16) / 255;
        return rgb(r, g, b);
    };

    const buildFooterLine = (pageNum, totalPages) => {
        const parts = [];
        if (name.trim())       parts.push(`Name: ${name.trim()}`);
        if (enrollment.trim()) parts.push(`Enrollment No.: ${enrollment.trim()}`);
        if (addPageNum)        parts.push(`Page ${pageNum} of ${totalPages}`);
        return parts.join('   |   ');
    };

    const process = async () => {
        if (!pdfFile) return;
        if (!name.trim() && !enrollment.trim()) {
            setError('Please enter at least a name or enrollment number.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const font   = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const color  = hexToRgb(textColor);
            const pages  = pdfDoc.getPages();
            const total  = pages.length;

            pages.forEach((page, i) => {
                const { width } = page.getSize();

                // Step 1: Cover old footer with a white rectangle
                if (coverOldFooter) {
                    page.drawRectangle({
                        x:      0,
                        y:      0,
                        width:  width,
                        height: coverHeight,
                        color:  rgb(1, 1, 1),   // white
                        opacity: 1,
                    });
                }

                // Step 2: Draw new footer text
                const text      = buildFooterLine(i + 1, total);
                const textWidth = font.widthOfTextAtSize(text, fontSize);

                let x;
                if      (position === 'left')   x = 40;
                else if (position === 'right')  x = width - textWidth - 40;
                else                            x = (width - textWidth) / 2;

                page.drawText(text, {
                    x,
                    y:    bottomMargin,
                    size: fontSize,
                    font,
                    color,
                });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            a.download = `studentai_footer_${Date.now()}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            setDone(true);
        } catch (err) {
            console.error(err);
            setError('Could not process PDF. The file may be encrypted or corrupted.');
        } finally {
            setLoading(false);
        }
    };

    const preview = buildFooterLine('1', '?');

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
            <SEO
                title="Free PDF Footer Editor — Add Name & Enrollment Number"
                description="Add your name, enrollment number, and page numbers to every page footer of any PDF — 100% free, secure, and browser-based. No upload needed."
                keywords="pdf footer editor, add name to pdf, enrollment number pdf, student pdf tool, free pdf editor"
                schema={{
                  "@context": "https://schema.org",
                  "@type": "SoftwareApplication",
                  "name": "PDF Footer Editor",
                  "operatingSystem": "Web",
                  "applicationCategory": "UtilitiesApplication",
                  "description": "Professional local PDF editor to add custom footers, enrollment numbers, and page numbers securely.",
                  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
                }}
            />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Hero */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 mb-4 shadow-lg shadow-indigo-500/20 transition-transform hover:-translate-y-1 hover:scale-105">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                        PDF Footer{' '}
                        <span style={{ backgroundImage: 'linear-gradient(to right, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                            Editor
                        </span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Automatically stamp your <strong>Name</strong> and <strong>Enrollment Number</strong> on every page of your PDF — no sign-up, no upload.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">

                    {/* ---- LEFT: Upload + Settings ---- */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Upload */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`glass-card rounded-3xl border-4 border-dashed p-10 flex flex-col items-center justify-center cursor-pointer transition-all group
                                ${pdfFile
                                    ? 'border-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10'
                                    : 'border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-900/10 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                                }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf"
                                onChange={handleFile}
                                className="hidden"
                            />
                            <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                {pdfFile ? <CheckCircle className="w-8 h-8 text-green-500" /> : <Upload className="w-8 h-8 text-indigo-500" />}
                            </div>
                            {pdfFile ? (
                                <div className="text-center">
                                    <p className="font-black text-slate-800 dark:text-white text-lg">{pdfFile.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        {(pdfFile.size / 1024).toFixed(1)} KB · Click to change
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="font-black text-slate-800 dark:text-white text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        Upload Your PDF
                                    </p>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Click or drag · PDF files only</p>
                                </div>
                            )}
                        </div>

                        {/* Name + Enrollment inputs */}
                        <div className="glass-card rounded-3xl p-8 space-y-5 border border-slate-200 dark:border-slate-800">
                            <h2 className="text-lg font-extrabold dark:text-white flex items-center gap-2">
                                <Sliders className="w-5 h-5 text-indigo-500" /> Footer Details
                            </h2>

                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                                        <User className="w-3.5 h-3.5" /> Your Name
                                    </span>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Roshan Pal"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500 transition-all"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                                        <Hash className="w-3.5 h-3.5" /> Enrollment Number
                                    </span>
                                    <input
                                        type="text"
                                        value={enrollment}
                                        onChange={(e) => setEnrollment(e.target.value)}
                                        placeholder="e.g. 2303035140"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500 transition-all"
                                    />
                                </label>
                            </div>

                            {/* Position */}
                            <div>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                                    Footer Position
                                </span>
                                <div className="flex gap-3">
                                    {POSITIONS.map(({ id, label, Icon }) => (
                                        <button
                                            key={id}
                                            onClick={() => setPosition(id)}
                                            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all
                                                ${position === id
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" /> {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Advanced tweaks */}
                            <div className="grid grid-cols-2 gap-4">
                                <label className="block">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Font Size ({fontSize}px)</span>
                                    <input
                                        type="range" min={8} max={20} step={1}
                                        value={fontSize}
                                        onChange={(e) => setFontSize(+e.target.value)}
                                        className="w-full accent-indigo-600"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Bottom Margin ({bottomMargin}px)</span>
                                    <input
                                        type="range" min={10} max={60} step={2}
                                        value={bottomMargin}
                                        onChange={(e) => setBottomMargin(+e.target.value)}
                                        className="w-full accent-indigo-600"
                                    />
                                </label>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div
                                        onClick={() => setAddPageNum(!addPageNum)}
                                        className={`w-11 h-6 rounded-full transition-all flex items-center px-0.5 ${addPageNum ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${addPageNum ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">
                                        Add page numbers
                                    </span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Text Color</span>
                                    <input
                                        type="color"
                                        value={textColor}
                                        onChange={(e) => setTextColor(e.target.value)}
                                        className="w-9 h-9 rounded-xl border-2 border-slate-200 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
                                    />
                                </label>
                            </div>

                            {/* Cover old footer */}
                            <div className={`rounded-2xl border-2 p-4 transition-all ${
                                coverOldFooter
                                    ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/10'
                                    : 'border-slate-200 dark:border-slate-700'
                            }`}>
                                <label className="flex items-center gap-3 cursor-pointer group mb-3">
                                    <div
                                        onClick={() => setCoverOldFooter(!coverOldFooter)}
                                        className={`w-11 h-6 rounded-full transition-all flex items-center px-0.5 flex-shrink-0 ${
                                            coverOldFooter ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                            coverOldFooter ? 'translate-x-5' : 'translate-x-0'
                                        }`} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                            <PaintBucket className="w-3.5 h-3.5 text-amber-500" />
                                            Cover existing footer
                                        </span>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Paints a white strip over the old footer before adding new one</p>
                                    </div>
                                </label>
                                {coverOldFooter && (
                                    <label className="block">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                                            Cover height ({coverHeight}px) — increase if old footer was tall
                                        </span>
                                        <input
                                            type="range" min={20} max={120} step={4}
                                            value={coverHeight}
                                            onChange={(e) => setCoverHeight(+e.target.value)}
                                            className="w-full accent-amber-500"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-red-500 font-semibold text-sm text-center bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3 border border-red-200 dark:border-red-800">
                                {error}
                            </p>
                        )}

                        {/* CTA */}
                        <button
                            onClick={process}
                            disabled={loading || !pdfFile}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-[0.98] group text-lg"
                        >
                            {loading
                                ? <><Loader2 className="animate-spin w-6 h-6" /> Processing...</>
                                : done
                                    ? <><CheckCircle className="w-6 h-6 text-green-300" /> Downloaded! Download Again</>
                                    : <><Download className="w-6 h-6 group-hover:-translate-y-1 transition-transform" /> Add Footer &amp; Download PDF</>
                            }
                        </button>
                    </div>

                    {/* ---- RIGHT: Preview + Info ---- */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Live Preview */}
                        <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden">
                            <h2 className="text-sm font-extrabold dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Eye className="w-4 h-4 text-indigo-500" /> Live Footer Preview
                            </h2>
                            {/* Simulated page */}
                            <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700 p-4 min-h-[220px] flex flex-col">
                                {/* Fake lines */}
                                <div className="space-y-2 flex-grow">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className={`h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 ${i === 0 ? 'w-3/4' : i % 3 === 0 ? 'w-1/2' : 'w-full'}`} />
                                    ))}
                                </div>
                                {/* Footer line */}
                                <div className={`mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex ${position === 'center' ? 'justify-center' : position === 'right' ? 'justify-end' : 'justify-start'}`}>
                                    <span
                                        className="font-mono font-semibold break-all"
                                        style={{ fontSize: Math.min(fontSize, 13), color: textColor }}
                                    >
                                        {preview || 'Your text will appear here'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Info cards */}
                        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-5">
                            <h2 className="text-sm font-extrabold dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-indigo-500" /> How It Works
                            </h2>
                            {[
                                { icon: Shield, title: '100% Private', text: 'Your PDF is processed entirely in your browser. Nothing is sent to any server.' },
                                { icon: FileText, title: 'All Pages Updated', text: 'Footer is automatically added to every single page of the PDF.' },
                                { icon: Sliders, title: 'Fully Customizable', text: 'Choose position, font size, margin, page numbers, and text color.' },
                            ].map(({ icon: Icon, title, text }, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white text-sm">{title}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Ad space */}
                <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
                    Ad Placement - PDF Tools Hub
                </div>
            </div>
        </div>
    );
};

export default PdfFooterEditor;
