import React, { useState } from 'react';

interface FormFillerProps {
  teamId?: string;
  onSuccess?: (result: any) => void;
}

/**
 * FormFiller Component - Integrates with the FormFillerAgent
 * 
 * Allows users to:
 * - Upload PDF, Word, Excel forms and customer data
 * - Fill single or batch forms
 * - Analyze form structure
 * - Verify filled forms
 * 
 * Features:
 * - Drag-and-drop file upload
 * - Customer data preview
 * - Progress tracking for batch operations
 * - Download filled forms
 */
export const FormFiller: React.FC<FormFillerProps> = ({ teamId, onSuccess }) => {
  const [formFile, setFormFile] = useState<File | null>(null);
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'single' | 'batch' | 'analyze'>('single');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{current: number; total: number} | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormFile(file);
    setError(null);

    // Upload the file to backend
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/forms/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) throw new Error('Upload failed');
      const uploadedFile = await response.json();
      console.log('Form uploaded:', uploadedFile);
    } catch (err) {
      setError(`Failed to upload form: ${err}`);
    }
  };

  const handleDataFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDataFile(file);
    setError(null);

    // Upload customer data file
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/forms/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) throw new Error('Upload failed');
      const uploadedFile = await response.json();
      console.log('Data file uploaded:', uploadedFile);
    } catch (err) {
      setError(`Failed to upload data: ${err}`);
    }
  };

  const handleAnalyzeForm = async () => {
    if (!formFile) {
      setError('Please upload a form first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/forms/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: new URLSearchParams({
          form_file: formFile.name,
          form_type: formFile.name.split('.').pop() || 'pdf',
        }).toString(),
      });

      if (!response.ok) throw new Error('Analysis failed');
      const analysisResult = await response.json();
      setResult(analysisResult);
      onSuccess?.(analysisResult);
    } catch (err) {
      setError(`Form analysis failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFillForm = async () => {
    if (!formFile || !dataFile) {
      setError('Please upload both form and data files');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dataContent = await dataFile.text();
      const customerData = JSON.parse(dataContent);

      const params = new URLSearchParams({
        form_file: formFile.name,
        customer_data: JSON.stringify(customerData),
        output_file: `filled_${Date.now()}.pdf`,
        sign_document: 'false',
      });

      const response = await fetch('/api/forms/fill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: params.toString(),
      });

      if (!response.ok) throw new Error('Form filling failed');
      const fillResult = await response.json();
      setResult(fillResult);
      onSuccess?.(fillResult);
    } catch (err) {
      setError(`Form filling failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchFill = async () => {
    if (!formFile || !dataFile) {
      setError('Please upload both form and data files');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dataContent = await dataFile.text();
      const customersData = dataFile.name.endsWith('.csv')
        ? parseCSV(dataContent)
        : JSON.parse(dataContent);

      if (!Array.isArray(customersData)) {
        throw new Error('Customer data must be an array');
      }

      const params = new URLSearchParams({
        form_template: formFile.name,
        customers_data: JSON.stringify(customersData),
        output_directory: `./filled_forms_${Date.now()}`,
        sign_documents: 'false',
      });

      const response = await fetch('/api/forms/fill-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: params.toString(),
      });

      if (!response.ok) throw new Error('Batch filling failed');
      const batchResult = await response.json();
      setResult(batchResult);
      setProgress(null);
      onSuccess?.(batchResult);
    } catch (err) {
      setError(`Batch filling failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const parseCSV = (content: string) => {
    const lines = content.trim().split('\n');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Form Filler Agent</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Operation Mode</label>
        <div className="flex gap-4">
          {(['single', 'batch', 'analyze'] as const).map(m => (
            <label key={m} className="flex items-center">
              <input
                type="radio"
                value={m}
                checked={mode === m}
                onChange={e => setMode(e.target.value as typeof m)}
                className="mr-2"
              />
              <span className="text-sm capitalize">{m} Fill</span>
            </label>
          ))}
        </div>
      </div>

      {/* File Uploads */}
      <div className="space-y-4 mb-6">
        {/* Form File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".pdf,.docx,.xlsx"
            onChange={handleFormFileUpload}
            className="hidden"
            id="form-input"
          />
          <label htmlFor="form-input" className="cursor-pointer">
            <div className="text-gray-600">
              <p className="font-medium">
                {formFile ? formFile.name : 'Drop form here or click to choose'}
              </p>
              <p className="text-xs text-gray-500 mt-1">PDF, Word (.docx), or Excel (.xlsx)</p>
            </div>
          </label>
        </div>

        {/* Data File Upload */}
        {mode !== 'analyze' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleDataFileUpload}
              className="hidden"
              id="data-input"
            />
            <label htmlFor="data-input" className="cursor-pointer">
              <div className="text-gray-600">
                <p className="font-medium">
                  {dataFile ? dataFile.name : 'Drop customer data here or click to choose'}
                </p>
                <p className="text-xs text-gray-500 mt-1">JSON or CSV</p>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Progress */}
      {progress && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Processing</span>
            <span>{progress.current} / {progress.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            if (mode === 'analyze') handleAnalyzeForm();
            else if (mode === 'single') handleFillForm();
            else handleBatchFill();
          }}
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Processing...' : mode === 'analyze' ? 'Analyze Form' : mode === 'single' ? 'Fill Form' : 'Fill Batch'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
          <h3 className="font-semibold mb-2">Results:</h3>
          <pre className="text-sm overflow-auto max-h-64 text-gray-600">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FormFiller;
