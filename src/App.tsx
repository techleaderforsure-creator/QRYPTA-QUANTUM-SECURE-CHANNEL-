/**
 * QRYPTA Quantum Shield P1: Qiskit Fall Fest 2026 Phase 1 Application
 * Problem Statement: P1 — Quantum-Safe Secure Channel (Post-Quantum Cryptography)
 * Architecture A/B Benchmark & Interactive Laboratory
 * Redesigned with Timeless Luxury Minimalism: Midnight-Black, Deep Charcoal, Warm Ivory & Champagne Gold
 */

import React, { useState } from 'react';
import { BackgroundTemplate } from './components/BackgroundTemplate';
import { Navbar, ActiveTab } from './components/Navbar';
import { OverviewHero } from './components/OverviewHero';
import { SecureChannelLab } from './components/SecureChannelLab';
import { ArchitectureBenchmark } from './components/ArchitectureBenchmark';
import { NotebookViewer } from './components/NotebookViewer';
import { ScientificReportView } from './components/ScientificReportView';
import { ExportModal } from './components/ExportModal';
import { Orbit } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  return (
    <BackgroundTemplate>
      {/* Top Luxury Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenExport={() => setIsExportModalOpen(true)}
      />

      {/* View Router */}
      <main className="flex-1 transition-opacity duration-300">
        {activeTab === 'overview' && (
          <OverviewHero onNavigate={tab => setActiveTab(tab)} />
        )}

        {activeTab === 'lab' && <SecureChannelLab />}

        {activeTab === 'benchmark' && <ArchitectureBenchmark />}

        {activeTab === 'notebook' && (
          <NotebookViewer onOpenExport={() => setIsExportModalOpen(true)} />
        )}

        {activeTab === 'report' && (
          <ScientificReportView onOpenExport={() => setIsExportModalOpen(true)} />
        )}
      </main>

      {/* Luxury Editorial Footer with Architectural Hairline */}
      <footer className="border-t border-white/[0.08] bg-[#0A0D12]/85 backdrop-blur-md py-9 px-4 md:px-8 mt-24 text-xs text-[#8E96A4]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#121620] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] shadow-sm">
              <Orbit className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="font-serif-display font-bold text-sm tracking-[0.14em] text-[#FAF6F0] uppercase">
                QRYPTA QUANTUM SHIELD P1
              </div>
              <div className="font-mono-code text-[11px] text-[#C5A880]">
                Qiskit Fall Fest 2026 Phase 1 · Online Qualification
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right font-mono-code text-[11px] space-y-1">
            <div className="text-[#FAF6F0]">
              Track: Post-Quantum Cryptography · PS: P1 Quantum-Safe Secure Channel
            </div>
            <div className="text-[#8E96A4]">
              SRM University-AP & IBM Quantum Architectural Benchmark
            </div>
          </div>
        </div>
      </footer>

      {/* Export Submission Package Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </BackgroundTemplate>
  );
}

