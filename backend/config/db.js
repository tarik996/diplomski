require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('../models/Role');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const exist = await Role.exists();
        if(!exist)
            await Role.insertMany([
                {roleName: 'Administrator', type: 1}, 
                {roleName: 'Računovođa', type: 2},
                {roleName: 'Zaposlenik', type: 3}
            ]);

        console.log("MongoDB connection SUCCESS");
    } catch (error) {
        console.log("MongoDB connection FAIL");
        process.exit(1);
    }
}

module.exports = connectDB;