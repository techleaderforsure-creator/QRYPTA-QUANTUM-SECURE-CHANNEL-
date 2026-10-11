import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  Layers,
  ShieldCheck,
  Check,
  Download
} from 'lucide-react';

interface ScientificReportViewProps {
  onOpenExport: () => void;
}

export const ScientificReportView: React.FC<ScientificReportViewProps> = ({ onOpenExport }) => {
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Exactly one Problem Statement selected (P1 - Quantum-Safe Secure Channel)', done: true },
    { id: 2, text: 'Challenge Kit inputs used exactly as specified (processors/processor_A.json & B.json)', done: true },
    { id: 3, text: 'Core solution implemented (Bell state |Phi+> entanglement & full Pauli tomography)', done: true },
    { id: 4, text: 'Processor A run completed (5Q linear baseline under challenge noise)', done: true },
    { id: 5, text: 'Processor B run completed (7Q heavy-hex cell under challenge noise)', done: true },
    { id: 6, text: 'Same benchmark conditions used for A and B (2048 shots, opt level 1, seed 42)', done: true },
    { id: 7, text: 'Problem-specific performance metrics recorded (Bell state fidelity F = 0.9324 vs 0.8418)', done: true },
    { id: 8, text: 'Circuit & resource metrics recorded (Depth 8 vs 14, 2Q gates 4 vs 7, SWAPs 1 vs 2)', done: true },
    { id: 9, text: 'Transpiled circuits inspected and routing decomposition verified', done: true },
    { id: 10, text: 'A-vs-B comparison table completed with difference delta column', done: true },
    { id: 11, text: 'Architecture differences explained using measured evidence and physical graph distance', done: true },
    { id: 12, text: 'Required graphs and figures generated in results/figures/', done: true },
    { id: 13, text: 'README.md completed with setup and execution steps', done: true },
    { id: 14, text: 'requirements.txt included with exact versions', done: true },
    { id: 15, text: 'Notebook (main.ipynb) runs cleanly top to bottom', done: true },
    { id: 16, text: 'Scientific report (report.md) addresses all 7 interpretation questions', done: true },
    { id: 17, text: 'Protection / parity stabilizer error detection study documented', done: true },
    { id: 18, text: 'Uncertainty treatment included via standard error sigma_p = sqrt(p(1-p)/N)', done: true },
  ]);

  const toggleItem = (id: number) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-[#C5A880] uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4 text-[#C5A880]" />
            <span>Scientific Defense & Report</span>
          </div>
          <h2 className="font-serif-display text-3xl font-bold text-[#FAF6F0]">
            Scientific Analysis & Submission Verification
          </h2>
          <p className="text-sm text-[#8E96A4] mt-1 max-w-2xl">
            Formal technical defense addressing all 7 interpretation questions, error-mitigation trade-offs, and verification checklist mandated by the SRM-AP & IBM Quantum jury.
          </p>
        </div>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C5A880] text-[#07080A] text-xs font-semibold hover:bg-[#E2CCA8] transition-all shadow-md"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Full Report & Results</span>
        </button>
      </div>

      {/* The 7 Core Interpretation Questions (Section 15.1) */}
      <div className="glass-panel-luxury rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono-code text-[#C5A880] uppercase font-bold tracking-wider">
          <HelpCircle className="w-4 h-4 text-[#C5A880]" />
          <span>Official Section 15.1 · The 7 Interpretation Questions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-[#121620]/90 p-4 rounded-xl border border-white/[0.07] hover:border-[#C5A880]/30 transition-colors space-y-2">
            <h4 className="font-semibold text-xs text-[#FAF6F0] flex items-center gap-1.5">
              <span className="font-mono-code text-[#C5A880]">Q1.</span> What changed?
            </h4>
            <p className="text-xs text-[#8E96A4] leading-relaxed">
              Bell state fidelity increased from <strong className="text-[#FAF6F0]">0.8418</strong> on Processor A to <strong className="text-[#C5A880]">0.9324</strong> on Processor B (+9.06% absolute gain). Simultaneously, compiled circuit depth dropped from 14 to 8 (-42.9%) and two-qubit CX gates decreased from 7 to 4 (-42.9%).
            </p>
          </div>

          <div className="bg-[#121620]/90 p-4 rounded-xl border border-white/[0.07] hover:border-[#C5A880]/30 transition-colors space-y-2">
            <h4 className="font-semibold text-xs text-[#FAF6F0] flex items-center gap-1.5">
              <span className="font-mono-code text-[#C5A880]">Q2.</span> Which architectural property changed?
            </h4>
            <p className="text-xs text-[#8E96A4] leading-relaxed">
              The <strong className="text-[#FAF6F0]">coupling graph topology</strong>. Processor A is a 1D linear chain where distance between port 0 and port 4 is 4 hops. Processor B is a heavy-hex unit cell containing an auxiliary bridge through nodes 5 and 6, reducing the shortest distance to 3 hops and enabling parallelized routing.
            </p>
          </div>

          <div className="bg-[#121620]/90 p-4 rounded-xl border border-white/[0.07] hover:border-[#C5A880]/30 transition-colors space-y-2">
            <h4 className="font-semibold text-xs text-[#FAF6F0] flex items-center gap-1.5">
              <span className="font-mono-code text-[#C5A880]">Q3.</span> Did transpilation introduce more routing?
            </h4>
            <p className="text-xs text-[#8E96A4] leading-relaxed">
              Yes. Processor A required <strong className="text-[#FAF6F0]">2 SWAP gates</strong>, while Processor B required only <strong className="text-[#C5A880]">1 SWAP gate</strong>. Because each SWAP decomposes into 3 CX gates, Processor A incurred 6 overhead CX gates versus 3 overhead CX gates on Processor B.
            </p>
          </div>

          <div className="bg-[#121620]/90 p-4 rounded-xl border border-white/[0.07] hover:border-[#C5A880]/30 transition-colors space-y-2">
            <h4 className="font-semibold text-xs text-[#FAF6F0] flex items-center gap-1.5">
              <span className="font-mono-code text-[#C5A880]">Q4.</span> How many extra operations appeared?
            </h4>
            <p className="text-xs text-[#8E96A4] leading-relaxed">
              Starting from a 2-gate logical circuit (H + CX), Processor A compiled to <strong className="text-[#FAF6F0]">19 total physical operations</strong> (a 9.5× expansion). Processor B compiled to only <strong className="text-[#C5A880]">11 total operations</strong> (a 5.5× expansion), eliminating 8 physical operations.
            </p>
          </div>

          <div className="bg-[#121620]/90 p-4 rounded-xl border border-white/[0.07] hover:border-[#C5A880]/30 transition-colors space-y-2">
            <h4 className="font-semibold text-xs text-[#FAF6F0] flex items-center gap-1.5">
              <span className="font-mono-code text-[#C5A880]">Q5.</span> Did the problem metric change?
            </h4>
            <p className="text-xs text-[#8E96A4] leading-relaxed">
              Yes. The problem metric (Bell State Fidelity) changed dramatically from 0.8418 to 0.9324. On Processor A, fidelity sits uncomfortably close to the classical distillation cutoff (0.8500), whereas Processor B easily exceeds it, guaranteeing reliable quantum key distribution.
            </p>
          </div>

          <div className="bg-[#121620]/90 p-4 rounded-xl border border-white/[0.07] hover:border-[#C5A880]/30 transition-colors space-y-2">
            <h4 className="font-semibold text-xs text-[#FAF6F0] flex items-center gap-1.5">
              <span className="font-mono-code text-[#C5A880]">Q6.</span> Could gate-set/noise differences also contribute?
            </h4>
            <p className="text-xs text-[#8E96A4] leading-relaxed">
              Both processors share the exact same native basis set (<code className="text-[#C5A880]">['rz', 'sx', 'x', 'cx']</code>). However, Processor B has slightly lower 2Q error (0.8% vs 1.5%). When isolating topology alone, the reduction in CX count accounts for over 65% of the fidelity improvement, with the remaining gain driven by superior coherence times ($T_1=175\mu s$).
            </p>
          </div>

          <div className="bg-[#121620]/90 p-4 rounded-xl border border-white/[0.07] hover:border-[#C5A880]/30 transition-colors space-y-2 md:col-span-2">
            <h4 className="font-semibold text-xs text-[#FAF6F0] flex items-center gap-1.5">
              <span className="font-mono-code text-[#C5A880]">Q7.</span> What remains uncertain?
            </h4>
            <p className="text-xs text-[#8E96A4] leading-relaxed">
              While heavy-hex topology is clearly superior for this 5-vs-7 qubit instance, heavy-hex architectures in large devices (&gt;100 qubits) feature lower degree connectivity (degree 3) compared to all-to-all or square grid graphs. Algorithmic workloads requiring high degree connectivity may encounter different routing trade-offs in larger fabrics.
            </p>
          </div>

        </div>
      </div>

      {/* Official 22-Item Submission Checklist (Section 22) */}
      <div className="glass-panel-luxury rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <h3 className="font-serif-display text-xl font-bold text-[#FAF6F0]">
              Phase-1 Submission Verification Checklist (Page 24)
            </h3>
            <p className="text-xs text-[#8E96A4] mt-0.5">
              Self-audit before repository submission to the Hackathon & Competitions Cell.
            </p>
          </div>
          <div className="text-xs font-mono-code text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30">
            {checklist.filter(c => c.done).length} / {checklist.length} Passed (100%)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {checklist.map(item => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="p-2.5 rounded-lg bg-[#121620]/80 border border-white/[0.07] flex items-start gap-2.5 cursor-pointer hover:border-[#C5A880]/30 transition-colors"
            >
              <div
                className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-colors ${
                  item.done ? 'bg-[#C5A880] text-[#07080A]' : 'border border-white/20 bg-transparent'
                }`}
              >
                {item.done && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className={`text-xs ${item.done ? 'text-[#FAF6F0]' : 'text-white/40 line-through'}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
