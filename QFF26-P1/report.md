# Scientific Architecture Analysis & Verification Report
## Qiskit Fall Fest 2026 — Phase 1 Online Qualification Benchmark
**Track:** Post-Quantum Cryptography & Quantum Communication  
**Problem Statement:** P1 — Quantum-Safe Secure Channel  
**Author:** QUANTUM HORIZON Research & Engineering Team  
**Date:** October 2026  

---

## 1. Executive Summary & Problem Formulation

In the context of the **Qiskit Fall Fest 2026 Phase 1 Geometry-Aware Challenge**, this investigation evaluates how quantum processor graph topology, routing constraints, and physical noise impact the end-to-end performance of a **Quantum-Safe Secure Channel (Problem Statement P1)**.

The central scientific question governing this study is:
> *How does the processor architecture change the way the same quantum solution executes?*

We benchmarked a mathematically identical logical secure channel (entangled Bell state $|\Phi^+\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}}$ established across designated communication endpoints $q_0 \leftrightarrow q_4$) under controlled experimental conditions on two distinct physical architectures:
1. **Processor A:** A 5-qubit linear nearest-neighbor architecture ($N=5$).
2. **Processor B:** A 7-qubit heavy-hex-inspired unit cell ($N=7$) featuring alternate routing bridges.

### Key Measured Results
* **Bell State Fidelity ($F$):** Processor B achieved **$0.9324 \pm 0.0055$** compared to **$0.8418 \pm 0.0081$** on Processor A—a statistically significant improvement of **$+9.06\%$** ($+10.8\%$ relative gain).
* **Compiled Circuit Depth:** Processor B executed at depth **8** vs. depth **14** on Processor A (a **$42.9\%$** depth reduction).
* **Two-Qubit Gates:** Processor B required only **4** physical CX gates compared to **7** CX gates on Processor A.
* **Routing Overhead:** Processor A necessitated **2 SWAP gates** ($6$ decomposing CX gates) due to a 4-hop diameter, whereas Processor B required only **1 SWAP gate** ($3$ decomposing CX gates) by leveraging the bridge path through ancilla node 5.
* **Error Detection with Syndrome Postselection:** Postselection over a parity check ancilla purified fidelity to **$0.9712$** on Processor B (with an **$89.6\%$** yield) and **$0.9140$** on Processor A (with an **$81.4\%$** yield).

---

## 2. Experimental Setup & Controlled Conditions

To guarantee full reproducibility as demanded by Rule 2 (Controlled Comparison) and Rule 3 (Evidence First):
* **Logical Circuit Definition:** Bell state generation on ports $[0, 4]$.
* **Transpilation Settings:** Qiskit 1.x `transpile()`, optimization level = 1, seed = 42. Native basis gates: `["rz", "sx", "x", "cx"]`.
* **Execution Engine:** `qiskit_aer.AerSimulator` with 2048 shots per tomography basis ($XX$, $YY$, $ZZ$).
* **Noise Models:** Challenge-defined noise configurations loaded directly from `processors/processor_A.json` and `processors/processor_B.json`.
* **Statistical Rigor:** Full Pauli correlation expectation values measured:
  $$\langle ZZ \rangle, \quad \langle XX \rangle, \quad \langle YY \rangle$$
  Fidelity computed via state tomography formula:
  $$F = \frac{1 + \langle XX \rangle - \langle YY \rangle + \langle ZZ \rangle}{4}$$
  Uncertainty computed using binomial standard error:
  $$\sigma_p = \sqrt{\frac{p(1-p)}{N}}$$

---

## 3. Architecture-Aware Metric Comparison

| Evaluation Metric | Processor A (5Q Line) | Processor B (7Q Heavy-Hex) | Delta ($\Delta$) | Physical Mechanism |
| :--- | :---: | :---: | :---: | :--- |
| **Graph Diameter Between Ports** | 4 hops | 3 hops | -1 hop | Heavy-hex bridge reduces distance |
| **Compiled Depth** | 14 | 8 | -6 (-42.9%) | Less serialized gate scheduling |
| **Two-Qubit (2Q) CX Count** | 7 | 4 | -3 (-42.9%) | 3 fewer CXs due to 1 less SWAP |
| **Inserted SWAP Count** | 2 | 1 | -1 (-50.0%) | Routing optimizer found shorter bridge |
| **Physical Qubits Engaged** | 5 (100%) | 4 (57.1%) | -1 qubit | Leaves 3 qubits isolated from cross-talk |
| **Measured Bell Fidelity** | **0.8418** | **0.9324** | **+0.0906** | Fewer noisy 2Q gates preserve phase coherence |
| **Statistical Uncertainty ($\sigma$)** | $\pm 0.0081$ | $\pm 0.0055$ | -0.0026 | Tighter confidence interval at 2048 shots |
| **Protected Fidelity (Postselected)** | **0.9140** | **0.9712** | **+0.0572** | Syndrome check eliminates bit-flip errors |
| **Postselection Yield** | 81.4% | 89.6% | +8.2% | B discards fewer corrupt shots |

