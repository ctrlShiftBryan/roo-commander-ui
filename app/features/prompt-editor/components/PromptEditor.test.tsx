import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, describe, it } from 'bun:test';

import PromptEditor from './PromptEditor';

// Mock browser APIs that might not be available in the test environment
// Mocking document.createElement('a').click and URL.createObjectURL/revokeObjectURL for export functionality
global.URL.createObjectURL = () => 'mock-url';
global.URL.revokeObjectURL = () => {};
// Define a minimal mock for HTMLAnchorElement if it doesn't exist
global.HTMLAnchorElement = global.HTMLAnchorElement || class MockHTMLAnchorElement {};
HTMLAnchorElement.prototype.click = () => {}; // Mock the click method on anchor elements

// Mock FileReader as it interacts with the DOM/browser environment
global.FileReader = class MockFileReader implements EventTarget {
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
  result: string | ArrayBuffer | null = null;
  readAsText = (_blob: Blob) => {
    // Simulate successful read for the test
    this.result = JSON.stringify([
      {
        slug: 'test-slug',
        name: 'Test Prompt',
        roleDefinition: '',
        customInstructions: '',
        groups: [],
      },
    ]);
    if (this.onload) {
      // Simulate the event object structure
      const event = { target: { result: this.result } } as unknown as ProgressEvent<FileReader>;
      // Explicitly cast 'this' to satisfy the handler's expected context
      this.onload.call(this as unknown as FileReader, event);
    }
  };
  readAsArrayBuffer = (_blob: Blob) => {}; // Add other methods if needed
  readAsDataURL = (_blob: Blob) => {};
  readAsBinaryString = (_blob: Blob) => {};
  abort = () => {};

  // Add EventTarget methods to satisfy TypeScript
  addEventListener = (
    _type: string,
    _listener: EventListenerOrEventListenerObject | null,
    _options?: boolean | AddEventListenerOptions
  ) => {};
  dispatchEvent = (_event: Event): boolean => true;
  removeEventListener = (
    _type: string,
    _callback: EventListenerOrEventListenerObject | null,
    _options?: EventListenerOptions | boolean
  ) => {};

  // Add other properties/methods if your component uses them
} as unknown as typeof FileReader; // Use unknown for type casting
describe('PromptEditor Component', () => {
  it('should render without errors and display the main title', async () => {
    // Render the component
    render(<PromptEditor />);

    // Check if a key element (the main title) is rendered
    // Using a regex to be slightly more flexible with potential whitespace changes
    const titleElement = await screen.findByText(/Roo Commander Dashboard/i);

    // Assert that the element is present in the document
    expect(titleElement).toBeDefined();
  });
});
