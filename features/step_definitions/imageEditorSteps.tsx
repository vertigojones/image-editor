import "@testing-library/jest-dom"
// features/step_definitions/imageEditorSteps.tsx
import { Given, When, Then } from "@cucumber/cucumber"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import HomePage from "../../app/page"
import EditImagePage from "../../app/edit/[id]"

// Scenario 1: User views a list of images with pagination
Given("the user is on the image gallery page", () => {
  render(<HomePage />)
})

When("they view the list of images", () => {
  // Simulate fetching and rendering images
})

Then("they should see image previews with the author's name", () => {
  expect(screen.getByText(/Image Gallery/)).toBeInTheDocument()
  expect(screen.getByAltText(/Image by/)).toBeInTheDocument() // Adjust based on actual implementation
})

Then("the images should be paginated", () => {
  expect(screen.getByText(/Next/)).toBeInTheDocument() // Adjust as needed
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
  fireEvent.change(sizeInput, { target: { value: "400" } }) // Example size change

  const greyscaleCheckbox = screen.getByLabelText("Greyscale")
  fireEvent.click(greyscaleCheckbox) // Toggle greyscale

  const blurInput = screen.getByLabelText("Blur")
  fireEvent.change(blurInput, { target: { value: "5" } }) // Set blur to 5
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

// Scenario 4: User refreshes the page and the image settings are preserved
Given("the user has edited the image", () => {
  render(<EditImagePage />)
})

When("they refresh the page or navigate back", async () => {
  fireEvent.click(screen.getByText(/Refresh/)) // Trigger refresh
})

Then("the image settings should be preserved", async () => {
  await waitFor(() => {
    expect(screen.getByAltText(/Edited Image/)).toHaveStyle("width: 400px")
    expect(screen.getByAltText(/Edited Image/)).toHaveStyle(
      "filter: grayscale(100%)"
    )
    expect(screen.getByAltText(/Edited Image/)).toHaveStyle("filter: blur(5px)")
  })
})

// Scenario 5: User goes back in history and sees the same image
Given("the user is on the image edit page", () => {
  render(<EditImagePage />)
})

When("they go back in their history", async () => {
  window.history.back() // Simulate going back in history
})

Then("the image and its settings should remain the same", async () => {
  await waitFor(() => {
    expect(screen.getByAltText(/Edited Image/)).toHaveStyle("width: 400px")
    expect(screen.getByAltText(/Edited Image/)).toHaveStyle(
      "filter: grayscale(100%)"
    )
    expect(screen.getByAltText(/Edited Image/)).toHaveStyle("filter: blur(5px)")
  })
})
