#!/bin/bash
# This script installs the missing bun-types dev dependency.

echo "Installing bun-types..."
bun add -d bun-types
echo "bun-types installation complete."