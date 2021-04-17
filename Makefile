backend_up:
	cd ./backend && npm run server
admin_up:
	cd ./admin && ng serve --host 0.0.0.0 --disable-host-check
shop_up:
	cd ./shop && ng serve