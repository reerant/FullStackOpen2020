const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// *** GET ***
blogsRouter.get("/", async (req, res) => {
  //when populate show only fields: username and name
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  res.json(blogs.map((blog) => blog.toJSON()));
});

// *** POST ***
blogsRouter.post("/", async (req, res) => {
  const body = req.body;
  //use middleware tokenExtractor to assign token to request
  const decodedToken = jwt.verify(req.token, process.env.SECRET_KEY);
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: "Token is missing or invalid." });
  }
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });
  //add new blog post
  const savedBlog = await blog.save();
  //add blog post also in user's blogs array
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  res.status(201).json(savedBlog);
});

// *** DELETE ***
blogsRouter.delete("/:id", async (req, res) => {
  //use middleware tokenExtractor to assign token to request
  const decodedToken = jwt.verify(req.token, process.env.SECRET_KEY);
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: "Token is missing or invalid." });
  }

  const user = await User.findById(decodedToken.id);
  const blog = await Blog.findById(req.params.id);

  if (blog.user.toString() !== user._id.toString()) {
    return res
      .status(401)
      .json({ error: "Blog can be deleted only by the user who created it." });
  }

  //delete blog post
  await Blog.findByIdAndRemove(req.params.id);
  //delete blog post also from user's blogs array
  const indexOfBlog = user.blogs.indexOf(req.params.id);
  if (indexOfBlog !== -1) {
    user.blogs.splice(indexOfBlog, 1);
  }
  await user.save();
  res.status(204).end();
});

// *** PUT ***
blogsRouter.put("/:id", async (req, res) => {
  const blog = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  });
  res.json(updatedBlog);
});

module.exports = blogsRouter;
