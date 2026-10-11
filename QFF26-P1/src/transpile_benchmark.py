import json
from pathlib import Path
from qiskit.transpiler import CouplingMap, PassManager
from qiskit.transpiler.passes import (
    SabreLayout,
    SabreSwap,
    BasisTranslator,
    Depth,
    CXCancellation,
    Optimize1qGatesDecomposition,
)
from qiskit.circuit.equivalence_library import SessionEquivalenceLibrary as sel
from qiskit import transpile

# Load official coupling maps
coupling_A = CouplingMap([
    [0, 1], [1, 0],
    [1, 2], [2, 1],
    [2, 3], [3, 2],
    [3, 4], [4, 3]
])

coupling_B = CouplingMap([
    [0, 1], [1, 0],
    [1, 2], [2, 1],
    [2, 3], [3, 2],
    [3, 4], [4, 3],
    [1, 5], [5, 1],
    [5, 6], [6, 5],
    [6, 3], [3, 6]  # Heavy-hex bridge
])

basis_gates = ["rz", "sx", "x", "cx"]

def get_heavy_hex_pass_manager(coupling_map):
    """
    QFF26 P1 - Architecture-aware SWAP router exploiting heavy-hex bridge
    """
    pm = PassManager([
        SabreLayout(coupling_map, max_iterations=4, seed=42),
        SabreSwap(coupling_map, heuristic="decay", seed=42),
        BasisTranslator(sel, target_basis=basis_gates),
        CXCancellation(),
        Optimize1qGatesDecomposition(basis_gates),
        Depth(),
    ])
    return pm

def benchmark_bell(qc_logical, processor="B", opt_level=1):
    """
    Transpiles logical Bell secure channel with Sabre layout/routing.
    Returns compiled circuit and extracted metrics (Depth, CX, SWAP estimate).
    """
    cmap = coupling_B if processor.upper() == "B" else coupling_A

    qc_compiled = transpile(
        qc_logical,
        coupling_map=cmap,
        basis_gates=basis_gates,
        optimization_level=opt_level,
        layout_method="sabre",
        routing_method="sabre",
        seed_transpiler=42,
    )

    ops = qc_compiled.count_ops()
    depth = qc_compiled.depth()
    two_q = ops.get("cx", 0)

    # SWAP estimate: in Qiskit, SWAP is decomposed into 3 CX gates.
    # 1 CX belongs to the original Bell state creation.
    swap_est = max(0, (two_q - 1) // 3)

    return {
        "compiled_circuit": qc_compiled,
        "depth": depth,
        "two_qubit_ops": two_q,
        "swap_estimate": swap_est,
        "operations": dict(ops),
        "2Q_Gates": two_q,
    }
