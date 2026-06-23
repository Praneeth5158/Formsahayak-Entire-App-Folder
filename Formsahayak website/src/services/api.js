import axios from "axios"

const api = axios.create({
  baseURL: "https://formsahayak-backend-new.onrender.com"
})

const langCodeMap = {
  English: "en",
  Telugu: "te",
  Hindi: "hi",
  Tamil: "ta"
}

api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"))
    const selectedLanguage = user?.language || "English"
    config.headers["Accept-Language"] = selectedLanguage
    config.headers["X-Language-Code"] = langCodeMap[selectedLanguage] || "en"
  } catch (error) {
    config.headers["Accept-Language"] = "English"
    config.headers["X-Language-Code"] = "en"
  }
  return config
})

export default api