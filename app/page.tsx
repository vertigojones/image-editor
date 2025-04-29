"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const HomePage = () => {
  const [images, setImages] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const router = useRouter() // Initialize router

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch(
        `https://picsum.photos/v2/list?page=${page}&limit=10`
      )
      const data = await response.json()
      setImages(data)
    }

    fetchImages()
  }, [page])

  const handlePagination = (direction: string) => {
    if (direction === "next") {
      setPage(page + 1)
    } else if (direction === "previous" && page > 1) {
      setPage(page - 1)
    }
  }

  const handleImageClick = (id: number) => {
    router.push(`/edit/${id}`) // Navigate to the edit page for the clicked image
  }

  return (
    <div>
      <h1>Image Gallery</h1>
      <div>
        {images.map((image) => (
          <div
            key={image.id}
            onClick={() => handleImageClick(image.id)}
            data-testid={`image-container-${image.id}`} // Add test ID for easier testing
          >
            <Image
              src={image.download_url}
              alt={`Image by ${image.author}`}
              width={500}
              height={300}
            />
            <p>By: {image.author}</p>
          </div>
        ))}
      </div>
      <div>
        <button onClick={() => handlePagination("previous")}>Previous</button>
        <button onClick={() => handlePagination("next")}>Next</button>
      </div>
    </div>
  )
}

export default HomePage
