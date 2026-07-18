import * as React from "react"
import { cn } from "@/lib/utils"

export default function ProductImageGallery({ images = [] }) {
  const [activeImage, setActiveImage] = React.useState(images[0] || 'https://picsum.photos/600/450?random=1')

  // Sync state if images change (e.g. from async loading)
  React.useEffect(() => {
    if (images.length > 0) {
      setActiveImage(images[0])
    }
  }, [images])

  if (images.length === 0) {
    return (
      <div className="aspect-video w-full rounded-lg bg-surface-light shimmer-bg flex items-center justify-center border border-border-subtle">
        <span className="text-text-secondary text-sm">No Images Available</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Large Main Image Display */}
      <div className="aspect-square w-full rounded-lg overflow-hidden border border-border-subtle bg-surface-light relative">
        <img
          src={activeImage}
          alt="Active product display"
          className="h-full w-full object-cover transition-all duration-300 animate-fade-in"
        />
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(img)}
              className={cn(
                "h-20 w-20 rounded-md overflow-hidden border bg-surface-light cursor-pointer focus:outline-none transition-all",
                activeImage === img
                  ? "border-secondary ring-2 ring-secondary/20 scale-95"
                  : "border-border-subtle hover:border-text-secondary"
              )}
            >
              <img
                src={img}
                alt={`Thumbnail display ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
