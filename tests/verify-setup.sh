#!/bin/bash
# Jest Testing Infrastructure Verification Script
# This script verifies that all testing components are properly installed and configured

echo "======================================"
echo "Jest Testing Infrastructure Verification"
echo "======================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Track overall status
ALL_PASSED=true

# Check 1: Jest installed
echo "1. Checking if Jest is installed..."
if npx jest --version > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Jest is installed$(npx jest --version)${NC}"
else
    echo -e "${RED}✗ Jest is NOT installed${NC}"
    ALL_PASSED=false
fi
echo ""

# Check 2: Supertest installed
echo "2. Checking if Supertest is installed..."
if npm list supertest > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Supertest is installed${NC}"
else
    echo -e "${RED}✗ Supertest is NOT installed${NC}"
    ALL_PASSED=false
fi
echo ""

# Check 3: Jest config exists
echo "3. Checking if jest.config.js exists..."
if [ -f "jest.config.js" ]; then
    echo -e "${GREEN}✓ jest.config.js exists${NC}"
else
    echo -e "${RED}✗ jest.config.js does NOT exist${NC}"
    ALL_PASSED=false
fi
echo ""

# Check 4: Test setup file exists
echo "4. Checking if tests/setup.js exists..."
if [ -f "tests/setup.js" ]; then
    echo -e "${GREEN}✓ tests/setup.js exists${NC}"
else
    echo -e "${RED}✗ tests/setup.js does NOT exist${NC}"
    ALL_PASSED=false
fi
echo ""

# Check 5: Test directory structure
echo "5. Checking test directory structure..."
if [ -d "tests/backend" ] && [ -d "tests/fixtures" ]; then
    echo -e "${GREEN}✓ Test directories exist${NC}"
else
    echo -e "${RED}✗ Test directories do NOT exist${NC}"
    ALL_PASSED=false
fi
echo ""

# Check 6: Smoke test file exists
echo "6. Checking if smoke test exists..."
if [ -f "tests/backend/api-smoke.test.js" ]; then
    echo -e "${GREEN}✓ Smoke test file exists${NC}"
else
    echo -e "${RED}✗ Smoke test file does NOT exist${NC}"
    ALL_PASSED=false
fi
echo ""

# Check 7: Package.json scripts
echo "7. Checking if test scripts are in package.json..."
if grep -q '"test": "jest"' package.json; then
    echo -e "${GREEN}✓ Test scripts are configured${NC}"
else
    echo -e "${RED}✗ Test scripts are NOT configured${NC}"
    ALL_PASSED=false
fi
echo ""

# Check 8: Run smoke tests
echo "8. Running smoke tests..."
echo ""
if npm test > /dev/null 2>&1; then
    echo -e "${GREEN}✓ All smoke tests PASSED${NC}"
else
    echo -e "${RED}✗ Some smoke tests FAILED${NC}"
    ALL_PASSED=false
fi
echo ""

# Final summary
echo "======================================"
if [ "$ALL_PASSED" = true ]; then
    echo -e "${GREEN}✓ ALL CHECKS PASSED${NC}"
    echo "Jest testing infrastructure is properly configured and ready for use."
    echo ""
    echo "Next steps:"
    echo "  - Run 'npm test' to execute all tests"
    echo "  - Run 'npm run test:watch' for development"
    echo "  - Run 'npm run test:coverage' for coverage report"
else
    echo -e "${RED}✗ SOME CHECKS FAILED${NC}"
    echo "Please review the errors above and fix the issues."
fi
echo "======================================"
