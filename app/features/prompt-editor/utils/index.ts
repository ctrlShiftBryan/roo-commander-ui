import type { PromptRole } from '../types';
import { promptRoleSchema } from '../types';

/**
 * Parses and validates prompt data from a JSON file content.
 * Handles both single prompt objects and arrays of prompts.
 *
 * @param fileContent The string content read from the JSON file.
 * @returns An object containing either the validated prompts or an error message.
 */
export const parseAndValidatePrompts = (
  fileContent: string
): { prompts?: PromptRole[]; error?: string } => {
  try {
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
      return { error: `Invalid prompt data found in file: ${errorDetails}` };
    }

    return { prompts: parseResult.data };
  } catch (error) {
    console.error('JSON Parse/Validation Error:', error);
    return { error: 'Invalid JSON format in the selected file. Please check the file content.' };
  }
};

/**
 * Merges imported prompts with existing prompts.
 * Updates existing prompts based on slug, adds new ones.
 *
 * @param existingPrompts The current array of prompt roles.
 * @param importedPrompts The array of validated prompts to import.
 * @returns The updated array of prompt roles.
 */
export const mergePrompts = (
  existingPrompts: PromptRole[],
  importedPrompts: PromptRole[]
): PromptRole[] => {
  const updatedPrompts = [...existingPrompts];

  importedPrompts.forEach((importedPrompt) => {
    const existingIndex = updatedPrompts.findIndex((p) => p.slug === importedPrompt.slug);

    if (existingIndex >= 0) {
      // Update existing prompt
      updatedPrompts[existingIndex] = importedPrompt;
    } else {
      // Add new prompt
      updatedPrompts.push(importedPrompt);
    }
  });

  return updatedPrompts;
};

/**
 * Triggers a browser download for the given data as a JSON file.
 *
 * @param data The data to be stringified and downloaded.
 * @param filename The desired name for the downloaded file.
 */
export const downloadJson = (data: unknown, filename: string): void => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  } catch (error) {
    console.error('Error creating download link:', error);
    // Optionally, provide user feedback here (e.g., using a toast notification)
  }
};
