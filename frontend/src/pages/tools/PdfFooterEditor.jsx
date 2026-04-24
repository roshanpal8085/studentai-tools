import { useState, useRef } from 'react';
import SEO from '../../components/SEO';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {
    FileText, Download, Loader2, Upload, CheckCircle,
    Shield, Sliders, User, Hash, AlignLeft, Eye, HelpCircle, PaintBucket, BookOpen
} from 'lucide-react';

const PdfFooterEditor = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError]   = useState('');

    // Footer fields
    const [name,        setName]        = useState('');
    const [enrollment,  setEnrollment]  = useState('');
    const [subject,     setSubject]     = useState('');

    // Style settings
    const [fontSize,     setFontSize]     = useState(10);
    const [bottomMargin, setBottomMargin] = useState(20);
    const [textColor,    setTextColor]    = useState('#000000');

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

    const process = async () => {
        if (!pdfFile) return;
        if (!name.trim() && !enrollment.trim() && !subject.trim()) {
            setError('Please enter at least one footer field.');
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

            const leftText   = name.trim();
            const centerText = enrollment.trim();
            const rightText  = subject.trim();

            pages.forEach((page) => {
                const { width } = page.getSize();
                const margin = 40;

                // Step 1: Cover old footer with a white rectangle
                if (coverOldFooter) {
                    page.drawRectangle({
                        x:      0,
                        y:      0,
                        width:  width,
                        height: coverHeight,
                        color:  rgb(1, 1, 1),
                        opacity: 1,
                    });
                }

                // Step 2: Draw Left text
                if (leftText) {
                    page.drawText(leftText, {
                        x: margin,
                        y: bottomMargin,
                        size: fontSize,
                        font,
                        color,
                    });
                }

                // Step 4: Draw Center text
                if (centerText) {
                    const cw = font.widthOfTextAtSize(centerText, fontSize);
                    page.drawText(centerText, {
                        x: (width - cw) / 2,
                        y: bottomMargin,
                        size: fontSize,
                        font,
                        color,
                    });
                }

                // Step 5: Draw Right text
                if (rightText) {
                    const rw = font.widthOfTextAtSize(rightText, fontSize);
                    page.drawText(rightText, {
                        x: width - margin - rw,
                        y: bottomMargin,
                        size: fontSize,
                        font,
                        color,
                    });
                }
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

    /* ── Preview helpers ── */
    const previewLeft   = name.trim()       || 'Your Name';
    const previewCenter = enrollment.trim() || 'Enrollment No.';
    const previewRight  = subject.trim()    || 'Class / Subject';

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
            <SEO
                title="Free PDF Footer Editor — Add Name, Enrollment & Class"
                description="Add your name, enrollment number, and class/subject to every page footer of any PDF — three-column format. 100% free, secure, and browser-based."
                keywords="pdf footer editor, add name to pdf, enrollment number pdf, student pdf tool, three column footer"
                schema={{
                  "@context": "https://schema.org",
                  "@type": "SoftwareApplication",
                  "name": "PDF Footer Editor",
                  "operatingSystem": "Web",
                  "applicationCategory": "UtilitiesApplication",
                  "description": "Professional local PDF editor to add custom three-column footers with name, enrollment, and class info.",
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
                        Stamp a <strong>3-column professional footer</strong> — Name · Enrollment Number · Class — on every page of your PDF. No upload, no sign-up.
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

                        {/* Footer Details */}
                        <div className="glass-card rounded-3xl p-8 space-y-5 border border-slate-200 dark:border-slate-800">
                            <h2 className="text-lg font-extrabold dark:text-white flex items-center gap-2">
                                <Sliders className="w-5 h-5 text-indigo-500" /> Footer Details
                            </h2>

                            {/* Three column layout hint */}
                            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl px-4 py-2.5 text-xs text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-100 dark:border-indigo-800">
                                <AlignLeft className="w-3.5 h-3.5 flex-shrink-0" />
                                Footer layout: <span className="font-black">LEFT · CENTER · RIGHT</span> (3-column, like your assignment sheets)
                            </div>

                            <div className="space-y-4">
                                {/* Name — Left */}
                                <label className="block">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                                        <User className="w-3.5 h-3.5 text-indigo-400" /> Name <span className="ml-auto text-xs font-medium normal-case tracking-normal text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">Left</span>
                                    </span>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Roshan Pal"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500 transition-all"
                                    />
                                </label>

                                {/* Enrollment — Center */}
                                <label className="block">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                                        <Hash className="w-3.5 h-3.5 text-indigo-400" /> Enrollment Number <span className="ml-auto text-xs font-medium normal-case tracking-normal text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">Center</span>
                                    </span>
                                    <input
                                        type="text"
                                        value={enrollment}
                                        onChange={(e) => setEnrollment(e.target.value)}
                                        placeholder="e.g. EN23CS304059"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500 transition-all"
                                    />
                                </label>

                                {/* Subject / Class — Right */}
                                <label className="block">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Class / Subject <span className="ml-auto text-xs font-medium normal-case tracking-normal text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">Right</span>
                                    </span>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. CS(AI)-A-I"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500 transition-all"
                                    />
                                </label>
                            </div>

                            {/* Style tweaks */}
                            <div className="grid grid-cols-2 gap-4 pt-1">
                                <label className="block">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Font Size ({fontSize}px)</span>
                                    <input
                                        type="range" min={8} max={18} step={1}
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

                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Text Color</span>
                                    <input
                                        type="color"
                                        value={textColor}
                                        onChange={(e) => setTextColor(e.target.value)}
                                        className="w-9 h-9 rounded-xl border-2 border-slate-200 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
                                    />
                                </label>
                                <span className="text-xs text-slate-400">(Default: Black — matches assignment sheets)</span>
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
                                {/* Footer preview */}
                                <div className="mt-4 pt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono text-left" style={{ fontSize: Math.min(fontSize, 11), color: textColor, fontWeight: 500 }}>
                                            {previewLeft}
                                        </span>
                                        <span className="font-mono text-center" style={{ fontSize: Math.min(fontSize, 11), color: textColor, fontWeight: 500 }}>
                                            {previewCenter}
                                        </span>
                                        <span className="font-mono text-right" style={{ fontSize: Math.min(fontSize, 11), color: textColor, fontWeight: 500 }}>
                                            {previewRight}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-3 text-center">↑ This is how your footer will look on each PDF page</p>
                        </div>

                        {/* Info cards */}
                        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-5">
                            <h2 className="text-sm font-extrabold dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-indigo-500" /> How It Works
                            </h2>
                            {[
                                { icon: Shield, title: '100% Private', text: 'Your PDF is processed entirely in your browser. Nothing is sent to any server.' },
                                { icon: FileText, title: 'All Pages Updated', text: 'Footer is automatically added to every single page of the PDF.' },
                                { icon: Sliders, title: '3-Column Format', text: 'Name on left, Enrollment No. in center, Class/Subject on right — exactly like standard assignment sheets.' },
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

                {/* ── Rich Content: How to Use ── */}
                <div className="mb-20 py-12 border-t border-slate-200 dark:border-slate-800">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 text-center">How to Add a Footer to Your PDF</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-center max-w-2xl mx-auto mb-12">
                        Adding a professional three-column footer to your assignment PDF takes less than 30 seconds. Here's exactly how to do it.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                        {[
                            { step: '1', title: 'Upload Your PDF', desc: 'Click the upload zone and select your assignment or document PDF. The file stays on your device — nothing is uploaded to any server.', color: 'from-indigo-500 to-purple-600' },
                            { step: '2', title: 'Enter Your Details', desc: 'Type your Name (left), Enrollment Number (center), and Class/Subject (right). These will appear on every page of your PDF.', color: 'from-purple-500 to-pink-600' },
                            { step: '3', title: 'Customize Style', desc: 'Adjust the font size, bottom margin, and text color. Use the live preview to see exactly how your footer will look before generating.', color: 'from-pink-500 to-rose-600' },
                            { step: '4', title: 'Download Your PDF', desc: 'Click "Add Footer & Download PDF." Your stamped PDF downloads instantly — ready to print or submit digitally.', color: 'from-rose-500 to-orange-500' },
                        ].map((s, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-3xl p-7 relative overflow-hidden">
                                <div className={`text-7xl font-black bg-gradient-to-br ${s.color} bg-clip-text text-transparent opacity-10 absolute -top-2 -right-2`}>{s.step}</div>
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white font-black text-sm mb-4`}>{s.step}</div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Who Is This For ── */}
                <div className="mb-20 py-12 border-t border-slate-200 dark:border-slate-800">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 text-center">Who Uses the PDF Footer Editor?</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-center max-w-2xl mx-auto mb-12">
                        This tool was designed for a specific academic need — but it's useful for anyone who needs to label PDF documents professionally.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Engineering & BTech Students',
                                desc: 'Universities require every assignment page to have your name, enrollment number, and branch/class in the footer. This tool automates that for all pages in one click.',
                                tags: ['Assignments', 'Lab Reports', 'Projects']
                            },
                            {
                                title: 'MBA & Management Students',
                                desc: 'Case studies and reports submitted to professors need proper identification. Stamp your name and roll number across all pages without manually editing every slide.',
                                tags: ['Case Studies', 'Reports', 'Presentations']
                            },
                            {
                                title: 'Teachers & Educators',
                                desc: 'Create labeled worksheets and handouts with student name fields in the footer. Or add your institution name and class code to every page of a course packet.',
                                tags: ['Worksheets', 'Handouts', 'Course Packets']
                            },
                        ].map((u, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-3xl p-8">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{u.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5">{u.desc}</p>
                                <div className="flex flex-wrap gap-2">
                                    {u.tags.map(t => (
                                        <span key={t} className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">{t}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── FAQ Section ── */}
                <div className="mb-24 py-12 border-t border-slate-200 dark:border-slate-800">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 text-center">Frequently Asked Questions</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-center max-w-2xl mx-auto mb-12">
                        Everything you need to know about adding footers to your PDF assignments.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {[
                            { q: 'Is my PDF uploaded to any server?', a: 'No. This tool uses the pdf-lib JavaScript library to process your PDF entirely inside your browser. Your document never leaves your device, ensuring complete privacy for sensitive academic work.' },
                            { q: 'Will the footer appear on every page?', a: 'Yes. The tool automatically iterates through every page of your PDF and applies identical footer text at the same position and size. You do not need to do anything extra for multi-page documents.' },
                            { q: 'Can I use this on an encrypted or password-protected PDF?', a: 'Unfortunately, password-protected PDFs cannot be modified without decryption. If you see an error message, try removing the PDF password first using an unlock tool, then run it through the footer editor.' },
                            { q: 'What is the correct format for an Indian university footer?', a: 'Most Indian universities (including VTU, SPPU, GTU, Anna University) require: Name on the left, Enrollment/Registration Number in the center, and Branch/Class on the right — exactly the 3-column format this tool uses.' },
                            { q: 'Can I change the text color to match my university theme?', a: 'Yes. Click the color picker next to "Text Color" to choose any color. The default is black, which is the standard professional choice for printed academic documents.' },
                            { q: 'What PDF file size can I use?', a: 'The editor works purely in-browser memory, so very large files (100MB+) may be slow depending on your device. For typical assignment PDFs (under 50MB), it processes near-instantly.' },
                            { q: 'Does the "Cover Existing Footer" option work well?', a: 'Yes. It paints a white rectangle over the bottom of each page before adding the new footer. Increase the "Cover Height" slider if the old footer was particularly tall.' },
                            { q: 'Is this tool completely free?', a: 'Yes, 100% free. No account creation, no premium tier, and no watermarks on your output PDF. The platform is sustained by non-intrusive advertising.' },
                        ].map((faq, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-6">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-start gap-2 text-sm">
                                    <HelpCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" /> {faq.q}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed pl-6">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfFooterEditor;

