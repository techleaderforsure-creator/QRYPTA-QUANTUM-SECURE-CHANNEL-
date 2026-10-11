import math

def proportion_standard_error(p: float, n: int) -> float:
    """
    Computes standard error of proportion for shot-based sampling:
    sigma_p = sqrt(p * (1 - p) / n)
    As mandated by Section 11 / Page 19 of the Hackathon Participant Guide.
    """
    if n <= 0:
        return 0.0
    p_c = max(0.0, min(1.0, p))  # clip to [0,1] for statistical safety
    return math.sqrt(p_c * (1.0 - p_c) / n)

def circuit_metrics(qc):
    """
    Extracts structural circuit metrics from compiled circuit.
    Accounts for transpiler decomposing SWAP into 3 CX gates.
    """
    ops = qc.count_ops()
    two_q = sum(n for g, n in ops.items() if g.lower() in {"cx", "cz", "ecr"})
    
    # Qiskit SWAP = 3 CX. In Bell state (|Phi+>), 1 algorithmic CX is needed.
    # Therefore, remaining CXs represent routing SWAPs: (two_q - 1) // 3
    swap_raw = ops.get("swap", 0)
    estimated_swaps = swap_raw if swap_raw > 0 else max(0, (two_q - 1) // 3)

    return {
        "depth": qc.depth(),
        "num_qubits": qc.num_qubits,
        "total_ops": sum(ops.values()),
        "two_qubit_ops_estimate": two_q,
        "swap_count": estimated_swaps,
        "operations": dict(ops),
        "2Q_Gates": two_q  # Matches official CSV schema
    }

def final_report_row(compiled_qc, fidelity: float, shots: int = 2048):
    """
    Generates report row with depth, 2Q gates, measured fidelity, and standard error.
    Mandatory as per Participant Guide Page 19.
    """
    m = circuit_metrics(compiled_qc)
    std = proportion_standard_error(fidelity, shots)
    return {
        "Depth": m["depth"],
        "2Q_Gates": m["2Q_Gates"],
        "Fidelity": round(fidelity, 4),
        "StdErr": round(std, 4),
        "Fidelity_str": f"{fidelity:.4f} ± {std:.4f}"
    }
