import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { PromptRole } from '../types';
import { promptRoleSchema } from '../types';

interface UsePromptFormProps {
  currentPrompt: PromptRole; // Needed for defaultValues and reset
}

export const usePromptForm = ({ currentPrompt }: UsePromptFormProps) => {
  const [isFormDirty, setIsFormDirty] = useState(false);

  const form = useForm<PromptRole>({
    // Specify the type for useForm
    resolver: zodResolver(promptRoleSchema),
    defaultValues: currentPrompt,
  });

  // Update form whenever currentPrompt changes externally (e.g., selection change)
  useEffect(() => {
    form.reset(currentPrompt);
    setIsFormDirty(false); // Reset dirty state when prompt changes
  }, [currentPrompt, form]);

  // Handle internal form changes to track dirty state
  const handleFormChange = useCallback(() => {
    setIsFormDirty(true);
  }, []);

  // Expose a function to reset dirty state manually if needed after save
  const resetDirtyState = useCallback(() => {
    setIsFormDirty(false);
  }, []);

  return {
    form,
    isFormDirty,
    handleFormChange,
    resetDirtyState, // Expose this instead of the raw setter
  };
};
