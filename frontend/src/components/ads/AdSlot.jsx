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
const SMARTLINK_URL = 'https://arwf.org/4/f0a9c99d6f0d0b5f2c1ab2792fafcbf2';

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

    if (actualType === 'smartlink') {
      const a = document.createElement('a');
      a.href = SMARTLINK_URL;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all';
      a.innerHTML = `<span>🎁 Featured Partner Offer</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`;
      container.appendChild(a);
    } else if (actualType === 'native') {
      const iframe = document.createElement('iframe');
      iframe.width = '100%';
      iframe.height = '120';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.scrolling = 'no';
      iframe.src = '/ad-native.html';
      container.appendChild(iframe);
    } else if (actualType === 'desktop') {
      const iframe = document.createElement('iframe');
      iframe.width = '728';
      iframe.height = '90';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.scrolling = 'no';
      iframe.src = '/ad-desktop.html';
      container.appendChild(iframe);
    } else if (actualType === 'mobile') {
      const iframe = document.createElement('iframe');
      iframe.width = '320';
      iframe.height = '50';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.scrolling = 'no';
      iframe.src = '/ad-mobile.html';
      container.appendChild(iframe);
    }
  }, [actualType]);

  const minH = actualType === 'desktop' ? '90px' : actualType === 'mobile' ? '50px' : actualType === 'smartlink' ? '60px' : '120px';

  return (
    <div className={`ad-slot relative my-4 overflow-hidden rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-2 text-center transition-all ${className}`} style={{ minHeight: minH }}>
      <span className="absolute top-1 right-2 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600 pointer-events-none z-10">
        {label}
      </span>
      <div ref={containerRef} className="flex items-center justify-center min-h-[50px] w-full" />
    </div>
  );
}
