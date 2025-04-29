import { render, screen, fireEvent, act } from "@testing-library/react"
import EditImagePage from "../app/edit/[id]"
import { useRouter } from "next/navigation"

// Mock Next.js navigation properly
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(() => ({
    id: "1", // Mocking id param
  })),
}))

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({
        id: 1,
        author: "Author 1",
        download_url: "https://picsum.photos/id/1/500/500",
      }),
  })
) as jest.Mock

describe("EditImagePage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renders the selected image for editing", async () => {
    await act(async () => {
      render(<EditImagePage />)
    })

    const image = await screen.findByAltText(/Image by Author 1/)
    expect(image).toBeInTheDocument()
  })

  test("allows the user to select image width and height", async () => {
    await act(async () => {
      render(<EditImagePage />)
    })

    // Simulate changing width and height
    const widthInput = screen.getByLabelText(/Width/)
    const heightInput = screen.getByLabelText(/Height/)

    fireEvent.change(widthInput, { target: { value: "600" } })
    fireEvent.change(heightInput, { target: { value: "400" } })

    expect(widthInput).toHaveValue(600) // Updated to use toHaveValue matcher
    expect(heightInput).toHaveValue(400) // Updated to use toHaveValue matcher
  })

  test("allows the user to toggle greyscale mode", async () => {
    await act(async () => {
      render(<EditImagePage />)
    })

    const greyscaleToggle = screen.getByLabelText(/Greyscale/)

    fireEvent.click(greyscaleToggle)
    expect(greyscaleToggle).toBeChecked()

    fireEvent.click(greyscaleToggle)
    expect(greyscaleToggle).not.toBeChecked()
  })

  test("allows the user to apply blur effect", async () => {
    await act(async () => {
      render(<EditImagePage />)
    })

    const blurSlider = screen.getByLabelText(/Blur/)

    fireEvent.change(blurSlider, { target: { value: "5" } })
    expect(blurSlider).toHaveValue(5) // Updated to use toHaveValue matcher
  })

  // The following tests need updates based on the new component structure

  test("updates image source URL when edits are applied", async () => {
    await act(async () => {
      render(<EditImagePage />)
    })

    // After component loads, change some settings
    const widthInput = screen.getByLabelText(/Width/)
    const heightInput = screen.getByLabelText(/Height/)
    const greyscaleToggle = screen.getByLabelText(/Greyscale/)

    fireEvent.change(widthInput, { target: { value: "600" } })
    fireEvent.change(heightInput, { target: { value: "400" } })
    fireEvent.click(greyscaleToggle)

    // The image src should now contain the updated dimensions and grayscale parameter
    const image = screen.getByAltText(/Image by Author 1/)
    expect(image.getAttribute("src")).toContain("600/400")
    expect(image.getAttribute("src")).toContain("grayscale")
  })

  test("persists image edits after refreshing the page", async () => {
    // Set the initial values for the image settings
    localStorage.setItem(
      "image-1-settings",
      JSON.stringify({ width: 600, height: 400, greyscale: true, blur: 5 })
    )

    await act(async () => {
      render(<EditImagePage />)
    })

    // Wait for the image to load
    const image = screen.getByAltText(/Image by Author 1/)
    expect(image).toBeInTheDocument()

    // Check if the persisted settings (width, height, etc.) are applied
    expect(screen.getByLabelText(/Width/)).toHaveValue(600)
    expect(screen.getByLabelText(/Height/)).toHaveValue(400)
    expect(screen.getByLabelText(/Greyscale/)).toBeChecked()
    expect(screen.getByLabelText(/Blur/)).toHaveValue(5)
  })

  test("navigates back to the image gallery", async () => {
    const mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })

    await act(async () => {
      render(<EditImagePage />)
    })

    // Simulate click on the 'Back to Gallery' button
    fireEvent.click(screen.getByText(/Back to Gallery/))

    // Check if the push method was called to navigate back to the gallery
    expect(mockPush).toHaveBeenCalledWith("/")
  })
})
