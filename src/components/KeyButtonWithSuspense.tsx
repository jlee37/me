"use client";
import { Suspense } from "react";
import KeyButton from "./KeyButton";

export default function KeyButtonWithSuspense(props: any) {
  return (
    <Suspense fallback={null}>
      <KeyButton {...props} />
    </Suspense>
  );
}
