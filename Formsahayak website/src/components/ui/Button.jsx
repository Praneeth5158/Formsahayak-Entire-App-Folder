function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/10 focus-visible:ring-blue-500",
    secondary:
      "bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/5 shadow-sm focus-visible:ring-slate-400",
    danger:
      "bg-red-500 hover:bg-red-600 text-white shadow-md focus-visible:ring-red-400",
    success:
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md focus-visible:ring-emerald-400"
  }

  return (
    <button
      type={type}
      className={`min-h-[44px] px-5 py-3 rounded-2xl font-bold transition duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
