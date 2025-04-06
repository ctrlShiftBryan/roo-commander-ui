import React, { useState, useEffect } from 'react'; // Keep useState for local UI state
// Remove unused icons if they are only used in extracted components
import { Sheet } from '@/components/ui/sheet'; // Keep only Sheet, Trigger/Content are in subcomponents
// Remove Dialog imports if only used in HelpDialog
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// Remove Form related imports if only used in PromptForm
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
// Remove Select imports if only used in PromptForm
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Remove AlertDialog imports if only used in PromptSidebar
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
// Remove Button, Input, Textarea, Checkbox, Label, Badge if only used in sub-components
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Label } from '@/components/ui/label';
// import { Badge } from '@/components/ui/badge';

// Import types from the new types file
import type { PromptRole } from '../types';

// Remove constants import if only used in sub-components
// import { groups } from '../constants';

// Hooks are imported
import { usePromptForm } from '../hooks/usePromptForm';
import { usePromptManagement } from '../hooks/usePromptManagement';
import { usePromptImportExport } from '../hooks/usePromptImportExport';

// Import extracted components
import { PromptHeader } from './PromptHeader';
import { PromptSidebar } from './PromptSidebar';
import { PromptForm } from './PromptForm';
import { ImportScreen } from './ImportScreen';

const PromptEditor = () => {
  // Local UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // --- Instantiate Hooks ---
  // Temporary state for initial hook setup
  const [tempCurrentPrompt, setTempCurrentPrompt] = useState<PromptRole>({
    slug: '',
    name: '',
    roleDefinition: '',
    customInstructions: '',
    groups: [],
  });

  const { form } = usePromptForm({ currentPrompt: tempCurrentPrompt });

  const promptManagement = usePromptManagement({
    form,
    isFormDirty,
    setIsFormDirty,
    setIsSidebarOpen,
    setSuccessMessage,
  });

  const importExport = usePromptImportExport({
    promptRoles: promptManagement.promptRoles,
    setPromptRoles: promptManagement.setPromptRoles,
    setCurrentPrompt: promptManagement.setCurrentPrompt,
  });

  // Update temp state when real currentPrompt changes
  useEffect(() => {
    setTempCurrentPrompt(promptManagement.currentPrompt);
  }, [promptManagement.currentPrompt]);

  // Local handler for form changes
  const handleFormChange = () => {
    setIsFormDirty(true);
  };

  // Handler to show import screen and close sidebar
  const showImportScreenHandler = () => {
    importExport.setShowImportScreen(true);
    setIsSidebarOpen(false);
  };

  // --- Remove Render Functions ---
  // const renderEditorUI = () => ( ... ); // Now PromptForm component
  // const renderImportScreen = () => ( ... ); // Now ImportScreen component

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Use PromptHeader Component */}
      <PromptHeader
        isSidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
        isFormDirty={isFormDirty}
        isHelpOpen={isHelpOpen}
        onHelpOpenChange={setIsHelpOpen}
      />

      {/* Sidebar Content (now inside PromptSidebar component) */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        {/* SheetTrigger is now part of PromptHeader */}
        <PromptSidebar
          promptRoles={promptManagement.promptRoles}
          currentPrompt={promptManagement.currentPrompt}
          handleAddNewPrompt={promptManagement.handleAddNewPrompt}
          handlePromptChange={promptManagement.handlePromptChange}
          handleDeletePrompt={promptManagement.handleDeletePrompt}
          onShowImportScreen={showImportScreenHandler} // Pass the combined handler
          handleExportJson={importExport.handleExportJson}
        />
      </Sheet>

      {/* Main content */}
      <main className="flex-1">
        {/* Success message */}
        {successMessage && (
          <div className="mb-4 border-l-4 border-green-500 bg-green-100 p-4 text-green-700">
            {successMessage}
          </div>
        )}

        {/* Conditionally render ImportScreen or PromptForm */}
        {importExport.showImportScreen ? (
          <ImportScreen
            selectedFile={importExport.selectedFile}
            importError={importExport.importError}
            handleFileSelect={importExport.handleFileSelect}
            handleImportJson={importExport.handleImportJson}
            cancelImport={importExport.cancelImport}
          />
        ) : (
          <PromptForm
            form={form}
            currentPrompt={promptManagement.currentPrompt}
            promptRoles={promptManagement.promptRoles}
            isFormDirty={isFormDirty}
            onFormSubmit={promptManagement.onFormSubmit}
            handleFormChange={handleFormChange} // Pass local handler
            handlePromptChange={promptManagement.handlePromptChange}
          />
        )}
      </main>
    </div>
  );
};

export default PromptEditor;
