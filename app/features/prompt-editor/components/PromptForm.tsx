import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { PromptRole } from '../types';
import { groups } from '../constants'; // Import groups constant

interface PromptFormProps {
  form: UseFormReturn<PromptRole>;
  currentPrompt: PromptRole;
  promptRoles: PromptRole[];
  isFormDirty: boolean;
  onFormSubmit: (data: PromptRole) => void;
  handleFormChange: () => void;
  handlePromptChange: (value: string) => void;
}

export const PromptForm: React.FC<PromptFormProps> = ({
  form,
  currentPrompt,
  promptRoles,
  isFormDirty,
  onFormSubmit,
  handleFormChange,
  handlePromptChange,
}) => {
  return (
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
            <Select value={currentPrompt.slug} onValueChange={handlePromptChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a prompt" />
              </SelectTrigger>
              <SelectContent>
                {promptRoles.map((prompt, index) => (
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
};
