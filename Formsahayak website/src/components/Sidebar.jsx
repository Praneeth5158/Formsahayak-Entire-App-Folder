import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "../i18n/useTranslation"
import { useDarkMode } from "./DarkModeProvider"
import { useState } from "react"

function Sidebar() {
  const { t } = useTranslation()
  const { isDarkMode, toggleTheme } = useDarkMode()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem("user"))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    {
      path: "/dashboard",
      label: t.dashboard,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    {
      path: "/upload",
      label: t.upload,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      )
    },
    {
      path: "/history",
      label: t.history,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      path: "/profile",
      label: t.profile,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      path: "/settings",
      label: t.settings || "Settings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      path: "/feedback",
      label: t.feedback,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    }
  ]

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  const userImage = localStorage.getItem("profileImage") || "https://cdn-icons-png.flaticon.com/512/149/149071.png"

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[280px] h-screen fixed left-0 top-0 bg-white/80 dark:bg-[#070b13]/85 border-r border-slate-200 dark:border-white/10 p-6 shadow-xl transition-all duration-300 backdrop-blur-xl z-40">
        
        {/* Brand */}
        <div className="flex items-center gap-3 py-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30">
            FS
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Formsahayak
            </h1>
            <span className="text-[10px] tracking-widest uppercase font-bold text-slate-400 dark:text-slate-500">
              Multilingual AI
            </span>
          </div>
        </div>

        {/* User profile capsule */}
        {user && (
          <div className="mt-8 mb-6 p-3 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex items-center gap-3">
            <img 
              src={userImage} 
              alt="avatar" 
              className="w-10 h-10 rounded-full object-cover border border-blue-500/20"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate dark:text-slate-200">
                {user.name}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex flex-col gap-2 mt-4 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-medium transition-all duration-300 group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10 active-nav-glow"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-blue-500"}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Panel (Theme Toggle & Logout) */}
        <div className="mt-auto pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col gap-4">
          
          {/* Quick Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition duration-300 border border-slate-200/50 dark:border-white/5 cursor-pointer"
            aria-label="Toggle dark/light theme"
          >
            <span className="text-sm font-medium">{t.themeMode || "Interface Theme"}</span>
            {isDarkMode ? (
              <span className="text-yellow-400">☀️</span>
            ) : (
              <span className="text-indigo-600">🌙</span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-red-500/10 dark:bg-red-500/5 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all duration-300 shadow-sm border border-red-500/20 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {t.logout}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation & Header */}
      <div className="md:hidden block z-40">
        
        {/* Mobile Header Bar */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-[#070b13]/85 border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-6 z-40 backdrop-blur-xl shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
              FS
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Formsahayak
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200/50 dark:border-white/5 cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl bg-red-500/10 dark:bg-red-500/5 text-red-500 flex items-center justify-center border border-red-500/10 cursor-pointer"
              aria-label="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* Spacer for top header */}
        <div className="h-16"></div>

        {/* Bottom Nav Bar */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#070b13]/95 border-t border-slate-200 dark:border-white/10 flex justify-around items-center px-2 py-1 shadow-2xl z-40 backdrop-blur-xl">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all duration-200 rounded-xl ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 font-bold"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <span className={`transition-transform duration-200 ${isActive ? "scale-110" : "scale-100"}`}>
                  {item.icon}
                </span>
                <span className="text-[10px] mt-1 tracking-tight truncate max-w-[64px]">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Spacer for bottom navigation */}
        <div className="h-16"></div>
      </div>
    </>
  )
}

export default Sidebar
