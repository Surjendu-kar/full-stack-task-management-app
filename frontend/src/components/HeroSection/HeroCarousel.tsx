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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, []);

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
        />
      ))}
    </div>
  );
}
