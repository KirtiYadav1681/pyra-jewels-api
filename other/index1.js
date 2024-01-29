const express = require("express");
const app = express();
const User = require("../models/User");
require("../db_connect");

app.use(express.json());

app.get("/test", async (req, res) => { 
    const user = await User.find()
    res.send(user)
});

app.listen(3001, () => {
    console.log(`Server is running on port`);
});