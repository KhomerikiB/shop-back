const { verify } = require("jsonwebtoken");

const isAuth = req => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    throw new Error("Anauthorized");
  }
  const token = authorization.split(" ")[1];
  const { userId } = verify(token, process.env.ACCESS_TOKEN_SECRET);
  return userId;
};

module.exports = {
  isAuth
};
