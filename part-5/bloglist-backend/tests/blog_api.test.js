const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Blog = require("../models/blog");
let token;

describe("initially saved blog posts", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
    await User.deleteMany({});
    await User.insertMany(helper.initialUsers);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("blogs have identification field named as id", async () => {
    const response = await api.get("/api/blogs");
    const firstBlog = response.body[0];
    expect(firstBlog.id).toBeDefined();
  });
});

describe("add and delete blog post for user with authentication token", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
    await User.deleteMany({});
    await User.insertMany(helper.initialUsers);
    //create new user with token
    await api
      .post("/api/users")
      .send({ username: "test user", name: "test user", password: "password" })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const loginResponse = await api
      .post("/api/login")
      .send({ username: "test user", password: "password" })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    token = loginResponse.body.token;
  });

  test("a new blog post can be added to blog list", async () => {
    const newBlog = {
      title: "NewTitle",
      author: "NewAuthor",
      url: "NewUrl",
      likes: 256,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "bearer " + token)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const allBlogs = await helper.blogsInDB();
    expect(allBlogs).toHaveLength(helper.initialBlogs.length + 1);

    const titles = allBlogs.map((blog) => blog.title);
    expect(titles).toContain("NewTitle");
  });

  test("a new blog post cannot be added to blog list if there is no valid token, fails with 401", async () => {
    const newBlog = {
      title: "NewTitle",
      author: "NewAuthor",
      url: "NewUrl",
      likes: 256,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const allBlogs = await helper.blogsInDB();
    expect(allBlogs).toHaveLength(helper.initialBlogs.length);
  });

  test("value for likes is defined as 0 by default", async () => {
    const newBlog = {
      title: "NewTitle2",
      author: "NewAuthor2",
      url: "NewUrl2",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", "bearer " + token)
      .send(newBlog);
    expect(response.body.likes).toEqual(0);
  });

  test("blog without title and url is not added", async () => {
    const newBlog = {
      author: "NewAuthor3",
      likes: 85,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "bearer " + token)
      .send(newBlog)
      .expect(400);
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("blog post is deleted succesfully if id and token are valid", async () => {
    //create new blog post for the new user created in beforeEach()
    const newBlog = {
      title: "NewTitle",
      author: "NewAuthor",
      url: "NewUrl",
      likes: 256,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "bearer " + token)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsInDB = await helper.blogsInDB();

    // delete the blog post from DB
    const blogToDelete = blogsInDB[2];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", "bearer " + token)
      .expect(204);

    const blogsInDbAfterDelete = await helper.blogsInDB();
    expect(blogsInDbAfterDelete.length).toBe(helper.initialBlogs.length);

    const titles = blogsInDbAfterDelete.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe("update blog post", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
    await User.deleteMany({});
    await User.insertMany(helper.initialUsers);
  });

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
});

describe("when there is initially one user at db", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("password", 10);
    const user = new User({
      username: "root",
      name: "test user",
      passwordHash,
    });
    await user.save();
  });

  test("creation succeeds with a new username", async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      username: "newUser",
      name: "New User",
      password: "password",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails if given username already taken", async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      username: "root",
      name: "Another User",
      password: "password",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("`username` to be unique");

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creation fails if password is not given", async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      username: "User",
      name: "Test User",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "User validation failed: Password is required."
    );

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creation fails if password is not at least 3 characters long", async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      username: "User",
      name: "Test User",
      password: "xx",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "User validation failed: Password must be at least 3 or more characters long."
    );

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
