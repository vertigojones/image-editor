// Import jest-dom for extended assertions in tests
import "@testing-library/jest-dom"

// Mock next/image to avoid issues with Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />, // Simply render a regular <img> element for testing
}))

// Mock next/navigation to avoid navigation issues in tests
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useParams: jest.fn(() => ({
    id: "1", // Mocking id param
  })),
}))

// Mock global fetch
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  status: 200,
  json: () =>
    Promise.resolve({
      id: 1,
      author: "Author 1",
      download_url: "https://picsum.photos/id/1/500/500",
    }),
})
