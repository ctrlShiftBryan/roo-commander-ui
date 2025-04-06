import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ImportScreenProps {
  selectedFile: File | null;
  importError: string;
  handleFileSelect: (file: File | null) => void;
  handleImportJson: () => void;
  cancelImport: () => void;
}

export const ImportScreen: React.FC<ImportScreenProps> = ({
  selectedFile,
  importError,
  handleFileSelect,
  handleImportJson,
  cancelImport,
}) => {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <h2 className="mb-4 text-2xl font-bold">Import Prompts from File</h2>
      <p className="mb-6 text-gray-600">
        Select a JSON file containing one or more prompts. Existing prompts with matching slugs will
        be updated.
      </p>

      <div className="space-y-4">
        {/* File Input */}
        <Input
          type="file"
          accept=".json"
          onChange={(e) => {
            handleFileSelect(e.target.files ? e.target.files[0] : null);
          }}
          className="w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
        />
        {/* Display selected file name */}
        {selectedFile && (
          <p className="text-sm text-gray-500">Selected file: {selectedFile.name}</p>
        )}

        {/* Error message display */}
        {importError && <div className="my-2 text-sm text-red-500">{importError}</div>}

        {/* Action buttons */}
        <div className="flex space-x-4">
          <Button onClick={handleImportJson} disabled={!selectedFile}>
            Upload and Import File
          </Button>
          <Button variant="outline" onClick={cancelImport}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
