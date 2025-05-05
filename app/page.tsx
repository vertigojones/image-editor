"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { ImageData } from "../types/image"
import { fetchImages, scrollCarousel } from "../utils/image-utils"
import ImageCard from "./components/ImageCard"
import { HomePageSkeleton } from "./components/HomePageSkeleton"

/**
 * HomePage Component
 * - Fetches and displays a paginated image gallery.
 * - Provides a horizontal carousel for browsing images.
 * - Supports image editing via navigation to the Edit page.
 */
const HomePage = () => {
  // --- Local state ---
  const [images, setImages] = useState<ImageData[]>([])
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()

  // --- Fetch images from API on page change ---
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true)
      try {
        const data = await fetchImages(page)
        setImages(data)
      } catch (error) {
        console.error("Error fetching images:", error)
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [page])

  /**
   * Updates the pagination page state.
   * Scrolls to top after page change.
   */
  const handlePagination = (direction: "next" | "previous") => {
    if (direction === "next") {
      setPage((prev) => prev + 1)
      window.scrollTo(0, 0)
    } else if (direction === "previous" && page > 1) {
      setPage((prev) => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  /**
   * Handles navigation to the image editing page.
   */
  const handleImageClick = (id: string | number) => {
    router.push(`/edit/${id}`)
  }

  return (
    <main className="min-h-screen w-full py-8 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* --- Page Header --- */}
        <h1 className="text-3xl font-bold text-center mb-6 text-foreground">
          Image Gallery Page
        </h1>

        {/* --- Image Carousel Section --- */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Gallery Carousel
            </h2>

            {/* --- Carousel navigation buttons --- */}
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel("left")}
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                aria-label="Scroll left"
              >
                {/* Left Arrow */}
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
                onClick={() => scrollCarousel("right")}
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                aria-label="Scroll right"
              >
                {/* Right Arrow */}
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

          {/* --- Carousel Content or Skeleton Loader --- */}
          <div
            id="image-carousel"
            className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading
              ? Array.from({ length: 12 }).map((_, index) => (
                  <HomePageSkeleton key={`skeleton-${index}`} />
                ))
              : images.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    onClick={handleImageClick}
                  />
                ))}
          </div>
        </div>

        {/* --- Pagination Controls --- */}
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
