import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import HomePage from "../app/page"

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: "OK",
    headers: new Headers({ "Content-Type": "application/json" }),
    redirected: false,
    type: "basic",
    url: "https://picsum.photos/v2/list",
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: jest.fn(),
    blob: jest.fn(() => Promise.resolve(new Blob())),
    bytes: jest.fn(),
    formData: jest.fn(() => Promise.resolve(new FormData())),
    text: jest.fn(() => Promise.resolve("")),
    json: () =>
      Promise.resolve(
        new Array(10).fill(null).map((_, index) => ({
          id: index + 1,
          author: `Author ${index + 1}`,
          download_url: `https://picsum.photos/id/${index + 1}/500/500`,
        }))
      ),
  } as Response)
)

describe("HomePage", () => {
  beforeEach(() => {
    // Clear mock calls between tests
    jest.clearAllMocks()
  })

  test("renders the image gallery and displays images with authors", async () => {
    await act(async () => {
      render(<HomePage />)
    })

    // Wait for the images to load and ensure they appear
    const images = await screen.findAllByAltText(/Image by/)

    // Ensure at least one image is rendered
    expect(images.length).toBeGreaterThan(0)
  })

  test("displays pagination buttons", async () => {
    await act(async () => {
      render(<HomePage />)
    })

    // Use findByText which has built-in waiting
    const nextButton = await screen.findByText(/Next/)
    const prevButton = await screen.findByText(/Previous/)

    // Check if the pagination buttons are rendered
    expect(nextButton).toBeInTheDocument()
    expect(prevButton).toBeInTheDocument()
  })

  test("handles pagination correctly", async () => {
    await act(async () => {
      render(<HomePage />)
    })

    // Wait for the images to load
    await screen.findAllByAltText(/Image by/)

    // Check if the 'Next' button is present
    const nextButton = await screen.findByText(/Next/)
    expect(nextButton).toBeInTheDocument()

    // Simulate clicking the 'Next' button within act
    await act(async () => {
      fireEvent.click(nextButton)
    })

    // Check if the pagination state updates
    const prevButton = await screen.findByText(/Previous/)
    expect(prevButton).toBeInTheDocument()
  })

  test("displays a correct number of images (10 images)", async () => {
    await act(async () => {
      render(<HomePage />)
    })

    // Wait for the images to load
    const images = await screen.findAllByAltText(/Image by/)

    // Ensure exactly 10 images are displayed
    expect(images.length).toBe(10)
  })
})
