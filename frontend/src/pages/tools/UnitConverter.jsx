import { useState } from 'react';
import SEO from '../../components/SEO';
import { ArrowRightLeft, HelpCircle, Activity, Scale, ThermometerSun, Info, Cog, CheckCircle } from 'lucide-react';

const UnitConverter = () => {
    const units = {
        length: {
            m: 1, km: 0.001, cm: 100, mm: 1000, inch: 39.37, feet: 3.28, mile: 0.000621
        },
        weight: {
            kg: 1, g: 1000, mg: 1000000, lb: 2.2046, oz: 35.274
        },
        temp: {
            c: (v) => v, f: (v) => (v * 9/5) + 32, k: (v) => v + 273.15
        }
    };

    const categoryIcons = {
        length: <Activity className="w-5 h-5" />,
        weight: <Scale className="w-5 h-5" />,
        temp: <ThermometerSun className="w-5 h-5" />
    };

    const [category, setCategory] = useState('length');
    const [from, setFrom] = useState('m');
    const [to, setTo] = useState('km');
    const [value, setValue] = useState(1);

    const convert = () => {
        if (category === 'temp') {
            let base = value;
            if (from === 'f') base = (value - 32) * 5/9;
            if (from === 'k') base = value - 273.15;
            
            if (to === 'c') return base.toFixed(2);
            if (to === 'f') return ((base * 9/5) + 32).toFixed(2);
            if (to === 'k') return (base + 273.15).toFixed(2);
            return base;
        }

        const base = value / units[category][from];
        return (base * units[category][to]).toFixed(category === 'temp' ? 2 : 4);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
            <SEO 
                title="Free Universal Unit Converter - Length, Weight & Temp" 
                description="Instantly convert between metric and imperial units. Fast, accurate, and professional-grade converter for students and professionals."
                keywords="unit converter, metric to imperial, length converter, weight converter, temperature converter, free utility"
                schema={{
                  "@context": "https://schema.org",
                  "@type": "SoftwareApplication",
                  "name": "Universal Unit Converter",
                  "operatingSystem": "Web",
                  "applicationCategory": "UtilitiesApplication",
                  "description": "High-precision unit converter for length, weight, and temperature with metric and imperial support.",
                  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
                }}
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 mb-4 transition-transform hover:rotate-12">
                        <ArrowRightLeft className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Universal <span className="text-gradient">Unit Converter</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Seamlessly switch between measurement systems. High-precision calculations for engineering, physics, and daily conversions.
                    </p>
                </div>

                <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-16">
                    <div className="p-10 md:p-14 border-b border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-950/20 backdrop-blur-md">
                        <div className="flex flex-wrap gap-4 mb-12 justify-center">
                            {Object.keys(units).map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => {
                                        setCategory(cat);
                                        const keys = Object.keys(units[cat]);
                                        setFrom(keys[0]);
                                        setTo(keys[1]);
                                    }}
                                    className={`px-8 py-4 rounded-2xl font-black capitalize transition-all flex items-center gap-3 ${
                                        category === cat 
                                        ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 scale-105' 
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:text-emerald-500'
                                    }`}
                                >
                                    {categoryIcons[cat]}
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center max-w-4xl mx-auto relative">
                            {/* From Box */}
                            <div className="md:col-span-2 space-y-4">
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest pl-2">Source Value</label>
                                <div className="relative group">
                                    <input 
                                        type="number" 
                                        value={value} 
                                        onChange={(e) => setValue(e.target.value)}
                                        className="w-full pl-6 pr-28 py-6 rounded-3xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-3xl font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner"
                                    />
                                    <select 
                                        value={from}
                                        onChange={(e) => setFrom(e.target.value)}
                                        className="absolute right-3 top-3 bottom-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-none px-4 rounded-2xl text-lg font-bold uppercase cursor-pointer hover:bg-emerald-100 transition-colors focus:ring-0 appearance-none"
                                        style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                                    >
                                        {Object.keys(units[category]).map(u => <option key={u} value={u} className="text-slate-900 dark:text-slate-900">{u}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            {/* Middle Icon */}
                            <div className="flex justify-center md:col-span-1 hidden md:flex items-center pt-8">
                                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 animate-pulse-slow">
                                   <ArrowRightLeft className="w-6 h-6" />
                                </div>
                            </div>

                            {/* To Box */}
                            <div className="md:col-span-2 space-y-4 pt-6 md:pt-0">
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest pl-2">Target Conversion</label>
                                <div className="relative group">
                                    <div className="w-full pl-6 pr-28 py-6 rounded-3xl border-2 border-transparent bg-emerald-50 dark:bg-slate-800/80 text-3xl font-black text-emerald-700 dark:text-white shadow-inner flex items-center min-h-[92px] overflow-x-auto whitespace-nowrap custom-scrollbar overflow-y-hidden">
                                        {convert()}
                                    </div>
                                    <select 
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                        className="absolute right-3 top-3 bottom-3 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 px-4 rounded-2xl text-lg font-bold uppercase cursor-pointer hover:border-emerald-500 transition-colors focus:ring-0 appearance-none shadow-sm"
                                        style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                                    >
                                        {Object.keys(units[category]).map(u => <option key={u} value={u} className="text-slate-900 dark:text-slate-900">{u}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ad Space Placeholder */}
                <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
                    Ad Placement - STEM Tools Hub
                </div>

                {/* Informational Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
                    <div className="space-y-12">
                        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Precision <span className="text-emerald-600">Engineering</span></h2>
                        <div className="space-y-10">
                            {[
                                { title: 'High Accuracy', desc: 'Calculations are performed with up to 4 decimal places of precision, ensuring scientific and recipe accuracy.', icon: Cog },
                                { title: 'Seamless UI', desc: 'Switching between categories instantly re-mounts the conversion engine without page reloads saving you time.', icon: Info },
                                { title: 'Broad Scope', desc: 'Covering the most common requirements for standard university physics, chemistry, and culinary challenges.', icon: CheckCircle }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                   <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
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
                        <h2 className="text-2xl font-extrabold dark:text-white mb-8">Converter FAQ</h2>
                        <div className="space-y-6">
                            {[
                                { q: 'Why do temperatures look different?', a: 'Unlike length or weight, temperature scales like Fahrenheit and Celsius require specific formulaic calculations (using offsets) rather than simple ratios.' },
                                { q: 'How many decimal places are shown?', a: 'Standard conversions display 4 decimal places. Due to the exact nature of Temperature scales, those display 2 decimal places to avoid visual clutter.' },
                                { q: 'Will you add more units like volume?', a: 'Yes! We are continuously expanding our utility database. Volume, Area, and Digital Storage conversions are on our immediate roadmap.' }
                            ].map((faq, i) => (
                                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <HelpCircle className="w-4 h-4 text-emerald-500" /> {faq.q}
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

export default UnitConverter;
