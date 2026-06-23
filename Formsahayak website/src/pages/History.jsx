import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import { useTranslation } from "../i18n/useTranslation"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import Modal from "../components/ui/Modal"
import Skeleton from "../components/ui/Skeleton"

function History() {
  const { t } = useTranslation()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const user = JSON.parse(localStorage.getItem("user")) || { email: "" }

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/history/${user.email}`)
      setDocuments(response.data.history || [])
    } catch (error) {
      console.log(error)
      alert(t.historyLoadFailed)
    } finally {
      setLoading(false)
    }
  }

  const deleteHistory = async (id) => {
    setDeleting(true)
    try {
      await api.delete(`/delete-history/${id}`)
      fetchHistory()
    } catch (error) {
      console.log(error)
      alert(t.deleteFailed)
    } finally {
      setDeleting(false)
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesQuery = !query || doc.guidance_text?.toLowerCase().includes(query.toLowerCase())
    const matchesDate = !dateFilter || String(doc.created_at || "").includes(dateFilter)
    return matchesQuery && matchesDate
  })

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          {t.history}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-[15px]">
          Review past uploads, AI-extracted guidance reports, and downloaded PDFs.
        </p>
      </div>

      {/* Filter capsule */}
      <Card className="glass-panel p-5 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-400">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchHistory || "Search history..."}
              className="w-full min-h-[46px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl pl-10 pr-4 outline-none text-sm dark:text-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-400">📅</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full min-h-[46px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl pl-10 pr-4 outline-none text-sm dark:text-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
              aria-label={t.filterByDate || "Filter by date"}
            />
          </div>
        </div>
      </Card>

      {/* Empty State */}
      {!loading && filteredDocuments.length === 0 && (
        <Card className="glass-panel p-16 text-center mt-8 space-y-4">
          <span className="text-5xl block animate-bounce">📁</span>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            {t.noUploadHistory} 😄
          </h2>
          <p className="text-slate-400 dark:text-slate-500 max-w-md mx-auto text-sm">
            {t.uploadToSeeHistory}
          </p>
          <div className="pt-2">
            <Link
              to="/upload"
              className="inline-flex bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl shadow transition"
            >
              Upload Form Now
            </Link>
          </div>
        </Card>
      )}

      {/* History Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        
        {loading && [1, 2, 3, 4].map((id) => (
          <Card key={id} className="glass-panel p-6 md:p-8 space-y-4">
            <Skeleton className="h-[250px] w-full rounded-2xl" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-16 w-full" />
          </Card>
        ))}

        {!loading && filteredDocuments.map((doc) => (
          <Card key={doc.id} className="glass-panel p-6 md:p-8 flex flex-col justify-between space-y-6 hover:shadow-xl transition-all duration-300">
            
            <div className="space-y-4">
              {/* Image Preview Action */}
              <button
                onClick={() => setSelectedDoc(doc)}
                className="w-full text-left rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900 h-[240px] flex items-center justify-center relative group cursor-pointer"
              >
                <img
                  src={doc.file_url}
                  alt="form"
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                  <span className="bg-white/90 dark:bg-slate-950/90 text-slate-800 dark:text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md">
                    🔍 Click to Preview
                  </span>
                </div>
              </button>

              {/* Timestamp */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                <span>📅</span>
                <span>{t.uploadedAt}: {doc.created_at}</span>
              </div>

              {/* AI Guidance Text Preview */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {t.aiGuidance}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-line line-clamp-4 leading-relaxed">
                  {doc.guidance_text}
                </p>
              </div>
            </div>

            {/* Bottom Actions Panel */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
              
              {/* Guidance Audio player (inline) */}
              {doc.audio_path && (
                <div className="space-y-1">
                  <audio controls className="w-full h-10">
                    <source src={doc.audio_path} type="audio/mp3" />
                  </audio>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="flex gap-2">
                  {doc.pdf_path && (
                    <a
                      href={doc.pdf_path}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition"
                    >
                      📄 {t.viewPdf}
                    </a>
                  )}
                  <Link
                    to={`/form-details/${doc.id}`}
                    className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition border border-slate-200/50 dark:border-white/5"
                  >
                    <span>ℹ️</span> Details
                  </Link>
                </div>

                <Button
                  onClick={() => setDeleteTarget(doc)}
                  variant="danger"
                  className="px-4 py-2 min-h-0 text-xs rounded-xl shadow-none"
                >
                  🗑 {t.delete}
                </Button>
              </div>

            </div>

          </Card>
        ))}

      </div>

      {/* Image Preview Modal */}
      <Modal
        open={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        title={t.imagePreview}
      >
        {selectedDoc && (
          <div className="flex justify-center max-h-[80vh] overflow-hidden bg-slate-50 dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-white/5">
            <img
              src={selectedDoc.file_url}
              alt="preview-large"
              className="max-w-full max-h-[70vh] object-contain rounded-xl"
            />
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Deletion"
      >
        <div className="text-center p-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 text-red-500 flex items-center justify-center text-3xl mx-auto mb-4">
            ⚠️
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-base font-semibold">
            {t.deleteConfirm}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            This action cannot be undone and will permanently delete this guidance record.
          </p>
          
          <div className="flex gap-4 mt-6">
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              className="flex-1 rounded-2xl py-3.5"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={deleting}
              onClick={async () => {
                if (!deleteTarget) return
                await deleteHistory(deleteTarget.id)
                setDeleteTarget(null)
              }}
              className="flex-1 rounded-2xl py-3.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              {deleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                t.delete
              )}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  )
}

export default History