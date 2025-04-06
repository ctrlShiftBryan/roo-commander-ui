# ⚙️ Project Standards

Enforcing project standards is crucial for maintaining code quality, consistency, and scalability in a React application. By establishing and adhering to a set of best practices, developers can ensure that the codebase remains clean, organized, and easy to maintain.

#### TypeScript

ESLint is effective for detecting language-related bugs in JavaScript. However, due to JavaScript's dynamic nature, ESLint may not catch all runtime data issues, especially in complex projects. To address this, TypeScript is recommended. TypeScript is valuable for identifying issues during large refactoring processes that may go unnoticed. When refactoring, prioritize updating type declarations first, then resolving TypeScript errors throughout the project. It's important to note that while TypeScript enhances development confidence by performing type checking at build time, it does not prevent runtime failures. Here is a [great resource on using TypeScript with React](https://react-typescript-cheatsheet.netlify.app/).

#### Absolute imports

Absolute imports should always be configured and used because it makes it easier to move files around and avoid messy import paths such as `../../../component`. Wherever you move the file, all the imports will remain intact. Here is how to configure it:

For JavaScript (`jsconfig.json`) projects:

```json
"compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
```

For TypeScript (`tsconfig.json`) projects:

```json
"compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
```

It is also possible to define multiple paths for various folders(such as `@components`, `@hooks`, etc.), but using `@/*` works very well because it is short enough so there is no need to configure multiple paths and it differs from other dependency modules so there is no confusion in what comes from `node_modules` and what is our source folder. That means that anything in the `src` folder can be accessed via `@`, e.g some file that lives in `src/components/my-component` can be accessed using `@/components/my-component` instead of `../../../components/my-component`.

#### File naming conventions

We can also enforce the file naming conventions and folder naming conventions in the project. For example, you can enforce that all files should be named in `kebab-case`. This can help you to keep your codebase consistent and easier to navigate.

To enforce this, you can use ESLint:

```js
'check-file/filename-naming-convention': [
  'error',
  {
      '**/*.{ts,tsx}': 'KEBAB_CASE',
  },
  {
      // ignore the middle extensions of the filename to support filename like bable.config.js or smoke.spec.ts
      ignoreMiddleExtensions: true,
  },
],
'check-file/folder-naming-convention': [
  'error',
  {
    // all folders within src (except **tests**)should be named in kebab-case
    'src/**/!(__tests__)': 'KEBAB_CASE',
  },
],
```

#### Formatting and Linting

Formatting should be automatically handled by [Prettier](https://prettier.io/). Prettier is an opinionated code formatter that enforces a consistent style by parsing your code and reprinting it with its own rules.

Linting should be handled by [ESLint](https://eslint.org/). ESLint should be used for enforcing code quality rules, not formatting rules.

When using both tools together:

- Formatting is Prettier's job
- Code quality is ESLint's job
- Disable all formatting rules in ESLint

This separation of concerns eliminates debates about formatting and lets engineers focus on what matters - writing good code.
