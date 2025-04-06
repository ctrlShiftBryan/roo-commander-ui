import React, { useState, useEffect } from 'react';
import { Menu, HelpCircle, ChevronRight, Plus, Trash2, Download, Upload } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'; // Adjusted path for form
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

// Define Zod schema for prompt role validation
const promptRoleSchema = z.object({
  slug: z
    .string()
    .min(1, { message: 'Slug is required' })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: 'Slug can only contain letters, numbers, and hyphens',
    })
    .optional(),
  name: z.string().min(1, { message: 'Name is required' }).optional(),
  roleDefinition: z.string().optional(),
  customInstructions: z.string().optional(),
  groups: z.array(z.enum(['read', 'edit', 'browser', 'command', 'mcp'])).optional(),
});

// Define a type for the group IDs based on the Zod enum
// Define GroupId directly as the enum values, as the array itself is optional now
type GroupId = 'read' | 'edit' | 'browser' | 'command' | 'mcp';

// Groups for checkbox selection - defined outside component
const groups: { id: GroupId; label: string }[] = [
  { id: 'read', label: 'Read' },
  { id: 'edit', label: 'Edit' },
  { id: 'browser', label: 'Browser' },
  { id: 'command', label: 'Command' },
  { id: 'mcp', label: 'MCP' },
];

type PromptRole = z.infer<typeof promptRoleSchema>;

