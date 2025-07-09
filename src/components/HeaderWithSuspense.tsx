"use client";
import { Suspense } from "react";
import Header from "./Header";

export default function HeaderWithSuspense() {
  return (
    <Suspense>
      <Header />
    </Suspense>
  );
}
