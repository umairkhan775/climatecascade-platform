import React, { useState, useEffect } from 'react';
import {
  Database,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Table,
  RefreshCw,
  X,
  FileCheck,
  Eye
} from 'lucide-react';
import { dataCenterApi } from '../services/api';
import { DatasetSummary } from '../types';

export const DataCenterPage: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState<DatasetSummary | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any | null>(null);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      const res = await dataCenterApi.getDatasets();
      setDatasets(res.datasets);
    } catch (err) {
      console.error("Failed to load datasets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile || !selectedDataset) return;
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('dataset_type', selectedDataset.id);

      const result = await dataCenterApi.upload(formData);
      setUploadResult(result);
      if (result.success) {
        await loadDatasets();
      }
    } catch (err: any) {
      setUploadResult({
        success: false,
        error: err.response?.data?.detail || "Upload validation failed"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = (typeId: string) => {
    window.open(`/api/data/sample-template/${typeId}`, '_blank');
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-brand-950 flex items-center space-x-2">
              <Database className="w-6 h-6 text-brand-600" />
              <span>Enterprise Data Center</span>
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-800 border border-brand-200">
              CSV • XLSX • JSON Support
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ingest and normalize operational topologies, ERP bill-of-materials, live orders, and supplier routes.
          </p>
        </div>

        <button
          onClick={loadDatasets}
          className="px-4 py-2 border border-surface-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-surface-100 flex items-center space-x-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Sync Schema</span>
        </button>
      </div>

      {/* Dataset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {datasets.map((ds) => (
          <div
            key={ds.id}
            className="p-6 bg-white rounded-2xl border border-surface-300 shadow-card space-y-4 hover:border-brand-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  {ds.id}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Updated: Today
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-2.5">
                {ds.name}
              </h3>

              {/* Key Metrics */}
              <div className="mt-3 p-3 bg-surface-100 rounded-xl border border-surface-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Record Volume</span>
                  <span className="font-bold text-brand-950 font-mono mt-0.5 block">{ds.record_count} Records</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Format Support</span>
                  <span className="font-semibold text-slate-700 mt-0.5 block">{ds.format_support.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleDownloadTemplate(ds.id)}
                className="px-3 py-1.5 rounded-lg border border-surface-300 hover:bg-surface-100 text-xs font-semibold text-slate-700 flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>View Data</span>
              </button>

              <button
                onClick={() => {
                  setSelectedDataset(ds);
                  setUploadFile(null);
                  setUploadResult(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Dataset</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload & Normalization Modal */}
      {selectedDataset && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-elevation border border-surface-300 max-w-xl w-full p-6 animate-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  Data Normalization Wizard
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Upload & Validate: {selectedDataset.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDataset(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Input Area */}
            <div className="p-6 border-2 border-dashed border-surface-300 hover:border-brand-400 rounded-xl bg-surface-50 text-center space-y-3 cursor-pointer">
              <input
                type="file"
                accept=".csv, .xlsx, .json"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer block space-y-2">
                <FileSpreadsheet className="w-10 h-10 text-brand-600 mx-auto" />
                <div className="text-xs font-bold text-slate-800">
                  {uploadFile ? uploadFile.name : "Click to select file (CSV, XLSX, JSON)"}
                </div>
                <p className="text-[11px] text-slate-400">
                  Files are automatically validated against dataset schema without manual editing.
                </p>
              </label>
            </div>

            {/* Validation Feedback */}
            {uploadResult && (
              <div className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                uploadResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center space-x-2 font-bold">
                  {uploadResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
                  <span>
                    {uploadResult.success ? 'Schema Validation & Ingestion Succeeded' : 'Validation Errors Encountered'}
                  </span>
                </div>

                {uploadResult.success ? (
                  <div className="space-y-1 text-slate-700">
                    <p>• Parsed rows: <strong>{uploadResult.total_rows_parsed}</strong></p>
                    <p>• Normalized and stored in database: <strong>{uploadResult.saved_count}</strong></p>
                  </div>
                ) : (
                  <div className="space-y-1 text-amber-800 font-mono text-[11px]">
                    {uploadResult.errors?.map((err: string, idx: number) => (
                      <div key={idx}>• {err}</div>
                    ))}
                    {uploadResult.error && <div>• {uploadResult.error}</div>}
                  </div>
                )}

                {/* Preview sample if available */}
                {uploadResult.preview_sample && uploadResult.preview_sample.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-200">
                    <span className="font-bold text-[10px] uppercase tracking-wider block mb-1">
                      Normalized Sample Preview:
                    </span>
                    <div className="overflow-x-auto bg-white p-2 rounded border border-surface-200 font-mono text-[10px]">
                      <pre>{JSON.stringify(uploadResult.preview_sample[0], null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-surface-200">
              <button
                onClick={() => setSelectedDataset(null)}
                className="px-4 py-2 border border-surface-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-surface-100"
              >
                Close
              </button>

              <button
                onClick={handleUploadSubmit}
                disabled={!uploadFile || isUploading}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-400 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Parsing & Ingesting...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Validate & Store into DB</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
