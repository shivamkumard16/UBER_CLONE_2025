const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use((express.urlencoded({ extended: true })));
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');


app.use('/users/', userRoutes);
app.use('/captains/', captainRoutes);

app.get('/', (req, res) => {
    res.send("hello from server");
});



module.exports = { app };