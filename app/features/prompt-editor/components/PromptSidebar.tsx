import React from 'react';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Upload, Download, ChevronRight, Trash2 } from 'lucide-react';
import type { PromptRole } from '../types';

interface PromptSidebarProps {
  promptRoles: PromptRole[];
  currentPrompt: PromptRole;
  handleAddNewPrompt: () => void;
  handlePromptChange: (slug: string) => void;
  handleDeletePrompt: (slug: string) => void;
  onShowImportScreen: () => void; // Renamed for clarity
  handleExportJson: () => void;
}

export const PromptSidebar: React.FC<PromptSidebarProps> = ({
  promptRoles,
  currentPrompt,
  handleAddNewPrompt,
  handlePromptChange,
  handleDeletePrompt,
  onShowImportScreen,
  handleExportJson,
}) => {
  return (
    <SheetContent side="left" className="w-80">
      <SheetHeader>
        <SheetTitle>Roo Commander Prompts</SheetTitle>
      </SheetHeader>
      <div className="py-4">
        <div className="mb-4 space-y-1">
          <Button variant="outline" className="w-full justify-start" onClick={handleAddNewPrompt}>
            <Plus className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onShowImportScreen} // Use the passed handler
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Prompts
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={handleExportJson}>
            <Download className="mr-2 h-4 w-4" />
            Export All Prompts
          </Button>
        </div>

        <div className="space-y-1">
          {promptRoles.map((prompt) => (
            <div key={prompt.slug} className="flex items-center justify-between">
              <Button
                variant={prompt.slug === currentPrompt.slug ? 'secondary' : 'ghost'}
                className="w-full justify-start overflow-hidden py-2 text-left"
                onClick={() => {
                  if (prompt.slug) {
                    handlePromptChange(prompt.slug);
                  }
                }}
                disabled={!prompt.slug}
              >
                <span className="truncate">{prompt.name}</span>
                <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Prompt</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete &quot;{prompt.name}&quot;? This action cannot
                      be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        if (prompt.slug) {
                          handleDeletePrompt(prompt.slug);
                        }
                      }}
                      disabled={!prompt.slug}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      </div>
    </SheetContent>
  );
};
