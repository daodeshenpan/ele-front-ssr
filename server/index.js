const fs = require('fs');
const http = require('http');
const path = require('path');
const {createBundleRenderer} = require('vue-server-renderer');

const template = fs.readFileSync('./template.html', 'utf-8');
const serverBundle = require('./vue-ssr-server-bundle.json');
const clientManifest = require('../dist/vue-ssr-client-manifest.json');

const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template,
    clientManifest
});

let title = 'ele-front-ssr';

http.createServer(function (req, res) {
    if (req.url.indexOf('.') === -1 || req.url.indexOf('?') > -1) {
        let context = {
            url: req.url,
            title
        };
        renderer.renderToString(context, (err, html) => {
            if (err) {
                if (err.code === 404) {
                    res.writeHead(404, {'Content-Type': 'text/plain;charset=utf-8'});
                    res.end('页面未找到');
                } else {
                    res.writeHead(500, {'Content-Type': 'text/plain;charset=utf-8'});
                    res.end('服务器错误');
                }
            } else {
                context.renderState({
                    windowKey: '__INITIAL_STATE__'
                });
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                res.end(html);
            }
        })
    } else {
        fs.readFile(path.join(__dirname, '../dist', req.url), function (err, data) {
            if (!err) {
                res.writeHead(200);
                res.end(data);
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain;charset=utf-8'});
                res.end('资源未找到');
            }
        });
    }
}).listen(7000);