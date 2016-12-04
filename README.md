## CURL example of getting stations

`curl -X POST http://www.lukoil.ru/new/azslocator/GetStations/ --data "bounds=43.908777108384264,12.612617375000013,64.47610514622922,80.28839862500003&tab=map&territoryid=c1"`

That works without headers, cookies and others security.

## TODO list

1. Hide placemarks on route showing, or group them (done)
2. Fix getting location
3. Pack app into Safari container
4. Add method to adjust center of screen to current location
5. (!) Remove old route on creating new one