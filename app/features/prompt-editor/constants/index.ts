import type { GroupId } from '../types';

// Groups for checkbox selection
export const groups: { id: GroupId; label: string }[] = [
  { id: 'read', label: 'Read' },
  { id: 'edit', label: 'Edit' },
  { id: 'browser', label: 'Browser' },
  { id: 'command', label: 'Command' },
  { id: 'mcp', label: 'MCP' },
];
