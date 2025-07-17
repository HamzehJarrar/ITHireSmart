import jwt from "jsonwebtoken";
import config from "config";

const auth = (req, res, next) => {
  // Get the token from the request header
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  } else {
    try {
      jwt.verify(token, config.get("jwtSecret"), (err, decoded) => {
        if (err) {
          return res.status(401).json({ msg: "Token is not valid" });
        } else {
          req.user = decoded.user;
          next();
        }
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }
};

export default auth;

