var http = require('http');

var server = http.createServer();

var host = '127.0.0.1';
var port = 3000;
server.listen(port, host, '50000', function() {
    console.log('started : %s, %d', host, port);
});