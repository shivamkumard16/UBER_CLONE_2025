const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();


dotenv.config();
app.use(cors());
app.use(express.json());
app.use((express.urlencoded({ extended: true })));
const userRoutes = require('./routes/user.routes');

app.use('/users/', userRoutes);



app.get('/', (req, res) => {
    res.send("hello from server");
});



module.exports = { app };