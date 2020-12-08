const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const totalAmount = blogs.reduce((sum, item) => {
    return sum + item.likes;
  }, 0);

  return totalAmount;
};

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map((x) => x.likes));
  const maxLikesObj = blogs.find((x) => x.likes === maxLikes);
  return {
    title: maxLikesObj.title,
    author: maxLikesObj.author,
    likes: maxLikesObj.likes,
  };
};

const mostBlogs = (blogs) => {
  const getAllAuthors = blogs.map((x) => x.author);

  //use lodash:
  //countBy return the composed aggregate object (= author name, occurence value)
  //entries/toPairs return the key-value pair arrays
  const keyValuePairsOfAuthors = _.entries(_.countBy(getAllAuthors));
  //maxBy return key-value pair with the maximum value of the second item of an array and then return the first item of the key-value pair (= author name)
  const mostFrequentAuthor = _.maxBy(keyValuePairsOfAuthors, (x) => x[1])[0];

  const totalOfBlogs = blogs.filter((x) => x.author === mostFrequentAuthor)
    .length;

  return {
    author: mostFrequentAuthor,
    blogs: totalOfBlogs,
  };
};

const mostLikes = (blogs) => {
  const authorLikes = {};
  //sum up every author's blog likes
  blogs.forEach((blog) => {
    if (!authorLikes[blog.author]) {
      authorLikes[blog.author] = 0;
    }
    authorLikes[blog.author] += blog.likes;
  });

  //get author name with the highest amount of likes and the amount of likes
  let mostLikes = 0;
  let mostLikesAuthor = null;
  Object.keys(authorLikes).forEach((authorName) => {
    if (authorLikes[authorName] > mostLikes) {
      mostLikes = authorLikes[authorName];
      mostLikesAuthor = authorName;
    }
  });

  return {
    author: mostLikesAuthor,
    likes: mostLikes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
