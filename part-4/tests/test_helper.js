const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
    user: "5faea5e20879f7295093e6be",
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
    user: "5faea5ee0879f7295093e6bf",
  },
];

const initialUsers = [
  {
    blogs: ["5a422a851b54a676234d17f7"],
    username: "User1",
    name: "safdsgfdghfgh",
    __v: 0,
    _id: "5faea5e20879f7295093e6be",
  },
  {
    blogs: ["5a422aa71b54a676234d17f8"],
    username: "User2",
    name: "sasdsdfggfdsgfdghfgh",
    __v: 0,
    _id: "5faea5ee0879f7295093e6bf",
  },
];

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDB = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDB,
  usersInDB,
};
