dev:
	npm run db:init
	pm2 start ecosystem.config.js

stop:
	pm2 stop ecosystem.config.js

restart:
	pm2 restart ecosystem.config.js

logs:
	pm2 logs character-list-api-dev

delete:
	pm2 delete ecosystem.config.js
