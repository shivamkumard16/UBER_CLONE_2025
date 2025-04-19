const http = require('http');
const { app } = require('./app');
const server = http.createServer(app);
const port = process.env.PORT || 4000;

server.listen(port, (err) => {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log(`Running sucessFully at port number ${port}`)
    }
})