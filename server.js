const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;


const logEvents = require('./logEvents');
const EventEmitter = require('events');
const { join } = require('path');
class Emitter extends EventEmitter { };
// initialize object 
const myEmitter = new Emitter();

const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
    try{
        // getting data from server
        const data = await fsPromises.readFile(filePath, 'utf8');
        response.writeHead(200, { 'Content-Type': contentType});
        response.end(data);
    }
    catch (err){
        console.log(err);
        response.statusCode = 500;
        response.end();
    }
}

// Creating a http server which has request and response in server
const server = http.createServer((req , res) => {
    console.log(req.url, req.method);
    const extension = path.extname(req.url);

    let contentType;

    switch(extension){
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/js';
             break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';        
    }

    let filePath = 
        contentType === 'text/html' && req.url == '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);
    // makes the .html extension not required in browser
    if(!extension && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExists = fs.existsSync(filePath);

    if(fileExists){
        //serve the file
        serveFile(filePath, contentType, res);
    }
    else{
        //404
        //301 redirect
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, {'Location': '/new-page.html'});
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, {'Location': '/'});
                res.end();
                break;
            default:
                // serve 404 response    
                serveFile(path.join(__dirname, 'views', '404.html'), 
                'text/html', res);

        }
    }
});

// servers need to listen for a request
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

