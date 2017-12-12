SHELL = /bin/bash

compose-up:
	ENVIRONMENT=development docker-compose up -d

compose-down:
	ENVIRONMENT=development docker-compose down

compose-logs:
	ENVIRONMENT=development docker-compose logs -f -t

dev-postgres:
	ENVIRONMENT=development docker-compose exec \
		postgres \
		psql

dev-mbview:
	ENVIRONMENT=development docker-compose exec \
		mbview \
		/bin/bash

dev-migrations:
	ENVIRONMENT=development docker-compose exec \
		migrations \
		/bin/bash

dev-generate-tilesource:
	ENVIRONMENT=development docker-compose exec \
		generate-tilesource \
		/bin/bash

dev-tilelive:
	ENVIRONMENT=development docker-compose exec \
		tilelive \
		/bin/bash