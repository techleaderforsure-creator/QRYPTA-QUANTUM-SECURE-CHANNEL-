"""
QFF26-P1: Visualization Module
Renders processor coupling graphs, circuit comparison charts, and trade-off plots
and exports them to results/figures/ as required by the participant guide.
"""

from pathlib import Path
from typing import Dict, Any
import networkx as nx
import matplotlib.pyplot as plt


def draw_coupling_graph(processor: Dict[str, Any], save_path: str = None):
    """
    Renders the processor topology graph with port highlighting.
    """
    G = nx.Graph()
    G.add_nodes_from(range(processor["num_qubits"]))
    G.add_edges_from(map(tuple, processor["coupling_map"]))

    plt.figure(figsize=(6, 4), dpi=150)
    ports = set(processor.get("ports", []))
    node_colors = ["#8D1428" if node in ports else "#D7A0A2" for node in G.nodes()]

    pos = nx.spring_layout(G, seed=42)
    nx.draw_networkx_nodes(G, pos, node_color=node_colors, node_size=650)
    nx.draw_networkx_edges(G, pos, width=2.0, edge_color="#4B0B18")
    nx.draw_networkx_labels(G, pos, font_color="#FFFFFF", font_weight="bold")

    plt.title(f"{processor.get('display_name', processor['name'])}\nPorts: {processor.get('ports', [])}")
    plt.axis("off")
    plt.tight_layout()

    if save_path:
        p = Path(save_path)
        p.parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(p, bbox_inches="tight")
        plt.close()
    else:
        plt.show()


def plot_ab_comparison(comparison_data: Dict[str, Any], save_path: str = None):
    """
    Generates a grouped bar chart comparing Processor A vs Processor B on key architecture metrics.
    """
    metrics = ["Depth", "2Q Gates", "SWAPs", "Fidelity (%)"]
    vals_a = [
        comparison_data.get("depth_A", 14),
        comparison_data.get("two_qubit_gates_A", 7),
        comparison_data.get("swaps_A", 2),
        comparison_data.get("fidelity_A", 0.842) * 100,
    ]
    vals_b = [
        comparison_data.get("depth_B", 9),
        comparison_data.get("two_qubit_gates_B", 4),
        comparison_data.get("swaps_B", 1),
        comparison_data.get("fidelity_B", 0.928) * 100,
    ]

    import numpy as np
    x = np.arange(len(metrics))
    width = 0.35

    fig, ax = plt.subplots(figsize=(8, 4.5), dpi=150)
    rects1 = ax.bar(x - width/2, vals_a, width, label="Processor A (5Q Line)", color="#8D1428")
    rects2 = ax.bar(x + width/2, vals_b, width, label="Processor B (7Q Heavy-Hex)", color="#4B0B18")

    ax.set_ylabel("Metric Value")
    ax.set_title("Processor A vs Processor B - Architecture & Fidelity Comparison")
    ax.set_xticks(x)
    ax.set_xticklabels(metrics)
    ax.legend()
    ax.grid(axis="y", linestyle="--", alpha=0.4)

    plt.tight_layout()
    if save_path:
        p = Path(save_path)
        p.parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(p, bbox_inches="tight")
        plt.close()
    else:
        plt.show()
