import { useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import { useTranslation } from "../i18n/useTranslation"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"

function ForgotPassword() {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [step, setStep] = useState(1) // 1 = Email, 2 = OTP, 3 = New Password
  const [loading, setLoading] = useState(false)

  // Step 1: Send OTP to Email
  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter your email")
      return
    }

    setLoading(true)
    try {
      const response = await api.post("/forgot-password", { email })
      alert(response.data.message || "OTP sent successfully. Please check your email.")
      setStep(2) // Move to OTP verification
    } catch (error) {
      if (error.response) {
        alert(error.response.data.detail)
      } else {
        alert(t.serverError || "Server error. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the 4-digit OTP code")
      return
    }

    setLoading(true)
    try {
      const response = await api.post("/verify-otp", { email, otp })
      alert(response.data.message || "OTP verified successfully!")
      setStep(3) // Move to Reset Password
    } catch (error) {
      if (error.response) {
        alert(error.response.data.detail)
      } else {
        alert("Server error. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill in both password fields")
      return
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const response = await api.post("/reset-password", {
        email,
        new_password: newPassword,
        confirm_password: confirmPassword
      })
      alert(response.data.message || "Password reset successful! You can now log in.")
      window.location.href = "/login"
    } catch (error) {
      if (error.response) {
        alert(error.response.data.detail)
      } else {
        alert("Server error. Please try again.")
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
            {step === 1 ? (t.forgotPasswordTitle || "Reset Password") : step === 2 ? "Verify OTP" : "New Password"}
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
            {step === 1 
              ? (t.forgotPasswordSubtitle || "Enter your email to receive a password reset OTP.") 
              : step === 2 
                ? `Enter the 4-digit code sent to ${email}`
                : "Enter and confirm your new secure password."
            }
          </p>
        </div>

        {/* Step 1: Email Form */}
        {step === 1 && (
          <>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <label htmlFor="reset-email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t.email}
                </label>
                <input
                  id="reset-email"
                  type="email"
                  placeholder={t.enterEmail}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-[15px] dark:text-slate-200"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
            </div>

            <Button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t.processing}</span>
                </>
              ) : (
                "Send Verification OTP"
              )}
            </Button>
          </>
        )}

        {/* Step 2: OTP Verification Form */}
        {step === 2 && (
          <>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <label htmlFor="reset-otp" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  OTP Code
                </label>
                <input
                  id="reset-otp"
                  type="text"
                  placeholder="Enter 4-Digit OTP"
                  maxLength={4}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-center tracking-[0.75em] text-lg font-black dark:text-slate-200 animate-pulse"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                />
              </div>
            </div>

            <Button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t.processing}</span>
                </>
              ) : (
                "Verify OTP Code"
              )}
            </Button>

            <button
              onClick={() => setStep(1)}
              className="text-xs text-center font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mt-2 transition cursor-pointer underline decoration-dotted"
            >
              Change Email Address
            </button>
          </>
        )}

        {/* Step 3: New Password Form */}
        {step === 3 && (
          <>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <label htmlFor="new-password" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="Enter New Password"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-[15px] dark:text-slate-200"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="confirm-password" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-[15px] dark:text-slate-200"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />
              </div>
            </div>

            <Button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t.processing}</span>
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </>
        )}

        {/* Links */}
        <div className="flex justify-between text-sm font-semibold text-blue-600 dark:text-blue-400 pt-2 border-t border-slate-100 dark:border-white/5">
          <Link to="/login" className="hover:underline">
            {t.login}
          </Link>
          <Link to="/signup" className="hover:underline">
            {t.register}
          </Link>
        </div>

      </Card>

    </div>
  )
}

export default ForgotPassword;
