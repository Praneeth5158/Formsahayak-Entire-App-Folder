import { useState, useEffect } from "react"
import { useTranslation } from "../i18n/useTranslation"
import { useDarkMode } from "../components/DarkModeProvider"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"

function Settings() {
  const { t, language } = useTranslation()
  const { isDarkMode, toggleTheme } = useDarkMode()
  const user = JSON.parse(localStorage.getItem("user")) || { name: "User", email: "user@example.com", language: "English" }

  // Settings State loaded from localStorage
  const [appLanguage, setAppLanguage] = useState(user.language || "English")
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("voiceAlerts") !== "false"
  })
  const [voiceSpeed, setVoiceSpeed] = useState(() => {
    return Number(localStorage.getItem("voiceSpeed") || "1")
  })
  const [highlightColor, setHighlightColor] = useState(() => {
    return localStorage.getItem("ocrHighlightColor") || "red"
  })
  
  const [saveStatus, setSaveStatus] = useState("")

  const handleSave = () => {
    // 1. Save Language Preference
    const updatedUser = { ...user, language: appLanguage }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    window.dispatchEvent(new Event("user-language-updated"))

    // 2. Save Other settings
    localStorage.setItem("voiceAlerts", String(notifications))
    localStorage.setItem("voiceSpeed", String(voiceSpeed))
    localStorage.setItem("ocrHighlightColor", highlightColor)

    // Show beautiful success notification
    setSaveStatus(t.settingsSaved || "Settings saved successfully")
    setTimeout(() => setSaveStatus(""), 3000)
  }

  const highlightColors = [
    { value: "red", label: t.red || "Vibrant Red", class: "bg-red-500 shadow-red-500/20" },
    { value: "blue", label: t.blue || "Electric Blue", class: "bg-blue-500 shadow-blue-500/20" },
    { value: "green", label: t.green || "Emerald Green", class: "bg-green-500 shadow-green-500/20" },
    { value: "purple", label: t.purple || "Electric Violet", class: "bg-purple-500 shadow-purple-500/20" }
  ]

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          {t.settings || "Settings"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-[15px]">
          {t.settingsSubtitle || "Customize your AI experience, themes, and highlight options."}
        </p>
      </div>

      {/* Success banner */}
      {saveStatus && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl animate-fade-in-up text-sm font-semibold flex items-center gap-2">
          <span>✅</span> {saveStatus}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Theme & Language */}
          <Card className="glass-panel p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-100 dark:border-white/5 pb-4">
              {t.generalSettings || "General Options"}
            </h2>

            {/* Dark Mode toggle row */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {t.toggleTheme || "Dark Mode Theme"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Adjust UI contrast for day or night use.
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                  isDarkMode ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-md ${
                    isDarkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Language row */}
            <div className="space-y-2">
              <label htmlFor="lang-select" className="block font-semibold text-slate-800 dark:text-slate-200">
                {t.selectLang || "Application Language"}
              </label>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
                Choose the system UI language for guidance.
              </p>
              <select
                id="lang-select"
                value={appLanguage}
                onChange={(e) => setAppLanguage(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-[15px] focus:ring-2 focus:ring-blue-500 outline-none font-medium dark:text-slate-200"
              >
                <option value="English">English</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
              </select>
            </div>
          </Card>

          {/* Card: AI Voice & Audio */}
          <Card className="glass-panel p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-100 dark:border-white/5 pb-4">
              AI Voice Settings
            </h2>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {t.notifyToggle || "Enable Voice Alerts"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Hear spoken audio cues when form elements are highlighted.
                </p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                  notifications ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-md ${
                    notifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Speed slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="voice-speed" className="font-semibold text-slate-800 dark:text-slate-200">
                  {t.voiceSpeed || "Voice Speed Selection"}
                </label>
                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {voiceSpeed}x
                </span>
              </div>
              <input
                id="voice-speed"
                type="range"
                min="0.7"
                max="1.5"
                step="0.1"
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Slower</span>
                <span>Normal</span>
                <span>Faster</span>
              </div>
            </div>
          </Card>

          {/* Card: OCR Highlight color */}
          <Card className="glass-panel p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-100 dark:border-white/5 pb-4">
              {t.highlightColor || "OCR Highlight Color"}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 -mt-2">
              Select the outline color used on the upload canvas for highlighted text fields.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {highlightColors.map((color) => {
                const isSelected = highlightColor === color.value
                return (
                  <button
                    key={color.value}
                    onClick={() => setHighlightColor(color.value)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition duration-300 cursor-pointer ${
                      isSelected
                        ? "border-blue-600 dark:border-blue-400 bg-blue-50/20 dark:bg-blue-500/5 font-semibold text-blue-600 dark:text-blue-400"
                        : "border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${color.class} ${isSelected ? "ring-4 ring-blue-500/20" : ""}`} />
                    <span className="text-xs truncate max-w-full">{color.label}</span>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Save Button Container */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
            >
              💾 {t.saveSettings || "Save Configuration"}
            </Button>
          </div>

        </div>

        {/* Right Column: Profile & Info */}
        <div className="space-y-6">
          
          {/* Card: Account details */}
          <Card className="glass-panel p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-100 dark:border-white/5 pb-4">
              {t.accountSettings || "Account Details"}
            </h2>

            <div className="flex flex-col items-center py-4 text-center">
              <img
                src={localStorage.getItem("profileImage") || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="user-avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/30 shadow-lg mb-4"
              />
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{user.name}</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{user.email}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active User</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">App Mode</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">AI Premium Plan</span>
              </div>
            </div>
          </Card>

          {/* Card: FormSahayak Info */}
          <Card className="glass-panel p-6 md:p-8 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 border-blue-500/10">
            <h3 className="font-extrabold text-blue-600 dark:text-blue-400 mb-2">FormSahayak AI v2.0</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              FormSahayak is a premium AI-powered form assistance platform designed to break language barriers, simplify documentation, and empower everyone—including beginners, old-age individuals, and rural residents—to comfortably process digital application forms.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="text-[10px] font-bold px-2 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md">Vite</span>
              <span className="text-[10px] font-bold px-2 py-1 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md">Tailwind 4</span>
              <span className="text-[10px] font-bold px-2 py-1 bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md">React 19</span>
            </div>
          </Card>

        </div>

      </div>

    </div>
  )
}

export default Settings
