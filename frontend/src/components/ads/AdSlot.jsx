import { useEffect, useRef, useState } from 'react';

/**
 * AdSlot - Adsterra Ad Unit Component
 * 
 * Supports:
 * - 'desktop': 728x90 Banner (key: 637f879dc3e06bf3d82c497089c8f297)
 * - 'mobile': 320x50 Banner (key: 1c27cabb98d6d26c4f9e296bbd8a5c49)
 * - 'responsive': Auto-switches based on window width
 * - 'native': Native banner container (container-1d472779334bd7805738b6962f93170e)
 */
export default function AdSlot({ type = 'responsive', label = 'Advertisement', className = '' }) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const actualType = type === 'responsive' ? (isMobile ? 'mobile' : 'desktop') : type;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    if (actualType === 'native') {
      const div = document.createElement('div');
      div.id = 'container-1d472779334bd7805738b6962f93170e';
      container.appendChild(div);

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://bicea.org/21/1d472779334bd7805738b6962f93170e';
      container.appendChild(script);
    } else if (actualType === 'desktop') {
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.text = `
        atOptions = {
          'key' : '637f879dc3e06bf3d82c497089c8f297',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      container.appendChild(confScript);

      const adScript = document.createElement('script');
      adScript.type = 'text/javascript';
      adScript.src = 'https://bicea.org/22/637f879dc3e06bf3d82c497089c8f297';
      container.appendChild(adScript);
    } else if (actualType === 'mobile') {
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.text = `
        atOptions = {
          'key' : '1c27cabb98d6d26c4f9e296bbd8a5c49',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;
      container.appendChild(confScript);

      const adScript = document.createElement('script');
      adScript.type = 'text/javascript';
      adScript.src = 'https://bicea.org/22/1c27cabb98d6d26c4f9e296bbd8a5c49';
      container.appendChild(adScript);
    }
  }, [actualType]);

  const minH = actualType === 'desktop' ? '90px' : actualType === 'mobile' ? '50px' : '120px';

  return (
    <div className={`ad-slot relative my-4 overflow-hidden rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-2 text-center transition-all ${className}`} style={{ minHeight: minH }}>
      <span className="absolute top-1 right-2 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600 pointer-events-none z-10">
        {label}
      </span>
      <div ref={containerRef} className="flex items-center justify-center min-h-[50px] w-full" />
    </div>
  );
}
