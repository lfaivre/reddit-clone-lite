#!/bin/sh

# Start PostgreSQL Server
echo "Starting PostgreSQL server (via Homebrew Services)..."
brew services start postgresql

# Access Database (via psql)
echo "Accessing reddit-clone-lite database (via psql)..."
psql reddit-clone-lite
