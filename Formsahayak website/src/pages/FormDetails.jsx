import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../services/api"
import { useTranslation } from "../i18n/useTranslation"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Skeleton from "../components/ui/Skeleton"

function FormDetails() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const byId = await api.get(`/history-item/${id}`)
        setDoc(byId.data)
      } catch (error) {
        try {
          const history = await api.get(`/history/${user?.email}`)
          const selected = (history.data.history || []).find((item) => String(item.id) === String(id))
          setDoc(selected || null)
        } catch (historyError) {
          setDoc(null)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchDocument()
  }, [id, user?.email])

  return (
    <div className="space-y-6 pb-10">
      
      {/* Top Navigation Row */}
      <div className="flex justify-between items-center">
        <Button
          onClick={() => window.history.back()}
          variant="secondary"
          className="flex items-center gap-2"
        >
          ← {t.back}
        </Button>
        
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          {t.formDetails}
        </h1>
        <div className="w-12 h-12" /> {/* alignment spacer */}
      </div>

      {loading ? (
        <Card className="glass-panel p-6 md:p-8 space-y-6">
          <Skeleton className="h-[400px] w-full rounded-2xl" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </Card>
      ) : !doc ? (
        <Card className="glass-panel p-16 text-center">
          <span className="text-4xl">🤷‍♂️</span>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mt-4">Form Not Found</h2>
          <p className="text-slate-400 dark:text-slate-500 mt-2">{t.noUploadHistory}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Image Canvas Preview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-panel p-6 flex flex-col space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {t.imagePreview}
              </h2>
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900 flex justify-center items-center">
                <img
                  src={doc.file_url}
                  alt="form"
                  className="max-w-full max-h-[500px] object-contain rounded-2xl hover:scale-[1.01] transition duration-300"
                />
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500">
                <span>ID: {doc.id}</span>
                <span>{t.uploadedAt}: {doc.created_at}</span>
              </div>
            </Card>
          </div>

          {/* Right Column: AI Guidance Details */}
          <div className="space-y-6">
            <Card className="glass-panel p-6 md:p-8 space-y-6">
              
              <div>
                <span className="text-xs font-black px-2.5 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10">
                  🤖 Form Assistant
                </span>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-4">
                  {t.aiGuidance}
                </h2>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200/50 dark:border-white/5 max-h-[300px] overflow-y-auto">
                <p className="text-slate-600 dark:text-slate-300 text-[15px] whitespace-pre-line leading-relaxed">
                  {doc.guidance_text}
                </p>
              </div>

              {/* Action row (Audio Player & PDF View) */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                {doc.audio_path && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Guidance Playback
                    </p>
                    <audio controls className="w-full">
                      <source src={doc.audio_path} type="audio/mp3" />
                    </audio>
                  </div>
                )}

                {doc.pdf_path && (
                  <a
                    href={doc.pdf_path}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition"
                  >
                    📄 {t.viewPdf}
                  </a>
                )}
              </div>

            </Card>
          </div>

        </div>
      )}

    </div>
  )
}

export default FormDetails
