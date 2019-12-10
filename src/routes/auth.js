const route = require("express").Router();
const { hash, compare } = require("bcryptjs");
const { verify } = require("jsonwebtoken");
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken
} = require("../tokens");
const { isAuth } = require("../middleware/isAuth");
const User = require("../modules/User");
route.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (name.length <= 2) {
    return res.status(403).json({ error: "Name must be more than 3" });
  } else if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Please enter valid email" });
  } else if (password.length <= 5) {
    return res.status(403).json({ error: "Password must be more than 5" });
  }
  //   CHECK IF USER EXISTS IN DATABASE
  const findUser = await User.findOne({ email });
  if (findUser) {
    return res.status(409).json({ error: "Email already exists" });
  }
  const hashedPassword = await hash(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPassword
  });
  try {
    await user.save();
    res.status(200).json({ success: "User registered successfully" });
  } catch (error) {
    return res.status(403).json({ error: error });
  }
});

route.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) return res.status(403).json();
  const checkedUser = await User.findOne({ email });

  if (!checkedUser)
    return res.status(422).json({ error: "Email or Password is incorrect" });
  const valid = await compare(password, checkedUser.password);
  if (!valid)
    return res.status(422).json({ error: "Email or Password is incorrect" });
  // CREATE REFRESH AND ACCESS TOKEN
  try {
    const accessToken = createAccessToken(checkedUser._id);
    const refreshToken = createRefreshToken(checkedUser._id);
    checkedUser.refreshToken = refreshToken;
    await checkedUser.save();
    sendRefreshToken(res, refreshToken);
    sendAccessToken(req, res, accessToken);
  } catch (error) {
    console.log(error);
  }
});
route.post("/refresh_token", async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.send({ accessToken: "" });
  let payload = null;

  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
    console.log(payload);
  } catch (error) {
    return res.send({ accessToken: "asfa" });
  }
  const user = await User.findById(payload.userId);
  if (!user) {
    return res.status(200).json({ accessToken: "" });
  }
  if (user.refreshToken !== token) {
    return res.status(200).json({ accessToken: "" });
  }
  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);
  user.refreshToken = refreshToken;
  await user.save();
  sendRefreshToken(res, refreshToken);
  return res.status(200).json({ accessToken });
});
route.get("/protected", isAuth, async (req, res) => {
  res.status(200).json({ success: "rac ginda" });
});
route.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", { path: "/api/auth/refresh_token" });
  return res.send({ success: "log out" });
});
module.exports = route;
