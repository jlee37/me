import { useState, useEffect } from "react";

// Updated GIFS array with lengthMs for each GIF
const GIFS: { url: string; lengthMs: number }[] = [
  // Pilot
  {
    url: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWRpd25yYzBuZGtiOWR6d3JuOTF5eHB5NWNsMzdmdnpxbzg5a3U4cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0K423YWdCvHeemsg/giphy.gif",
    lengthMs: 1800,
  },
  // Windows
  {
    url: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGh5dWp3MHNwcDdweWd2aDgzZHlwd2t1MXcxaDI3ZWh1MmI2aHNlOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/eLRO6NZiCrFDADqJHQ/giphy.gif",
    lengthMs: 2200,
  },
  // Running doll
  {
    url: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHJ0aDJjMDkwZmQwbXphdzF2ZzRtb2FzYmh1dHJxb2JoaHQxeWIwYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0K4fw32ZXp6pRlAc/giphy.gif",
    lengthMs: 5000,
  },
  // Geisha
  {
    url: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWdrY2FpZjcwZjd6a2w5MGEwbDBwZmJuYnl3M2dlcWx5Z2h1eTN3cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7qDNQuLZ1gOCedQ4/giphy.gif",
    lengthMs: 5000,
  },
  // Goodbye
  {
    url: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGk4NGFlZzJlMWVsbTZ1a2h3Z281ZG9idTZyNzRkdHk3cThwYWhpOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/v955sPT2tdBbaBBHFd/giphy.gif",
    lengthMs: 5000,
  },
  // // Exodia left arm
  // {
  //   url: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjQ2bGtsdHNxc2ozeTAzbTEweWp1dnYyOW01dTloZXV4b3VtYXlqdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LX0o9BYKg0rKIgFw8l/giphy.gif",
  //   lengthMs: 200,
  // },
  // // Exodia right arm
  // {
  //   url: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExazgwNGt3Z3RscXI5OXM3YjlxNDNkdjF2YTBva2t4Z2t6Z3lkaXQ4ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gC8JUYQDnuspgNmpfK/giphy.gif",
  //   lengthMs: 200,
  // },
  // // Exodia left leg
  // {
  //   url: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExczJoMjdqM3h6eHZwOXNzZmd1OHF4dTJnanZtbXZubWRycGMxMDE0NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lcyrPD0U5Fv4Xvs7wy/giphy.gif",
  //   lengthMs: 200,
  // },
  // {
  //   url: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2toZG9raDNmNHpoYzg2ZmJiazlkZ3V6bzNvZnY1bG85cHpidHUzeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/R53jUjenQFp8AvnzJs/giphy.gif",
  //   lengthMs: 200,
  // },
  // // Exodia head
  // {
  //   url: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWEwOHhoMGNiZTBxNmRwMThzcGkxdWhvN2sxOWd3dmJ1cndkdXk0YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YK1u5d1KSqrwIJojSt/giphy.gif",
  //   lengthMs: 1800,
  // },
  // Static
  {
    url: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHQ4MXliYzZ2N3h2dngyeHhnaHQ3NGwxMm12ZDFtOW40MjJxdDFuNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YRcXl6VfNhCorklI0R/giphy.gif",
    lengthMs: 500,
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

  return (
    <img
      src={GIFS[index].url}
      alt="Cycling GIF"
      className="w-[100%] h-[40%] md:h-[100%] object-cover rounded-lg shadow-lg"
    />
  );
};

export default GifCycler;

// Bank
// https://giphy.com/gifs/dreams-dreaming-van-gogh-oGM7oUhPctSqA
