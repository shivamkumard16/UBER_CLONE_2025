const http = require('http');
const { app } = require('./app');
const server = http.createServer(app);
const port = process.env.PORT || 4000;
const { connectDB } = require('./db/db');

server.listen(port, (err) => {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log(`Running sucessFully at port number ${port}`)
        connectDB();
    }
})