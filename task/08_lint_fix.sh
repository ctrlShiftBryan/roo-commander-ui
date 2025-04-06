#!/bin/bash
set -e
echo "Running linter with auto-fix..."
bun lint:fix
echo "Linting completed."