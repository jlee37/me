import { useState, useEffect } from "react";

interface GifCyclerProps {
  gifs: string[];
  interval?: number; // Time in milliseconds
}

const GifCycler: React.FC<GifCyclerProps> = ({ gifs, interval = 2000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % gifs.length);
    }, interval);

    return () => clearInterval(timer);
  }, [gifs, interval]);

  return (
    <img
      src={gifs[index]}
      alt="Cycling GIF"
      className="w-[90%] h-[90%] object-cover rounded-lg shadow-lg"
    />
  );
};

export default GifCycler;
