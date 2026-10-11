import React from 'react';
import { ShieldCheck, Cpu, BookOpen, FileText, Download, Orbit } from 'lucide-react';

export type ActiveTab = 'overview' | 'lab' | 'benchmark' | 'notebook' | 'report';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onOpenExport }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0C0E13]/85 backdrop-blur-md border-b border-white/[0.08] px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#161922] border border-[#C5A880]/35 flex items-center justify-center text-[#C5A880] shadow-sm">
            <Orbit className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-display text-xl font-bold tracking-[0.14em] text-[#FAF6F0] uppercase">
                QRYPTA Quantum Shield P1
              </span>
              <span className="text-xs text-[#C5A880] font-mono-code hidden sm:inline">
                / QFF 2026
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#959CA8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
              <span>Phase 1 Online Qualification</span>
              <span aria-hidden="true" className="text-white/20">·</span>
              <span className="font-mono-code text-[#C5A880]">Track: PQC (P1)</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Functional interactive buttons) */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => onTabChange('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-[#C5A880] text-[#090A0C] font-semibold shadow-xs'
                : 'text-[#959CA8] hover:text-[#FAF6F0] hover:bg-white/[0.05]'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>Horizon</span>
          </button>

          <button
            onClick={() => onTabChange('lab')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'lab'
                ? 'bg-[#C5A880] text-[#090A0C] font-semibold shadow-xs'
                : 'text-[#959CA8] hover:text-[#FAF6F0] hover:bg-white/[0.05]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Channel Lab</span>
          </button>

          <button
            onClick={() => onTabChange('benchmark')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'benchmark'
                ? 'bg-[#C5A880] text-[#090A0C] font-semibold shadow-xs'
                : 'text-[#959CA8] hover:text-[#FAF6F0] hover:bg-white/[0.05]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Processor A/B Benchmark</span>
          </button>

          <button
            onClick={() => onTabChange('notebook')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'notebook'
                ? 'bg-[#C5A880] text-[#090A0C] font-semibold shadow-xs'
                : 'text-[#959CA8] hover:text-[#FAF6F0] hover:bg-white/[0.05]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>main.ipynb & Code</span>
          </button>

          <button
            onClick={() => onTabChange('report')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'report'
                ? 'bg-[#C5A880] text-[#090A0C] font-semibold shadow-xs'
                : 'text-[#959CA8] hover:text-[#FAF6F0] hover:bg-white/[0.05]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Scientific Report</span>
          </button>
        </nav>

        {/* Export / Submission Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#141820] text-[#FAF6F0] hover:bg-[#C5A880] hover:text-[#090A0C] transition-all shadow-sm border border-[#C5A880]/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Submission</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
