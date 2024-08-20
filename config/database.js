const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch((error) => {
        console.error("Database connection failed. Exiting now...");
        console.error(error);
        process.exit(1);
    });
};
