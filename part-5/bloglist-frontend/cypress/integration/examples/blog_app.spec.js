describe("Blog app", function() {
  beforeEach( function() {
    cy.request("POST", "http://localhost:3001/api/testing/reset")

    const testUser = {
      name: "Jane Doe",
      username: "testuser",
      password: "password"
    }
    cy.request("POST", "http://localhost:3001/api/users/", testUser)

    const testUser2 = {
      name: "John Doe",
      username: "testuser2",
      password: "password"
    }
    cy.request("POST", "http://localhost:3001/api/users/", testUser2)

    cy.visit("http://localhost:3000")
  })

  it("Login form is shown", function() {
    cy.contains("Log in to application")
    cy.get("#loginForm")
  })

  describe("Login",function() {
    it("succeeds with correct credentials", function() {
      cy.get("#username").type("testuser")
      cy.get("#password").type("password")
      cy.get("#submitLoginBtn").click()
      cy.contains("Logged in as Jane Doe")
    })

    it("fails with wrong credentials", function() {
      cy.get("#username").type("testuser")
      cy.get("#password").type("xxxxxx")
      cy.get("#submitLoginBtn").click()
      cy.get(".error").should("contain", "Wrong username or password.")
      cy.get(".error").should("have.css", "color", "rgb(194, 9, 9)")
      cy.get(".error").should("have.css", "background-color", "rgb(231, 153, 139)")
      cy.get("html").should("not.contain", "Logged in as Jane Doe")

    })
  })

  describe("When logged in", function() {
    beforeEach(function() {
      cy.get("#username").type("testuser")
      cy.get("#password").type("password")
      cy.get("#submitLoginBtn").click()
    })

    it("a blog can be created", function() {
      cy.get("#createNewBtn").click()
      cy.get("#title").type("Title for testing")
      cy.get("#author").type("Author for testing")
      cy.get("#url").type("Url for testing")
      cy.get("#createBtnSend").click()
      cy.get("#createForm").should("not.be.visible")
      cy.contains("Blog: Title for testing")
      cy.contains("Author: Author for testing")
    })
  })


  describe("When logged in and after a new blog post is created", function() {
    beforeEach(function() {
      cy.get("#username").type("testuser")
      cy.get("#password").type("password")
      cy.get("#submitLoginBtn").click()
      cy.get("#createNewBtn").click()
      cy.get("#title").type("Title for testing")
      cy.get("#author").type("Author for testing")
      cy.get("#url").type("Url for testing")
      cy.get("#createBtnSend").click()
    })

    it("a blog can be liked", function() {
      cy.get("#viewMoreBtn").click()
      cy.contains("Likes: 0")
      cy.get("#likeBtn").click()
      cy.contains("Likes: 1")
    })

    it("a blog can be deleted", function() {
      cy.reload()
      cy.get("#viewMoreBtn").click()
      cy.get("#deleteBtn").click()
      cy.get("#blogPosts").should("not.exist")

    })

    it("a blog cannot be deleted if logged in user is not the same who created the post.", function() {
      cy.reload()
      cy.get("#logoutBtn").click()
      cy.get("#username").type("testuser2")
      cy.get("#password").type("password")
      cy.get("#submitLoginBtn").click()
      cy.get("#viewMoreBtn").click()
      cy.get("#deleteBtn").should("not.be.visible")

    })


  })

  it("Blog posts are sorted by the amount of likes", function() {
    cy.get("#username").type("testuser")
    cy.get("#password").type("password")
    cy.get("#submitLoginBtn").click()

    cy.get("#createNewBtn").click()
    cy.get("#title").type("Title for testing")
    cy.get("#author").type("Author for testing")
    cy.get("#url").type("Url for testing")
    cy.get("#createBtnSend").click()

    cy.get("#createNewBtn").click()
    cy.get("#title").type("Title for testing2")
    cy.get("#author").type("Author for testing2")
    cy.get("#url").type("Url for testing2")
    cy.get("#createBtnSend").click()

    cy.get(".blogPost")
      .should("have.lengthOf", 2)
      .then(divs => {
        cy.wrap(divs[1]).within(() => {
          cy.get("#viewMoreBtn").click()
          cy.get("#likeBtn").click()
          cy.get("#hide").click()
        })
      })
    cy.get("#sortBtn").click()
    cy.get(".blogPost")
      .then(divs => {
        cy.wrap(divs[0]).within(() => {
          cy.contains("Blog: Title for testing2")
          cy.contains("Author for testing2")
        })
      })
  })

})