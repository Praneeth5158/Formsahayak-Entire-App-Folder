import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "../i18n/useTranslation"
import Card from "../components/ui/Card"
import Skeleton from "../components/ui/Skeleton"
import api from "../services/api"

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || { name: "User", email: "user@example.com" }
  const { t, language } = useTranslation()
  const [documents, setDocuments] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)

  const uploadCount = documents.length || 0
  const historyCount = uploadCount
  const lastUploaded = documents[0]?.created_at || t.noGuidance

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(`/history/${user?.email}`)
        const historyItems = response.data.history || []
        setDocuments(historyItems)
      } catch (error) {
        const fallback = JSON.parse(localStorage.getItem("dashboardStats") || "[]")
        setDocuments(fallback)
      } finally {
        setLoadingStats(false)
      }
    }
    fetchStats()
  }, [user?.email])

  return (
    <div className="space-y-8 pb-10">
      
      {/* Top Welcome Capsule */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 dark:from-blue-500/5 dark:to-purple-500/5 p-6 md:p-8 rounded-3xl border border-blue-500/10 shadow-sm relative overflow-hidden">
        
        {/* Glow behind greeting */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -z-10" />

        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent leading-normal">
            {t.welcome}, {user?.name} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-base md:text-lg">
            {t.dashboardSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm text-sm font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-600 dark:text-slate-300">{t.activeUser}</span>
        </div>
      </div>

      {/* Grid of Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loadingStats ? (
          <>
            <Skeleton className="h-28 rounded-3xl" />
            <Skeleton className="h-28 rounded-3xl" />
            <Skeleton className="h-28 sm:col-span-2 rounded-3xl" />
          </>
        ) : (
          <>
            <Card className="glass-panel glass-card-glow p-6 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {t.totalUploads || "Total Uploads"}
              </span>
              <div className="flex items-baseline justify-between mt-4">
                <h3 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 glow-text-blue">
                  {uploadCount}
                </h3>
                <span className="text-xl">⬆️</span>
              </div>
            </Card>

            <Card className="glass-panel glass-card-glow p-6 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {t.totalHistory || "History Records"}
              </span>
              <div className="flex items-baseline justify-between mt-4">
                <h3 className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 glow-text-purple">
                  {historyCount}
                </h3>
                <span className="text-xl">🕘</span>
              </div>
            </Card>

            <Card className="glass-panel glass-card-glow p-6 sm:col-span-2 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {t.lastUploadedForm || "Last Uploaded Form"}
              </span>
              <div className="flex items-baseline justify-between mt-4 gap-4">
                <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200 truncate flex-1">
                  {lastUploaded}
                </h3>
                <span className="text-xl flex-shrink-0">📄</span>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Grid of Core AI Features */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
          AI-Powered Capabilities
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-panel glass-card-glow p-6 md:p-8 flex flex-col justify-between space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-2xl">
              💡
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {t.aiGuidance}
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
                {t.aiCardText}
              </p>
            </div>
          </Card>

          <Card className="glass-panel glass-card-glow p-6 md:p-8 flex flex-col justify-between space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-2xl">
              🔍
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {t.ocrCardTitle}
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
                {t.ocrCardText}
              </p>
            </div>
          </Card>

          <Card className="glass-panel glass-card-glow p-6 md:p-8 flex flex-col justify-between space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-2xl">
              🗣️
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {t.audioCardTitle}
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
                {t.audioCardText}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Card: Quick Actions */}
      <Card className="glass-panel p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {t.quickAccess}
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Perform actions immediately on your multilingual helper.
        </p>

        <div className="flex flex-wrap gap-4 mt-6">
          <Link
            to="/upload"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
          >
            <span>⬆️</span> {t.uploadNewForm}
          </Link>
          <Link
            to="/history"
            className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-semibold px-6 py-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition duration-300"
          >
            <span>🕘</span> {t.viewHistory}
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold px-6 py-3.5 rounded-2xl hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 transition duration-300"
          >
            <span>👤</span> {t.profile}
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-2 bg-purple-500/10 dark:bg-purple-500/5 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold px-6 py-3.5 rounded-2xl hover:bg-purple-500 hover:text-white dark:hover:bg-purple-500 transition duration-300"
          >
            <span>⚙️</span> {t.settings || "Settings"}
          </Link>
        </div>
      </Card>

      {/* Multilingual Status Card */}
      <Card className="glass-panel p-6 md:p-8 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Multilingual System Status
          </h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Active Language: <strong className="text-indigo-600 dark:text-indigo-400">{language}</strong>. Dynamic Voice Assistance is synchronized.
          </p>
        </div>
        <div className="flex gap-2">
          {["EN", "TE", "HI", "TA"].map((lang) => (
            <span
              key={lang}
              className={`text-xs font-black px-2.5 py-1.5 rounded-xl border ${
                (language === "English" && lang === "EN") ||
                (language === "Telugu" && lang === "TE") ||
                (language === "Hindi" && lang === "HI") ||
                (language === "Tamil" && lang === "TA")
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25"
                  : "bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/5"
              }`}
            >
              {lang}
            </span>
          ))}
        </div>
      </Card>

    </div>
  )
}

export default Dashboard
