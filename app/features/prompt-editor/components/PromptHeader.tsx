import React from 'react';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu } from 'lucide-react';
import { HelpDialog } from './HelpDialog'; // Import the extracted HelpDialog

interface PromptHeaderProps {
  isSidebarOpen: boolean;
  onSidebarOpenChange: (open: boolean) => void;
  isFormDirty: boolean;
  isHelpOpen: boolean;
  onHelpOpenChange: (open: boolean) => void;
}

export const PromptHeader: React.FC<PromptHeaderProps> = ({
  isSidebarOpen,
  onSidebarOpenChange,
  isFormDirty,
  isHelpOpen,
  onHelpOpenChange,
}) => {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Sidebar Trigger */}
        <Sheet open={isSidebarOpen} onOpenChange={onSidebarOpenChange}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          {/* SheetContent is now in PromptSidebar component */}
        </Sheet>

        <h1 className="ml-3 text-xl font-semibold">Roo Commander Dashboard</h1>

        <div className="ml-auto flex items-center space-x-4">
          {/* Status indicator */}
          <Badge variant={isFormDirty ? 'secondary' : 'outline'}>
            {isFormDirty ? 'Unsaved Changes' : 'Saved'}
          </Badge>

          {/* Help Dialog Trigger/Content */}
          <HelpDialog isOpen={isHelpOpen} onOpenChange={onHelpOpenChange} />
        </div>
      </div>
    </header>
  );
};
