"use client";

import GifCycler from "@/components/GifCycler";

export default function Home() {
  return (
    <div className="pt-16 w-full h-full">
      <GifCycler
        gifs={[
          "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWRpd25yYzBuZGtiOWR6d3JuOTF5eHB5NWNsMzdmdnpxbzg5a3U4cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0K423YWdCvHeemsg/giphy.gif",
          "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHJ0aDJjMDkwZmQwbXphdzF2ZzRtb2FzYmh1dHJxb2JoaHQxeWIwYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0K4fw32ZXp6pRlAc/giphy.gif",
          "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbng2YmplOXRnNW9xbTNiMTNoYjI1cGE3OXh4Y3VyeWthZG9jdWFwdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7abKaxXEFyGRxWcE/giphy.gif",
        ]}
      />
    </div>
  );
}
