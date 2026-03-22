"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      theme="dark"
      toastOptions={{
        style: {
          background: "#171717",
          border: "1px solid rgba(0,245,212,0.18)",
          color: "#f5f7fb",
        },
      }}
    />
  );
}
