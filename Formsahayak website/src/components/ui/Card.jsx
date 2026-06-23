function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
