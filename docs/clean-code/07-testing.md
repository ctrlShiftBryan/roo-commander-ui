## Testing

### F.I.R.S.T. rules

Clean tests should follow the rules:

- **Fast** tests should be fast because we want to run them frequently.

- **Independent** tests should not depend on each other. They should provide same output whether run independently or all together in any order.

- **Repeatable** tests should be repeatable in any environment and there should be no excuse for why they fail.

- **Self-Validating** a test should answer with either _Passed_ or _Failed_. You don't need to compare log files to answer if a test passed.

- **Timely** unit tests should be written before the production code. If you write tests after the production code, you might find writing tests too hard.

### Single concept per test

Tests should also follow the _Single Responsibility Principle_. Make only one assert per unit test.

**Bad:**

```ts
import { assert } from 'bun:test';

describe('AwesomeDate', () => {
  it('handles date boundaries', () => {
    let date: AwesomeDate;

    date = new AwesomeDate('1/1/2015');
    assert.equal('1/31/2015', date.addDays(30));

    date = new AwesomeDate('2/1/2016');
    assert.equal('2/29/2016', date.addDays(28));

    date = new AwesomeDate('2/1/2015');
    assert.equal('3/1/2015', date.addDays(28));
  });
});
```

**Good:**

```ts
import { expect, describe, it } from 'bun:test';

describe('AwesomeDate', () => {
  it('handles 30-day months', () => {
    const date = new AwesomeDate('1/1/2015');
    expect(date.addDays(30)).toMatchInlineSnapshot(\`'1/31/2015'\`);
  });

  it('handles leap year', () => {
    const date = new AwesomeDate('2/1/2016');
    expect(date.addDays(28)).toMatchInlineSnapshot(\`'2/29/2016'\`);
  });

  it('handles non-leap year', () => {
    const date = new AwesomeDate('2/1/2015');
    expect(date.addDays(28)).toMatchInlineSnapshot(\`'3/1/2015'\`);
  });
});
```

### Prefer Inline Snapshots for Literal Comparisons

When testing against specific literal values (strings, numbers, simple objects), prefer using inline snapshots (`expect().toMatchInlineSnapshot()`) over direct equality assertions (`assert.equal`, `expect().toEqual()`). Inline snapshots make tests more readable by placing the expected value directly in the test file, automatically update when the value changes (requiring explicit review), and reduce the chance of typos in expected values.

**Bad:**

```ts
import { assert } from 'bun:test'; // Or: import { expect } from 'bun:test';

function getUserGreeting(name: string): string {
  return `Hello, ${name}!`;
}

describe('getUserGreeting', () => {
  it('should return the correct greeting', () => {
    const name = 'Alice';
    const greeting = getUserGreeting(name);
    assert.equal('Hello, Alice!', greeting); // Or: expect(greeting).toEqual('Hello, Alice!');
  });
});
```

**Good:**

```ts
import { expect, describe, it } from 'bun:test';

function getUserGreeting(name: string): string {
  return `Hello, ${name}!`;
}

describe('getUserGreeting', () => {
  it('should return the correct greeting', () => {
    const name = 'Alice';
    const greeting = getUserGreeting(name);
    expect(greeting).toMatchInlineSnapshot(`'Hello, Alice!'`);
  });
});
```

### The name of the test should reveal its intention

When a test fails, its name is the first indication of what may have gone wrong.

**Bad:**

```ts
describe('Calendar', () => {
  it('2/29/2020', () => {
    // ...
  });

  it('throws', () => {
    // ...
  });
});
```

**Good:**

```ts
describe('Calendar', () => {
  it('should handle leap year', () => {
    // ...
  });

  it('should throw when format is invalid', () => {
    // ...
  });
});
```

### Prefer Stubs Over Mocks

When writing tests, prefer simple stubs over complex mocks. Stubs focus on outcomes rather than implementation details, resulting in more maintainable tests that are less likely to break during refactoring.

```ts
// Function that uses the email sender
const notifyUserOfLogin = async (userId: string, emailSender) => {
  const userEmail = `user-${userId}@example.com`;
  await emailSender(userEmail, 'New login detected');
  return true;
};
```

