#!/bin/bash
# Script to check if the Claude Code Manager server is running and start it if needed
# Usage: ./scripts/ensure-server-running.sh

SERVER_PORT=8420
SERVER_URL="http://localhost:${SERVER_PORT}"
PROJECT_DIR="/home/claude/manager"
LOG_DIR="${PROJECT_DIR}/.claude/logs"
LOG_FILE="${LOG_DIR}/server.log"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create logs directory if it doesn't exist
mkdir -p "${LOG_DIR}"

# Function to check if server is responding
check_server() {
    curl -s -o /dev/null -w "%{http_code}" "${SERVER_URL}/api/health" 2>/dev/null
}

# Function to check if process is running on port
check_port() {
    lsof -ti:${SERVER_PORT} 2>/dev/null
}

echo "Checking Claude Code Manager server status..."

# Check if server responds to health check
HTTP_CODE=$(check_server)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Server is running and responding on port ${SERVER_PORT}${NC}"
    exit 0
fi

# Check if something is listening on the port but not responding
PID=$(check_port)
if [ -n "$PID" ]; then
    echo -e "${YELLOW}⚠ Process detected on port ${SERVER_PORT} (PID: ${PID}) but not responding to health check${NC}"
    echo -e "${YELLOW}  Attempting to restart...${NC}"
    kill "$PID" 2>/dev/null
    sleep 2
fi

# Start the server
echo -e "${YELLOW}⚠ Server not running. Starting server...${NC}"

cd "${PROJECT_DIR}" || exit 1

# Start server in background and redirect output to log file
nohup node src/backend/server.js > "${LOG_FILE}" 2>&1 &
SERVER_PID=$!

echo "Server starting with PID: ${SERVER_PID}"
echo "Logs: ${LOG_FILE}"

# Wait for server to start (max 10 seconds)
for i in {1..20}; do
    sleep 0.5
    HTTP_CODE=$(check_server)
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ Server started successfully on port ${SERVER_PORT}${NC}"
        exit 0
    fi
done

# If we get here, server failed to start
echo -e "${RED}✗ Server failed to start within 10 seconds${NC}"
echo -e "${RED}  Check logs at: ${LOG_FILE}${NC}"
exit 1
