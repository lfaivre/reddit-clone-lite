#!/bin/sh

source ${PWD}/bin/shared.sh

printf "\n${CYAN}Starting PostgreSQL server (via Homebrew Services)...${NC}\n"
brew services run postgresql

printf "\n${CYAN}Dropping PostgreSQL database (reddit-clone-lite)...${NC}\n"
printf "${YELLOW}Use password for user reddit-clone-lite-admin${NC}\n"
dropdb --echo --if-exists --username=reddit-clone-lite-admin --password reddit-clone-lite

printf "\n${CYAN}Removing PostgreSQL user (reddit-clone-lite-admin)...${NC}\n"
dropuser --echo --if-exists reddit-clone-lite-admin

printf "\n${CYAN}Stopping PostgreSQL server (via Homebrew Services)...${NC}\n"
brew services stop postgresql && brew services cleanup
