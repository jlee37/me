"use client";
import { Suspense } from "react";
import Sidebar, { SidebarProps } from "./Sidebar";

export default function SidebarWithSuspense(props: SidebarProps) {
  return (
    <Suspense>
      <Sidebar {...props} />
    </Suspense>
  );
}
