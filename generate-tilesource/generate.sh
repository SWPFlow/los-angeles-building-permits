#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

readonly TILESET=${TILESET_YML:-'./tileset.yaml'}
readonly TM2_DIR=${TM2SOURCE_DIR:-'/data/tm2source'}
readonly DB_HOST=${POSTGRES_HOST:-postgres}
readonly DB_USER=${POSTGRES_USER:-postgres}
readonly DB_NAME=${POSTGRES_NAME:-permits}
readonly DB_PORT=${POSTGRES_PORT:-5432}
readonly DB_PASSWORD=${POSTGRES_PASSWORD:-password}

function generate_source() {
    mkdir -p $TM2_DIR

    generate-tm2source \
            $TILESET \
            --host="$DB_HOST" \
            --port="$DB_PORT" \
            --user="$DB_USER" \
            --database="$DB_NAME" \
            --password="$DB_PASSWORD" \
            > $TM2_DIR/data.yml
}

function main() {
    generate_source
}

main