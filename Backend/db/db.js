const mongoose = require('mongoose')
async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URL);
        console.log(`MONGO DB Connected : ${conn.connection.host}`)
    } catch (error) {
        console.log(`MONGO DB connection error \n ${error}`);
    }
}

module.exports = { connectDB };