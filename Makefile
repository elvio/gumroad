all:
	@echo "Available options: test, build and deploy"

test:
	npm run test

build:
	npm run build

deploy: build purge_cache
	aws s3 rm s3://gumroad.elviovicosa.com/index.html
	aws s3 sync --exact-timestamps public/ s3://gumroad.elviovicosa.com/	
	aws s3 sync --exact-timestamps lib/ s3://gumroad.elviovicosa.com/lib/

purge_cache:
	curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" -H "X-Auth-Email: ${CF_EMAIL}" -H "X-Auth-Key: ${CF_AUTH_KEY}" -H "Content-Type: application/json" --data '{"purge_everything":true}'