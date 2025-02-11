import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/Users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username: username } });
  console.log(user);

  if (user) {
    return res.json({ message: "User already exists !" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username: username,
    password: hashedPassword,
  });
  await newUser.save();
  res.json({ message: "User Registred Successfully !" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username: username } });

  if (!user) {
    return res.json({ message: "User Doesn't Exist !" });
  }

  const IsPasswordValid = await bcrypt.compare(password, user.password);

  if (!IsPasswordValid) {
    return res.json({ message: "Username or Password is Incorrect !" });
  }
  const token = jwt.sign({ id: user._id }, "secret");
  res.json({ token, userId: user.id });
});

export { router as userRouter };

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "secret", (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
