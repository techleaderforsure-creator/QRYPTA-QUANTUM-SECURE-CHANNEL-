from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister

def create_bell_secure_channel(alice_qubit: int = 0, bob_qubit: int = 1, num_qubits: int = 2) -> QuantumCircuit:
    """
    P1 - Quantum-Safe Secure Channel
    Target Bell state: |Phi+> = (|00> + |11>) / sqrt(2)
    Alice and Bob are mapped to physical communication endpoints.
    """
    n = max(alice_qubit, bob_qubit) + 1
    if num_qubits > n:
        n = num_qubits
    qc = QuantumCircuit(n, 2, name="P1_Bell_Secure_Channel")
    qc.h(alice_qubit)
    qc.cx(alice_qubit, bob_qubit)
    return qc

def append_tomography_basis(qc: QuantumCircuit, basis: str, alice_qubit: int = 0, bob_qubit: int = 1) -> QuantumCircuit:
    """
    Appends basis transformation before measurement to estimate full quantum correlations.
    Basis must be one of 'ZZ', 'XX', 'YY'.
    Warning from Guide: Z-basis agreement alone can be a classical mixture!
    Full Bell fidelity requires XX, YY, and ZZ coherence.
    """
    meas_qc = qc.copy()
    cr = ClassicalRegister(2, "meas")
    meas_qc.add_register(cr)

    if basis.upper() == "ZZ":
        pass
    elif basis.upper() == "XX":
        meas_qc.h(alice_qubit)
        meas_qc.h(bob_qubit)
    elif basis.upper() == "YY":
        meas_qc.sdg(alice_qubit)
        meas_qc.h(alice_qubit)
        meas_qc.sdg(bob_qubit)
        meas_qc.h(bob_qubit)
    else:
        raise ValueError(f"Unknown basis: {basis}")

    meas_qc.measure([alice_qubit, bob_qubit], [cr[0], cr[1]])
    return meas_qc
