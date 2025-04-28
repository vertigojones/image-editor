import '@testing-library/jest-dom'
import { Given, When, Then } from "@cucumber/cucumber"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import HomePage from "../../page"
import EditImagePage from "../../edit/[id]"

// Scenario 1: User views a list of images with pagination
Given("the user is on the image gallery page", () => {
  render(<HomePage /> )
})

When("they view the list of images", () => {
  // Simulate fetching and rendering images (mock the fetch if necessary)
})

Then("they should see image previews with the author's name", () => {
  expect(screen.getByAltText(/Image by/)).toBeInTheDocument()
  expect(screen.getByText(/By:/)).toBeInTheDocument()
})

Then("the images should be paginated", () => {
  expect(screen.getByText(/Next/)).toBeInTheDocument()
})

// Scenario 2: User clicks on an image to navigate to the edit page
Given("the user is on the image gallery page", () => {
  render(<HomePage />)
})

When("they click on an image", () => {
  const image = screen.getByAltText("Image by Author 1") // Example alt text
  fireEvent.click(image)
})

Then("they should be navigated to the image edit page", async () => {
  await waitFor(() => {
    expect(screen.getByText(/Edit Image/)).toBeInTheDocument()
  })
})

// Scenario 3: User edits an image
Given("the user is on the image edit page", () => {
  render(<EditImagePage />)
})

When("they adjust the image settings (size, greyscale, blur)", () => {
  const sizeInput = screen.getByLabelText("Image Size")
  fireEvent.change(sizeInput, { target: { value: "400" } })

  const greyscaleCheckbox = screen.getByLabelText("Greyscale")
  fireEvent.click(greyscaleCheckbox)

  const blurInput = screen.getByLabelText("Blur")
  fireEvent.change(blurInput, { target: { value: "5" } })
})

Then("the image preview should update", async () => {
  await waitFor(() => {
    expect(screen.getByAltText(/Edited Image/)).toHaveStyle("width: 400px")
    expect(screen.getByAltText(/Edited Image/)).toHaveStyle(
      "filter: grayscale(100%)"
    )
    expect(screen.getByAltText(/Edited Image/)).toHaveStyle("filter: blur(5px)")
  })
})
