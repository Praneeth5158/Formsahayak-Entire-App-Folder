import { createContext, useContext, useEffect, useState } from "react"

const DarkModeContext = createContext(undefined)

export function DarkModeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check local storage first, then system preference
    const saved = localStorage.getItem("theme")
    if (saved) return saved
    
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
    return systemPreference ? "dark" : "light"
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    if (theme === "dark") {
      root.classList.add("dark")
      root.style.colorScheme = "dark"
    } else {
      root.classList.remove("dark")
      root.style.colorScheme = "light"
    }
    
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  const isDarkMode = theme === "dark"

  return (
    <DarkModeContext.Provider value={{ theme, isDarkMode, toggleTheme, setTheme }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider")
  }
  return context
}
