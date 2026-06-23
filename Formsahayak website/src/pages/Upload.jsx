import { useEffect, useMemo, useState, useRef } from "react"
import api from "../services/api"
import { useTranslation } from "../i18n/useTranslation"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Loader from "../components/ui/Loader"
import OcrOverlay from "../components/OcrOverlay"
import AudioGuidanceControls from "../components/AudioGuidanceControls"

const compressImage = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.65) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith("image/")) {
      resolve(file)
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          } else {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now()
            })
            resolve(compressedFile)
          },
          "image/jpeg",
          quality
        )
      }
      img.onerror = () => resolve(file)
      img.src = event.target.result
    }
    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}

function Upload() {
  const { t, language, voiceLang } = useTranslation()
  const [file, setFile] = useState(null)
  const [guidance, setGuidance] = useState("")
  const [loading, setLoading] = useState(false)
  const [audioFile, setAudioFile] = useState("")
  const [pdfFile, setPdfFile] = useState("")
  const [preview, setPreview] = useState("")
  const [currentLine, setCurrentLine] = useState(-1)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [rawOcrBoxes, setRawOcrBoxes] = useState([])
  const [extractedText, setExtractedText] = useState("")
  const [imageMeta, setImageMeta] = useState({ width: 1, height: 1 })
  const [uploadProgress, setUploadProgress] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [isDragOver, setIsDragOver] = useState(false)

  // AI Guidance line-by-line typing state
  const [displayedLines, setDisplayedLines] = useState([])
  const [guidanceSteps, setGuidanceSteps] = useState([])
  const audioRef = useRef(null)
  const timerRef = useRef(null)

  // Natural edge-tts voice mapping for the backend
  const edgeTtsVoiceMap = {
    English: "en-IN-NeerjaNeural",
    Telugu: "te-IN-ShrutiNeural",
    Hindi: "hi-IN-SwaraNeural",
    Tamil: "ta-IN-PallaviNeural"
  }

  const guidanceLines = useMemo(
    () => guidance.split("\n").filter((line) => line.trim() !== ""),
    [guidance]
  )

  // Typewriter effect for displaying guidance lines one by one
  useEffect(() => {
    if (!guidance) {
      setDisplayedLines([])
      return
    }

    setDisplayedLines([])
    let currentIdx = 0
    
    const timer = setInterval(() => {
      if (currentIdx < guidanceLines.length) {
        setDisplayedLines((prev) => [...prev, guidanceLines[currentIdx]])
        currentIdx++
      } else {
        clearInterval(timer)
      }
    }, 600) // Animates in a new line every 600ms

    return () => clearInterval(timer)
  }, [guidance, guidanceLines])

  const toPercentBox = (box, fallbackMeta) => {
    const left = box.left ?? box.x ?? box.x1 ?? 0
    const top = box.top ?? box.y ?? box.y1 ?? 0
    const width = box.width ?? box.w ?? (box.x2 ? box.x2 - (box.x1 ?? 0) : 0)
    const height = box.height ?? box.h ?? (box.y2 ? box.y2 - (box.y1 ?? 0) : 0)
    const imageWidth = box.image_width || box.page_width || fallbackMeta.width || 1
    const imageHeight = box.image_height || box.page_height || fallbackMeta.height || 1

    const normalized =
      left <= 1 && top <= 1 && width <= 1 && height <= 1
        ? { left, top, width, height }
        : {
            left: left / imageWidth,
            top: top / imageHeight,
            width: width / imageWidth,
            height: height / imageHeight
          }

    return {
      left: `${Math.min(Math.max(normalized.left, 0), 1) * 100}%`,
      top: `${Math.min(Math.max(normalized.top, 0), 1) * 100}%`,
      width: `${Math.min(Math.max(normalized.width, 0), 1) * 100}%`,
      height: `${Math.min(Math.max(normalized.height, 0), 1) * 100}%`
    }
  }

  const ocrBoxes = useMemo(
    () =>
      rawOcrBoxes
        .filter((box) => (box.confidence ?? 1) >= 0.45)
        .map((box, index) => ({
          ...toPercentBox(box, imageMeta),
          text: box.text || "",
          id: box.id || index,
          x: box.x,
          y: box.y,
          w: box.w,
          h: box.h
        })),
    [rawOcrBoxes, imageMeta]
  )

  useEffect(() => {
    setAudioFile("")
    setGuidance("")
    setExtractedText("")
    setRawOcrBoxes([])
    setPdfFile("")
    setUploadProgress(0)
    setDisplayedLines([])
    setGuidanceSteps([])
  }, [language])

  const handleUpload = async () => {
    const user = JSON.parse(localStorage.getItem("user"))

    if (!file) {
      alert(t.selectFile)
      return
    }

    setLoading(true)
    setUploadProgress(0)

    // Smooth progressive simulation for upload + backend AI analysis phase
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev < 30) return prev + 10 // Quick start
        if (prev < 65) return prev + 4  // Medium upload simulation
        if (prev < 88) return prev + 2  // Backend processing begins
        if (prev < 98) return prev + 1  // Slow down near completion
        return prev // Hold at 98% until backend responds
      })
    }, 250)

    let fileToUpload = file
    if (file.type.startsWith("image/")) {
      try {
        fileToUpload = await compressImage(file)
      } catch (err) {
        console.error("Image compression failed, using original file", err)
      }
    }

    const formData = new FormData()
    formData.append("file", fileToUpload)
    formData.append("user_email", user.email)
    formData.append("language", language)

    // Apply natural edge-tts voice config for backend synthesis
    const backendVoice = edgeTtsVoiceMap[language] || "en-IN-NeerjaNeural"
    formData.append("language_code", backendVoice)

    try {
      const response = await api.post(
        "/upload-document",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          params: { language_code: backendVoice }
        }
      )

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Short delay so the user feels/sees the completion to 100%
      await new Promise((resolve) => setTimeout(resolve, 50))

      setGuidance(response.data.guidance)
      
      const cleanUrl = (url) => {
        if (!url) return ""
        return url.replace("https://formsahayak-backend.onrender.com", api.defaults.baseURL)
      }

      setAudioFile(cleanUrl(response.data.audio_file))
      setPdfFile(cleanUrl(response.data.pdf_file))
      setExtractedText(
        response.data.extracted_text ||
          response.data.ocr_text ||
          response.data.text ||
          ""
      )
      setRawOcrBoxes(response.data.ocr_boxes || [])
      setGuidanceSteps(response.data.guidance_steps || [])

      const docCache = JSON.parse(localStorage.getItem("dashboardStats") || "[]")
      const latest = [
        {
          created_at: response.data.created_at || new Date().toLocaleString(),
          guidance: response.data.guidance || ""
        },
        ...docCache
      ].slice(0, 25)
      localStorage.setItem("dashboardStats", JSON.stringify(latest))

    } catch (error) {
      clearInterval(progressInterval)
      alert(error?.response?.data?.detail || t.uploadFailed)
    } finally {
      setLoading(false)
    }
  }

  const speakGuidance = () => {
    setIsSpeaking(true)

    if ((language === "Telugu" || language === "Tamil") && audioFile) {
      const audio = new Audio(audioFile)
      audioRef.current = audio
      audio.play()

      let index = 0
      const playNextLine = () => {
        if (index >= guidanceLines.length) {
          setCurrentLine(-1)
          setIsSpeaking(false)
          return
        }

        setCurrentLine(index)
        const currentLineText = guidanceLines[index]
        // Estimate reading speed: Telugu/Tamil syllables are long, calibrated to ~92ms for perfect sync with the neural voice
        const duration = Math.max(3000, currentLineText.length * 92)

        const timer = setTimeout(() => {
          index++
          playNextLine()
        }, duration)

        timerRef.current = timer
      }

      playNextLine()

      audio.onended = () => {
        stopVoice()
      }
    } else {
      let index = 0

      const speakNext = () => {
        if (index >= guidanceLines.length) {
          setCurrentLine(-1)
          setIsSpeaking(false)
          return
        }

        setCurrentLine(index)

        const speech = new SpeechSynthesisUtterance(guidanceLines[index])
        speech.lang = `${voiceLang}-IN`
        
        const savedSpeed = Number(localStorage.getItem("voiceSpeed") || "0.95")
        speech.rate = savedSpeed

        const voices = window.speechSynthesis.getVoices()
        const matchedVoice = voices.find(
          (voice) => voice.lang?.toLowerCase().startsWith(voiceLang.toLowerCase())
        )
        if (matchedVoice) {
          speech.voice = matchedVoice
        }

        speech.onend = () => {
          index++
          speakNext()
        }

        window.speechSynthesis.speak(speech)
      }

      speakNext()
    }
  }

  const stopVoice = () => {
    window.speechSynthesis.cancel()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setCurrentLine(-1)
    setIsSpeaking(false)
  }

  // Cleanup timers and speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
      if (audioRef.current) audioRef.current.pause()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className="space-y-8 pb-10">
      
      {/* Top Navigator */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 bg-slate-200/60 dark:bg-white/5 dark:text-slate-200 px-5 py-3 rounded-2xl font-semibold border border-slate-350 dark:border-white/5 cursor-pointer"
        >
          ← {t.back}
        </button>

        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          {t.uploadTitle}
        </h1>
        <div className="w-12 h-12" />
      </div>

      <p className="text-slate-500 dark:text-slate-400 mt-2 text-[15px] max-w-2xl">
        {t.uploadSubtitle}
      </p>

      {/* Upload Zone */}
      <Card 
        className={`glass-panel p-6 border-2 border-dashed transition-all duration-300 ${
          isDragOver 
            ? "border-blue-500 bg-blue-500/10 scale-[1.01]" 
            : "border-slate-300 dark:border-white/10 hover:border-slate-400"
        }`}
      >
        <label
          htmlFor="upload-input"
          className="block text-center cursor-pointer rounded-2xl p-8 hover:bg-slate-50/50 dark:hover:bg-white/5 transition"
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(event) => {
            event.preventDefault()
            setIsDragOver(false)
            const dropped = event.dataTransfer.files?.[0]
            if (!dropped) return
            setFile(dropped)
            setPreview(URL.createObjectURL(dropped))
          }}
        >
          <div className="text-4xl mb-4">📤</div>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
            {t.dragDrop || "Drag and drop your form here"}
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
            {t.orSelect || "or click to choose a file"}
          </p>
          {file && (
            <div className="mt-4 px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold rounded-xl inline-block text-xs border border-blue-500/25">
              📎 {file.name}
            </div>
          )}
        </label>
        <input
          id="upload-input"
          type="file"
          className="sr-only"
          onChange={(e) => {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            if (selectedFile) setPreview(URL.createObjectURL(selectedFile))
          }}
        />
      </Card>

      {/* Upload button */}
      <div className="flex justify-center pt-2">
        <Button
          onClick={handleUpload}
          disabled={loading || !file}
          className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-3 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t.processing}</span>
            </>
          ) : (
            <>
              <span>🚀</span> {t.uploadTitle}
            </>
          )}
        </Button>
      </div>

      {/* Progress alert overlay */}
      {loading && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 p-6 rounded-2xl animate-pulse">
          <Loader text={`${t.userFriendlyWait} (${uploadProgress}%)`} />
          <p className="text-xs font-semibold mt-2.5 text-yellow-600/80 dark:text-yellow-400/80 transition-all duration-300">
            {uploadProgress < 30 && "⚡ Preparing and compressing form..."}
            {uploadProgress >= 30 && uploadProgress < 65 && "📤 Transmitting lightweight image data..."}
            {uploadProgress >= 65 && uploadProgress < 85 && "🤖 AI OCR is analyzing form lines & boxes..."}
            {uploadProgress >= 85 && uploadProgress < 98 && "✍️ FormSahayak AI is translating & compiling smart guidelines..."}
            {uploadProgress >= 98 && "✨ Almost done! Rendering layout overlays..."}
          </p>
          <div className="mt-4 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold mt-2 block text-right">{uploadProgress}%</span>
        </div>
      )}

      {/* Preview + AI Guidance Split Layout */}
      {preview && (
        <div className={guidance ? "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" : "w-full"}>
          
          {/* Left Column: Form Image Preview Canvas */}
          <div className={guidance ? "lg:col-span-7 space-y-6" : "w-full"}>
            <Card className="glass-panel p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {t.smartGuidance}
                </h2>
                
                {/* Zoom Action Bar */}
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5">
                  <button
                    onClick={() => setZoom(Math.max(0.4, zoom - 0.1))}
                    className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 flex items-center justify-center font-bold text-lg dark:text-slate-300 hover:bg-slate-50 transition cursor-pointer"
                    title="Zoom Out"
                  >
                    -
                  </button>
                  <span className="text-xs font-black min-w-[56px] text-center dark:text-slate-300">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom(Math.min(2.2, zoom + 0.1))}
                    className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 flex items-center justify-center font-bold text-lg dark:text-slate-300 hover:bg-slate-50 transition cursor-pointer"
                    title="Zoom In"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Interactive Zoom Canvas */}
              <div className="relative max-w-2xl mx-auto overflow-auto rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900 select-none">
                <div 
                  className="relative origin-top-left transition-transform duration-200" 
                  style={{ transform: `scale(${zoom})`, width: `${100 / zoom}%` }}
                >
                  <img
                    src={preview}
                    alt="uploaded-form-canvas"
                    className="w-full h-auto rounded-xl object-contain"
                    onLoad={(event) => {
                      const target = event.currentTarget
                      setImageMeta({
                        width: target.naturalWidth || 1,
                        height: target.naturalHeight || 1
                      })
                    }}
                  />
                  <OcrOverlay
                    boxes={ocrBoxes}
                    currentLine={currentLine}
                    guidanceLines={guidanceLines}
                    guidanceSteps={guidanceSteps}
                    noOcrText={t.noOcrBoxes}
                    showNoOcr={!loading && ocrBoxes.length === 0 && guidance}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: AI Typed Guidance and Audio controls */}
          {guidance && (
            <div className="lg:col-span-5 space-y-6">
              <Card className="glass-panel p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl animate-pulse">🤖</span>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {t.aiGuidance}
                    </h2>
                  </div>

                  {/* Audio Panel & PDF Download Row */}
                  <div className="flex flex-wrap gap-3 items-center">
                    <Button
                      onClick={speakGuidance}
                      disabled={isSpeaking}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-5 min-h-0 text-sm rounded-xl cursor-pointer"
                    >
                      🔊 {t.startVoice}
                    </Button>

                    <Button
                      onClick={stopVoice}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 min-h-0 text-sm rounded-xl cursor-pointer"
                    >
                      ⏹ {t.stop}
                    </Button>

                    {pdfFile && (
                      <a
                        href={pdfFile}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 text-sm rounded-xl inline-flex items-center gap-1.5 shadow"
                      >
                        📄 {t.downloadPdf}
                      </a>
                    )}
                  </div>
                </div>

                {/* Guidelines typewritten list */}
                <div className="space-y-4 pt-2">
                  {displayedLines.map((line, index) => {
                    const isCurrent = currentLine === index
                    return (
                      <div
                        key={index}
                        className={`text-base md:text-lg leading-relaxed p-4 rounded-2xl border transition duration-300 animate-fade-in-up ${
                          isCurrent
                            ? "bg-yellow-400/20 border-yellow-500/40 font-bold dark:text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.15)]"
                            : "bg-slate-50/50 dark:bg-white/5 border-slate-200/50 dark:border-white/5 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {line}
                      </div>
                    )
                  })}
                  
                  {/* Show fallback alert if empty */}
                  {!guidanceLines.length && (
                    <p className="text-slate-400 dark:text-slate-500">{t.noGuidance}</p>
                  )}
                </div>

                {/* Extracted RAW Text container */}
                <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
                    {t.extractedText}
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl p-5">
                    {extractedText ? (
                      <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {extractedText}
                      </p>
                    ) : (
                      <p className="text-slate-400 dark:text-slate-500 text-sm">{t.noExtractedText}</p>
                    )}
                  </div>
                </div>

                {/* Custom audio music controls widget */}
                <AudioGuidanceControls audioFile={audioFile} t={t} />

              </Card>
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export default Upload