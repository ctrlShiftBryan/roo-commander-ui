# Plan: Strip File Scanner and Create Simple Dashboard

**Objective:** Remove the `fileScanner.ts` functionality and replace the index route (`app/routes/_index.tsx`) with a basic "Hello World" dashboard page styled with Tailwind.

**Based on Q&A:** See `task/qa.md` for details.

**Steps:**

1.  **Delete File Scanner Code:**

    - Action: Delete the file `app/lib/fileScanner.ts`.
    - Tool: `execute_command` (using `rm`) or potentially a file deletion tool if available (though `rm` is standard).

2.  **Delete File Scanner Test:**

    - Action: Delete the file `app/lib/fileScanner.test.ts`.
    - Tool: `execute_command` (using `rm`).

3.  **Replace Index Route Component:**

    - Action: Overwrite the contents of `app/routes/_index.tsx` with a new React component.
    - New Content:
      ```tsx
      // app/routes/_index.tsx
      export default function Index() {
        return (
          <div className="flex h-screen items-center justify-center">
            <h1 className="text-4xl font-bold">Hello World</h1>
          </div>
        );
      }
      ```
    - Tool: `write_to_file`.

4.  **Lint and Format:**
    - Action: Run the project's linter and formatter to ensure code quality and consistency.
    - Command (based on `package.json`): `bun run lint:fix && bun run format`
    - Tool: `execute_command`.

**Verification:**

- After completion, manually run the development server (`bun run dev`) and navigate to the root URL (`/`) to verify the "Hello World" dashboard is displayed correctly.
- Check that the build process (`bun run build`) completes without errors related to the removed files.
