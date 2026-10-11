# QFF26-P1: Quantum-Safe Secure Channel (Processor A vs Processor B)
### Qiskit Fall Fest 2026 — Phase 1 Online Qualification Submission
**Track:** Post-Quantum Cryptography  
**Problem Statement Code:** P1  
**Problem Statement Name:** Quantum-Safe Secure Channel  
**Project Name:** QUANTUM HORIZON  
**Team Identification:** QUANTUM HORIZON Research Group  

---

## 1. Overview & Selected Problem Statement

This repository contains the complete, reproducible Phase 1 submission for **Problem Statement P1 (Quantum-Safe Secure Channel)** at **Qiskit Fall Fest 2026**.

In Phase 1, our objective is to:
1. Select exactly one Problem Statement: **P1 — Quantum-Safe Secure Channel**.
2. Construct the end-to-end logical solution: A quantum-safe secure channel leveraging Bell-state entanglement ($|\Phi^+\rangle$) verification alongside post-quantum cryptographic primitives.
3. Benchmark the identical logical quantum circuit on **Processor A** (5-qubit linear baseline) and **Processor B** (7-qubit heavy-hex-inspired unit cell) under controlled conditions.
4. Measure and compare problem-specific metrics (Bell state fidelity $F$, Pauli correlations $\langle XX \rangle, \langle YY \rangle, \langle ZZ \rangle$) and architecture-aware metrics (compiled depth, two-qubit CX gates, SWAP count, physical qubits, postselection yield).
5. Explain the observed physical mechanisms through evidence-based analysis.

---

## 2. Repository Structure

```
QFF26-P1/
├── README.md                 # Setup, execution, methodology, and key results
├── main.ipynb                # Reproducible end-to-end experiment (Sections 1-23)
├── requirements.txt          # Python dependencies (qiskit 1.x, qiskit-aer, networkx, etc.)
├── data/
│   ├── raw/                  # Official Challenge Kit sample data
│   └── processed/            # Processed tomography matrices
├── processors/
│   ├── processor_A.json      # Official Processor A definition (5-qubit line)
│   └── processor_B.json      # Official Processor B definition (7-qubit heavy-hex)
├── src/
│   ├── __init__.py           # Package exports
│   ├── problem.py            # Bell channel & Pauli tomography circuit builder
│   ├── processors.py         # Processor loaders, graph builder & noise models
│   ├── routing.py            # Transpilation and routing pipeline
│   ├── metrics.py            # Depth, SWAPs, Bell fidelity & uncertainty calculation
│   └── visualization.py      # Coupling graph & benchmark plotting utilities
├── results/
│   ├── tables/
│   │   ├── processor_A_metrics.csv
│   │   ├── processor_B_metrics.csv
│   │   ├── AB_comparison.csv
│   │   └── final_comparison.csv
│   └── figures/
│       ├── processor_A_graph.png
│       ├── processor_B_graph.png
│       ├── logical_vs_transpiled.png
│       ├── AB_performance.png
│       └── architecture_tradeoffs.png
└── report.md                 # Full scientific analysis, interpretation, and lab notes
```

---

## 3. Environment Setup & Execution Instructions

### Prerequisites
* Python 3.10, 3.11, or 3.12
* Qiskit 1.x and Qiskit Aer

### Installation
```bash
# Clone the repository and navigate to root
cd QFF26-P1

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install exact pinned requirements
pip install -r requirements.txt
```

### Running the Notebook Top-to-Bottom
Launch JupyterLab or VSCode and execute `main.ipynb` from start to finish:
```bash
jupyter notebook main.ipynb
```
All cells run sequentially without errors, generating all result CSV tables in `results/tables/` and figures in `results/figures/`.

---

## 4. Key Experimental Findings

| Metric | Processor A (5Q Line) | Processor B (7Q Heavy-Hex) | Difference ($\Delta$) | Analysis |
| :--- | :---: | :---: | :---: | :--- |
| **Bell State Fidelity ($F$)** | **0.8418** | **0.9324** | **+0.0906 (+10.8%)** | Processor B preserves entanglement coherence |
| **Standard Error ($\sigma_p$)** | $\pm 0.0081$ | $\pm 0.0055$ | -0.0026 | Measured with 2048 shots per basis |
| **Compiled Depth** | 14 | 8 | -6 (-42.9%) | Heavy-hex bridge reduces critical path |
| **Two-Qubit (2Q) Gates** | 7 | 4 | -3 (-42.9%) | Processor A requires 6 CXs for SWAPs |
| **SWAP Operations** | 2 | 1 | -1 (-50.0%) | Graph distance reduced from 4 to 3 hops |
| **Active Physical Qubits** | 5 | 4 | -1 (-20.0%) | Lower footprint reduces cross-talk risk |
| **Protected Fidelity** | 0.9140 | 0.9712 | +0.0572 (+6.3%) | Parity stabilizer postselection benefit |
| **Syndrome Yield** | 81.4% | 89.6% | +8.2% | B discards fewer corrupt outcomes |

---

## 5. Hackathon Submission Checklist Verification

- [x] **Rule 1 — Exactly one PS selected:** P1 — Quantum-Safe Secure Channel.
- [x] **Rule 2 — Controlled comparison:** Exact same 2048-shot budget, optimization level 1, and seed 42 used on both processors.
- [x] **Rule 3 — Evidence first:** All claims backed by real measured CSV files and uncertainty calculations $\sigma_p = \sqrt{p(1-p)/N}$.
- [x] **Challenge Kit inputs used:** Official processor JSONs loaded via `load_processor()`.
- [x] **Results & figures exported:** Machine-readable CSVs and PNG figures generated.
- [x] **Report completed:** Comprehensive answers to all 7 interpretation questions in `report.md`.
