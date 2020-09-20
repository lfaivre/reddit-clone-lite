#!/bin/sh

# Script Colors
CYAN='\033[0;36m'
YELLOW='\033[0;33m'
NC='\033[0m'

# Start PostgreSQL Server
printf "\n${CYAN}Starting PostgreSQL server (via Homebrew Services)...${NC}\n"
brew services start postgresql

printf "\n${CYAN}Dropping PostgreSQL database (reddit-clone-lite)...${NC}\n"
printf "${YELLOW}Use password for user reddit-clone-lite-admin${NC}\n"
dropdb --echo --if-exists --username=reddit-clone-lite-admin --password reddit-clone-lite

printf "\n${CYAN}Removing PostgreSQL user (reddit-clone-lite-admin)...${NC}\n"
dropuser --echo --if-exists reddit-clone-lite-admin