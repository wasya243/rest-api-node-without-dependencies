const http = require('http');

const handlers = require('./handlers');

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        return handlers.handleGetReq(req, res);
    } else if (req.method === 'POST') {
        return handlers.handlePostReq(req, res);
    } else if (req.method === 'DELETE') {
        return handlers.handleDeleteReq(req, res);
    } else if (req.method === 'PUT') {
        return handlers.handlePutReq(req, res);
    }
});



server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});