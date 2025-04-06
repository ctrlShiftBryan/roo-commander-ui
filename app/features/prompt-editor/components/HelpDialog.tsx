import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface HelpDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpDialog: React.FC<HelpDialogProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Roo Commander Dashboard Help</DialogTitle>
          <DialogDescription>
            This dashboard allows you to create and manage prompt roles for Roo Commander.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <h3 className="font-semibold">Getting Started</h3>
          <p>
            Use the sidebar to navigate between existing prompts or create new ones. Each prompt has
            a unique slug, a friendly name, role definition, custom instructions, and group
            permissions.
          </p>

          <h3 className="font-semibold">Fields</h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Slug:</strong> A unique identifier (letters, numbers, hyphens only)
            </li>
            <li>
              <strong>Name:</strong> A human-friendly name for the prompt
            </li>
            <li>
              <strong>Role Definition:</strong> Core description of the role&apos;s purpose
            </li>
            <li>
              <strong>Custom Instructions:</strong> Detailed behavior guidelines (use \n for line
              breaks)
            </li>
            <li>
              <strong>Groups:</strong> Permission categories for the role
            </li>
          </ul>

          <h3 className="font-semibold">Import/Export</h3>
          <p>
            Use the Import function to add prompts from JSON data. The Export function saves all
            prompts as a downloadable JSON file.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
