# Makefile
db-up:
	docker-compose -f docker-compose.migrate.yaml run --rm database-up
db-down:
	docker-compose -f docker-compose.migrate.yaml run --rm database-down
app-build:
	docker-compose build trade-exportscore-trp
app-up:
	docker-compose up
app-down:
	docker-compose down
prettier:
	npm run prettier:fix
tests:
	scripts/test