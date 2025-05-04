import type { ImageData } from "../types/image"

/**
 * Fetches a paginated list of images from the Picsum API.
 *
 * @param page - The page number to retrieve.
 * @returns A promise that resolves to an array of `ImageData` objects.
 * @throws An error if the API response is not OK.
 */
export const fetchImages = async (page: number): Promise<ImageData[]> => {
  const response = await fetch(
    `https://picsum.photos/v2/list?page=${page}&limit=12`
  )
  if (!response.ok) {
    throw new Error("Failed to fetch images")
  }
  const data = await response.json()
  return data as ImageData[]
}

/**
 * Scrolls the horizontal image carousel in the given direction.
 *
 * @param direction - The direction to scroll: `"left"` or `"right"`.
 * @remarks
 * This function assumes the container has the ID `image-carousel`.
 * Scrolling is animated smoothly by 300 pixels.
 */
export const scrollCarousel = (direction: "left" | "right") => {
  const container = document.getElementById("image-carousel")
  if (container) {
    const distance = direction === "left" ? -300 : 300
    container.scrollBy({ left: distance, behavior: "smooth" })
  }
}
