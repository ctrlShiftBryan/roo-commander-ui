#!/bin/bash
# This script deletes the fileScanner files as per the plan.

echo "Deleting fileScanner files..."
rm -f app/lib/fileScanner.ts
rm -f app/lib/fileScanner.test.ts
echo "Deletion complete."