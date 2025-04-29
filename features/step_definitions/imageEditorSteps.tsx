import "@testing-library/jest-dom"
// features/step_definitions/imageEditorSteps.tsx
import { Given, When, Then } from "@cucumber/cucumber"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import HomePage from "../../app/page"
// import EditImagePage from "../../app/edit/[id]"

// Scenario 1: User views a list of images with pagination
Given("the user is on the image gallery page", () => {
  render(<HomePage />)
})

When("they view the list of images", () => {
  // The images are automatically rendered as part of HomePage component
})

Then("they should see image previews with the author's name", () => {
  // Check if images have the 'alt' text containing "Image by"
  expect(screen.getByAltText(/Image by/)).toBeInTheDocument()
  // Check if author's name is displayed in the "By:" element
  expect(screen.getByText(/By:/)).toBeInTheDocument()
})

Then("the images should be paginated", () => {
  // Check if the pagination buttons are displayed
  expect(screen.getByText(/Next/)).toBeInTheDocument()

  // Simulate clicking the 'Next' button
  fireEvent.click(screen.getByText(/Next/))

  // Optionally, you can check if the page updates by verifying new image previews or the page number
  // For simplicity, you can just check if the 'Previous' button is now present after clicking 'Next'
  expect(screen.getByText(/Previous/)).toBeInTheDocument()
})

// Optional: Test image count (optional but useful for verifying images are correctly fetched)
Then("there should be 10 images displayed", () => {
  const images = screen.getAllByAltText(/Image by/)
  expect(images.length).toBe(10) // Ensure there are 10 images
})
