import { useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import { useTranslation } from "../i18n/useTranslation"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"

function Login() {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields")
      return
    }
    
    setLoading(true)
    try {
      const response = await api.post("/login", {
        email,
        password
      })

      // Fix: Store user state in localStorage BEFORE navigating!
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      )

      alert(response.data.message || t.login)
      window.location.href = "/dashboard"

    } catch (error) {
      if (error.response) {
        alert(error.response.data.detail)
      } else {
        alert(t.serverError)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background neon meshes */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 dark:opacity-20 bg-mesh-light dark:bg-mesh-dark" />

      {/* Decorative Glow Orb */}
      <div className="w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl absolute -top-12 -left-12 -z-10" />
      <div className="w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl absolute -bottom-12 -right-12 -z-10" />

      <Card className="relative z-10 glass-panel p-8 md:p-12 w-full max-w-[420px] shadow-2xl flex flex-col space-y-6">
        
        {/* Title */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20 mx-auto mb-4">
            FS
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            {t.login}
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
            Welcome back to FormSahayak Multilingual AI
          </p>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <label htmlFor="login-email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.email}
            </label>
            <input
              id="login-email"
              type="email"
              placeholder={t.enterEmail}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-[15px] dark:text-slate-200"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="login-password" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              placeholder={t.enterPassword}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-[15px] dark:text-slate-200"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t.processing}</span>
            </>
          ) : (
            t.login
          )}
        </Button>

        {/* Links */}
        <div className="flex justify-between text-sm font-semibold text-blue-600 dark:text-blue-400 pt-2 border-t border-slate-100 dark:border-white/5">
          <Link to="/forgot-password" className="hover:underline">
            {t.forgotPassword}
          </Link>
          <Link to="/signup" className="hover:underline">
            {t.register}
          </Link>
        </div>

      </Card>

    </div>
  )
}

export default Login