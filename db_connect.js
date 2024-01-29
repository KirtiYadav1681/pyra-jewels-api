const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(
    process.env.MONGO_URL,  
    {dbName:"myDb"}
).then(() => { console.log("Connected to MongoDB") }).catch(err => { console.log("Error connecting to MongoDB:", err.message) });
