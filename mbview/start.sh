#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

readonly MBTILES=${MBTILES_LOCATION:-'/data/export/tiles.mbtiles'}
readonly PORT=${PORT:-3000}

function start_mbview() {
    exec mbview --port $PORT $MBTILES
}

function main() {
    start_mbview
}

main