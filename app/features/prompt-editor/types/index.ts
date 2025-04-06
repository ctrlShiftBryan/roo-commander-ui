import * as z from 'zod';

// Define Zod schema for prompt role validation
export const promptRoleSchema = z.object({
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
export type GroupId = 'read' | 'edit' | 'browser' | 'command' | 'mcp';

// Define the main PromptRole type based on the schema
export type PromptRole = z.infer<typeof promptRoleSchema>;
