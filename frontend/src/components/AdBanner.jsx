// Real AdSense script will be initialized in index.html or Helmet.
// This is a placeholder component for structured ad placements to make it monetization-ready.
const AdBanner = ({ format = 'horizontal' }) => {
  const isHorizontal = format === 'horizontal';
  
  return (
    <div className={`w-full overflow-hidden flex justify-center items-center bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 dark:text-slate-500 transition-all ${isHorizontal ? 'h-[90px] md:max-w-4xl mx-auto my-8' : 'h-[600px] w-full max-w-[300px] my-4'}`}>
      <span className="text-xs uppercase font-bold tracking-widest text-slate-300 dark:text-slate-600">Advertisement</span>
    </div>
  );
};

export default AdBanner;
