#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER prisma WITH PASSWORD 'prisma';
    ALTER USER prisma WITH SUPERUSER;
    CREATE DATABASE mqtt;
    GRANT ALL PRIVILEGES ON DATABASE mqtt TO prisma;
EOSQL
