const router = require("express").Router();
const User = require("../models/User");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const userExists = await User.findOne({username: req.body.username});
  if(!userExists) {
      try {
        const user1 = req.body.password;
        const user = new User({
          username: req.body.username,
          email: req.body.email,
          // password: req.body.password,
          conformpassword: user1,
          password: cryptoJS.AES.encrypt(
            user1,
            process.env.SECRET_KEY
          ).toString(),
        });
          const savedata = await user.save();
          res.status(201).send(savedata);
      } catch (err) {
        res.status(500).send(err);
      }
  }else{res.status(500).json({message:"user already exists"})}
  
  // const enc =cryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY);
  // console.log(enc);
});



//LOGIN

router.post("/login", async (req, res) => {
  try {
    console.log(req.body.username);
    const user = await User.findOne({
      username: req.body.username,
    });

    !user ? res.status(404).send("User id is required") : null;
    // console.log(x);
    // const user = await User.find({});
    const originalpassword = cryptoJS.AES.decrypt(
      user.password,

      process.env.SECRET_KEY
    ).toString(cryptoJS.enc.Utf8);
    // console.log(originalpassword);
    originalpassword !== req.body.password
      ? res.status(401).send("Wrong password")
      : null;

    const acessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.WEB_TOKEN
    );
    console.log(user);
    const { password, ...other } = user._doc;
    res.status(201).send({ ...other, acessToken });

    // console.log(password);

    // const password = cryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(cryptoJS.enc.Utf8);
  } catch (err) {
    res.status(500).send("Error in finding user");
  }
});



module.exports = router;
