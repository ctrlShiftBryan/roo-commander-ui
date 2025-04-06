import { useState, useCallback } from 'react';
import type { PromptRole } from '../types';
import { parseAndValidatePrompts, mergePrompts, downloadJson } from '../utils';

interface UsePromptImportExportProps {
  promptRoles: PromptRole[];
  setPromptRoles: React.Dispatch<React.SetStateAction<PromptRole[]>>;
  setCurrentPrompt: React.Dispatch<React.SetStateAction<PromptRole>>;
}

export const usePromptImportExport = ({
  promptRoles,
  setPromptRoles,
  setCurrentPrompt,
}: UsePromptImportExportProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showImportScreen, setShowImportScreen] = useState(false);
  const [importError, setImportError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileSelect = useCallback((file: File | null) => {
    setSelectedFile(file);
    if (file) {
      setImportError(''); // Clear previous errors on new file selection
    }
  }, []);

  const handleImportJson = useCallback(() => {
    if (!selectedFile) {
      setImportError('Please select a JSON file to import.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const fileContent = event.target?.result;
        if (typeof fileContent !== 'string') {
          setImportError('Failed to read file content.');
          return;
        }

        const validationResult = parseAndValidatePrompts(fileContent);

        if (validationResult.error) {
          setImportError(validationResult.error);
          return;
        }

        const validPrompts = validationResult.prompts;
        if (!validPrompts || validPrompts.length === 0) {
          setImportError('No valid prompts found in the file.');
          return;
        }

        const updatedPrompts = mergePrompts(promptRoles, validPrompts);

        setPromptRoles(updatedPrompts);
        // Ensure setCurrentPrompt receives a valid PromptRole object
        if (validPrompts[0]) {
          setCurrentPrompt(validPrompts[0]); // Select the first imported prompt
        }

        setShowImportScreen(false);
        setSelectedFile(null);
        setImportError('');
        setSuccessMessage(
          `Imported ${validPrompts.length} prompt(s) successfully from ${selectedFile.name}!`
        );
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Import Error:', error);
        setImportError('An unexpected error occurred during import.');
      }
    };

    reader.onerror = () => {
      setImportError('Error reading the selected file.');
    };

    reader.readAsText(selectedFile);
  }, [selectedFile, promptRoles, setPromptRoles, setCurrentPrompt]); // Added dependencies

  const handleExportJson = useCallback(() => {
    downloadJson(promptRoles, 'roo-commander-prompts.json');
  }, [promptRoles]); // Added dependency

  const cancelImport = useCallback(() => {
    setShowImportScreen(false);
    setSelectedFile(null);
    setImportError('');
  }, []);

  return {
    selectedFile,
    // setSelectedFile, // Only expose handler below
    handleFileSelect,
    showImportScreen,
    setShowImportScreen,
    importError,
    setImportError, // Expose setter if needed externally
    successMessage,
    setSuccessMessage, // Expose setter if needed externally
    handleImportJson,
    handleExportJson,
    cancelImport,
  };
};
