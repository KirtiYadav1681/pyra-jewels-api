const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const User = require("../models/User");
const cryptoJS = require("crypto-js");
// const jwt = require("jsonwebtoken");
const router = require("express").Router();



// const express = require("express");
// const app = express();

// router.get("/user", (req, res) => {
//   res.send("Hello user");
// });

// router.post("/userpost", (req, res) => {
//     const username = req.body.username;
//     console.log(username);
//     res.send(username);
    
// })
// // app.use(express.json());
// var express = require("express");
// var bodyParser = require("body-parser");

// var app = express();

// // create application/json parser
// var jsonParser = bodyParser.json();

// // create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

// // POST /login gets urlencoded bodies
// app.post("/user/admin", urlencodedParser, function (req, res) {
//   res.send("welcome, " + req.body.username);
// // });
// router.post("/user/admin/", async (req, res) => {
//   try {
//     console.log(req.body.username);
//     const user = await User.find({user:req.body.username});
//     res.send(user);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });


router.put("/user/:id",verifyTokenAndAuthorization,  async (req, res) => {
  
  if (req.body.password) {
    console.log(req.body.username);
    console.log(req.body.password);
    req.body.password = cryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString();
  }
  {
    try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
      );
      // console.log("lov");
      res.status(200).send(updateUser);
  } catch (err) {
    res.status(500).send(err);
  }}
}); 

router.delete("/deleteUser/:id", verifyTokenAndAdmin,async (req, res) => { 

  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.send("user deleted");
  } catch (err) {
    res.status(500).send(err);
  }
   
  

});


router.get("/finduser/admin/",verifyTokenAndAdmin,async (req, res) => {
  try {
    const user = await User.find()
    
    res.status(200).send(user);
  }
  catch (err) {
    res.status(500).send(err);
   };

});



//admin 
router.get("/finduser/admin/limit/", verifyTokenAndAdmin, async (req, res) => {
  
  const query = req.query.new;
  try {

    const user = query ? await User.find().sort({_id:-1}).limit(5):await User.find();

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});


router.get("/finduser/stats", (req, res) => {
  
  const date = new Date();
  const lastyear = new Date(date.setFullYear(date.getFullYear() - 1));
  // console.log(lastyear);

  try {
    const user = User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: lastyear,
          },
        },
      },
      {
        $group: {
          _id: {
            $month: "$createdAt",
            // `${createdAt}`
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    res.status(200).send(user);
    
  } catch (err) {
    res.status(500).send(err);
  }
}
  
);


module.exports = router;
