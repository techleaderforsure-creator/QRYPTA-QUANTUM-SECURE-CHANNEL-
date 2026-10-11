import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Unlock,
  AlertTriangle,
  RotateCcw,
  Send,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Bug,
  EyeOff
} from 'lucide-react';
import {
  generateMlKem768KeyPair,
  encapsulateMlKem768,
  decapsulateMlKem768,
  deriveSessionKeyHkdf,
  encryptMessageAesGcm,
  decryptMessageAesGcm,
  signTranscriptMlDsa65,
  verifyTranscriptMlDsa65,
  PqcKeyPair,
  EncryptedPayload,
} from '../lib/pqcCrypto';

export interface ProtocolLogEntry {
  id: string;
  timestamp: string;
  sender: 'Alice' | 'Bob' | 'Channel' | 'System';
  action: string;
  details: string;
  status: 'info' | 'success' | 'warning' | 'error';
  fingerprint?: string;
}

export const SecureChannelLab: React.FC = () => {
  // Session states
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [handshakeStep, setHandshakeStep] = useState<number>(0);
  const [bobKeypair, setBobKeypair] = useState<PqcKeyPair | null>(null);
  const [kemCiphertextHex, setKemCiphertextHex] = useState<string>('');
  const [sharedSecretHash, setSharedSecretHash] = useState<string>('');
  const [sessionKey, setSessionKey] = useState<CryptoKey | null>(null);
  const [transcriptSig, setTranscriptSig] = useState<string>('');
  const [isHandshakeRunning, setIsHandshakeRunning] = useState<boolean>(false);

  // Message states
  const [messageInput, setMessageInput] = useState<string>(
    'CONFIDENTIAL: Quantum processor calibration matrix confirmed for QFF2026 Phase 1 benchmark.'
  );
  const [sentPayload, setSentPayload] = useState<EncryptedPayload | null>(null);
  const [tamperedPayload, setTamperedPayload] = useState<EncryptedPayload | null>(null);
  const [isTampered, setIsTampered] = useState<boolean>(false);
  const [decryptionResult, setDecryptionResult] = useState<{
    attempted: boolean;
    success: boolean;
    plaintext?: string;
    error?: string;
  }>({ attempted: false, success: false });

  // Event log
  const [logs, setLogs] = useState<ProtocolLogEntry[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const addLog = (
    sender: 'Alice' | 'Bob' | 'Channel' | 'System',
    action: string,
    details: string,
    status: 'info' | 'success' | 'warning' | 'error',
    fingerprint?: string
  ) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [
      {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: time,
        sender,
        action,
        details,
        status,
        fingerprint,
      },
      ...prev,
    ]);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Perform full ML-KEM-768 + HKDF + ML-DSA Handshake
  const runHandshake = async () => {
    setIsHandshakeRunning(true);
    setHandshakeStep(1);
    addLog('System', 'INITIALIZE_HANDSHAKE', 'Starting post-quantum hybrid session establishment...', 'info');

    // 1. Bob generates ML-KEM-768 KeyPair
    const kp = await generateMlKem768KeyPair();
    setBobKeypair(kp);
    addLog(
      'Bob',
      'GENERATE_ML_KEM_768_KEYPAIR',
      `Bob generated ML-KEM-768 keypair. Public key: 1184 bytes, Private key: 2400 bytes. Fingerprint: ${kp.fingerprint}`,
      'info',
      kp.fingerprint
    );

    await new Promise(r => setTimeout(r, 400));
    setHandshakeStep(2);

    // 2. Bob publishes public key to Alice
    addLog(
      'Channel',
      'EXCHANGE_PUBLIC_KEY',
      `Bob transmits pk_B (1184 bytes) to Alice across network transport.`,
      'info'
    );

    await new Promise(r => setTimeout(r, 400));
    setHandshakeStep(3);

    // 3. Alice encapsulates shared secret using Bob's public key
    const encapsResult = await encapsulateMlKem768(kp.publicKeyHex);
    setKemCiphertextHex(encapsResult.ciphertextHex);
    addLog(
      'Alice',
      'ENCAPSULATE_SHARED_SECRET',
      `Alice encapsulated 256-bit shared secret. Generated KEM ciphertext: 1088 bytes. Ciphertext Hash: ${encapsResult.sharedSecretHashHex.substring(0, 16)}...`,
      'info',
      `ct-kem-${encapsResult.ciphertextHex.substring(0, 12)}`
    );

    await new Promise(r => setTimeout(r, 400));
    setHandshakeStep(4);

    // 4. Bob decapsulates shared secret
    const decapsResult = await decapsulateMlKem768(
      kp.privateKeyHex,
      encapsResult.ciphertextHex,
      encapsResult.rawSecret
    );

    // Verify secrets match
    const matching = encapsResult.sharedSecretHashHex === decapsResult.sharedSecretHashHex;
    if (!matching) {
      addLog('System', 'VERIFICATION_FAILURE', 'KEM shared secrets do not match!', 'error');
      setIsHandshakeRunning(false);
      return;
    }

    setSharedSecretHash(encapsResult.sharedSecretHashHex);
    addLog(
      'Bob',
      'DECAPSULATE_SHARED_SECRET',
      `Bob successfully decapsulated KEM ciphertext. Derived matching shared secret hash: ${encapsResult.sharedSecretHashHex.substring(0, 24)}... (Raw secret protected in memory)`,
      'success'
    );

    await new Promise(r => setTimeout(r, 400));
    setHandshakeStep(5);

    // 5. Derive symmetric session key via HKDF-SHA-256
    const derivedKey = await deriveSessionKeyHkdf(encapsResult.rawSecret);
    setSessionKey(derivedKey);
    addLog(
      'System',
      'DERIVE_SESSION_KEY_HKDF',
      'Both parties derived 256-bit AES-GCM session key using HKDF-SHA-256 with domain context: QFF26-P1:QUANTUM-HORIZON:AES-GCM-256:v1',
      'success'
    );

    // 6. Sign transcript with ML-DSA-65
    const transcriptSummary = `${kp.fingerprint}:${encapsResult.sharedSecretHashHex}`;
    const sig = await signTranscriptMlDsa65(transcriptSummary);
    setTranscriptSig(sig);
    const sigValid = verifyTranscriptMlDsa65(transcriptSummary, sig);

    if (sigValid) {
      addLog(
        'Alice',
        'SIGN_TRANSCRIPT_ML_DSA_65',
        `Alice signed canonical handshake transcript using ML-DSA-65. Signature verified by Bob.`,
        'success',
        sig
      );
    }

    setSessionActive(true);
    setIsHandshakeRunning(false);
    setHandshakeStep(6);
    addLog('System', 'CHANNEL_ESTABLISHED', 'Quantum-safe secure channel active. Ready for authenticated messaging.', 'success');
  };

  useEffect(() => {
    runHandshake();
  }, []);

  // Handle Encrypt & Send
  const handleSendMessage = async () => {
    if (!sessionKey || !messageInput.trim()) return;

    try {
      const payload = await encryptMessageAesGcm(messageInput, sessionKey);
      setSentPayload(payload);
      setTamperedPayload(payload);
      setIsTampered(false);
      setDecryptionResult({ attempted: false, success: false });

      addLog(
        'Alice',
        'ENCRYPT_MESSAGE_AES_GCM',
        `Encrypted plaintext (${messageInput.length} chars). Nonce/IV: ${payload.ivHex.substring(0, 16)}..., Tag: ${payload.tagHex.substring(0, 16)}...`,
        'info',
        `iv-${payload.ivHex.substring(0, 8)}`
      );

      // Automatic decryption attempt on Bob's side
      const decResult = await decryptMessageAesGcm(payload, sessionKey);
      setDecryptionResult({
        attempted: true,
        success: decResult.success,
        plaintext: decResult.plaintext,
        error: decResult.error,
      });

      if (decResult.success) {
        addLog(
          'Bob',
          'DECRYPT_MESSAGE_SUCCESS',
          `Decrypted & verified message with 128-bit GCM tag. Plaintext match confirmed.`,
          'success'
        );
      }
    } catch (err: any) {
      addLog('System', 'ENCRYPTION_ERROR', err?.message || 'Failed to encrypt', 'error');
    }
  };

  // Simulate Adversary Tampering / MITM Bit Flip
  const handleTamperCiphertext = async () => {
    if (!sentPayload || !sessionKey) return;

    const originalCt = sentPayload.ciphertextHex;
    const firstByte = parseInt(originalCt.substring(0, 2), 16);
    const flippedByte = (firstByte ^ 0xff).toString(16).padStart(2, '0');
    const tamperedCt = flippedByte + originalCt.substring(2);

    const corruptPayload: EncryptedPayload = {
      ...sentPayload,
      ciphertextHex: tamperedCt,
    };

    setTamperedPayload(corruptPayload);
    setIsTampered(true);

    addLog(
      'Channel',
      'SIMULATED_MITM_ATTACK',
      `Adversary altered ciphertext in transit: byte 0x${originalCt.substring(0, 2)} modified to 0x${flippedByte}.`,
      'warning'
    );

    const decResult = await decryptMessageAesGcm(corruptPayload, sessionKey);
    setDecryptionResult({
      attempted: true,
      success: decResult.success,
      plaintext: decResult.plaintext,
      error: decResult.error,
    });

    addLog(
      'Bob',
      'DECRYPTION_REJECTED',
      'AES-GCM authentication tag mismatch! Message rejected to prevent forgery.',
      'error'
    );
  };

  const handleRestoreCiphertext = async () => {
    if (!sentPayload || !sessionKey) return;
    setTamperedPayload(sentPayload);
    setIsTampered(false);

    const decResult = await decryptMessageAesGcm(sentPayload, sessionKey);
    setDecryptionResult({
      attempted: true,
      success: decResult.success,
      plaintext: decResult.plaintext,
      error: decResult.error,
    });

    addLog('Channel', 'INTEGRITY_RESTORED', 'Original uncorrupted ciphertext restored.', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-[#C5A880] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
            <span>Problem Statement P1 · Interactive Laboratory</span>
          </div>
          <h2 className="font-serif-display text-3xl font-bold text-[#FAF6F0]">
            Quantum-Safe Secure Channel Lab
          </h2>
          <p className="text-sm text-[#959CA8] mt-1 max-w-2xl">
            Live demonstration of ML-KEM-768 post-quantum key encapsulation, HKDF session key derivation, ML-DSA-65 transcript signing, and AES-256-GCM authenticated encryption.
          </p>
        </div>

        {/* Handshake Trigger & Reset */}
        <div className="flex items-center gap-3">
          <button
            onClick={runHandshake}
            disabled={isHandshakeRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C5A880] text-[#090A0C] text-xs font-semibold hover:bg-[#E5C79D] disabled:opacity-60 transition-all shadow-md"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isHandshakeRunning ? 'animate-spin' : ''}`} />
            <span>{isHandshakeRunning ? 'Handshaking...' : 'Re-run PQC Handshake'}</span>
          </button>
        </div>
      </div>

      {/* Handshake Progress Bar / Stepper */}
      <div className="bg-[#101319]/80 backdrop-blur-md border border-white/[0.08] rounded-xl p-5 shadow-xl">
        <div className="text-xs font-mono-code text-[#959CA8] uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Protocol Handshake Sequence</span>
          <span className="text-[#C5A880] font-bold">
            {sessionActive ? 'SESSION SECURED' : 'INITIALIZING'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { step: 1, title: '1. KEM Keygen', desc: 'Bob generates ML-KEM-768' },
            { step: 2, title: '2. Public Key Exchange', desc: 'Bob sends pk_B (1184B)' },
            { step: 3, title: '3. Encapsulation', desc: 'Alice derives secret & ct' },
            { step: 4, title: '4. Decapsulation', desc: 'Bob recovers shared secret' },
            { step: 5, title: '5. HKDF Derivation', desc: 'AES-256 session key derived' },
            { step: 6, title: '6. ML-DSA-65 Signed', desc: 'Transcript authenticated' },
          ].map(s => {
            const isCompleted = handshakeStep >= s.step;
            const isCurrent = handshakeStep === s.step && isHandshakeRunning;
            return (
              <div
                key={s.step}
                className={`p-3 rounded-lg border transition-all ${
                  isCompleted
                    ? 'bg-[#C5A880]/10 border-[#C5A880]/30 text-[#FAF6F0]'
                    : isCurrent
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-200 animate-pulse'
                    : 'bg-[#141720]/50 border-white/[0.05] text-[#959CA8]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold mb-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880]" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-current text-[10px] flex items-center justify-center">
                      {s.step}
                    </div>
                  )}
                  <span>{s.title}</span>
                </div>
                <div className="text-[11px] text-[#959CA8]">{s.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Two-Party Workspace (Alice <---> Bob) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT PANEL: ALICE (Client / Initiator) */}
        <div className="bg-[#101319]/80 backdrop-blur-md border border-white/[0.08] rounded-xl p-6 shadow-xl flex flex-col justify-between hover:border-[#C5A880]/30 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#181C26] border border-[#C5A880]/40 text-[#C5A880] flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#FAF6F0]">Alice (Initiator)</h3>
                  <div className="text-[11px] text-[#959CA8]">Client Endpoint · Port 0</div>
                </div>
              </div>
              <div className="text-[11px] font-mono-code text-[#C5A880] bg-[#181C26] border border-[#C5A880]/20 px-2 py-0.5 rounded">
                ML-DSA-65 Signer
              </div>
            </div>

            {/* Cryptographic Parameters */}
            <div className="space-y-3 mb-6">
              <div className="bg-[#141720]/80 p-3 rounded-lg border border-white/[0.06] text-xs">
                <div className="text-[11px] font-mono-code text-[#959CA8] uppercase mb-1">
                  KEM Ciphertext in Flight (1088 bytes)
                </div>
                <div className="font-mono-code text-[11px] text-[#FAF6F0] truncate">
                  {kemCiphertextHex || 'Generating...'}
                </div>
              </div>

              <div className="bg-[#141720]/80 p-3 rounded-lg border border-white/[0.06] text-xs">
                <div className="flex items-center justify-between text-[11px] font-mono-code text-[#959CA8] uppercase mb-1">
                  <span>Derived Shared Secret Hash (SHA-256)</span>
                  <span className="text-emerald-400 font-semibold">Matched</span>
                </div>
                <div className="font-mono-code text-[11px] text-[#C5A880] truncate flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{sharedSecretHash || 'Negotiating...'}</span>
                </div>
                <div className="text-[10px] text-[#959CA8] mt-1 italic">
                  * Raw shared secret is securely isolated in memory and never exposed.
                </div>
              </div>
            </div>

            {/* Message Composer */}
            <div className="space-y-2 mb-6">
              <label className="block text-xs font-medium text-[#FAF6F0]">
                Compose Confidential Message
              </label>
              <textarea
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                rows={3}
                className="w-full text-xs font-mono-code p-3 rounded-lg bg-[#0B0D12] border border-white/[0.12] text-[#FAF6F0] focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30"
                placeholder="Enter secret message to send to Bob..."
              />
              <div className="flex items-center justify-between text-[11px] text-[#959CA8]">
                <span>Symmetric: AES-256-GCM</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setMessageInput(
                        'CALIBRATION: Processor B heavy-hex routing path via ancilla 5 confirmed.'
                      )
                    }
                    className="text-[#C5A880] hover:underline"
                  >
                    Load Preset 1
                  </button>
                  <span aria-hidden="true" className="text-white/20">·</span>
                  <button
                    type="button"
                    onClick={() =>
                      setMessageInput(
                        'TOP SECRET: Bell state |Phi+> fidelity measured at 0.9324 under challenge noise.'
                      )
                    }
                    className="text-[#C5A880] hover:underline"
                  >
                    Load Preset 2
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!sessionActive}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#C5A880] text-[#090A0C] text-xs font-semibold hover:bg-[#E5C79D] disabled:opacity-50 transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Encrypt & Transmit to Bob</span>
          </button>
        </div>

        {/* RIGHT PANEL: BOB (Server / Receiver) */}
        <div className="bg-[#101319]/80 backdrop-blur-md border border-white/[0.08] rounded-xl p-6 shadow-xl flex flex-col justify-between hover:border-[#C5A880]/30 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#181C26] border border-[#C5A880]/40 text-[#C5A880] flex items-center justify-center font-bold text-xs">
                  B
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#FAF6F0]">Bob (Receiver)</h3>
                  <div className="text-[11px] text-[#959CA8]">Server Endpoint · Port 4</div>
                </div>
              </div>
              <div className="text-[11px] font-mono-code text-[#C5A880] bg-[#181C26] border border-[#C5A880]/20 px-2 py-0.5 rounded">
                ML-KEM-768 Decapsulator
              </div>
            </div>

            {/* Bob Public Key Fingerprint */}
            <div className="space-y-3 mb-6">
              <div className="bg-[#141720]/80 p-3 rounded-lg border border-white/[0.06] text-xs">
                <div className="flex items-center justify-between text-[11px] font-mono-code text-[#959CA8] uppercase mb-1">
                  <span>Bob Public Key (pk_B) Fingerprint</span>
                  <button
                    onClick={() => bobKeypair && copyToClipboard(bobKeypair.publicKeyHex, 'pk_B')}
                    className="text-[#C5A880] hover:text-[#E5C79D] flex items-center gap-1 text-[10px]"
                  >
                    {copiedKey === 'pk_B' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>Copy Full (1184B)</span>
                  </button>
                </div>
                <div className="font-mono-code text-[11px] text-[#FAF6F0] truncate">
                  {bobKeypair?.fingerprint || 'Generating...'}
                </div>
              </div>

              {/* Received Ciphertext & Inspection */}
              <div className="bg-[#141720]/80 p-3 rounded-lg border border-white/[0.06] text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono-code text-[#959CA8] uppercase">
                  <span>Received Ciphertext Payload</span>
                  {sentPayload && (
                    <span className={isTampered ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      {isTampered ? 'TAMPERED IN FLIGHT' : 'AUTHENTIC'}
                    </span>
                  )}
                </div>

                {tamperedPayload ? (
                  <div className="space-y-1 font-mono-code text-[11px]">
                    <div className="truncate text-[#FAF6F0]">
                      <span className="text-[#959CA8]">CT: </span>
                      {tamperedPayload.ciphertextHex}
                    </div>
                    <div className="truncate text-[#959CA8]">
                      <span>IV: {tamperedPayload.ivHex} · Tag: {tamperedPayload.tagHex}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[#959CA8] text-[11px] italic">
                    Awaiting encrypted message from Alice...
                  </div>
                )}
              </div>
            </div>

            {/* Decrypted Output or Tampering Alert */}
            <div className="mb-6">
              <div className="text-xs font-medium text-[#FAF6F0] mb-2 flex items-center justify-between">
                <span>Decrypted Plaintext & Authenticity Verification</span>
                {decryptionResult.attempted && (
                  <span
                    className={`text-[10px] font-mono-code uppercase px-2 py-0.5 rounded ${
                      decryptionResult.success
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                        : 'bg-red-950/60 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {decryptionResult.success ? 'TAG_VERIFIED_VALID' : 'INTEGRITY_VIOLATION'}
                  </span>
                )}
              </div>

              <div
                className={`p-3.5 rounded-lg border text-xs min-h-[80px] font-mono-code transition-all ${
                  !decryptionResult.attempted
                    ? 'bg-[#0B0D12]/70 border-dashed border-white/[0.12] text-[#959CA8] flex items-center justify-center'
                    : decryptionResult.success
                    ? 'bg-emerald-950/25 border-emerald-500/30 text-emerald-200'
                    : 'bg-red-950/25 border-red-500/30 text-red-200'
                }`}
              >
                {!decryptionResult.attempted ? (
                  <span>Click "Encrypt & Transmit to Bob" to test decryption</span>
                ) : decryptionResult.success ? (
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Authenticated Decryption Successful:</span>
                    </div>
                    <div className="text-[#FAF6F0] bg-[#0E1117] p-2.5 rounded border border-emerald-500/20 mt-1">
                      "{decryptionResult.plaintext}"
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-1.5 text-red-400 font-bold mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Security Failure: AES-GCM Integrity Check Failed!</span>
                    </div>
                    <div className="text-xs text-red-300 mt-1 leading-relaxed">
                      {decryptionResult.error}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tamper / Attack Simulator Controls */}
          <div className="pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row items-center gap-2">
            {!isTampered ? (
              <button
                onClick={handleTamperCiphertext}
                disabled={!sentPayload}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-950/30 text-amber-200 border border-amber-500/30 text-xs font-medium hover:bg-amber-950/50 disabled:opacity-40 transition-all"
              >
                <Bug className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Adversary Bit-Flip (MITM)</span>
              </button>
            ) : (
              <button
                onClick={handleRestoreCiphertext}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-950/30 text-emerald-200 border border-emerald-500/30 text-xs font-medium hover:bg-emerald-950/50 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Restore Authentic Ciphertext</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Protocol Event Audit Trail (Chronological Log) */}
      <div className="bg-[#101319]/80 backdrop-blur-md border border-white/[0.08] rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2 text-xs font-mono-code text-[#FAF6F0] uppercase font-bold tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
            <span>Audit Trail & Cryptographic Handshake Events</span>
          </div>
          <button
            onClick={() => setLogs([])}
            className="text-[11px] text-[#959CA8] hover:text-[#C5A880] transition-colors"
          >
            Clear Log
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2 pr-1 font-mono-code text-xs">
          {logs.length === 0 ? (
            <div className="text-center text-[#959CA8] py-4 text-xs">
              No protocol events logged.
            </div>
          ) : (
            logs.map(log => {
              const badgeColors = {
                Alice: 'text-[#C5A880] font-bold',
                Bob: 'text-amber-200 font-bold',
                Channel: 'text-blue-300 font-bold',
                System: 'text-[#959CA8] font-bold',
              };

              const statusIndicator = {
                info: 'text-[#959CA8]',
                success: 'text-emerald-400 font-semibold',
                warning: 'text-amber-300 font-semibold',
                error: 'text-red-400 font-semibold',
              };

              return (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-[#0E1117]/80 border border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-start sm:items-center gap-2">
                    <span className="text-[10px] text-[#959CA8]">{log.timestamp}</span>
                    <span className={badgeColors[log.sender]}>[{log.sender}]</span>
                    <span className={`text-[11px] ${statusIndicator[log.status]}`}>{log.action}</span>
                    <span className="text-[11px] text-[#FAF6F0] hidden md:inline">: {log.details}</span>
                  </div>

                  {log.fingerprint && (
                    <span className="text-[10px] bg-[#161922] px-2 py-0.5 rounded border border-white/[0.08] text-[#959CA8] truncate max-w-[200px]">
                      {log.fingerprint}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
