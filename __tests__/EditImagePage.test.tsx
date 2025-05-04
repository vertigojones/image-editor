import { render, screen, fireEvent, act } from "@testing-library/react"
import EditImagePage from "../app/edit/[id]/page"
import { useRouter } from "next/navigation"

// --- Suppress React warnings during tests ---
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((msg, ...args) => {
    const ignored = [
      "Received `true` for a non-boolean attribute `priority`",
      "Received `true` for a non-boolean attribute `fill`",
    ]
    if (typeof msg === "string" && ignored.some((text) => msg.includes(text))) {
      return
    }
    // Optional: re-enable unhandled logs
    // console.error(msg, ...args)
  })
})

// Mock router and params
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(() => ({ id: "1" })),
}))

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, priority, ...rest } = props
    return <img {...rest} />
  },
}))

// Mock fetch for image data
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({
        id: 1,
        author: "Author 1",
        download_url: "https://picsum.photos/id/1/500/500",
        width: 500,
        height: 300,
      }),
  })
) as jest.Mock

describe("EditImagePage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
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
    fireEvent.change(screen.getByLabelText(/Width/), {
      target: { value: "600" },
    })
    fireEvent.change(screen.getByLabelText(/Height/), {
      target: { value: "400" },
    })
    expect(screen.getByLabelText(/Width/)).toHaveValue(600)
    expect(screen.getByLabelText(/Height/)).toHaveValue(400)
  })

  test("allows the user to toggle greyscale mode", async () => {
    await act(async () => {
      render(<EditImagePage />)
    })
    const checkbox = screen.getByLabelText(/Greyscale/)
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  test("allows the user to apply blur effect", async () => {
    await act(async () => {
      render(<EditImagePage />)
    })
    const slider = screen.getByRole("slider")
    fireEvent.change(slider, { target: { value: "5" } })
    expect(slider).toHaveValue("5") // it's a string in DOM
  })

  test("updates image source URL when edits are applied", async () => {
    await act(async () => {
      render(<EditImagePage />)
    })
    fireEvent.click(screen.getByLabelText(/Greyscale/))
    fireEvent.change(screen.getByLabelText(/Width/), {
      target: { value: "600" },
    })
    fireEvent.change(screen.getByLabelText(/Height/), {
      target: { value: "400" },
    })
    fireEvent.change(screen.getByRole("slider"), { target: { value: "5" } })

    const image = screen.getByAltText(/Image by Author 1/)
    const src = image.getAttribute("src") || ""
    expect(src).toContain("600/400")
    expect(src).toContain("grayscale")
    expect(src).toContain("blur=5")
  })

  test("persists image edits after refreshing the page", async () => {
    localStorage.setItem(
      "image-1-settings",
      JSON.stringify({ width: 600, height: 400, greyscale: true, blur: 5 })
    )

    await act(async () => {
      render(<EditImagePage />)
    })

    expect(screen.getByLabelText(/Width/)).toHaveValue(600)
    expect(screen.getByLabelText(/Height/)).toHaveValue(400)
    expect(screen.getByLabelText(/Greyscale/)).toBeChecked()
    expect(screen.getByRole("slider")).toHaveValue("5")
  })

  test("navigates back to the image gallery", async () => {
    const mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })

    await act(async () => {
      render(<EditImagePage />)
    })

    fireEvent.click(screen.getByText(/Back to Gallery/))
    expect(mockPush).toHaveBeenCalledWith("/")
  })
})
