"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"

const EditImagePage = () => {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string // Get id from useParams hook

  const [image, setImage] = useState<any>(null)
  const [width, setWidth] = useState(500)
  const [height, setHeight] = useState(300)
  const [greyscale, setGreyscale] = useState(false)
  const [blur, setBlur] = useState(0)

  useEffect(() => {
    const fetchImage = async () => {
      const response = await fetch(`https://picsum.photos/id/${id}/info`)
      const data = await response.json()
      setImage(data)
    }

    if (id) {
      fetchImage()
    }

    // Load persisted settings from localStorage if available
    const savedSettings = localStorage.getItem(`image-${id}-settings`)
    if (savedSettings) {
      const { width, height, greyscale, blur } = JSON.parse(savedSettings)
      setWidth(width)
      setHeight(height)
      setGreyscale(greyscale)
      setBlur(blur)
    }
  }, [id])

  // Apply filters and size to the image
  const applyFilters = () => {
    let url = `https://picsum.photos/id/${id}/${width}/${height}`
    if (greyscale) {
      url += "?grayscale"
    }
    if (blur > 0) {
      url += `${greyscale ? "&" : "?"}blur=${blur}`
    }
    return url
  }

  // Save current settings to localStorage
  const saveSettingsToLocalStorage = () => {
    const settings = { width, height, greyscale, blur }
    localStorage.setItem(`image-${id}-settings`, JSON.stringify(settings))
  }

  // Handle download of the edited image
  const handleDownload = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = document.createElement("img") as HTMLImageElement
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
  }

  const handleBackToGallery = () => {
    router.push("/")
  }

  useEffect(() => {
    saveSettingsToLocalStorage() // Persist settings whenever they change
  }, [width, height, greyscale, blur])

  if (!image) return <div>Loading...</div>

  return (
    <div>
      <h1>Edit Image</h1>
      <div>
        <div
          style={{
            position: "relative",
            width: `${width}px`,
            height: `${height}px`,
          }}
        >
          <Image
            src={applyFilters()}
            alt={`Image by ${image.author}`}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <p>By: {image.author}</p>
      </div>
      <div>
        <label>
          Width:
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </label>
        <label>
          Height:
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </label>
        <label>
          Greyscale:
          <input
            type="checkbox"
            checked={greyscale}
            onChange={(e) => setGreyscale(e.target.checked)}
          />
        </label>
        <label>
          Blur (0-10):
          <input
            type="number"
            min="0"
            max="10"
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
          />
        </label>
        <button onClick={handleDownload}>Download Edited Image</button>
        <button onClick={handleBackToGallery}>Back to Gallery</button>
      </div>
    </div>
  )
}

export default EditImagePage
