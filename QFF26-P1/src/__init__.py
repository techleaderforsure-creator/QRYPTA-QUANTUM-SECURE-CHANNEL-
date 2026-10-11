"""
Qiskit Fall Fest 2026 - Phase 1 Core Package
Problem Statement: P1 - Quantum-Safe Secure Channel (Post-Quantum Cryptography)
"""

from .bell_channel import create_bell_secure_channel, append_tomography_basis
from .transpile_benchmark import benchmark_bell, get_heavy_hex_pass_manager
from .metrics import circuit_metrics, proportion_standard_error, final_report_row
from .pqc_layer import (
    generate_ml_kem_768_keypair,
    encapsulate_ml_kem_768,
    decapsulate_ml_kem_768,
    derive_aes_key,
    encrypt_channel_payload,
    verify_quantum_channel_security,
)

__all__ = [
    "create_bell_secure_channel",
    "append_tomography_basis",
    "benchmark_bell",
    "get_heavy_hex_pass_manager",
    "circuit_metrics",
    "proportion_standard_error",
    "final_report_row",
    "generate_ml_kem_768_keypair",
    "encapsulate_ml_kem_768",
    "decapsulate_ml_kem_768",
    "derive_aes_key",
    "encrypt_channel_payload",
    "verify_quantum_channel_security",
]
