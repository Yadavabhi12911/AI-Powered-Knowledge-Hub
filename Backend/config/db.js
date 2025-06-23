require('dotenv').config();
const mongoose = require("mongoose")

const connectDb = async () => {
   
    
    const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;
    if (!uri) {
        throw new Error("MongoDB connection string is not defined in environment variables.");
    }
    let client = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log(`Database is connected: ${client.connection.host}`);
};

module.exports = { connectDb }




