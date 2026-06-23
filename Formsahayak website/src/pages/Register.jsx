import { useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import { useTranslation } from "../i18n/useTranslation"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"

function Register() {
  const { t } = useTranslation()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const response = await api.post("/signup", {
        name,
        email,
        password,
        confirm_password: confirmPassword
      })

      alert(response.data.message || t.register)
      window.location.href = "/login"

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

      <Card className="relative z-10 glass-panel p-8 md:p-10 w-full max-w-[440px] shadow-2xl flex flex-col space-y-5">
        
        {/* Title */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20 mx-auto mb-3">
            FS
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            {t.register}
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
            Create an account to simplify digital forms using AI
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-3.5 pt-1">
          <div className="space-y-1">
            <label htmlFor="reg-name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.name}
            </label>
            <input
              id="reg-name"
              type="text"
              placeholder={t.enterName}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-[15px] dark:text-slate-200"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.email}
            </label>
            <input
              id="reg-email"
              type="email"
              placeholder={t.enterEmail}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-[15px] dark:text-slate-200"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-pass" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Password
            </label>
            <input
              id="reg-pass"
              type="password"
              placeholder={t.enterPassword}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-[15px] dark:text-slate-200"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-confpass" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              id="reg-confpass"
              type="password"
              placeholder={t.confirmPassword}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-[15px] dark:text-slate-200"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </div>
        </div>

        {/* Button */}
        <Button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t.processing}</span>
            </>
          ) : (
            t.register
          )}
        </Button>

        {/* Links */}
        <div className="text-center text-sm font-semibold text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            {t.login}
          </Link>
        </div>

      </Card>

    </div>
  )
}

export default Register