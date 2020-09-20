#!/bin/sh

source ${PWD}/bin/shared.sh

printf "\n${CYAN}Starting PostgreSQL server (via Homebrew Services)...${NC}\n"
brew services run postgresql

printf "\n${CYAN}Creating PostgreSQL user (reddit-clone-lite-admin)...${NC}\n"
createuser --echo --no-inherit --pwprompt --superuser --createdb --replication reddit-clone-lite-admin

printf "\n${CYAN}Creating PostgreSQL database (reddit-clone-lite)...${NC}\n"
printf "${YELLOW}Use password for user reddit-clone-lite-admin${NC}\n"
createdb --echo --username=reddit-clone-lite-admin --password --owner=reddit-clone-lite-admin reddit-clone-lite
