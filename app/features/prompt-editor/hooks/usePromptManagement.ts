import { useState, useCallback } from 'react';
import type { PromptRole } from '../types';
import type { UseFormReturn } from 'react-hook-form';

// Define initial prompts directly here or import from a constants file if preferred
const initialPromptRoles: PromptRole[] = [
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
];

interface UsePromptManagementProps {
  form: UseFormReturn<PromptRole>; // Pass the form instance for validation and submission trigger
  isFormDirty: boolean;
  setIsFormDirty: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>; // Needed for save success message
}

export const usePromptManagement = ({
  form,
  isFormDirty,
  setIsFormDirty,
  setIsSidebarOpen,
  setSuccessMessage,
}: UsePromptManagementProps) => {
  const [promptRoles, setPromptRoles] = useState<PromptRole[]>(initialPromptRoles);
  const [currentPrompt, setCurrentPrompt] = useState<PromptRole>(promptRoles[0]);

  // Define onFormSubmit locally within the hook as it's tightly coupled
  // It needs access to setPromptRoles, setCurrentPrompt, setIsFormDirty, setSuccessMessage
  const onFormSubmit = useCallback(
    (data: PromptRole) => {
      const updatedPromptRoles = promptRoles.map((prompt) =>
        prompt.slug === currentPrompt.slug ? data : prompt
      );
      setPromptRoles(updatedPromptRoles);
      setCurrentPrompt(data);
      setIsFormDirty(false);
      setSuccessMessage('Prompt saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    [promptRoles, currentPrompt.slug, setIsFormDirty, setSuccessMessage]
  );

  const handlePromptChange = useCallback(
    async (promptSlug: string) => {
      if (isFormDirty) {
        const isValid = await form.trigger();
        if (isValid) {
          // Use the locally defined onFormSubmit
          await form.handleSubmit(onFormSubmit)();
        } else {
          console.error('Validation failed, cannot switch prompt.');
          return;
        }
      }

      const selectedPrompt = promptRoles.find((prompt) => prompt.slug === promptSlug);
      if (selectedPrompt) {
        setCurrentPrompt(selectedPrompt);
      }
      setIsSidebarOpen(false);
    },
    [isFormDirty, form, promptRoles, setIsSidebarOpen, onFormSubmit]
  ); // Add onFormSubmit dependency

  const handleDeletePrompt = useCallback(
    (slug: string) => {
      const filteredPrompts = promptRoles.filter((prompt) => prompt.slug !== slug);
      setPromptRoles(filteredPrompts);

      if (filteredPrompts.length > 0) {
        setCurrentPrompt(filteredPrompts[0]);
      } else {
        const emptyPrompt: PromptRole = {
          slug: '',
          name: '',
          roleDefinition: '',
          customInstructions: '',
          groups: [],
        };
        setCurrentPrompt(emptyPrompt);
        form.reset(emptyPrompt); // Reset form as well
      }
    },
    [promptRoles, form]
  ); // Add form dependency

  const handleAddNewPrompt = useCallback(() => {
    const newPrompt: PromptRole = {
      slug: `new-prompt-${Date.now()}`,
      name: 'New Prompt',
      roleDefinition: '',
      customInstructions: '',
      groups: [],
    };
    setPromptRoles((prev) => [...prev, newPrompt]);
    setCurrentPrompt(newPrompt);
    setIsFormDirty(true); // Mark form as dirty for the new prompt
    setIsSidebarOpen(false);
  }, [setIsFormDirty, setIsSidebarOpen]); // Add dependencies

  return {
    promptRoles,
    setPromptRoles, // Expose setter for import functionality
    currentPrompt,
    setCurrentPrompt, // Expose setter for import functionality
    handlePromptChange,
    handleDeletePrompt,
    handleAddNewPrompt,
    onFormSubmit, // Expose submit handler for direct use if needed elsewhere (e.g., form component)
  };
};
