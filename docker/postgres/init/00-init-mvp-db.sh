#!/bin/sh
set -eu

# Default values let this script run outside Docker too.
POSTGRES_USER="${POSTGRES_USER:-workshop}"
POSTGRES_DB="${POSTGRES_DB:-procurement_mvp}"

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

if command -v psql >/dev/null 2>&1; then
 PSQL_BIN="psql"
elif [ -x "/c/Program Files/PostgreSQL/18/bin/psql.exe" ]; then
 PSQL_BIN="/c/Program Files/PostgreSQL/18/bin/psql.exe"
else
 echo "[initdb] ERROR: psql not found in PATH. Install PostgreSQL CLI or add psql to PATH." >&2
 exit 1
fi

# Prefer the in-container mount, then fall back to repo-relative path.
if [ -d "/workspace/db" ]; then
 DB_ROOT="/workspace/db"
elif [ -d "$SCRIPT_DIR/../../../db" ]; then
 DB_ROOT="$SCRIPT_DIR/../../../db"
else
 echo "[initdb] ERROR: db directory not found from $SCRIPT_DIR" >&2
 exit 1
fi

MIGRATION_FILE="$DB_ROOT/migrations/001_init_procurement_mvp.sql"
SEED_FILE="$DB_ROOT/seeds/002_seed_procurement_mvp.sql"

if [ ! -r "$MIGRATION_FILE" ]; then
 echo "[initdb] ERROR: migration file not found: $MIGRATION_FILE" >&2
 exit 1
fi

if [ ! -r "$SEED_FILE" ]; then
 echo "[initdb] ERROR: seed file not found: $SEED_FILE" >&2
 exit 1
fi

echo "[initdb] Running baseline migration..."
"$PSQL_BIN" -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$MIGRATION_FILE"

echo "[initdb] Seeding sample data..."
"$PSQL_BIN" -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$SEED_FILE"

echo "[initdb] Database initialization complete."
 