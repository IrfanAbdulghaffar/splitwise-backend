const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://user_splitwise:Password@splitwise-db.vz4em.mongodb.net/?retryWrites=true&w=majority&appName=splitwise-db");
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