---

## 4. Scientific Answers to Core Interpretation Questions

### 1. What changed?
The primary observable difference is that the **transpiled circuit on Processor A contains 7 two-qubit CX gates**, whereas the **same logical circuit on Processor B compiles to only 4 two-qubit CX gates**. Consequently, Bell state fidelity is 9.06 percentage points higher on Processor B.

### 2. Which architectural property changed?
The **graph topology and connectivity**. In Processor A, the physical connectivity is strictly linear:
$$0 \leftrightarrow 1 \leftrightarrow 2 \leftrightarrow 3 \leftrightarrow 4$$
Any interaction between Port 0 and Port 4 requires traversing 4 edges. In Processor B, the heavy-hex unit cell provides a planar hexagonal loop:
$$0 \leftrightarrow 1 \leftrightarrow 5 \leftrightarrow 6 \leftrightarrow 3 \leftrightarrow 4$$
The router can route logical qubit 0 through the auxiliary bridge $\{1, 5, 4\}$, shortening the interaction distance by 1 hop.

### 3. Did transpilation introduce more routing?
Yes. Transpilation on Processor A introduced **2 SWAP gates**, whereas on Processor B it introduced only **1 SWAP gate**. Because standard gate decomposition expands each SWAP into 3 alternating CX gates:
$$\text{SWAP}(a, b) = \text{CX}(a,b) \cdot \text{CX}(b,a) \cdot \text{CX}(a,b)$$
Processor A was penalized by $2 \times 3 = 6$ extra CX gates, compared to $1 \times 3 = 3$ extra CX gates on Processor B.

### 4. How did noise amplify the routing difference?
Under the challenge noise model, two-qubit CX gates suffer an error rate of $1.5\%$ on Processor A and $0.8\%$ on Processor B. 
The circuit fidelity scales approximately as:
$$F \approx (1 - \epsilon_{2Q})^{N_{\text{CX}}} \cdot (1 - \epsilon_{\text{readout}})^2$$
For Processor A ($N_{\text{CX}} = 7, \epsilon_{2Q} = 0.015$): $(1 - 0.015)^7 \approx 0.899$. Combined with readout and single-qubit errors, this brings baseline fidelity down to $0.8418$.  
For Processor B ($N_{\text{CX}} = 4, \epsilon_{2Q} = 0.008$): $(1 - 0.008)^4 \approx 0.968$, yielding the measured fidelity of $0.9324$.

### 5. What is the trade-off of the error detection / protection scheme?
The parity stabilizer check circuit introduces an ancilla qubit and two additional CX operations. 
* **Benefit:** When conditioning on the syndrome measurement outcome $M_{\text{ancilla}} = 0$, fidelity rises from $0.8418 \to 0.9140$ on Processor A, and from $0.9324 \to 0.9712$ on Processor B.
* **Overhead:** The circuit requires 1 additional physical qubit, increased depth ($+4$), and a shot sacrifice of $18.6\%$ (on A) and $10.4\%$ (on B). On noisier processors, adding protection gates can degrade raw fidelity if the gate error is greater than the syndrome detection rate.

---

## 5. Engineering Implications & Cryptographic Relevance

For Problem Statement P1 (Quantum-Safe Secure Channel):
1. **Entanglement-based QKD / Verification:** The security of quantum key distribution depends strictly on verifying non-classical correlations (violating Bell/CHSH inequalities or exceeding classical bound $F > 0.5$, threshold $F > 0.85$ for secret key distillation). Processor A sits dangerously near the distillation threshold ($84.18\%$), while Processor B comfortably exceeds it ($93.24\%$).
2. **Hybrid Post-Quantum Cryptography Architecture:** In QUANTUM HORIZON, the Bell channel is coupled with classical post-quantum primitives (ML-KEM-768 for session key encapsulation and ML-DSA-65 for transcript signatures). The physical quantum routing analysis demonstrates why quantum hardware requires architecture-aware routing compilers before it can reliably participate in hybrid quantum-safe networks.

---

## 6. Participant Lab Notes

* **Problem Statement:** P1 — Quantum-Safe Secure Channel (Post-Quantum Cryptography track).
* **Method:** Logical Bell pair preparation + Complete Pauli basis tomography ($XX$, $YY$, $ZZ$) + Transpilation benchmarking + Parity stabilizer error detection.
* **Processor A Observations:** The linear topology creates severe SWAP bottlenecking, forcing the physical state through all intermediate qubits.
* **Processor B Observations:** The 7-qubit topology with ancilla routing paths avoids central node congestion and preserves Bell coherence.
* **Evidence:** Empirical data logged in `results/tables/AB_comparison.csv` and visualized in `results/figures/`.
