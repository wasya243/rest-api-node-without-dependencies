const qs = require('querystring');
const url = require('url');
const http = require('http');

const UserRepository = require('./user-repository');

function handleGetReq(req, res) {
    const {pathname} = url.parse(req.url);

    if (pathname !== '/users') {
        return handleError(res, 404);
    }

    res.setHeader('Content-Type', 'application/json;charset=utf-8');

    return res.end(JSON.stringify(UserRepository.getUsers()));
}

function handleDeleteReq(req, res) {
    const {pathname, query} = url.parse(req.url);

    if (pathname !== '/users') {
        return handleError(res, 404);
    }

    const {id} = qs.parse(query);
    const userDeleted = UserRepository.deleteUser(parseInt(id, 10));

    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    const payload = {
        userDeleted
    };
    res.end(JSON.stringify(payload));
}

function handlePutReq(req, res) {
    const {pathname, query} = url.parse(req.url);

    if (pathname !== '/users') {
        return handleError(res, 404);
    }

    const {id} = qs.parse(query);
    const size = parseInt(req.headers['content-length'], 10);
    const buffer = Buffer.allocUnsafe(size);
    let pos = 0;

    req.on('data', (chunk) => {
        const offset = pos + chunk.length;

        if (offset > size) {
            reject(413, 'Too Large', res);

            return;
        }

        chunk.copy(buffer, pos);
        pos = offset;
    });

    req.on('end', () => {
        if (pos !== size) {
            reject(400, 'Bad request', res);

            return;
        }

        const data = JSON.parse(buffer.toString());

        const userUpdated = UserRepository.updateUser(parseInt(id, 10), data);

        console.log('User updated: ', data);

        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        const payload = {
            userUpdated: userUpdated
        };
        res.end(JSON.stringify(payload));

    });
}

function handlePostReq(req, res) {
    const size = parseInt(req.headers['content-length'], 10);
    const buffer = Buffer.allocUnsafe(size);
    let pos = 0;

    const {pathname} = url.parse(req.url);
    if (pathname !== '/user') {
        return handleError(res, 404);
    }

    req.on('data', (chunk) => {
        const offset = pos + chunk.length;

        if (offset > size) {
            reject(413, 'Too Large', res);

            return;
        }

        chunk.copy(buffer, pos);
        pos = offset;
    });

    req.on('end', () => {
        if (pos !== size) {
            reject(400, 'Bad request', res);

            return;
        }

        const data = JSON.parse(buffer.toString());

        UserRepository.saveUser(data);

        console.log('User posted: ', data);

        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.end('You posted: ' + JSON.stringify(data));

    });
}

function handleError(res, code) {
    res.statusCode = code;

    const payload = {
        error: http.STATUS_CODES[code]
    };

    res.end(JSON.stringify(payload));
}

module.exports = {
    handlePostReq,
    handlePutReq,
    handleGetReq,
    handleDeleteReq
};