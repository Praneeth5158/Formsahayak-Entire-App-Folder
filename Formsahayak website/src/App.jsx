import { Routes, Route, Link } from "react-router-dom"
import Profile from "./pages/Profile"
import History from "./pages/History"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Upload from "./pages/Upload"
import ForgotPassword from "./pages/ForgotPassword"
import Feedback from "./pages/Feedback"
import FormDetails from "./pages/FormDetails"
import Settings from "./pages/Settings"
import Sidebar from "./components/Sidebar"
import { DarkModeProvider, useDarkMode } from "./components/DarkModeProvider"
import { useTranslation } from "./i18n/useTranslation"

// Shared layout shell for all authenticated app pages
function AppLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 w-full p-4 md:p-10 md:pl-[320px] overflow-y-auto">
        <div className="max-w-6xl mx-auto animate-fade-in-up">
          {children}
        </div>
      </main>
    </div>
  )
}

function Home() {
  const { t } = useTranslation()
  const { isDarkMode, toggleTheme } = useDarkMode()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background neon grids */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20 bg-mesh-light dark:bg-mesh-dark" />

      {/* Navbar */}
      <nav className="relative z-10 glass-panel bg-white/70 dark:bg-slate-950/70 backdrop-blur-md px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 border-b border-slate-200/50 dark:border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-500/20">
            FS
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Formsahayak
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="hidden sm:inline-block text-slate-600 dark:text-slate-300 font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition">
            {t.home}
          </Link>
          <Link to="/login" className="text-slate-600 dark:text-slate-300 font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition px-3 py-2">
            {t.login}
          </Link>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200/50 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition"
          >
            {t.register}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center pt-24 pb-36 px-6 max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Glow accent */}
        <div className="w-72 h-72 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl absolute top-12 left-1/2 -translate-x-1/2 -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/5 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
          ✨ Premium Multilingual Guidance Platform
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
          {t.heroTitle}
        </h1>

        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
          {t.heroSubtitle}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
          <Link
            to="/register"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition text-center"
          >
            {t.getStarted}
          </Link>

          <Link
            to="/login"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 font-bold px-8 py-4 rounded-2xl text-lg transition text-center shadow-sm"
          >
            {t.login}
          </Link>
        </div>
      </section>

    </div>
  )
}

function MainAppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Authenticated Pages wrapped in AppLayout */}
      <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
      <Route path="/upload" element={<AppLayout><Upload /></AppLayout>} />
      <Route path="/history" element={<AppLayout><History /></AppLayout>} />
      <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
      <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
      <Route path="/feedback" element={<AppLayout><Feedback /></AppLayout>} />
      <Route path="/form-details/:id" element={<AppLayout><FormDetails /></AppLayout>} />
    </Routes>
  )
}

function App() {
  return (
    <DarkModeProvider>
      <MainAppRoutes />
    </DarkModeProvider>
  )
}

export default App