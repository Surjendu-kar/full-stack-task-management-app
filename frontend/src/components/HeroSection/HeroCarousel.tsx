import { useState, useEffect } from "react";

const images = [
  "/hero-section-img/hero1.jpg",
  "/hero-section-img/hero2.jpg",
  "/hero-section-img/hero3.jpg",
  "/hero-section-img/hero4.jpg",
];

const SLIDE_DURATION = 3000;

export default function HeroCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [localInterval, setLocalInterval] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, SLIDE_DURATION);

    setLocalInterval(interval);

    return () => clearInterval(interval);
  }, [isLoaded]);

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
    if (localInterval) {
      clearInterval(localInterval);
    }
  };

  return (
    <div className="w-[700px] h-[400px] relative overflow-hidden rounded-xl">
      {images.map((img, index) => (
        <img
          key={img}
          src={img}
          alt={`Hero image ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => {
            setIsLoaded(true);
          }}
        />
      ))}

      {/* Navigation Dots */}
      {isLoaded && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 ${
                index === currentImageIndex
                  ? "bg-white scale-110 w-4"
                  : "bg-white/50 hover:bg-white/70 w-2"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* shimmer effect */}
      {!isLoaded && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-200 animate-pulse"></div>
      )}
    </div>
  );
}
