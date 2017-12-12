FROM node:5

WORKDIR /usr/src/app
RUN npm install -g \
          tl@0.8.1 \
          mapnik@3.5.13 \
          mbtiles@0.8.2 \
          tilelive@5.12.2 \
          tilelive-tmsource@0.5.0 \
          tilelive-vector@3.9.3 \
          tilelive-bridge@2.3.1 \
          tilelive-mapnik@0.6.18

ENV SOURCE_PROJECT_DIR=/data/tm2source EXPORT_DIR=/data/export TILELIVE_BIN=tl