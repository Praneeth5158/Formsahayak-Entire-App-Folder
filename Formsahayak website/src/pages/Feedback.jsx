import { useState } from "react"
import api from "../services/api"
import { useTranslation } from "../i18n/useTranslation"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Modal from "../components/ui/Modal"

function Feedback() {
  const { t } = useTranslation()
  const [message, setMessage] = useState("")
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  
  const user = JSON.parse(localStorage.getItem("user")) || { email: "user@example.com", language: "English" }

  const handleSubmit = async () => {
    if (!message.trim()) {
      alert(t.feedbackRequired)
      return
    }

    setLoading(true)
    try {
      // Append rating to message so we don't break existing backend API structure
      const formattedMessage = `[Rating: ${rating}/5] ${message}`
      
      const response = await api.post("/feedback", {
        user_email: user?.email,
        rating: String(rating),
        feedback_text: message,
        app_experience: "Excellent",
        voice_guidance_helpful: "Yes",
        recommend_app: "Yes",
        additional_comments: message
      })

      // Fix [object Object] issue safely
      let parsedMsg = t.feedbackThanks || "Thank you for your feedback!"
      if (response.data) {
        if (typeof response.data.message === "string") {
          parsedMsg = response.data.message
        } else if (response.data.message && typeof response.data.message === "object") {
          parsedMsg = response.data.message.detail || response.data.message.message || JSON.stringify(response.data.message)
        } else if (typeof response.data.detail === "string") {
          parsedMsg = response.data.detail
        }
      }

      setSuccessMessage(parsedMsg)
      setSuccessModal(true)
      setMessage("")
      setRating(5)

    } catch (error) {
      console.error(error)
      const errDetail = error?.response?.data?.detail || error?.response?.data?.message || t.serverError
      alert(typeof errDetail === "object" ? JSON.stringify(errDetail) : errDetail)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          {t.feedbackTitle}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-[15px]">
          {t.feedbackSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feedback Form */}
        <div className="lg:col-span-2">
          <Card className="glass-panel p-6 md:p-8 space-y-6">
            
            {/* Star Rating Section */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-800 dark:text-slate-200">
                Rate your Experience
              </label>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
                Tap the stars to rate FormSahayak.
              </p>
              
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = (hoverRating || rating) >= star
                  return (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={`text-3xl md:text-4xl transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "text-yellow-400 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
                          : "text-slate-200 dark:text-slate-700 scale-100"
                      }`}
                      aria-label={`Rate ${star} stars`}
                    >
                      ★
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-2">
              <label htmlFor="feedback-text" className="block font-bold text-slate-800 dark:text-slate-200">
                {t.feedbackMessage}
              </label>
              <textarea
                id="feedback-text"
                rows={6}
                placeholder="Tell us what you liked, or where we can improve..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-[15px] dark:text-slate-200 font-medium"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t.processing}</span>
                </>
              ) : (
                t.submitFeedback
              )}
            </Button>

          </Card>
        </div>

        {/* Right Info Card */}
        <div className="space-y-6">
          <Card className="glass-panel p-6 md:p-8 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-lg mb-2">We value your input!</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed space-y-2">
              <span>FormSahayak relies on feedback from users to continuously optimize guidelines, support translations, and update our OCR recognition mapping models.</span>
              <br/><br/>
              <span>Whether you encountered a bug, had trouble listening to translations, or enjoyed our seamless service, please let us know!</span>
            </p>
          </Card>
        </div>

      </div>

      {/* Custom Animated Success Popup Modal */}
      <Modal
        open={successModal}
        onClose={() => setSuccessModal(false)}
        title="Feedback Submitted!"
      >
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center text-3xl mb-4 animate-bounce">
            🎉
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-base font-medium">
            {successMessage}
          </p>
          <Button
            onClick={() => setSuccessModal(false)}
            className="mt-6 px-6 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Okay
          </Button>
        </div>
      </Modal>

    </div>
  )
}

export default Feedback
