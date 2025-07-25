"use client";
import { Suspense } from "react";
import KeyButton from "./KeyButton";

export default function KeyButtonWithSuspense() {
  return (
    <Suspense>
      <KeyButton />
    </Suspense>
  );
}