**Bad:**

```ts
import { expect, describe, it, mock } from 'bun:test';

// Function that sends emails
const sendEmail = async (to: string, message: string) => {
  // Real implementation would connect to email server
};

describe('notifyUserOfLogin', () => {
  it('should notify user of login', async () => {
    // Complex mock with verification
    const mockSendEmail = mock.fn();
    mockSendEmail.mockResolvedValue(true);

    await notifyUserOfLogin('123', mockSendEmail);

    // Test focuses on implementation details
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledWith('user-123@example.com', 'New login detected');
  });
});
```

**Good:**

```ts
import { expect, describe, it } from 'bun:test';

// Function that sends emails
const sendEmail = async (to: string, message: string) => {
  // Real implementation would connect to email server
};

describe('notifyUserOfLogin', () => {
  it('should successfully notify user of login', async () => {
    // Simple stub that just works
    const stubSendEmail = async () => true;

    const result = await notifyUserOfLogin('123', stubSendEmail);

    // Test focuses on behavior/outcome
    expect(result).toMatchInlineSnapshot(`true`);
  });
});
```

The good example is better because it:

- Uses a simple function stub without mock verification
- Focuses on testing the outcome rather than implementation details
- Won't break if you change how emails are formatted or sent
- Is more resilient to refactoring

### One Top-Level Describe Per File

Tests should be organized with exactly one top-level describe block per test file, without nesting additional describe blocks. This improves test clarity, navigation, and maintainability.
**Bad:**

File: `user.test.ts`

```ts
import { expect, describe, it } from 'bun:test';

// Multiple top-level describe blocks in one file
describe('UserAuthentication', () => {
  it('should validate user credentials', () => {
    expect(validateCredentials('user', 'password123')).toMatchInlineSnapshot(`true`);
  });
});

describe('UserRegistration', () => {
  it('should register new users', () => {
    expect(registerUser('newuser', 'password123')).toMatchInlineSnapshot(`true`);
  });
});

// Nested describe blocks
describe('UserManagement', () => {
  describe('Profile', () => {
    it('should update user profile', () => {
      expect(updateProfile(123, { name: 'New Name' })).toMatchInlineSnapshot(`true`);
    });
  });

  describe('Preferences', () => {
    it('should save user preferences', () => {
      expect(savePreferences(123, { theme: 'dark' })).toMatchInlineSnapshot(`true`);
    });
  });
});
```

**Good:**

File: `user.authentication.test.ts`

```ts
import { expect, describe, it } from 'bun:test';

describe('UserAuthentication', () => {
  it('should validate user credentials', () => {
    expect(validateCredentials('user', 'password123')).toMatchInlineSnapshot(`true`);
  });

  it('should reject invalid credentials', () => {
    expect(validateCredentials('user', 'wrong')).toMatchInlineSnapshot(`false`);
  });
});
```

File: `user.registration.test.ts`

```ts
import { expect, describe, it } from 'bun:test';

describe('UserRegistration', () => {
  it('should register new users', () => {
    expect(registerUser('newuser', 'password123')).toMatchInlineSnapshot(`true`);
  });

  it('should prevent duplicate usernames', () => {
    expect(registerUser('existing', 'password123')).toMatchInlineSnapshot(`false`);
  });
});
```

File: `user.profile.test.ts`

```ts
import { expect, describe, it } from 'bun:test';

describe('UserProfile', () => {
  it('should update user profile', () => {
    expect(updateProfile(123, { name: 'New Name' })).toMatchInlineSnapshot(`true`);
  });

  it('should save user preferences', () => {
    expect(savePreferences(123, { theme: 'dark' })).toMatchInlineSnapshot(`true`);
  });
});
```

The good example is better because it:

- Splits related tests into separate files by feature or responsibility
- Each file contains exactly one top-level `describe` block
- Avoids nested `describe` blocks
- Makes it easier to locate tests for specific features
- Reduces cognitive load when viewing test files
- Allows for better parallel test execution
