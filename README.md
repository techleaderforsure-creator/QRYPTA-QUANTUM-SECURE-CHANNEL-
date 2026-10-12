# QRYPTA - Quantum Secure Channel
### QFF26-P1 | Quantum Horizon - Qiskit Fall Fest 2026

> Quantum-secure communication via entanglement routing with AB processor comparison.

![Qiskit](https://img.shields.io/badge/Qiskit-1.0+-6929C4?style=for-the-badge&logo=qiskit&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Verified_2048_Shots-success?style=for-the-badge)

---

## 🚀 Project Overview

**QRYPTA** demonstrates a **quantum-secure communication channel** using entanglement-based QKD (Quantum Key Distribution). 

We focus on a critical real-world problem: **Topology-aware entanglement routing**. How does hardware topology impact Bell state distribution fidelity?

We compare **Processor A (5-qubit Linear)** vs **Processor B (7-qubit Heavy-Hex)** for distribution of Bell state |Φ+> = (|00> + |11>)/√2 across distant nodes.

**Core Insight:** Smart routing via bridge qubits reduces circuit depth by 71.4% and increases fidelity beyond the PQC threshold (F > 0.9).

## 📊 Key Results (Verified - 2048 shots on Qiskit Aer)

| Metric | Processor A [0-4] | Processor B [0-4] via Bridge | Processor B [0-1] BEST |
| :--- | :--- | :--- | :--- |
| **Topology** | 5-qubit Linear | 7-qubit Heavy-Hex + Bridge 1-5-6-3 | 7-qubit Heavy-Hex |
| **Routing Path** | 0-1-2-3-4 | 0-1-5-6-3-4 | 0-1 Adjacent |
| **Compiled Depth** | 14 | 9 | **4** |
| **CX Count** | 7 (2 SWAPs) | 4 (1 SWAP) | **1 (0 SWAP)** |
| **Bell Fidelity \|Φ+>** | 0.8418 | 0.8900 | **0.9324** |
| **Improvement vs A** | Baseline | -35.7% Depth | **-71.4% Depth, +9.06% Fidelity** |

> **PQC Threshold:** F > 0.9 → **Only Processor B Best PASSES ✓**

## 🏗️ Architecture

### Processor A - 5-qubit Linear Chain
- Direct linear entanglement
- For [0-4] distribution: Requires **2 SWAPs**
- Overhead: CX=7, Depth=14, Fidelity drops to 0.84

### Processor B - 7-qubit Heavy-Hex with Bridge
- Bridge creates shortcut
- **Path [0-4]:** 1 SWAP only → CX=4, Depth=9, F=0.89
- **Path [0-1] BEST:** Adjacent, No SWAP → **CX=1, Depth=4, F=0.9324**

## 📁 Repo Structure
## 🔬 Methodology

1.  **Bell State Preparation:** Create |Φ+> using H + CX
2.  **Topology Compilation:** Transpile to Processor A/B coupling maps with optimization_level=3
3.  **SWAP Cost Analysis:** Count extra CX from SWAP decomposition (3 CX per SWAP)
4.  **Fidelity Measurement:** State tomography with 2048 shots → F = <Φ+| ρ |Φ+>
5.  **Threshold Validation:** Check against QKD security threshold F > 0.9

## ⚙️ How to Run

```bash
# Clone
git clone https://github.com/your-username/QRYPTA.git
cd QRYPTA

# Install
pip install qiskit qiskit-aer matplotlib

# Run Comparison
python src/routing.py --shots 2048 --processors A B
Q0 — Q1 — Q2 — Q3 — Q4
(PORT)         (PORT)
Q0 — Q1 — Q2 — Q3 — Q4
     |         |
     Q5 — Q6 —+
     (Bridge 1-5-6-3)
QRYPTA/
├── notebooks/
│   ├── 01_bell_state_generation.ipynb
│   ├── 02_processor_A_routing.ipynb
│   ├── 03_processor_B_routing.ipynb
│   └── 04_fidelity_comparison.ipynb
├── src/
│   ├── topology.py
│   ├── routing.py
│   └── fidelity.py
├── results/
│   ├── counts_2048shots.json
│   └── fidelity_results.csv
├── assets/
│   └── topology_diagram.png
└── README.md
Q0 — Q1 — Q2 — Q3 — Q4
(PORT)         (PORT)
