const { verify } = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const token = authorization.split(" ")[1];
    const { userId } = verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = userId;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = {
  isAuth
};
