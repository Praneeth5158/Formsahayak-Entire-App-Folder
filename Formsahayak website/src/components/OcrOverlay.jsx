import { memo } from "react"

function OcrOverlay({ boxes, currentLine, guidanceLines, guidanceSteps, noOcrText, showNoOcr }) {
  // Read OCR Highlight color from settings
  const colorPref = localStorage.getItem("ocrHighlightColor") || "red"

  // Define premium color scheme variables
  const colorMap = {
    red: {
      border: "rgba(239, 68, 68, 0.8)",
      bg: "rgba(239, 68, 68, 0.08)",
      activeBg: "rgba(239, 68, 68, 0.2)",
      glow: "shadow-[0_0_12px_rgba(239,68,68,0.35)]"
    },
    blue: {
      border: "rgba(59, 130, 246, 0.8)",
      bg: "rgba(59, 130, 246, 0.08)",
      activeBg: "rgba(59, 130, 246, 0.2)",
      glow: "shadow-[0_0_12px_rgba(59,130,246,0.35)]"
    },
    green: {
      border: "rgba(16, 185, 129, 0.8)",
      bg: "rgba(16, 185, 129, 0.08)",
      activeBg: "rgba(16, 185, 129, 0.2)",
      glow: "shadow-[0_0_12px_rgba(16,185,129,0.35)]"
    },
    purple: {
      border: "rgba(139, 92, 246, 0.8)",
      bg: "rgba(139, 92, 246, 0.08)",
      activeBg: "rgba(139, 92, 246, 0.2)",
      glow: "shadow-[0_0_12px_rgba(139,92,246,0.35)]"
    }
  }

  const selectedColors = colorMap[colorPref] || colorMap.red

  // Filter: Only draw red box outlines around actual empty input fields to avoid cluttering the screen!
  const fieldBoxes = boxes.filter(box => box.text && box.text.startsWith("[Field:"))

  return (
    <>
      {fieldBoxes.map((box, index) => {
        const isCurrent = (() => {
          if (currentLine < 0) return false

          // 1. Primary path: Use backend-mapped guidanceSteps for exact, high-accuracy multilingual tracking
          if (guidanceSteps && guidanceSteps[currentLine]) {
            const activeBoxes = guidanceSteps[currentLine].ocr_boxes || []
            const matched = activeBoxes.some(
              (activeBox) =>
                activeBox.x === box.x &&
                activeBox.y === box.y &&
                activeBox.w === box.w &&
                activeBox.h === box.h
            )
            if (matched) return true
          }

          // 2. Secondary fallback: Local keyword substring matching
          if (!guidanceLines || !guidanceLines[currentLine] || !box.text) return false

          const cleanLine = guidanceLines[currentLine]
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .replace(/\s+/g, " ")
            .trim()

          const cleanBoxText = box.text
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .replace(/\s+/g, " ")
            .trim()

          if (cleanBoxText.length < 3) return false

          // Avoid generic word highlights
          const genericWords = ["the", "and", "for", "you", "are", "enter", "please", "your", "form", "select", "type", "box"]
          if (genericWords.includes(cleanBoxText)) return false

          return cleanLine.includes(cleanBoxText)
        })()

        return (
          <div
            key={box.id}
            className={`absolute rounded-xl transition-all duration-300 pointer-events-none ${
              isCurrent 
                ? `ocr-glow-box scale-[1.01] z-30 ${selectedColors.glow}` 
                : "opacity-80 hover:opacity-100 z-20"
            }`}
            style={{
              top: box.top,
              left: box.left,
              width: box.width,
              height: box.height,
              border: `2.5px solid ${selectedColors.border}`,
              backgroundColor: isCurrent ? selectedColors.activeBg : selectedColors.bg,
              position: "absolute",
              "--pulse-color": selectedColors.border
            }}
          >
            {/* Minimal text indicator on hover or highlight if needed */}
            {isCurrent && box.text && (
              <span className="absolute -top-6 left-0 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur shadow whitespace-nowrap">
                {box.text}
              </span>
            )}
          </div>
        )
      })}
      
      {showNoOcr && (
        <div className="absolute bottom-4 left-4 glass-panel bg-white/95 dark:bg-slate-950/95 text-slate-700 dark:text-slate-200 text-xs font-bold px-4 py-2.5 rounded-2xl shadow-lg border border-slate-200/50 dark:border-white/5 z-30">
          ⚠️ {noOcrText}
        </div>
      )}
    </>
  )
}

export default memo(OcrOverlay)
