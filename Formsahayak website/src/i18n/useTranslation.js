import { useEffect, useMemo, useState } from "react"
import translations, { SUPPORTED_LANGUAGES, VOICE_LANG_MAP } from "./translations"

const FALLBACK_LANGUAGE = "English"

const normalizeLanguage = (language) => {
  if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
    return FALLBACK_LANGUAGE
  }
  return language
}

export function getCurrentUserLanguage() {
  try {
    const user = JSON.parse(localStorage.getItem("user"))
    return normalizeLanguage(user?.language)
  } catch (error) {
    return FALLBACK_LANGUAGE
  }
}

export function useTranslation() {
  const [language, setLanguage] = useState(getCurrentUserLanguage())

  useEffect(() => {
    const syncLanguage = () => setLanguage(getCurrentUserLanguage())
    window.addEventListener("storage", syncLanguage)
    window.addEventListener("user-language-updated", syncLanguage)
    return () => {
      window.removeEventListener("storage", syncLanguage)
      window.removeEventListener("user-language-updated", syncLanguage)
    }
  }, [])

  const t = useMemo(() => translations[language] || translations[FALLBACK_LANGUAGE], [language])
  const voiceLang = VOICE_LANG_MAP[language] || "en"
  return { t, language, voiceLang }
}
