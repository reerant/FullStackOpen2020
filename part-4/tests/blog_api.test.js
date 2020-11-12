const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

//app returns blogs in JSON
test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

//app returns all blogs from DB
test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

//blogs have identification field named as id
test("blogs have identification field named as id", async () => {
  const response = await api.get("/api/blogs");
  const firstBlog = response.body[0];
  expect(firstBlog.id).toBeDefined();
});

// amount of blogs increases by one and the added new blog post can be found from DB by its title
test("a new blog post can be added to blog list", async () => {
  const newBlog = {
    title: "NewTitle",
    author: "NewAuthor",
    url: "NewUrl",
    likes: 256,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const allBlogs = await helper.blogsInDB();
  expect(allBlogs).toHaveLength(helper.initialBlogs.length + 1);

  const titles = allBlogs.map((blog) => blog.title);
  expect(titles).toContain("NewTitle");
});

//if field 'likes' is not passed with value, its value will be defined as 0
test("value for likes is defined as 0 by default", async () => {
  const newBlog = {
    title: "NewTitle2",
    author: "NewAuthor2",
    url: "NewUrl2",
  };

  const response = await api.post("/api/blogs").send(newBlog);
  expect(response.body.likes).toEqual(0);
});

//blog post wihtout title and url cannot be added to DB
test("blog without title and url is not added", async () => {
  const newBlog = {
    author: "NewAuthor3",
    likes: 85,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

//delete blog post from DB by its ID
test("blog post is deleted succesfully if id is valid", async () => {
  const blogsInDB = await helper.blogsInDB();
  // delete the second blog post from DB
  const blogToDelete = blogsInDB[1];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsInDbAfterDelete = await helper.blogsInDB();
  expect(blogsInDbAfterDelete.length).toBe(helper.initialBlogs.length - 1);
  
  const titles = blogsInDbAfterDelete.map((blog) => blog.title);
  expect(titles).not.toContain(blogToDelete.title);
});

//update likes for the blog post
test("blog likes updated successfully if id is valid", async () => {
  const blogsInDB = await helper.blogsInDB();
  // update the second blog post from DB
  const blogToUpdate = blogsInDB[1];

  blogToUpdate.likes = 568;

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const updatedBlogsInDB = await helper.blogsInDB();
  const likes = updatedBlogsInDB.map((blog) => blog.likes);
  expect(likes).toContain(blogToUpdate.likes);
});

afterAll(() => {
  mongoose.connection.close();
});
