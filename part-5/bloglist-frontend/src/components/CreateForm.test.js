import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent } from "@testing-library/react"
import CreateForm from "./CreateForm"


test("create new blog form sends accurate information when create-button is clicked", () => {
  const createNew = jest.fn()

  const component = render(
    <CreateForm createNew={createNew} />
  )

  const author = component.container.querySelector("#author")
  const title = component.container.querySelector("#title")
  const url = component.container.querySelector("#url")

  fireEvent.change(author, { target: { value:"Author for testing" } })
  fireEvent.change(title, { target: { value: "Title for testing" } })
  fireEvent.change(url,  { target: { value:"Url for testing" } })


  const createBtnSend = component.container.querySelector("#createBtnSend")
  fireEvent.click(createBtnSend)

  expect(createNew).toHaveBeenCalledWith({
    title: "Title for testing",
    author: "Author for testing",
    url: "Url for testing",
  })
  expect(createNew.mock.calls).toHaveLength(1)

})
