import React, { useEffect, useState } from 'react';

interface BackgroundTemplateProps {
  children?: React.ReactNode;
}

export const BackgroundTemplate: React.FC<BackgroundTemplateProps> = ({ children }) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [isInteractiveLightActive, setIsInteractiveLightActive] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    let frameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion || !isInteractiveLightActive) return;
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, [reducedMotion, isInteractiveLightActive]);

  return (
    <div className="relative min-h-screen bg-[#07080A] text-[#FAF6F0] selection:bg-[#C5A880] selection:text-[#07080A] overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* 1. ATMOSPHERIC BASE: Soft Charcoal to Midnight Gradient   */}
      {/* ========================================================= */}
      <div 
        aria-hidden="true" 
        className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(120%_90%_at_50%_-10%,#131722_0%,#0B0E14_45%,#07080A_100%)]" 
      />

      {/* ========================================================= */}
      {/* 2. PROCEDURAL FINE NOISE GRAIN (Tactile Matte Paper Feel) */}
      {/* ========================================================= */}
      <div 
        aria-hidden="true" 
        className="fixed inset-0 pointer-events-none z-[1] bg-grain-luxury mix-blend-screen opacity-90" 
      />

      {/* ========================================================= */}
      {/* 3. UNDERSTATED ARCHITECTURAL GRID (Low Opacity Geometry) */}
      {/* ========================================================= */}
      <div 
        aria-hidden="true" 
        className="fixed inset-0 pointer-events-none z-[2] bg-architectural-grid opacity-75" 
      />
      <div 
        aria-hidden="true" 
        className="fixed inset-0 pointer-events-none z-[2] bg-architectural-grid-fine opacity-40" 
      />

      {/* ========================================================= */}
      {/* 4. ARCHITECTURAL REGISTRATION & VERTICAL FLANK GUIDES     */}
      {/* ========================================================= */}
      <div 
        aria-hidden="true" 
        className="fixed inset-0 pointer-events-none z-[3] max-w-7xl mx-auto px-4 md:px-8 border-x border-white/[0.035]"
      >
        {/* Subtle coordinate registration crosshairs */}
        <div className="absolute top-16 -left-2 text-[10px] font-mono-code text-white/20 select-none">+</div>
        <div className="absolute top-16 -right-2 text-[10px] font-mono-code text-white/20 select-none">+</div>
        <div className="absolute top-1/2 -left-2 text-[10px] font-mono-code text-[#C5A880]/30 select-none">+</div>
        <div className="absolute top-1/2 -right-2 text-[10px] font-mono-code text-[#C5A880]/30 select-none">+</div>
        <div className="absolute bottom-24 -left-2 text-[10px] font-mono-code text-white/20 select-none">+</div>
        <div className="absolute bottom-24 -right-2 text-[10px] font-mono-code text-white/20 select-none">+</div>

        {/* Minimalist studio watermark coordinates */}
        <div className="absolute top-24 left-4 text-[9px] font-mono-code text-white/[0.12] tracking-widest uppercase select-none hidden lg:block">
          SEC // 01 · ARCHITECTURE MATRIX
        </div>
        <div className="absolute top-24 right-4 text-[9px] font-mono-code text-[#C5A880]/[0.22] tracking-widest uppercase select-none hidden lg:block text-right">
          QRYPTA // 2026 BENCHMARK
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. DIFFUSED AMBIENT LIGHTING & BREATHING GLOW LAYERS      */}
      {/* ========================================================= */}
      {/* A. Hero Diffused Champagne-Gold Ambient Light */}
      <div 
        aria-hidden="true"
        className="fixed top-[-5%] left-1/2 -translate-x-1/2 w-[1100px] h-[650px] pointer-events-none z-[4] bg-[radial-gradient(ellipse_at_top,rgba(197,168,128,0.085)_0%,rgba(122,18,36,0.035)_40%,transparent_70%)] blur-[110px]"
      />

      {/* B. Organic Breathing Ambient Light Orb (Left Flank) */}
      <div 
        aria-hidden="true"
        className={`fixed top-1/4 -left-40 w-[650px] h-[650px] pointer-events-none z-[4] bg-[radial-gradient(circle,rgba(197,168,128,0.045)_0%,transparent_70%)] blur-[130px] ${
          !reducedMotion ? 'animate-ambient-breathe' : 'opacity-25'
        }`}
      />

      {/* C. Soft Drifting Charcoal/Wine Warmth (Right Flank) */}
      <div 
        aria-hidden="true"
        className={`fixed top-1/2 -right-48 w-[700px] h-[700px] pointer-events-none z-[4] bg-[radial-gradient(circle,rgba(122,18,36,0.04)_0%,rgba(197,168,128,0.02)_40%,transparent_70%)] blur-[140px] ${
          !reducedMotion ? 'animate-ambient-drift' : 'opacity-25'
        }`}
      />

      {/* D. Bottom Grounding Radial Glow */}
      <div 
        aria-hidden="true"
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] pointer-events-none z-[4] bg-[radial-gradient(ellipse_at_bottom,rgba(20,24,34,0.7)_0%,transparent_75%)] blur-2xl"
      />

      {/* ========================================================= */}
      {/* 6. LUXURY MOUSE-FOLLOWING SPOTLIGHT (Restrained & Smooth)  */}
      {/* ========================================================= */}
      {isInteractiveLightActive && !reducedMotion && mousePos.x > 0 && (
        <div
          aria-hidden="true"
          className="fixed pointer-events-none z-[5] transition-transform duration-500 ease-out -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] opacity-35"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            background: 'radial-gradient(circle, rgba(197, 168, 128, 0.12) 0%, rgba(122, 18, 36, 0.035) 45%, transparent 70%)',
          }}
        />
      )}

      {/* ========================================================= */}
      {/* 7. FOREGROUND CONTENT WRAPPER                             */}
      {/* ========================================================= */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>

      {/* ========================================================= */}
      {/* 8. RESTRAINED 2026 LUXURY ATMOSPHERE CONTROLLER           */}
      {/* ========================================================= */}
      <aside 
        aria-label="Atmosphere Settings"
        className="fixed bottom-4 right-4 z-40 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E1117]/85 backdrop-blur-md border border-white/[0.08] shadow-lg text-[10px] font-mono-code text-[#8E96A4] hover:border-[#C5A880]/35 transition-colors"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
        <span className="text-[#E3DDD4]">ATMOSPHERE:</span>
        <button
          onClick={() => setIsInteractiveLightActive(prev => !prev)}
          className="text-[#C5A880] hover:text-[#E2CCA8] transition-colors underline-offset-2 hover:underline cursor-pointer"
          title="Toggle interactive champagne-gold ambient lighting"
        >
          {isInteractiveLightActive ? 'LUXURY AMBIENT (ON)' : 'MINIMAL STATIC (OFF)'}
        </button>
      </aside>

    </div>
  );
};
