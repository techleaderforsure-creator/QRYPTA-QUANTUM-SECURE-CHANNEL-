import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Activity,
  Play,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Info,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import {
  PROCESSOR_A,
  PROCESSOR_B,
  runProcessorBenchmark,
  TranspiledCircuitResult,
} from '../lib/quantumSimulation';

export const ArchitectureBenchmark: React.FC = () => {
  const [shots, setShots] = useState<number>(2048);
  const [optLevel, setOptLevel] = useState<number>(1);
  const [enablePostselection, setEnablePostselection] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Benchmarked results state
  const [resultA, setResultA] = useState<TranspiledCircuitResult>(() =>
    runProcessorBenchmark(PROCESSOR_A, 2048, 1)
  );
  const [resultB, setResultB] = useState<TranspiledCircuitResult>(() =>
    runProcessorBenchmark(PROCESSOR_B, 2048, 1)
  );

  const handleRunBenchmark = async () => {
    setIsRunning(true);
    await new Promise(r => setTimeout(r, 350));
    const newA = runProcessorBenchmark(PROCESSOR_A, shots, optLevel);
    const newB = runProcessorBenchmark(PROCESSOR_B, shots, optLevel);
    setResultA(newA);
    setResultB(newB);
    setIsRunning(false);
  };

  const deltaFidelity = resultB.fidelity - resultA.fidelity;
  const deltaDepth = resultB.compiledDepth - resultA.compiledDepth;
  const delta2Q = resultB.twoQubitGates - resultA.twoQubitGates;
  const deltaSwaps = resultB.swapCount - resultA.swapCount;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-[#C5A880] uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4 text-[#C5A880]" />
            <span>Phase 1 Core Requirement · Geometry-Aware Computing</span>
          </div>
          <h2 className="font-serif-display text-3xl font-bold text-[#FAF6F0]">
            Processor A vs Processor B Benchmark
          </h2>
          <p className="text-sm text-[#959CA8] mt-1 max-w-2xl">
            Controlled architecture-aware evaluation answering the central question: <em>How does the processor architecture change the way the same quantum solution executes?</em>
          </p>
        </div>

        {/* Benchmark Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunBenchmark}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C5A880] text-[#090A0C] text-xs font-semibold hover:bg-[#E5C79D] disabled:opacity-60 transition-all shadow-md"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Compiling & Simulating...' : 'Execute Controlled A/B Benchmark'}</span>
          </button>
        </div>
      </div>

      {/* Control Panel Bar */}
      <div className="bg-[#101319]/80 backdrop-blur-md border border-white/[0.08] rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          
          {/* Shot Budget Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[#959CA8] font-medium">Shot Budget:</span>
            <div className="flex items-center bg-[#161922] p-0.5 rounded-lg border border-white/[0.06]">
              {[1024, 2048, 4096].map(s => (
                <button
                  key={s}
                  onClick={() => setShots(s)}
                  className={`px-2.5 py-1 rounded text-xs font-mono-code transition-colors ${
                    shots === s
                      ? 'bg-[#C5A880] text-[#090A0C] font-bold shadow-xs'
                      : 'text-[#FAF6F0] hover:bg-white/[0.06]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Transpiler Optimization Level */}
          <div className="flex items-center gap-2">
            <span className="text-[#959CA8] font-medium">Optimization Level:</span>
            <div className="flex items-center bg-[#161922] p-0.5 rounded-lg border border-white/[0.06]">
              {[0, 1, 2, 3].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setOptLevel(lvl)}
                  className={`px-2.5 py-1 rounded text-xs font-mono-code transition-colors ${
                    optLevel === lvl
                      ? 'bg-[#C5A880] text-[#090A0C] font-bold shadow-xs'
                      : 'text-[#FAF6F0] hover:bg-white/[0.06]'
                  }`}
                >
                  L{lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Parity Syndrome Postselection Toggle */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enablePostselection}
                onChange={e => setEnablePostselection(e.target.checked)}
                className="rounded border-white/[0.2] bg-[#141720] text-[#C5A880] focus:ring-[#C5A880]"
              />
              <span className="text-xs text-[#FAF6F0] font-medium">
                Parity Postselection (Sec. 16)
              </span>
            </label>
          </div>

        </div>

        <div className="text-[11px] font-mono-code text-[#959CA8]">
          Seed: <span className="text-[#C5A880]">42</span> · Basis: <span className="text-[#C5A880]">['rz','sx','x','cx']</span>
        </div>
      </div>

      {/* Side-by-Side Processor Architecture Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Processor A Card */}
        <div className="bg-[#101319]/80 backdrop-blur-md border border-white/[0.08] rounded-xl p-6 shadow-xl space-y-6 hover:border-[#C5A880]/30 transition-colors">
          <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
            <div>
              <div className="text-[11px] font-mono-code text-[#C5A880] uppercase tracking-wider">
                Online Qualification Baseline
              </div>
              <h3 className="font-serif-display text-xl font-bold text-[#FAF6F0]">
                {PROCESSOR_A.displayName}
              </h3>
              <div className="text-xs text-[#959CA8] mt-0.5">
                Topology: 1D Nearest-Neighbor Chain · Graph Distance = 4 hops
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono-code text-[#C5A880] bg-[#181C26] border border-[#C5A880]/20 px-2.5 py-1 rounded">
                5 Physical Qubits
              </div>
            </div>
          </div>

          {/* Visual Coupling Graph (SVG diagram) */}
          <div className="bg-[#141720]/80 p-4 rounded-xl border border-white/[0.06] flex flex-col items-center">
            <div className="text-[11px] font-mono-code text-[#959CA8] mb-2 self-start uppercase">
              Coupling Map: [[0,1], [1,2], [2,3], [3,4]] · Ports: [0, 4]
            </div>
            <svg viewBox="0 0 540 80" className="w-full max-w-[480px] h-20">
              {/* Edges */}
              {[0, 1, 2, 3].map(i => (
                <line
                  key={i}
                  x1={50 + i * 110}
                  y1={40}
                  x2={50 + (i + 1) * 110}
                  y2={40}
                  stroke="#C5A880"
                  strokeWidth="2.5"
                  strokeOpacity="0.7"
                />
              ))}

              {/* Nodes */}
              {[0, 1, 2, 3, 4].map(i => {
                const isPort = i === 0 || i === 4;
                return (
                  <g key={i}>
                    <circle
                      cx={50 + i * 110}
                      cy={40}
                      r={isPort ? 20 : 16}
                      fill={isPort ? "#C5A880" : "#242A36"}
                      stroke={isPort ? "#E5C79D" : "rgba(255,255,255,0.2)"}
                      strokeWidth="2"
                    />
                    <text
                      x={50 + i * 110}
                      y={45}
                      textAnchor="middle"
                      fill={isPort ? "#090A0C" : "#FAF6F0"}
                      fontSize="12"
                      fontWeight="bold"
                    >
                      q{i}
                    </text>
                    {isPort && (
                      <text
                        x={50 + i * 110}
                        y={72}
                        textAnchor="middle"
                        fill="#C5A880"
                        fontSize="10"
                        fontWeight="600"
                      >
                        {i === 0 ? 'Port A' : 'Port B'}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Transpiled Circuit Specs on A */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-[#141720]/80 p-2.5 rounded-lg border border-white/[0.06]">
              <div className="text-[10px] text-[#959CA8] uppercase">Compiled Depth</div>
              <div className="text-base font-bold text-[#FAF6F0] mt-0.5">{resultA.compiledDepth}</div>
              <div className="text-[10px] text-red-400 mt-0.5">+600% vs logical</div>
            </div>
            <div className="bg-[#141720]/80 p-2.5 rounded-lg border border-white/[0.06]">
              <div className="text-[10px] text-[#959CA8] uppercase">2Q CX Gates</div>
              <div className="text-base font-bold text-[#FAF6F0] mt-0.5">{resultA.twoQubitGates}</div>
              <div className="text-[10px] text-[#959CA8] mt-0.5">1 alg + 6 routing</div>
            </div>
            <div className="bg-[#141720]/80 p-2.5 rounded-lg border border-white/[0.06]">
              <div className="text-[10px] text-[#959CA8] uppercase">SWAP Stages</div>
              <div className="text-base font-bold text-[#FAF6F0] mt-0.5">{resultA.swapCount}</div>
              <div className="text-[10px] text-[#959CA8] mt-0.5">3 CX per SWAP</div>
            </div>
            <div className="bg-[#141720]/80 p-2.5 rounded-lg border border-white/[0.06]">
              <div className="text-[10px] text-[#959CA8] uppercase">Active Qubits</div>
              <div className="text-base font-bold text-[#FAF6F0] mt-0.5">{resultA.physicalQubitsUsed} / 5</div>
              <div className="text-[10px] text-[#959CA8] mt-0.5">100% footprint</div>
            </div>
          </div>

          {/* Measured Quantum Fidelity on A */}
          <div className="bg-[#141720]/80 p-4 rounded-xl border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono-code text-[#959CA8] uppercase">
                  Bell State Fidelity (Target |Φ+⟩)
                </div>
                <div className="text-2xl font-serif-display font-bold text-[#C5A880] mt-0.5">
                  {(enablePostselection ? resultA.protectedFidelity : resultA.fidelity).toFixed(4)}
                  <span className="text-xs font-sans text-[#959CA8] font-normal ml-2">
                    ± {resultA.uncertainty.toFixed(4)} (1σ)
                  </span>
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="font-mono-code text-[11px] text-[#FAF6F0] bg-[#181C26] px-2 py-0.5 rounded border border-white/[0.08]">
                  {enablePostselection ? `Yield: ${resultA.syndromeYield}%` : 'Raw Noisy'}
                </span>
              </div>
            </div>

            {/* Pauli Expectation Values */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono-code bg-[#0E1117] p-2 rounded-lg border border-white/[0.06]">
              <div>
                <span className="text-[#959CA8]">⟨ZZ⟩: </span>
                <span className="font-bold text-[#FAF6F0]">{resultA.expZz.toFixed(3)}</span>
              </div>
              <div>
                <span className="text-[#959CA8]">⟨XX⟩: </span>
                <span className="font-bold text-[#FAF6F0]">{resultA.expXx.toFixed(3)}</span>
              </div>
              <div>
                <span className="text-[#959CA8]">⟨YY⟩: </span>
                <span className="font-bold text-[#FAF6F0]">{resultA.expYy.toFixed(3)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Processor B Card */}
        <div className="bg-[#101319]/80 backdrop-blur-md border border-white/[0.08] rounded-xl p-6 shadow-xl space-y-6 hover:border-[#C5A880]/30 transition-colors">
          <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
            <div>
              <div className="text-[11px] font-mono-code text-emerald-400 uppercase tracking-wider font-semibold">
                Contemporary Heavy-Hex Architecture
              </div>
              <h3 className="font-serif-display text-xl font-bold text-[#FAF6F0]">
                {PROCESSOR_B.displayName}
              </h3>
              <div className="text-xs text-[#959CA8] mt-0.5">
                Topology: Heavy-Hex Unit Cell · Graph Distance = 3 hops via bridge
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono-code text-[#C5A880] bg-[#181C26] border border-[#C5A880]/20 px-2.5 py-1 rounded">
                7 Physical Qubits
              </div>
            </div>
          </div>

          {/* Visual Coupling Graph (SVG diagram) */}
          <div className="bg-[#141720]/80 p-4 rounded-xl border border-white/[0.06] flex flex-col items-center">
            <div className="text-[11px] font-mono-code text-[#959CA8] mb-2 self-start uppercase">
              Heavy-Hex Bridge: Ancilla Qubits [q5, q6] provide shortcut
            </div>
            <svg viewBox="0 0 540 80" className="w-full max-w-[480px] h-20">
              {/* Base line edges */}
              {[0, 1, 2, 3].map(i => (
                <line
                  key={`line-${i}`}
                  x1={40 + i * 95}
                  y1={55}
                  x2={40 + (i + 1) * 95}
                  y2={55}
                  stroke="#C5A880"
                  strokeWidth="2.5"
                  strokeOpacity="0.7"
                />
              ))}

              {/* Hexagonal Bridge edges */}
              <line x1={135} y1={55} x2={185} y2={18} stroke="#34D399" strokeWidth="2" />
              <line x1={185} y1={18} x2={275} y2={18} stroke="#34D399" strokeWidth="2" />
              <line x1={275} y1={18} x2={325} y2={55} stroke="#34D399" strokeWidth="2" />

              {/* Main Line Nodes */}
              {[0, 1, 2, 3, 4].map(i => {
                const isPort = i === 0 || i === 4;
                return (
                  <g key={`main-${i}`}>
                    <circle
                      cx={40 + i * 95}
                      cy={55}
                      r={isPort ? 18 : 14}
                      fill={isPort ? "#C5A880" : "#242A36"}
                      stroke={isPort ? "#E5C79D" : "rgba(255,255,255,0.2)"}
                      strokeWidth="2"
                    />
                    <text
                      x={40 + i * 95}
                      y={59}
                      textAnchor="middle"
                      fill={isPort ? "#090A0C" : "#FAF6F0"}
                      fontSize="10"
                      fontWeight="bold"
                    >
                      q{i}
                    </text>
                  </g>
                );
              })}

              {/* Bridge Ancilla Nodes */}
              {[5, 6].map((i, idx) => {
                const cx = idx === 0 ? 185 : 275;
                return (
                  <g key={`bridge-${i}`}>
                    <circle
                      cx={cx}
                      cy={18}
                      r={13}
                      fill="#064E3B"
                      stroke="#34D399"
                      strokeWidth="2"
                    />
                    <text
                      x={cx}
                      y={22}
                      textAnchor="middle"
                      fill="#A7F3D0"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      q{i}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Transpiled Circuit Specs on B */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-[#141720]/80 p-2.5 rounded-lg border border-white/[0.06]">
              <div className="text-[10px] text-[#959CA8] uppercase">Compiled Depth</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">{resultB.compiledDepth}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">-42.9% vs A</div>
            </div>
            <div className="bg-[#141720]/80 p-2.5 rounded-lg border border-white/[0.06]">
              <div className="text-[10px] text-[#959CA8] uppercase">2Q CX Gates</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">{resultB.twoQubitGates}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">-3 CX (-42.9%)</div>
            </div>
            <div className="bg-[#141720]/80 p-2.5 rounded-lg border border-white/[0.06]">
              <div className="text-[10px] text-[#959CA8] uppercase">SWAP Stages</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">{resultB.swapCount}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">1 SWAP (50% less)</div>
            </div>
            <div className="bg-[#141720]/80 p-2.5 rounded-lg border border-white/[0.06]">
              <div className="text-[10px] text-[#959CA8] uppercase">Active Qubits</div>
              <div className="text-base font-bold text-[#FAF6F0] mt-0.5">{resultB.physicalQubitsUsed} / 7</div>
              <div className="text-[10px] text-[#959CA8] mt-0.5">57% footprint</div>
            </div>
          </div>

          {/* Measured Quantum Fidelity on B */}
          <div className="bg-[#141720]/80 p-4 rounded-xl border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono-code text-[#959CA8] uppercase">
                  Bell State Fidelity (Target |Φ+⟩)
                </div>
                <div className="text-2xl font-serif-display font-bold text-emerald-400 mt-0.5">
                  {(enablePostselection ? resultB.protectedFidelity : resultB.fidelity).toFixed(4)}
                  <span className="text-xs font-sans text-[#959CA8] font-normal ml-2">
                    ± {resultB.uncertainty.toFixed(4)} (1σ)
                  </span>
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="font-mono-code text-[11px] text-emerald-300 bg-[#064E3B]/60 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                  {enablePostselection ? `Yield: ${resultB.syndromeYield}%` : 'Raw Noisy'}
                </span>
              </div>
            </div>

            {/* Pauli Expectation Values */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono-code bg-[#0E1117] p-2 rounded-lg border border-white/[0.06]">
              <div>
                <span className="text-[#959CA8]">⟨ZZ⟩: </span>
                <span className="font-bold text-[#FAF6F0]">{resultB.expZz.toFixed(3)}</span>
              </div>
              <div>
                <span className="text-[#959CA8]">⟨XX⟩: </span>
                <span className="font-bold text-[#FAF6F0]">{resultB.expXx.toFixed(3)}</span>
              </div>
              <div>
                <span className="text-[#959CA8]">⟨YY⟩: </span>
                <span className="font-bold text-[#FAF6F0]">{resultB.expYy.toFixed(3)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Mandatory Official A/B Comparison Table (Page 19 & 22) */}
      <div className="bg-[#101319]/80 backdrop-blur-md border border-white/[0.08] rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
          <div>
            <h3 className="font-serif-display text-xl font-bold text-[#FAF6F0]">
              Controlled A/B Comparison Table (Official Format)
            </h3>
            <p className="text-xs text-[#959CA8] mt-0.5">
              Exact schema required by Section 15 of the Hackathon Participant Guide.
            </p>
          </div>
          <div className="text-xs font-mono-code text-[#C5A880] font-semibold bg-[#181C26] border border-[#C5A880]/30 px-2.5 py-1 rounded">
            Shots = {shots} · Opt = L{optLevel}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/[0.08] font-mono-code text-[#C5A880] uppercase text-[11px]">
                <th className="py-2.5 px-3">Metric</th>
                <th className="py-2.5 px-3">Processor A (5Q Line)</th>
                <th className="py-2.5 px-3">Processor B (7Q Heavy-Hex)</th>
                <th className="py-2.5 px-3">Difference (Δ)</th>
                <th className="py-2.5 px-3">Physical & Architectural Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-3 font-semibold text-[#FAF6F0]">Bell State Fidelity (F)</td>
                <td className="py-3 px-3 font-mono-code text-[#C5A880] font-bold">
                  {resultA.fidelity.toFixed(4)}
                </td>
                <td className="py-3 px-3 font-mono-code text-emerald-400 font-bold">
                  {resultB.fidelity.toFixed(4)}
                </td>
                <td className="py-3 px-3 font-mono-code font-bold text-emerald-400">
                  {deltaFidelity >= 0 ? `+${deltaFidelity.toFixed(4)}` : deltaFidelity.toFixed(4)}
                </td>
                <td className="py-3 px-3 text-[#959CA8]">
                  Processor B preserves non-local coherence due to 3 fewer noisy 2Q gates.
                </td>
              </tr>

              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-3 font-semibold text-[#FAF6F0]">Fidelity Uncertainty (σ_p)</td>
                <td className="py-3 px-3 font-mono-code text-[#FAF6F0]">± {resultA.uncertainty.toFixed(4)}</td>
                <td className="py-3 px-3 font-mono-code text-[#FAF6F0]">± {resultB.uncertainty.toFixed(4)}</td>
                <td className="py-3 px-3 font-mono-code text-[#959CA8]">
                  {(resultB.uncertainty - resultA.uncertainty).toFixed(4)}
                </td>
                <td className="py-3 px-3 text-[#959CA8]">
                  Computed via binomial proportion standard error formula σ_p = √(p(1-p)/N).
                </td>
              </tr>

              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-3 font-semibold text-[#FAF6F0]">Compiled Depth</td>
                <td className="py-3 px-3 font-mono-code text-[#FAF6F0]">{resultA.compiledDepth}</td>
                <td className="py-3 px-3 font-mono-code text-emerald-400 font-bold">{resultB.compiledDepth}</td>
                <td className="py-3 px-3 font-mono-code text-emerald-400 font-bold">
                  {deltaDepth} (-42.9%)
                </td>
                <td className="py-3 px-3 text-[#959CA8]">
                  Reduced graph diameter between endpoints eliminates serialized SWAP stages.
                </td>
              </tr>

              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-3 font-semibold text-[#FAF6F0]">Two-Qubit (2Q) Gates</td>
                <td className="py-3 px-3 font-mono-code text-[#FAF6F0]">{resultA.twoQubitGates} CX</td>
                <td className="py-3 px-3 font-mono-code text-emerald-400 font-bold">{resultB.twoQubitGates} CX</td>
                <td className="py-3 px-3 font-mono-code text-emerald-400 font-bold">
                  {delta2Q} (-42.9%)
                </td>
                <td className="py-3 px-3 text-[#959CA8]">
                  Processor A suffers 6 CXs from 2 SWAP expansions; B requires only 1 SWAP (3 CXs).
                </td>
              </tr>

              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-3 font-semibold text-[#FAF6F0]">SWAP Count</td>
                <td className="py-3 px-3 font-mono-code text-[#FAF6F0]">{resultA.swapCount}</td>
                <td className="py-3 px-3 font-mono-code text-emerald-400 font-bold">{resultB.swapCount}</td>
                <td className="py-3 px-3 font-mono-code text-emerald-400 font-bold">
                  {deltaSwaps} (-50.0%)
                </td>
                <td className="py-3 px-3 text-[#959CA8]">
                  Routing optimizer on B routes state via alternate heavy-hex cell bridge.
                </td>
              </tr>

              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-3 font-semibold text-[#FAF6F0]">Active Physical Qubits</td>
                <td className="py-3 px-3 font-mono-code text-[#FAF6F0]">5 (100%)</td>
                <td className="py-3 px-3 font-mono-code text-[#FAF6F0]">4 (57.1%)</td>
                <td className="py-3 px-3 font-mono-code text-emerald-400">-1 qubit</td>
                <td className="py-3 px-3 text-[#959CA8]">
                  Lower physical footprint reduces susceptibility to spectator qubit cross-talk.
                </td>
              </tr>

              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-3 font-semibold text-[#FAF6F0]">Protected Postselected Fidelity</td>
                <td className="py-3 px-3 font-mono-code font-semibold text-[#FAF6F0]">{resultA.protectedFidelity.toFixed(4)}</td>
                <td className="py-3 px-3 font-mono-code font-semibold text-emerald-400">
                  {resultB.protectedFidelity.toFixed(4)}
                </td>
                <td className="py-3 px-3 font-mono-code font-bold text-emerald-400">
                  +{(resultB.protectedFidelity - resultA.protectedFidelity).toFixed(4)}
                </td>
                <td className="py-3 px-3 text-[#959CA8]">
                  Parity stabilizer postselection purifies bit-flip routing errors on both.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
