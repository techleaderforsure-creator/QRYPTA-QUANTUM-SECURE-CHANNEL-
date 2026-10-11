"""
QFF26-P1: Problem Statement Module
Implements the core quantum-safe secure channel protocol via Bell-state entanglement
and full XX, YY, ZZ quantum correlation verification.
"""

from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister


def create_bell_secure_channel(alice_qubit: int = 0, bob_qubit: int = 1, num_qubits: int = 5) -> QuantumCircuit:
    """
    Constructs the logical quantum circuit for the P1 Bell-state secure channel.
    Target state: |Phi+> = (|00> + |11>) / sqrt(2)
    Alice and Bob are separated across designated endpoints.
    """
    qr = QuantumRegister(num_qubits, "q")
    qc = QuantumCircuit(qr, name="P1_Logical_Bell_Channel")

    # Alice prepares superposition on her source node
    qc.h(qr[alice_qubit])

    # Entanglement generation across communication channel to Bob
    qc.cx(qr[alice_qubit], qr[bob_qubit])

    return qc


def append_tomography_basis(qc: QuantumCircuit, basis: str, alice_qubit: int = 0, bob_qubit: int = 1) -> QuantumCircuit:
    """
    Appends basis rotation before measurement to estimate full quantum correlations.
    Basis must be one of 'ZZ', 'XX', 'YY'.
    Warning from Hackathon Guide: Z-basis agreement alone can be a classical mixture!
    Full Bell fidelity requires XX, YY, and ZZ coherence.
    """
    meas_qc = qc.copy()
    cr = ClassicalRegister(2, "meas")
    meas_qc.add_register(cr)

    if basis.upper() == "ZZ":
        # Standard computational basis
        pass
    elif basis.upper() == "XX":
        # Hadamard on both qubits maps X basis to Z basis
        meas_qc.h(alice_qubit)
        meas_qc.h(bob_qubit)
    elif basis.upper() == "YY":
        # S-dagger then H maps Y basis to Z basis
        meas_qc.sdg(alice_qubit)
        meas_qc.h(alice_qubit)
        meas_qc.sdg(bob_qubit)
        meas_qc.h(bob_qubit)
    else:
        raise ValueError(f"Unknown measurement basis: {basis}")

    meas_qc.measure([alice_qubit, bob_qubit], [cr[0], cr[1]])
    return meas_qc


def create_protected_bell_channel(alice_qubit: int = 0, bob_qubit: int = 1, ancilla_qubit: int = 2, num_qubits: int = 5) -> QuantumCircuit:
    """
    Constructs a protected Bell channel using a parity/stabilizer check ancilla
    and syndrome postselection to detect bit-flip / relaxation errors during routing.
    """
    qr = QuantumRegister(num_qubits, "q")
    cr_syndrome = ClassicalRegister(1, "syn")
    qc = QuantumCircuit(qr, cr_syndrome, name="P1_Protected_Bell_Channel")

    # Prepare entangled Bell pair
    qc.h(qr[alice_qubit])
    qc.cx(qr[alice_qubit], qr[bob_qubit])

    # Parity stabilizer check Z_A * Z_B via ancilla
    qc.reset(qr[ancilla_qubit])
    qc.cx(qr[alice_qubit], qr[ancilla_qubit])
    qc.cx(qr[bob_qubit], qr[ancilla_qubit])
    qc.measure(qr[ancilla_qubit], cr_syndrome[0])

    return qc
