"use client";

import { useContentful } from "@/utils/hooks";

export default function Home() {
  const look = useContentful("photoEssay");
  console.log("JLEE look", look);
  return <div>HOMEMEMMMEMEMEMEME</div>;
}
