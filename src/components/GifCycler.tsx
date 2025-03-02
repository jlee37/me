import { useState, useEffect } from "react";

// Updated GIFS array with lengthMs for each GIF
const GIFS: { url: string; lengthMs: number }[] = [
  {
    url: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWRpd25yYzBuZGtiOWR6d3JuOTF5eHB5NWNsMzdmdnpxbzg5a3U4cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0K423YWdCvHeemsg/giphy.gif",
    lengthMs: 2000,
  }, // Pilot
  {
    url: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXN4cmNybjdiaXhmeTdkZm94bGZrMDZ0a2RtZDZ3a2tzMm95M2ZndyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0K4hrwXJnW9RuBd6/giphy.gif",
    lengthMs: 2000,
  },
  {
    url: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHJ0aDJjMDkwZmQwbXphdzF2ZzRtb2FzYmh1dHJxb2JoaHQxeWIwYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0K4fw32ZXp6pRlAc/giphy.gif",
    lengthMs: 2000,
  }, // Running doll
  //   {
  //     url: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbng2YmplOXRnNW9xbTNiMTNoYjI1cGE3OXh4Y3VyeWthZG9jdWFwdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7abKaxXEFyGRxWcE/giphy.gif",
  //     lengthMs: 2500,
  //   }, // Faces

  {
    url: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWdrY2FpZjcwZjd6a2w5MGEwbDBwZmJuYnl3M2dlcWx5Z2h1eTN3cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7qDNQuLZ1gOCedQ4/giphy.gif",
    lengthMs: 2000,
  },
];

interface GifCyclerProps {
  interval?: number; // Time in milliseconds
}

const GifCycler: React.FC<GifCyclerProps> = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => {
        // Get the current gif's lengthMs and use it for the interval
        const nextIndex = (prevIndex + 1) % GIFS.length;
        return nextIndex;
      });
    }, GIFS[index].lengthMs); // Dynamically change interval based on current gif's lengthMs

    return () => clearInterval(timer);
  }, [index]); // Dependency array should track index to adjust the interval

  console.log("JLEE index", index);

  return (
    <img
      src={GIFS[index].url}
      alt="Cycling GIF"
      className="w-[90%] h-[90%] object-cover rounded-lg shadow-lg"
    />
  );
};

export default GifCycler;
