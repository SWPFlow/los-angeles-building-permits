los-angeles-building-permits
============================

A mix of containerized processing with serverless powered endpoints to load and map building permits of Los Angeles.

## WIP

## Sources

- [Los Angeles Building Permits](https://data.lacity.org/A-Prosperous-City/Building-Permits/nbyu-2ha9)
- [US Census Tracts via CitySDK](https://uscensusbureau.github.io/citysdk/)

## PreReqs

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Docker Containers

- [Postgres 10 with PostGIS](https://hub.docker.com/r/mdillon/postgis/)
- [Node.js](https://hub.docker.com/_/node/)
- [openmaptiles/openmaptiles-tools](https://hub.docker.com/r/openmaptiles/openmaptiles-tools/)

## Services

To start the system, run `$> make compose_up`.  This runs the development docker compose environment using the appropriate environment variables.

### generate-tilesource

### mbview

### migrations

### postgres

### tilelive

## Contact

Andrew Burnes