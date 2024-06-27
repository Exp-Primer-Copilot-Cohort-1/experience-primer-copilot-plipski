// Create web server
// 1. Load modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
// 2. Create server
http.createServer(function(req, res) {
    // 2.1 Parse request
    var path = url.parse(req.url).pathname;
    console.log('Path: ' + path);
    // 2.2 Route
    switch(path) {
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<h1>Hello, world</h1>');
            res.end();
            break;
        case '/comments':
            switch(req.method) {
                case 'POST':
                    var body = '';
                    req.on('data', function(data) {
                        body += data;
                        // Too much POST data, kill the connection!
                        if (body.length > 1e6)
                            req.connection.destroy();
                    });
                    req.on('end', function() {
                        var post = qs.parse(body);
                        console.log(post);
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(JSON.stringify(post));
                    });
                    break;
                case 'GET':
                    fs.readFile(__dirname + '/comments.json', function(err, data) {
                        if(err) {
                            res.writeHead(404, {'Content-Type': 'text/plain'});
                            res.write('Not Found');
                            res.end();
                            return;
                        }
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.write(data);
                        res.end();
                    });
                    break;
                default:
                    res.writeHead(405, {'Content-Type': 'text/plain'});
                    res.write('Method not allowed');
                    res.end();
            }
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('Not Found');
            res.end();
    }
}).listen(8080);
console.log('Server running at http://localhost:8080/');
// 3. Run server
// 4. Test
// 5. Improve
// 6. Deploy
// 7. Monitor
// 8. Scale
// 9. Repeat
// End of comments.js