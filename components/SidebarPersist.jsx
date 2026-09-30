import { useEffect } from "react"

const STORAGE_KEY = "pimo-nextra-sidebar"

function getToggleButton() {
  return document.querySelector(
    '.nextra-sidebar-footer button[title="Hide sidebar"], .nextra-sidebar-footer button[title="Show sidebar"]'
  )
}

/**
 * Remembers Nextra desktop sidebar expand/collapse across navigations.
 * Nextra keeps the toggle in React state only; this syncs it with localStorage.
 */
export function SidebarPersist() {
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "collapsed") {
      const button = getToggleButton()
      if (button?.getAttribute("title") === "Hide sidebar") {
        button.click()
      }
    }

    function onClick(event) {
      const button = event.target.closest?.(
        '.nextra-sidebar-footer button[title="Hide sidebar"], .nextra-sidebar-footer button[title="Show sidebar"]'
      )
      if (!button) return

      requestAnimationFrame(() => {
        const current = getToggleButton()
        if (!current) return
        const collapsed = current.getAttribute("title") === "Show sidebar"
        localStorage.setItem(STORAGE_KEY, collapsed ? "collapsed" : "expanded")
      })
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  return null
}
