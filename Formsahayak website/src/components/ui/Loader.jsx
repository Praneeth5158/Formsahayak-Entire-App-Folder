function Loader({ text }) {
  return (
    <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
      <div className="w-5 h-5 border-3 border-blue-300 dark:border-blue-500/20 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
      <span className="font-semibold text-sm">{text}</span>
    </div>
  )
}

export default Loader
