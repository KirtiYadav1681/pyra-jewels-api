const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());

const users = [
  {
    id: "1",
    username: "johndoe1",
    password: "1234",
    isAdmin: true,
  },
  {
    id: "2",
    username: "johndoe2",
    password: "123456789",
    isAdmin: false,
  },
];

app.post("/api/refresh", () => {
  const refreshToken = req.body.token;

  if (refreshToken) {
    jwt.verify(refreshToken, "secretkey", (err, usr) => {
      if (err) {
        return res.status(403).send("token is not valid!");
      }
      const accessToken = generateAccessToken(usr);
      res.json({ accessToken: accessToken });
    });
  }
});

app.post("/api/login", (req, res) => {
  // const { username, password } = req.body;

  const usr = users.find((u) => {
    return u.username === req.body.username && u.password === req.body.password;
  });
  // res.send(usr);

  if (usr) {
    const acessToken = jwt.sign(
      {
        id: usr.id,
        isAdmin: usr.isAdmin,
      },
      "secretkey",
      {
        expiresIn: "1h",
      }
    );
    res.send({
      username: usr.username,
      isAdmin: usr.isAdmin,
      acessToken,
    });
  } else {
    res.send("user and password is incorrect");
  }

  // console.log(req.usr)
});

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "secretkey", (err, usr) => {
      if (err) {
        return res.status(403).send("token is not valid!");
      }

      // console.log(req.usr)
      // console.log(usr)
      req.usr = usr;

      
      // console.log(req.usr)
      
       next();
    
    });
  } else {
    res.status(401).send("you are not authenticated!");
  }
};

app.delete("/api/users/:userId", verify, (req, res) => {
  if (req.usr.id === req.params.userId || req.usr.isAdmin) {
    // console.log(req.params.userId);
    res.status(200).send("user had been delete");
  } else {
    res.status(403).send("you are not be able to delete usr");
  }
});

app.listen(3000, () => {
  console.log("server is running at port ");
});
