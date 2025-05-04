"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const HomePage = () => {
  const [images, setImages] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://picsum.photos/v2/list?page=${page}&limit=12`
        )
        const data = await response.json()
        setImages(data)
      } catch (error) {
        console.error("Error fetching images:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [page])

  const handlePagination = (direction: string) => {
    if (direction === "next") {
      setPage(page + 1)
      window.scrollTo(0, 0)
    } else if (direction === "previous" && page > 1) {
      setPage(page - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleImageClick = (id: number) => {
    router.push(`/edit/${id}`)
  }

  // Carousel scrolling
  const scrollLeft = () => {
    const container = document.getElementById("image-carousel")
    if (container) {
      container.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    const container = document.getElementById("image-carousel")
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <main className="min-h-screen w-full py-8 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-foreground">
          Image Gallery
        </h1>

        {/* Horizontal Carousel */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Horizontal Carousel
            </h2>
            <div className="flex gap-2">
              <button
                onClick={scrollLeft}
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                aria-label="Scroll left"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={scrollRight}
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                aria-label="Scroll right"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div
              id="image-carousel"
              className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {images.map((image) => (
                <div
                  key={image.id}
                  onClick={() => handleImageClick(image.id)}
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
                    <p className="text-foreground font-medium truncate">
                      By: {image.author}
                    </p>
                    <p className="text-foreground/70 text-sm mt-1">
                      ID: {image.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center gap-4 py-4">
          <button
            onClick={() => handlePagination("previous")}
            disabled={page <= 1 || loading}
            className={`px-4 py-2 rounded font-medium ${
              page <= 1 || loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            }`}
          >
            Previous Page
          </button>
          <span className="flex items-center px-4 py-2 bg-gray-100 rounded text-foreground">
            Page {page}
          </span>
          <button
            onClick={() => handlePagination("next")}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition-colors"
          >
            Next Page
          </button>
        </div>
      </div>
    </main>
  )
}

export default HomePage
