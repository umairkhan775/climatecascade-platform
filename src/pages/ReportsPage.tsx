import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Eye,
  PlusCircle,
  CheckCircle2,
  Calendar,
  Clock,
  Layers,
  ShieldCheck,
  AlertCircle,
  X,
  FileCheck,
  ExternalLink
} from 'lucide-react';
import { reportApi } from '../services/api';
import { ReportItem } from '../types';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewReport, setPreviewReport] = useState<ReportItem | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const list = await reportApi.getAll();
      setReports(list);
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      const res = await reportApi.generate({
        scenario_code: 'EXTREME_HEAT_4C',
        title: 'ClimateCascade Operational Climate Stress Analysis - Heatwave 4.0C'
      });
      await loadReports();
    } catch (err) {
      console.error("Failed to generate report:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (filename: string) => {
    window.open(reportApi.getDownloadUrl(filename), '_blank');
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-brand-950 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-brand-600" />
              <span>Operational Stress Reports & Audits</span>
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-800 border border-brand-200">
              PDF Audit Generation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Formal risk governance reports documenting first failure root causes, dependency cascades, and intervention ROIs.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-400 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-2 transition-all"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating PDF via ReportLab...</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              <span>Generate Impact Report</span>
            </>
          )}
        </button>
      </div>

      {/* Reports Listing Table */}
      <div className="bg-white rounded-2xl border border-surface-300 shadow-card overflow-hidden">
        <div className="p-5 border-b border-surface-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Generated Climate Stress Analysis Documents
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {reports.length} Document(s) Archiving
          </span>
        </div>

        <div className="divide-y divide-surface-200">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-5 hover:bg-surface-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{rep.title}</h4>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                    <span>Scenario: <strong className="text-slate-700">{rep.scenario_name}</strong></span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rep.generated_at}</span>
                    </span>
                  </div>

                  {/* Summary First: Key Findings, Main Exposure, Main Intervention */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2.5 bg-surface-100 rounded-lg border border-surface-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Key Finding</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                        Plant 1 Cooling Derates First
                      </span>
                    </div>

                    <div className="p-2.5 bg-surface-100 rounded-lg border border-surface-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Main Exposure</span>
                      <span className="font-bold text-slate-900 mt-0.5 block font-sans">
                        ₹18.6L Unmitigated
                      </span>
                    </div>

                    <div className="p-2.5 bg-surface-100 rounded-lg border border-surface-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Main Intervention</span>
                      <span className="font-bold text-emerald-700 mt-0.5 block font-sans">
                        ₹{(rep.avoided_exposure_inr / 100000).toFixed(1)}L Avoided
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setPreviewReport(rep)}
                  className="px-3.5 py-2 rounded-lg border border-brand-300 hover:bg-brand-50 text-xs font-semibold text-brand-800 flex items-center space-x-1.5 transition-colors shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5 text-brand-600" />
                  <span>View Full Report</span>
                </button>

                <button
                  onClick={() => rep.pdf_filename && handleDownload(rep.pdf_filename)}
                  className="px-3 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Report Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-elevation border border-surface-300 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  ClimateCascade Impact Report Preview
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {previewReport.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewReport(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Body */}
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-sans">
              <div className="p-3.5 bg-brand-50/60 rounded-xl border border-brand-200 text-brand-900">
                <span className="font-bold block mb-1">Executive Summary</span>
                {previewReport.summary_text}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-surface-100 rounded-xl border border-surface-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Scenario Tested</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{previewReport.scenario_name}</span>
                  <span className="text-slate-500 mt-1 block">Sanand & Chakan Industrial Clusters</span>
                </div>
                <div className="p-3 bg-surface-100 rounded-xl border border-surface-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Financial Variance</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">Gross: ₹18.6L</span>
                  <span className="font-bold text-emerald-700 block">Net Residual: ₹7.4L (-₹11.2L Avoided)</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Document Audit Sections Included in PDF:
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                  <li><strong>Section 1:</strong> Climate Hazard Telemetry & IMD Warning Thresholds</li>
                  <li><strong>Section 2:</strong> First Failure Bottleneck (Plant 1 Chilled Water Cooling Capacity)</li>
                  <li><strong>Section 3:</strong> 6-Stage Operational Cascade Chain (Cooling → Line 2 → SKU-17 → Orders)</li>
                  <li><strong>Section 4:</strong> 37 Tier-1 Customer Consignments SLA Exposure Matrix</li>
                  <li><strong>Section 5:</strong> Intervention Cost-Benefit Analysis (Plant 2 Capacity Shift)</li>
                  <li><strong>Section 6:</strong> Deterministic Mathematical Formulas & Legal Covenants</li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-200 flex items-center justify-between">
              <button
                onClick={() => setPreviewReport(null)}
                className="px-4 py-2 border border-surface-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-surface-100"
              >
                Close Preview
              </button>

              <button
                onClick={() => {
                  if (previewReport.pdf_filename) {
                    handleDownload(previewReport.pdf_filename);
                  }
                }}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Official PDF Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
