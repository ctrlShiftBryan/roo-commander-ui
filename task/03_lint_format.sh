#!/bin/bash
# This script runs the linter and formatter.

echo "Running lint:fix..."
bun run lint:fix
echo "Linting complete."

echo "Running format..."
bun run format
echo "Formatting complete."