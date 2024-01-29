const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  // console.log(authHeader.split(" ")[1]);
  // auth=authHeader.split(" ")[1];

  if (authHeader) {
    auth = authHeader.split(" ")[1];
    jwt.verify(auth, process.env.WEB_TOKEN, (err, user) => {
      if (err) {
        res.status(401).send("Invalid token");
      } else {
        // console.log(req.user);
        req.user = user;
        next();
      }
    });
  } else {
    return res.status(401).send("Access Denied");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(401).send("you are not allowed to do that");
    }
  });
};

const verifyTokenAndAdmin= (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(401).send("you are not allowed to do that");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
