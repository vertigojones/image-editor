// Import jest-dom to extend the jest matchers
import "@testing-library/jest-dom"

// Mocking next/image to avoid issues with Next.js Image component
jest.mock("next/image", () => {
  return {
    __esModule: true, // This is important for mocking ES Modules
    default: (props: any) => <img {...props} />, // Simply render a regular <img> element for testing
  }
})

// Mocking the global fetch function
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: "OK",
    headers: new Headers({ "Content-Type": "application/json" }),
    redirected: false,
    type: "basic",
    url: "https://picsum.photos/v2/list",
    clone: jest.fn(),
    body: null, // No body content needed for the mock
    bodyUsed: false,
    arrayBuffer: jest.fn(),
    json: () =>
      Promise.resolve([
        {
          id: 1,
          author: "Author 1",
          download_url: "https://picsum.photos/id/1/500/500",
        },
        {
          id: 2,
          author: "Author 2",
          download_url: "https://picsum.photos/id/2/500/500",
        },
        // More images if needed
      ]),
    text: jest.fn().mockResolvedValue(""),
    blob: jest.fn().mockResolvedValue(new Blob([])),
    formData: jest.fn().mockResolvedValue(new FormData()),
    bytes: jest.fn().mockResolvedValue(new Uint8Array()),
  } as Response)
)
