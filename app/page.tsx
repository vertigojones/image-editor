import Link from "next/link"

export default function HomePage() {
  const images = [
    { id: 1, author: "Author 1", url: "https://picsum.photos/200" },
    { id: 2, author: "Author 2", url: "https://picsum.photos/200" },
    // Add more images here
  ]

  return (
    <div>
      <h1>Image Gallery</h1>
      <ul>
        {images.map((image) => (
          <li key={image.id}>
            <img src={image.url} alt={`Image by ${image.author}`} />
            <p>By: {image.author}</p>
            <Link href={`/edit/${image.id}`}>Edit Image</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
