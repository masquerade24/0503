const http = require('http');
const app = require('./app');
const port = 7000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`서버가 ${port}번 포트에서 동작중입니다.`);
});