const express = require("express")
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const blogsRouter = require('./controllers/blogs')

const app = express();
app.use('/api/blogs', blogsRouter)

app.use(cors());
app.use(express.json());



mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = app