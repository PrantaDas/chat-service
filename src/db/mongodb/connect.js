require('dotenv').config();
const mongoose = require('mongoose');

module.exports = () => new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => resolve('Connected to mongodb!!'))
        .catch((err) => reject(err.message));
});