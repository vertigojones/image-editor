import { render, screen, fireEvent, act } from "@testing-library/react"
import HomePage from "../app/page"
import { useRouter } from "next/navigation"

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}))

// Silence scrollTo not implemented warning
beforeAll(() => {
  window.scrollTo = jest.fn()
})

// Silence React warning for `fill` prop in mocked <img />
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ fill, ...props }: any) => <img {...props} />,
}))

// Silence specific console errors
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((msg) => {
    if (
      typeof msg === "string" &&
      (msg.includes("fill") || msg.includes("scrollTo"))
    ) {
      return
    }
    console.warn("Suppressed error:", msg)
  })
})

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve(
        new Array(12).fill(null).map((_, index) => ({
          id: index + 1,
          author: `Author ${index + 1}`,
          download_url: `https://picsum.photos/id/${index + 1}/500/500`,
        }))
      ),
  })
) as jest.Mock

describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renders the image gallery and displays images with authors", async () => {
    await act(async () => {
      render(<HomePage />)
    })

    const images = await screen.findAllByAltText(/Image by/)
    expect(images.length).toBeGreaterThan(0)
  })

  test("displays pagination buttons", async () => {
    await act(async () => {
      render(<HomePage />)
    })

    expect(await screen.findByText(/Next Page/)).toBeInTheDocument()
    expect(await screen.findByText(/Previous Page/)).toBeInTheDocument()
  })

  test("handles pagination correctly", async () => {
    await act(async () => {
      render(<HomePage />)
    })

    await screen.findAllByAltText(/Image by/)

    const nextButton = await screen.findByText(/Next Page/)
    await act(async () => {
      fireEvent.click(nextButton)
    })

    const prevButton = await screen.findByText(/Previous Page/)
    expect(prevButton).toBeInTheDocument()
  })

  test("displays a correct number of images (12 images)", async () => {
    await act(async () => {
      render(<HomePage />)
    })

    const images = await screen.findAllByAltText(/Image by/)
    expect(images.length).toBe(12)
  })

  test("navigates to the edit page when an image is clicked", async () => {
    const mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })

    await act(async () => {
      render(<HomePage />)
    })

    const imageCard = await screen.findByTestId("carousel-image-1")
    await act(async () => {
      fireEvent.click(imageCard)
    })

    expect(mockPush).toHaveBeenCalledWith("/edit/1")
  })
})
