"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import type { ImageData } from "../../../types/image"

/**
 * EditImagePage Component
 * Allows users to:
 * - View a selected image
 * - Modify dimensions, greyscale, and blur
 * - Preview the edited image live
 * - Persist settings via localStorage
 * - Download the transformed image
 */
const EditImagePage = () => {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string // Extract image ID from route

  // --- Editable state for image and settings ---
  const [image, setImage] = useState<ImageData | null>(null)
  const [width, setWidth] = useState(500)
  const [height, setHeight] = useState(300)
  const [greyscale, setGreyscale] = useState(false)
  const [blur, setBlur] = useState(0)
  const [loading, setLoading] = useState(true)

  /**
   * Fetch the selected image details
   * and restore any saved settings on mount
   */
  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true)
      try {
        const response = await fetch(`https://picsum.photos/id/${id}/info`)
        const data = await response.json()
        setImage(data)
      } catch (error) {
        console.error("Error fetching image:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchImage()

      const savedSettings = localStorage.getItem(`image-${id}-settings`)
      if (savedSettings) {
        const { width, height, greyscale, blur } = JSON.parse(savedSettings)
        setWidth(width)
        setHeight(height)
        setGreyscale(greyscale)
        setBlur(blur)
      }
    }
  }, [id])

  /**
   * Construct a filtered image URL
   * based on user-selected parameters
   */
  const applyFilters = () => {
    let url = `https://picsum.photos/id/${id}/${width}/${height}`
    if (greyscale) url += "?grayscale"
    if (blur > 0) url += `${greyscale ? "&" : "?"}blur=${blur}`
    return url
  }

  /**
   * Persist settings to localStorage on change
   */
  useEffect(() => {
    const saveSettingsToLocalStorage = () => {
      const settings = { width, height, greyscale, blur }
      localStorage.setItem(`image-${id}-settings`, JSON.stringify(settings))
    }

    saveSettingsToLocalStorage()
  }, [width, height, greyscale, blur, id])

  /**
   * Create a canvas, draw the image, and export as a download
   */
  const handleDownload = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = document.createElement("img")

    img.crossOrigin = "anonymous"
    img.src = applyFilters()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)

      const dataUrl = canvas.toDataURL("image/jpeg")
      const a = document.createElement("a")
      a.href = dataUrl
      a.download = `edited-image-${id}.jpg`
      a.click()
    }

    img.onerror = () => {
      alert("Failed to load image for download. Please try again.")
    }
  }

  // Return to the homepage
  const handleBackToGallery = () => {
    router.push("/")
  }

  // --- Loading state ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  // --- Error state ---
  if (!image) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Image Not Found
          </h2>
          <p className="text-foreground mb-4">
            The requested image could not be loaded.
          </p>
          <button
            onClick={handleBackToGallery}
            className="px-4 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition-colors"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    )
  }

  // --- Main render ---
  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* --- Header & Navigation --- */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBackToGallery}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Gallery
          </button>
          <h1 className="text-3xl font-bold text-center mb-6 text-foreground">
            Edit Image Page
          </h1>
          <div className="w-24" /> {/* Spacer to balance layout */}
        </div>

        {/* --- Main Content: Image + Editor --- */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- Image Preview --- */}
          <div className="lg:w-2/3 flex flex-col">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
              <div
                className="relative w-full"
                style={{ height: `${Math.min(600, height)}px` }}
              >
                <Image
                  src={applyFilters()}
                  alt={`Image by ${image.author}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-contain rounded"
                  priority
                />
              </div>
            </div>

            {/* --- Author Info + Download Button --- */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    By: {image.author}
                  </h3>
                  <p className="text-sm text-foreground/70">
                    Original dimensions: {image.width} x {image.height}
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Edited Image
                </button>
              </div>
            </div>
          </div>

          {/* --- Control Panel --- */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-6 text-foreground">
                Edit Settings
              </h2>

              <div className="space-y-6">
                {/* --- Size Inputs --- */}
                <div>
                  <h3 className="text-sm font-medium text-foreground/80 mb-2">
                    Dimensions
                  </h3>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label htmlFor="width-input" className="block mb-1">
                        Width
                      </label>
                      <input
                        id="width-input"
                        type="number"
                        min="100"
                        max="1200"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Width"
                      />
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="height-input" className="block mb-1">
                        Height
                      </label>
                      <input
                        id="height-input"
                        type="number"
                        min="100"
                        max="1200"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Height"
                      />
                    </div>
                  </div>
                </div>

                {/* --- Filters: Greyscale + Blur --- */}
                <div>
                  <h3 className="text-sm font-medium text-foreground/80 mb-2">
                    Filters
                  </h3>

                  {/* Greyscale toggle switch */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <label className="flex items-center cursor-pointer">
                      <span className="mr-3 text-foreground">Greyscale</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={greyscale}
                          onChange={(e) => setGreyscale(e.target.checked)}
                          className="sr-only"
                          aria-label="Greyscale"
                        />
                        <div
                          className={`block w-10 h-6 rounded-full ${
                            greyscale ? "bg-indigo-600" : "bg-gray-300"
                          }`}
                        />
                        <div
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            greyscale ? "transform translate-x-4" : ""
                          }`}
                        />
                      </div>
                    </label>
                  </div>

                  {/* Blur slider */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-foreground">Blur</label>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {blur}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={blur}
                      onChange={(e) => setBlur(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      aria-label="Blur"
                    />
                    <div className="flex justify-between text-xs text-foreground/60 mt-1">
                      <span>0</span>
                      <span>5</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>

                {/* --- Preset Buttons --- */}
                <div>
                  <h3 className="text-sm font-medium text-foreground/80 mb-2">
                    Quick Presets
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setWidth(500)
                        setHeight(300)
                        setGreyscale(false)
                        setBlur(0)
                      }}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                    >
                      Original
                    </button>
                    <button
                      onClick={() => {
                        setGreyscale(true)
                        setBlur(0)
                      }}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                    >
                      Black & White
                    </button>
                    <button
                      onClick={() => {
                        setWidth(800)
                        setHeight(600)
                      }}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                    >
                      Large (4:3)
                    </button>
                    <button
                      onClick={() => {
                        setWidth(1080)
                        setHeight(1080)
                      }}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                    >
                      Square (1:1)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default EditImagePage
