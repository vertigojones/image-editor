// features/step_definitions/imageEditorSteps.tsx

import "@testing-library/jest-dom"
import { Given, When, Then } from "@cucumber/cucumber"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import HomePage from "../../app/page" // Make sure this import path is correct

// Scenario 1: User views a list of images with pagination
Given("the user is on the image gallery page", async () => {
  render(<HomePage />)
  // Optionally, you can wait for the images to load if you're mocking the API response.
  await waitFor(() => screen.getByAltText(/Image by/))
})

When("they view the list of images", () => {
  // The images are automatically rendered as part of the HomePage component
})

Then("they should see image previews with the author's name", () => {
  // Check if images have the 'alt' text containing "Image by"
  expect(screen.getByAltText(/Image by/)).toBeInTheDocument()
  // Check if author's name is displayed in the "By:" element
  expect(screen.getByText(/By:/)).toBeInTheDocument()
})

Then("the images should be paginated", () => {
  expect(screen.getByText(/Next/)).toBeInTheDocument()

  // Simulate clicking the 'Next' button
  fireEvent.click(screen.getByText(/Next/))

  // Check if the 'Previous' button is now present
  expect(screen.getByText(/Previous/)).toBeInTheDocument()
})
