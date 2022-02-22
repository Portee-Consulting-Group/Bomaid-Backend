const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // console.log(`mongo uri ${process.env.MONGO_URI}`)
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        mongoose.set('debug', true);
        mongoose.connection.on('connected', () => {
            console.log(`MongoDB connected: ${conn.connection.host}`);
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;