#!/bin/sh

source ${PWD}/bin/shared.sh

printf "\n${CYAN}Starting Redis (via Homebrew Services)...${NC}\n"
brew services run redis
