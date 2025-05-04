import type { ImageData } from "./image"

export interface CarouselProps {
  images: ImageData[]
  onImageClick: (id: string | number) => void
}
