import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent } from "@testing-library/react"
import Blog from "./Blog"

test("renders blog title and author, but not url and likes", () => {
  const blog = {
    title: "Title for testing",
    author: "Author for testing",
    url: "Url for testing",
    likes: 1,
    user: {}
  }

  const component = render(
    <Blog blog={blog}  canDelete={false}
      addLike={() => {}}
      blogDeleted={() => {}} />
  )

  const div = component.container.querySelector(".smallView")
  expect(div).toHaveTextContent(
    "Title for testing"
  )
  expect(div).toHaveTextContent(
    "Author for testing"
  )

  expect(div).not.toHaveTextContent(
    "Url for testing"
  )

  expect(div).not.toHaveTextContent(
    "Likes:"
  )
})

test("renders blog title, author, url and likes when button 'view more' is clicked", () => {
  const blog = {
    title: "Title for testing",
    author: "Author for testing",
    url: "Url for testing",
    likes: 1,
    user: {}
  }

  const component = render(
    <Blog blog={blog}  canDelete={false}
      addLike={() => {}}
      blogDeleted={() => {}} />
  )

  const button = component.getByText("View more")
  fireEvent.click(button)

  const div = component.container.querySelector(".viewMore")

  expect(div).toHaveTextContent(
    "Title for testing"
  )
  expect(div).toHaveTextContent(
    "Author for testing"
  )
  expect(div).toHaveTextContent(
    "Url for testing"
  )
  expect(div).toHaveTextContent(
    "Likes:"
  )

})

test("if button 'like' is clicked twice, addLike is called twice.", () => {
  const blog = {
    title: "Title for testing",
    author: "Author for testing",
    url: "Url for testing",
    likes: 1,
    user: {}
  }

  const addLike = jest.fn()

  const component = render(
    <Blog blog={blog}  canDelete={false}
      addLike={addLike}
      blogDeleted={() => {}} />
  )

  const viewMoreButton = component.getByText("View more")
  fireEvent.click(viewMoreButton)

  const likeButton = component.container.querySelector("#likeBtn")
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(addLike.mock.calls).toHaveLength(2)
})

