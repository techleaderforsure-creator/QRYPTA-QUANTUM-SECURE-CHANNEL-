import React from 'react';
import { QuantumHorizon3D } from './QuantumHorizon3D';
import { ShieldCheck, Cpu, ArrowRight, Lock, KeyRound, Radio, Network, Binary, Sparkles, Layers } from 'lucide-react';
import { ActiveTab } from './Navbar';

interface OverviewHeroProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const OverviewHero: React.FC<OverviewHeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative space-y-12">
      {/* ========================================================= */}
      {/* SECTION 1: HERO VIEWPORT WITH 3D QUANTUM CENTERPIECE      */}
      {/* ========================================================= */}
      <section className="relative pt-8 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Header Title Cluster */}
          <div className="text-center max-w-3xl mx-auto mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121622]/90 border border-[#C5A880]/30 text-[11px] font-mono-code text-[#C5A880] mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
              <span>Qiskit Fall Fest 2026 · Phase 1 Qualification</span>
              <span className="text-white/20">|</span>
              <span>Post-Quantum Cryptography P1</span>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FAF6F0] leading-[1.08] mb-4">
              QRYPTA Quantum Shield P1
            </h1>

            <p className="text-base sm:text-lg text-[#8E96A4] max-w-2xl mx-auto leading-relaxed">
              A timeless, architecture-aware benchmark for quantum-safe communication. Evaluating how physical quantum processor geometry alters cryptographic execution, routing overhead, and entanglement fidelity.
            </p>
          </div>

          {/* 3D Quantum Horizon Centerpiece */}
          <div className="relative max-w-4xl mx-auto my-3">
            <QuantumHorizon3D />

            {/* Floating Scientific Readouts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 -mt-8 relative z-10">
              <div className="glass-panel-luxury rounded-xl p-4 hover:border-[#C5A880]/40 transition-colors">
                <div className="text-[11px] font-mono-code text-[#8E96A4] uppercase tracking-wider">
                  KEM Primitive
                </div>
                <div className="font-semibold text-sm text-[#FAF6F0] mt-0.5">
                  ML-KEM-768
                </div>
                <div className="text-[11px] text-[#C5A880] mt-1 font-mono-code">
                  NIST FIPS 203 Level 3
                </div>
              </div>

              <div className="glass-panel-luxury rounded-xl p-4 hover:border-[#C5A880]/40 transition-colors">
                <div className="text-[11px] font-mono-code text-[#8E96A4] uppercase tracking-wider">
                  Symmetric Cipher
                </div>
                <div className="font-semibold text-sm text-[#FAF6F0] mt-0.5">
                  AES-256-GCM
                </div>
                <div className="text-[11px] text-[#C5A880] mt-1 font-mono-code">
                  Fresh 96-bit Nonce
                </div>
              </div>

              <div className="glass-panel-luxury rounded-xl p-4 hover:border-[#C5A880]/40 transition-colors">
                <div className="text-[11px] font-mono-code text-[#8E96A4] uppercase tracking-wider">
                  Bell Fidelity Delta
                </div>
                <div className="font-semibold text-sm text-[#FAF6F0] mt-0.5">
                  +9.06% on B
                </div>
                <div className="text-[11px] text-emerald-400 mt-1 font-mono-code font-semibold">
                  0.9324 vs 0.8418
                </div>
              </div>

              <div className="glass-panel-luxury rounded-xl p-4 hover:border-[#C5A880]/40 transition-colors">
                <div className="text-[11px] font-mono-code text-[#8E96A4] uppercase tracking-wider">
                  2Q CX Reduction
                </div>
                <div className="font-semibold text-sm text-[#FAF6F0] mt-0.5">
                  -42.9% Gates
                </div>
                <div className="text-[11px] text-[#C5A880] mt-1 font-mono-code">
                  4 CX (B) vs 7 CX (A)
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
            <button
              onClick={() => onNavigate('lab')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg bg-[#C5A880] text-[#07080A] font-semibold text-sm hover:bg-[#E2CCA8] transition-all shadow-lg hover:shadow-[#C5A880]/20 group cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#07080A] group-hover:scale-110 transition-transform" />
              <span>Enter Secure Channel Lab</span>
              <ArrowRight className="w-4 h-4 text-[#07080A] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('benchmark')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg bg-[#121622]/90 text-[#FAF6F0] border border-[#C5A880]/30 font-medium text-sm hover:bg-[#1A2030] hover:border-[#C5A880]/60 transition-all shadow-sm cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-[#C5A880]" />
              <span>Inspect Processor A/B Benchmark</span>
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* EDITORIAL SEPARATOR 1                                     */}
      {/* ========================================================= */}
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="editorial-separator" />
      </div>

      {/* ========================================================= */}
      {/* SECTION 2: CORE MENTAL MODEL & THREAT BRIEF               */}
      {/* ========================================================= */}
      <section className="py-6 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: The Quantum Threat */}
          <div className="glass-panel-luxury rounded-xl p-6 hover:border-[#C5A880]/35 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#141822] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display text-xl font-bold text-[#FAF6F0] mb-2">
              The Cryptanalytic Threat
            </h3>
            <p className="text-sm text-[#8E96A4] leading-relaxed mb-4">
              Shor's algorithm on fault-tolerant quantum hardware breaks classical public-key cryptography (RSA, ECDH, ECDSA). Modern secure channels must transition to lattice-based post-quantum cryptography (ML-KEM, ML-DSA) and entanglement-based verification.
            </p>
            <div className="text-xs font-mono-code text-[#C5A880] bg-[#10131B] p-3 rounded-lg border border-white/[0.06]">
              Harvest-Now-Decrypt-Later (HNDL) resilience requires immediate deployment of hybrid post-quantum key establishment.
            </div>
          </div>

          {/* Card 2: Core Mental Model */}
          <div className="glass-panel-luxury rounded-xl p-6 hover:border-[#C5A880]/35 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#141822] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] mb-4">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display text-xl font-bold text-[#FAF6F0] mb-2">
              Core Mental Model (Page 4)
            </h3>
            <p className="text-sm text-[#8E96A4] leading-relaxed mb-4">
              A mathematically identical logical quantum circuit produces vastly different compiled circuits on different hardware architectures due to placement, routing, and native gate decomposition.
            </p>
            <div className="text-xs font-mono-code text-[#FAF6F0] bg-[#10131B] p-3 rounded-lg border border-white/[0.06] space-y-1">
              <div className="text-[#8E96A4]">Logical Circuit → Placement</div>
              <div className="text-[#C5A880]">→ Routing (SWAP Insertions)</div>
              <div className="text-[#8E96A4]">→ Physical Execution + Noise</div>
              <div className="text-emerald-400 font-semibold">→ Divergent State Fidelity</div>
            </div>
          </div>

          {/* Card 3: Hackathon Mandate */}
          <div className="glass-panel-luxury rounded-xl p-6 hover:border-[#C5A880]/35 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#141822] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] mb-4">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display text-xl font-bold text-[#FAF6F0] mb-2">
              The 3 Submission Rules
            </h3>
            <p className="text-sm text-[#8E96A4] leading-relaxed mb-4">
              Strictly adhered to throughout QRYPTA Quantum Shield P1 as mandated by SRM University-AP & IBM Quantum coordinators:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="font-mono-code font-bold text-[#C5A880]">Rule 1:</span>
                <span className="text-[#FAF6F0]">Exactly one PS selected (P1 - Quantum-Safe Secure Channel).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono-code font-bold text-[#C5A880]">Rule 2:</span>
                <span className="text-[#FAF6F0]">Controlled comparison: Identical shots, seed, and optimizer on A and B.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono-code font-bold text-[#C5A880]">Rule 3:</span>
                <span className="text-[#FAF6F0]">Evidence first: Architecture differences proven with measured metrics.</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* EDITORIAL SEPARATOR 2                                     */}
      {/* ========================================================= */}
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="editorial-separator" />
      </div>

      {/* ========================================================= */}
      {/* SECTION 3: ARCHITECTURE PORTFOLIO & SPECIFICATION GRID    */}
      {/* ========================================================= */}
      <section className="py-6 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-mono-code text-[#C5A880] uppercase tracking-wider mb-1">
              Architecture & Systems Engineering · 2026 Portfolio
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#FAF6F0]">
              Comparative Topologies & Defense Stack
            </h2>
          </div>
          <div className="text-xs font-mono-code text-[#8E96A4]">
            REPRODUCIBILITY LEVEL: COMPLETE (END-TO-END)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Topology Spec: Processor A */}
          <div className="glass-panel-luxury rounded-xl p-6 border-l-2 border-l-[#8E96A4]/40">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-[#8E96A4]" />
                <h4 className="font-serif-display text-lg font-bold text-[#FAF6F0]">
                  Processor A (5-Qubit Line Topology)
                </h4>
              </div>
              <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-white/[0.06] text-[#8E96A4]">
                Baseline
              </span>
            </div>
            <p className="text-xs text-[#8E96A4] leading-relaxed mb-4">
              A 1D linear chain where each internal qubit has degree 2. Communication between endpoint ports (Q0 and Q4) requires traversing 4 physical edges, necessitating two full SWAP stages and accumulating 7 CX gate errors.
            </p>
            <div className="grid grid-cols-3 gap-2 font-mono-code text-[11px] text-center">
              <div className="bg-[#10131B] p-2 rounded border border-white/[0.05]">
                <div className="text-[#8E96A4] text-[10px]">Graph Distance</div>
                <div className="text-[#FAF6F0] font-bold mt-0.5">4 Hops</div>
              </div>
              <div className="bg-[#10131B] p-2 rounded border border-white/[0.05]">
                <div className="text-[#8E96A4] text-[10px]">Circuit Depth</div>
                <div className="text-[#FAF6F0] font-bold mt-0.5">14 Gates</div>
              </div>
              <div className="bg-[#10131B] p-2 rounded border border-white/[0.05]">
                <div className="text-[#8E96A4] text-[10px]">Bell Fidelity</div>
                <div className="text-[#FAF6F0] font-bold mt-0.5">0.8418</div>
              </div>
            </div>
          </div>

          {/* Topology Spec: Processor B */}
          <div className="glass-panel-gold rounded-xl p-6 border-l-2 border-l-[#C5A880]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-[#C5A880]" />
                <h4 className="font-serif-display text-lg font-bold text-[#FAF6F0]">
                  Processor B (7-Qubit Heavy-Hex Cell)
                </h4>
              </div>
              <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#C5A880] font-semibold">
                Optimized
              </span>
            </div>
            <p className="text-xs text-[#8E96A4] leading-relaxed mb-4">
              A heavy-hex unit cell with hexagonal perimeter and internal cross-bridge (Q5, Q6). Reduces effective routing distance to 3 hops, eliminating an entire SWAP stage and boosting state fidelity by +9.06%.
            </p>
            <div className="grid grid-cols-3 gap-2 font-mono-code text-[11px] text-center">
              <div className="bg-[#10131B] p-2 rounded border border-white/[0.05]">
                <div className="text-[#8E96A4] text-[10px]">Graph Distance</div>
                <div className="text-[#C5A880] font-bold mt-0.5">3 Hops (-25%)</div>
              </div>
              <div className="bg-[#10131B] p-2 rounded border border-white/[0.05]">
                <div className="text-[#8E96A4] text-[10px]">Circuit Depth</div>
                <div className="text-[#C5A880] font-bold mt-0.5">8 Gates (-43%)</div>
              </div>
              <div className="bg-[#10131B] p-2 rounded border border-white/[0.05]">
                <div className="text-[#8E96A4] text-[10px]">Bell Fidelity</div>
                <div className="text-emerald-400 font-bold mt-0.5">0.9324 (+9%)</div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

