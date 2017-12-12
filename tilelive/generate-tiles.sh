#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

readonly RENDER_SCHEME=${RENDER_SCHEME:-pyramid}
readonly MIN_ZOOM=${MIN_ZOOM:-13}
readonly MAX_ZOOM=${MAX_ZOOM:-16}
readonly BBOX=${BBOX:-"-118.66779,33.70606,-118.1556,34.3298"}
readonly COPY_CONCURRENCY=${COPY_CONCURRENCY:-10}
readonly TILE_TIMEOUT=${TILE_TIMEOUT:-1800000}
readonly MBTILES_NAME=${MBTILES_NAME:-tiles.mbtiles}
readonly DEST_PROJECT_DIR=${DEST_PROJECT_DIR:-'/data/tm2source'}
readonly EXPORT_DIR=${EXPORT_DIR:-'/data/export'}

function export_local_mbtiles() {
    exec tilelive-copy \
        --scheme=pyramid \
        --bounds="$BBOX" \
        --timeout="$TILE_TIMEOUT" \
        --concurrency="$COPY_CONCURRENCY" \
        --minzoom="$MIN_ZOOM" \
        --maxzoom="$MAX_ZOOM" \
        "tmsource://$DEST_PROJECT_DIR" "mbtiles://$EXPORT_DIR/$MBTILES_NAME"
}

function main() {
    export_local_mbtiles
}

main