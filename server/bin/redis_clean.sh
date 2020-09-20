#!/bin/sh

source ${PWD}/bin/shared.sh

printf "\n${CYAN}Stopping Redis (via Homebrew Services)...${NC}\n"
brew services stop redis && brew services cleanup
