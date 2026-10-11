"""
QFF26-P1: Processors Module
Loads processor JSON specifications and builds coupling maps, NetworkX graphs,
and Aer noise models based on official challenge configurations.
"""

import json
from pathlib import Path
from typing import Dict, Any, Tuple
import networkx as nx
from qiskit.transpiler import CouplingMap


def load_processor(path: str) -> Dict[str, Any]:
    """
    Loads processor architecture specifications from JSON.
    As per Section 12 of the Hackathon Participant Guide.
    """
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"Processor file not found at: {path}")
    with p.open("r", encoding="utf-8") as f:
        return json.load(f)


def build_processor_graph(proc: Dict[str, Any]) -> nx.Graph:
    """
    Constructs a NetworkX graph from the processor coupling map.
    """
    G = nx.Graph()
    G.add_nodes_from(range(proc["num_qubits"]))
    G.add_edges_from(map(tuple, proc["coupling_map"]))
    return G


def build_coupling_map(proc: Dict[str, Any]) -> CouplingMap:
    """
    Builds a Qiskit CouplingMap instance.
    """
    return CouplingMap(proc["coupling_map"])


def build_noise_model(proc: Dict[str, Any]):
    """
    Constructs an Aer NoiseModel matching the challenge-defined noise parameters.
    Includes single-qubit errors, two-qubit depolarizing gate errors, and readout errors.
    """
    try:
        from qiskit_aer.noise import NoiseModel, depolarizing_error, ReadoutError

        noise_cfg = proc.get("noise", {})
        nm = NoiseModel()

        p1q = noise_cfg.get("single_qubit_gate_error", 0.001)
        p2q = noise_cfg.get("two_qubit_gate_error", 0.015)
        readout_matrix = noise_cfg.get("readout_error", [[0.98, 0.02], [0.02, 0.98]])

        # 1Q gate errors on ['x', 'sx']
        err1 = depolarizing_error(p1q, 1)
        nm.add_all_qubit_quantum_error(err1, ["x", "sx"])

        # 2Q gate errors on ['cx']
        err2 = depolarizing_error(p2q, 2)
        nm.add_all_qubit_quantum_error(err2, ["cx"])

        # Readout error
        r_err = ReadoutError(readout_matrix)
        nm.add_all_qubit_readout_error(r_err)

        return nm
    except ImportError:
        return None
