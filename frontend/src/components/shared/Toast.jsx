import * as React from "react"
import { Toaster as Sonner } from "sonner"

export default function Toaster() {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        style: {
          background: "#162A3E",
          borderColor: "#2A4A6B",
          color: "#F0ECE3"
        },
        classNames: {
          toast: "group toast bg-surface border-border-subtle text-text-primary shadow-lg rounded-md",
          description: "group-[.toast]:text-text-secondary text-xs",
          actionButton: "group-[.toast]:bg-secondary group-[.toast]:text-bg",
          cancelButton: "group-[.toast]:bg-surface-light group-[.toast]:text-text-secondary"
        }
      }}
      position="bottom-right"
      closeButton
    />
  )
}
