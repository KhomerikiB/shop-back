const { sign } = require("jsonwebtoken");
const createAccessToken = userId => {
  return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5h"
  });
};

const createRefreshToken = userId => {
  return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "24h"
  });
};
const sendAccessToken = (req, res, accessToken) => {
  res.send({ accessToken, email: req.body.email });
};
const sendRefreshToken = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/api/auth/refresh_token",
    expires: new Date(Date.now() + 4 * 3600000 * 24)
  });
};
module.exports = {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken
};
