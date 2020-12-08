const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

// *** POST ***
usersRouter.post("/", async (req, res) => {
  const body = req.body;

  //validation for password
  if (body.password === undefined) {
    return res
      .status(400)
      .json({ error: "User validation failed: Password is required." });
  }
  if (body.password.length < 3) {
    return res
      .status(400)
      .json({
        error:
          "User validation failed: Password must be at least 3 or more characters long.",
      });
  }

  //password hash
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();
  res.json(savedUser);
});

// *** GET ***
usersRouter.get("/", async (req, res) => {
  //when populate show only fields: title, author and url
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
  });
  res.json(users.map((u) => u.toJSON()));
});

module.exports = usersRouter;
