import { useMemo, useRef, useState, useEffect } from "react"
import Button from "./ui/Button"

function AudioGuidanceControls({ audioFile, t }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [duration, setDuration] = useState("0:00")

  const progressPercent = useMemo(() => `${Math.min(progress * 100, 100)}%`, [progress])

  // Helper to format raw seconds into mm:ss
  const formatTime = (secs) => {
    if (isNaN(secs) || secs === Infinity) return "0:00"
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  useEffect(() => {
    // Reset states if audioFile changes
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime("0:00")
    setDuration("0:00")
  }, [audioFile])

  if (!audioFile) return null

  const handleTimeUpdate = (e) => {
    const target = e.currentTarget
    setProgress(target.duration ? target.currentTime / target.duration : 0)
    setCurrentTime(formatTime(target.currentTime))
  }

  const handleLoadedMetadata = (e) => {
    setDuration(formatTime(e.currentTarget.duration))
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl p-6 mt-6 shadow-sm">
      
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioFile}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className="hidden"
      />

      <div className="space-y-4">
        
        {/* Player Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-indigo-500">🎵</span>
            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              AI Voice Guide Playback
            </span>
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {currentTime} / {duration}
          </span>
        </div>

        {/* Custom Progress Track Line */}
        <div 
          onClick={(e) => {
            if (!audioRef.current || !audioRef.current.duration) return
            const rect = e.currentTarget.getBoundingClientRect()
            const clickX = e.clientX - rect.left
            const clickRatio = clickX / rect.width
            audioRef.current.currentTime = clickRatio * audioRef.current.duration
          }}
          className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden cursor-pointer relative group"
        >
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-150" 
            style={{ width: progressPercent }}
          />
        </div>

        {/* Control Button panel */}
        <div className="flex flex-wrap gap-4 items-center justify-between pt-2">
          
          <Button
            variant={isPlaying ? "secondary" : "success"}
            onClick={togglePlay}
            className="px-6 py-2.5 min-h-[40px] text-sm rounded-xl flex items-center gap-2 shadow shadow-blue-500/10 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <span>⏸</span> {t.pause || "Pause"}
              </>
            ) : (
              <>
                <span>▶</span> {t.play || "Play"}
              </>
            )}
          </Button>

          {/* Speed settings dropdown */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-white/5 shadow-sm">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest" htmlFor="music-speed">
              {t.playbackSpeed || "Speed"}
            </label>
            <select
              id="music-speed"
              className="text-xs font-bold bg-transparent border-none outline-none dark:text-slate-350 cursor-pointer"
              value={speed}
              onChange={(e) => {
                const value = Number(e.target.value)
                setSpeed(value)
                if (audioRef.current) audioRef.current.playbackRate = value
              }}
            >
              <option value={0.75}>0.75x</option>
              <option value={1}>1.00x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.50x</option>
            </select>
          </div>

        </div>

      </div>

    </div>
  )
}

export default AudioGuidanceControls
