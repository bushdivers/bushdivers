#!/usr/bin/env bash

mysql --user=root --password="$MYSQL_ROOT_PASSWORD" <<-EOSQL
    CREATE DATABASE IF NOT EXISTS bushdivers_ci;
    GRANT ALL PRIVILEGES ON \`bushdivers_ci%\`.* TO '$MYSQL_USER'@'%';
EOSQL
