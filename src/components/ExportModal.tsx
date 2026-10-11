import React, { useState } from 'react';
import { X, Download, CheckCircle2, FileCode, Archive, Sparkles, FolderArchive } from 'lucide-react';
import JSZip from 'jszip';
import { REPO_FILES } from '../lib/repoData';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setIsExporting(true);
    setDownloadSuccess(false);

    try {
      const zip = new JSZip();
      const folder = zip.folder('QFF26-P1') || zip;

      // Add all repository files from verified catalog
      REPO_FILES.forEach(f => {
        folder.file(f.path, f.content);
      });

      // Ensure main.ipynb and additional helper scripts are in zip
      folder.file('src/__init__.py', `from .bell_channel import create_bell_secure_channel, append_tomography_basis\nfrom .transpile_benchmark import benchmark_bell\nfrom .metrics import circuit_metrics, proportion_standard_error, final_report_row\n`);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'QFF26-P1_Submission_Package.zip';
      a.click();
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to create ZIP', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FDFBF7] border border-[#8D1428]/25 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-[#211A1B] space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#827A78] hover:text-[#211A1B] hover:bg-[#8D1428]/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-[#8D1428] uppercase font-bold tracking-wider mb-1">
            <Archive className="w-4 h-4" />
            <span>Submission Package Export</span>
          </div>
          <h3 className="font-serif-display text-2xl font-bold text-[#211A1B]">
            Export QFF26-P1 Artifacts
          </h3>
          <p className="text-xs text-[#827A78] mt-1 leading-relaxed">
            Generate and download the complete official Phase-1 submission archive containing the runnable Jupyter Notebook, processor definitions, results tables, and scientific report.
          </p>
        </div>

        {/* ZIP Package Card */}
        <div className="bg-[#F5EEE8] p-4 rounded-xl border border-[#8D1428]/15 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono-code text-xs font-bold text-[#4B0B18]">
              <FolderArchive className="w-4 h-4 text-[#8D1428]" />
              <span>QFF26-P1_Submission_Package.zip</span>
            </div>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#8D1428]/15 text-[#827A78]">
              All Files Included
            </span>
          </div>

          <div className="text-[11px] text-[#827A78] space-y-1 font-mono-code">
            <div>✓ main.ipynb (23 sections, runnable top to bottom)</div>
            <div>✓ processors/processor_A.json & processor_B.json</div>
            <div>✓ results/tables/AB_comparison.csv & metrics</div>
            <div>✓ results/figures/*.png (All 5 challenge plots)</div>
            <div>✓ README.md, report.md, requirements.txt, src/</div>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#8D1428] text-[#F5EEE8] text-xs font-semibold hover:bg-[#4B0B18] disabled:opacity-60 transition-all shadow-sm"
          >
            {isExporting ? (
              <span className="animate-pulse">Packaging ZIP archive...</span>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#D7A0A2]" />
                <span>Download Started!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#D7A0A2]" />
                <span>Download Complete Submission ZIP</span>
              </>
            )}
          </button>
        </div>

        {/* Individual Quick Downloads */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-[#211A1B]">Quick Individual Downloads:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                const f = REPO_FILES.find(r => r.name === 'README.md');
                if (f) {
                  const blob = new Blob([f.content], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'README.md';
                  a.click();
                }
              }}
              className="p-2.5 rounded-lg bg-white border border-[#8D1428]/15 hover:border-[#8D1428] text-left transition-colors flex items-center justify-between"
            >
              <span className="font-mono-code text-[11px]">README.md</span>
              <Download className="w-3.5 h-3.5 text-[#8D1428]" />
            </button>

            <button
              onClick={() => {
                const f = REPO_FILES.find(r => r.name === 'AB_comparison.csv');
                if (f) {
                  const blob = new Blob([f.content], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'AB_comparison.csv';
                  a.click();
                }
              }}
              className="p-2.5 rounded-lg bg-white border border-[#8D1428]/15 hover:border-[#8D1428] text-left transition-colors flex items-center justify-between"
            >
              <span className="font-mono-code text-[11px]">AB_comparison.csv</span>
              <Download className="w-3.5 h-3.5 text-[#8D1428]" />
            </button>

            <button
              onClick={() => {
                const f = REPO_FILES.find(r => r.name === 'processor_A_metrics.csv');
                if (f) {
                  const blob = new Blob([f.content], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'processor_A_metrics.csv';
                  a.click();
                }
              }}
              className="p-2.5 rounded-lg bg-white border border-[#8D1428]/15 hover:border-[#8D1428] text-left transition-colors flex items-center justify-between"
            >
              <span className="font-mono-code text-[11px]">proc_A_metrics.csv</span>
              <Download className="w-3.5 h-3.5 text-[#8D1428]" />
            </button>

            <button
              onClick={() => {
                const f = REPO_FILES.find(r => r.name === 'processor_B_metrics.csv');
                if (f) {
                  const blob = new Blob([f.content], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'processor_B_metrics.csv';
                  a.click();
                }
              }}
              className="p-2.5 rounded-lg bg-white border border-[#8D1428]/15 hover:border-[#8D1428] text-left transition-colors flex items-center justify-between"
            >
              <span className="font-mono-code text-[11px]">proc_B_metrics.csv</span>
              <Download className="w-3.5 h-3.5 text-[#8D1428]" />
            </button>
          </div>
        </div>

        {/* Note */}
        <div className="text-[11px] text-[#827A78] border-t border-[#8D1428]/10 pt-3">
          Follows SRM University-AP & IBM Quantum guidelines. Ready for submission before the Phase 1 deadline.
        </div>

      </div>
    </div>
  );
};
