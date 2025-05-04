"use client"

import Image from "next/image"
import type { ImageData } from "../../types/image"

type Props = {
  image: ImageData
  onClick: (id: string | number) => void
}

const ImageCard = ({ image, onClick }: Props) => (
  <div
    onClick={() => onClick(image.id)}
    data-testid={`carousel-image-${image.id}`}
    className="flex-shrink-0 w-64 snap-start bg-background border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
  >
    <div className="relative h-40 w-full">
      <Image
        src={image.download_url}
        alt={`Image by ${image.author}`}
        fill
        sizes="(max-width: 768px) 100vw, 16rem"
        className="object-cover"
      />
    </div>
    <div className="p-3">
      <p className="text-foreground font-medium truncate">By: {image.author}</p>
      <p className="text-foreground/70 text-sm mt-1">ID: {image.id}</p>
    </div>
  </div>
)

export default ImageCard
