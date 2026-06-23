function Modal({ open, title, children, onClose }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm transition duration-300 animate-fade-in-up"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 w-full max-w-xl rounded-3xl shadow-2xl p-6 md:p-8 animate-fade-in-up relative">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-4">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition flex items-center justify-center font-bold cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}

export default Modal