const PromptEditor = () => {
  // Renamed component here
  // Sample data structure for prompt roles
  const [promptRoles, setPromptRoles] = useState<PromptRole[]>([
    {
      slug: 'roo-commander',
      name: '👑 Roo Commander',
      roleDefinition:
        'You are Roo Chief Executive, the highest-level coordinator for software development projects. You understand goals, delegate tasks, manage state via the project journal, and ensure project success.',
      customInstructions:
        'As Roo Chief Executive:\n\n**Phase 1: Initial Interaction & Intent Clarification**\n\n1.  **Analyze Initial Request:** Upon receiving the first user message:\n    *   **Check for Directives:** Does the message explicitly request a specific mode (e.g., "switch to code", "use project initializer") or ask for options ("list modes", "what can you do?")?\n    *   **Analyze Intent (if no directive):** Attempt to map the request to a likely persona/workflow (Planner, Vibe Coder, Fixer, Brainstormer, Adopter, Explorer, etc.) based on keywords. Assess confidence.\n\n2.  **Determine Response Path:**\n    *   **Path A (Direct Mode Request):** If a specific mode was requested, confirm and attempt `switch_mode` or delegate via `new_task` if appropriate. Then proceed to Phase 2 or optional details.\n        *   *Example:* User: "Switch to git manager". Roo: "Okay, switching to Git Manager mode." `<switch_mode>...`',
      groups: ['read', 'edit', 'browser', 'command', 'mcp'],
    },
    {
      slug: 'code-writer',
      name: '💻 Code Writer',
      roleDefinition:
        'You are Code Writer, a specialist in writing clean, efficient code. You focus on implementation details and best practices.',
      customInstructions:
        'As a Code Writer, you should follow these principles:\n\n1. Write clean, well-documented code\n2. Follow language-specific best practices\n3. Consider edge cases and error handling',
      groups: ['read', 'edit'],
    },
  ]);

  const [currentPrompt, setCurrentPrompt] = useState<PromptRole>(promptRoles[0]);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  // const [jsonImport, setJsonImport] = useState(''); // No longer needed for paste
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State for file input
  const [showImportScreen, setShowImportScreen] = useState(false);
  const [importError, setImportError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Setup form with react-hook-form and zod
  const form = useForm({
    resolver: zodResolver(promptRoleSchema),
    defaultValues: currentPrompt,
  });

  // Define onFormSubmit before it's used in other handlers
  const onFormSubmit = (data: PromptRole) => {
    // Update the promptRoles array with the updated prompt
    const updatedPromptRoles = promptRoles.map((prompt) =>
      prompt.slug === currentPrompt.slug ? data : prompt
    );

    setPromptRoles(updatedPromptRoles);
    setCurrentPrompt(data); // Update current prompt to reflect saved data
    setIsFormDirty(false); // Reset dirty state after successful save

    setSuccessMessage('Prompt saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Update form whenever currentPrompt changes
  useEffect(() => {
    form.reset(currentPrompt);
  }, [currentPrompt, form]);

  useEffect(() => {
    // Placeholder for potential future async loading logic
  }, []);

  const handlePromptChange = async (promptSlug: string) => {
    if (isFormDirty) {
      const isValid = await form.trigger(); // Trigger validation
      if (isValid) {
        // Simulate async save if needed, then call submit handler
        await form.handleSubmit(onFormSubmit)(); // Call the submit handler
        // Note: onFormSubmit already sets isFormDirty to false
      } else {
        // Handle validation errors - maybe show a message?
        console.error('Validation failed, cannot switch prompt.');
        // Optionally prevent switching if save fails due to validation
        return;
      }
    }

    const selectedPrompt = promptRoles.find((prompt) => prompt.slug === promptSlug);
    if (selectedPrompt) {
      setCurrentPrompt(selectedPrompt); // Switch prompt only after potential save
    }
    setIsSidebarOpen(false);
  };

  const handleFormChange = () => {
    setIsFormDirty(true);
  };

  const handleDeletePrompt = (slug: string) => {
    const filteredPrompts = promptRoles.filter((prompt) => prompt.slug !== slug);
    setPromptRoles(filteredPrompts);

    if (filteredPrompts.length > 0) {
      setCurrentPrompt(filteredPrompts[0]);
    } else {
      // Reset to a default empty state if no prompts are left
      const emptyPrompt: PromptRole = {
        slug: '',
        name: '',
        roleDefinition: '',
        customInstructions: '',
        groups: [],
      };
      setCurrentPrompt(emptyPrompt);
      form.reset(emptyPrompt); // Also reset the form
    }
  };

  const handleAddNewPrompt = () => {
    const newPrompt = {
      slug: `new-prompt-${Date.now()}`, // Generate unique slug
      name: 'New Prompt',
      roleDefinition: '',
      customInstructions: '',
      groups: [],
    };

    setPromptRoles([...promptRoles, newPrompt]);
    setCurrentPrompt(newPrompt);
    setIsFormDirty(true);
    setIsSidebarOpen(false);
  };

  // Updated function to handle file import
  const handleImportJson = () => {
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

        let importedData = JSON.parse(fileContent);

        // Handle both single object and array
        if (!Array.isArray(importedData)) {
          importedData = [importedData];
        }

        // Validate using Zod schema
        const parseResult = promptRoleSchema.array().safeParse(importedData);

        if (!parseResult.success) {
          // Provide more specific error feedback based on Zod issues
          const errorDetails = parseResult.error.errors
            .map((err) => `Prompt at index ${err.path[0]}: ${err.message} (field: ${err.path[1]})`)
            .join('; ');
          setImportError(`Invalid prompt data found in file: ${errorDetails}`);
          return;
        }

        const validPrompts = parseResult.data;

        // Update existing prompts or add new ones
        const updatedPrompts = [...promptRoles];

        validPrompts.forEach((importedPrompt) => {
          const existingIndex = updatedPrompts.findIndex((p) => p.slug === importedPrompt.slug);

          if (existingIndex >= 0) {
            updatedPrompts[existingIndex] = importedPrompt;
          } else {
            updatedPrompts.push(importedPrompt);
          }
        });

        setPromptRoles(updatedPrompts);
        setCurrentPrompt(validPrompts[0]); // Select the first imported prompt

        setShowImportScreen(false);
        setSelectedFile(null); // Reset file input
        setImportError('');
        setSuccessMessage(
          `Imported ${validPrompts.length} prompt(s) successfully from ${selectedFile.name}!`
        );
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Import Error:', error);
        setImportError('Invalid JSON format in the selected file. Please check the file content.');
      }
    };

    reader.onerror = () => {
      setImportError('Error reading the selected file.');
    };

    reader.readAsText(selectedFile);
  };

  const handleExportJson = () => {
    const jsonString = JSON.stringify(promptRoles, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = href;
    link.download = 'roo-commander-prompts.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  // Render the main editor UI
  const renderEditorUI = () => (
    <div className="mx-auto max-w-4xl p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onFormSubmit)}
          onChange={handleFormChange}
          className="space-y-6"
        >
          {/* Prompt selector */}
          <div className="space-y-2">
            <Label htmlFor="promptSelect">Role</Label>
            <Select value={currentPrompt.slug} onValueChange={(value) => handlePromptChange(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a prompt" />
              </SelectTrigger>
              <SelectContent>
                {promptRoles.map((prompt, index) => (
                  // Use index as part of the key if slug is undefined, ensure value is string
                  <SelectItem key={prompt.slug ?? index} value={prompt.slug ?? ''}>
                    {prompt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Slug field */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="letters-numbers-hyphens-only" {...field} />
                </FormControl>
                <FormDescription>Letters, numbers, and hyphens only. No spaces.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Human-friendly name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role Definition */}
          <FormField
            control={form.control}
            name="roleDefinition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Definition</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Define the role's purpose and capabilities"
                    rows={6}
                    className="resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Custom Instructions */}
          <FormField
            control={form.control}
            name="customInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detailed instructions for how the role should behave"
                    rows={10}
                    className="resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Use \n for line breaks that will be preserved.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Groups */}
          <FormField
            control={form.control}
            name="groups"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Groups</FormLabel>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                  {groups.map((group) => (
                    <FormField
                      key={group.id}
                      control={form.control}
                      name="groups"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={group.id}
                            className="flex flex-row items-start space-y-0 space-x-3"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(group.id)}
                                onCheckedChange={(checked) => {
                                  // Handle potentially undefined field.value
                                  const currentValue = field.value ?? [];
                                  return checked
                                    ? field.onChange([...currentValue, group.id])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== group.id)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">{group.label}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Save button */}
          <Button type="submit" disabled={!isFormDirty} className="w-full sm:w-auto">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );

  // Render the import screen - Updated for file upload
  const renderImportScreen = () => (
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
            if (e.target.files && e.target.files.length > 0) {
              setSelectedFile(e.target.files[0]);
              setImportError(''); // Clear previous errors on new file selection
            } else {
              setSelectedFile(null);
            }
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
          <Button variant="outline" onClick={() => setShowImportScreen(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header Toolbar */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Roo Commander Prompts</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <div className="mb-4 space-y-1">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleAddNewPrompt}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Prompt
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      setShowImportScreen(true);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Import Prompts
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleExportJson}
                  >
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
                        // Only allow changing if slug exists
                        onClick={() => {
                          if (prompt.slug) {
                            handlePromptChange(prompt.slug);
                          }
                        }}
                        disabled={!prompt.slug} // Disable button if slug is missing
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
                              Are you sure you want to delete &quot;{prompt.name}&quot;? This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            {/* Only allow deleting if slug exists */}
                            <AlertDialogAction
                              onClick={() => {
                                if (prompt.slug) {
                                  handleDeletePrompt(prompt.slug);
                                }
                              }}
                              disabled={!prompt.slug} // Disable button if slug is missing
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
          </Sheet>

          <h1 className="ml-3 text-xl font-semibold">Roo Commander Dashboard</h1>

          <div className="ml-auto flex items-center space-x-4">
            {/* Status indicator */}
            <Badge variant={isFormDirty ? 'secondary' : 'outline'}>
              {isFormDirty ? 'Unsaved Changes' : 'Saved'}
            </Badge>

            {/* Help icon */}
            <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
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
                    Use the sidebar to navigate between existing prompts or create new ones. Each
                    prompt has a unique slug, a friendly name, role definition, custom instructions,
                    and group permissions.
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
                      <strong>Custom Instructions:</strong> Detailed behavior guidelines (use \n for
                      line breaks)
                    </li>
                    <li>
                      <strong>Groups:</strong> Permission categories for the role
                    </li>
                  </ul>

                  <h3 className="font-semibold">Import/Export</h3>
                  <p>
                    Use the Import function to add prompts from JSON data. The Export function saves
                    all prompts as a downloadable JSON file.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* Success message */}
        {successMessage && (
          <div className="mb-4 border-l-4 border-green-500 bg-green-100 p-4 text-green-700">
            {successMessage}
          </div>
        )}

        {/* Import screen or editor UI */}
        {showImportScreen ? renderImportScreen() : renderEditorUI()}
      </main>
    </div>
  );
};

export default PromptEditor; // Updated export here
