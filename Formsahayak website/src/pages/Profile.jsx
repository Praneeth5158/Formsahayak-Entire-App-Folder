import { useEffect, useState } from "react"
import api from "../services/api"
import { useTranslation } from "../i18n/useTranslation"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"

function Profile() {
  const { t } = useTranslation()
  const user = JSON.parse(localStorage.getItem("user")) || { email: "user@example.com", name: "User" }

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    language: "English",
    profile_image: ""
  })

  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(
    localStorage.getItem("profileImage") || ""
  )

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/profile/${user.email}`)
      setProfile(res.data)
      if (res.data.profile_image) {
        setPreview(res.data.profile_image)
        localStorage.setItem("profileImage", res.data.profile_image)
      }
    } catch (error) {
      console.log(error)
      alert(t.profileLoadFailed)
    }
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", user.email)
      formData.append("phone", profile.phone)
      formData.append("language", profile.language)

      if (image) {
        formData.append("profile_image", image)
      }

      await api.post("/update-profile", formData)

      const updatedUser = {
        ...user,
        language: profile.language
      }

      localStorage.setItem("user", JSON.stringify(updatedUser))
      alert(`${t.profileUpdated} 😄`)
      window.dispatchEvent(new Event("user-language-updated"))

      setEditing(false)
      fetchProfile()
    } catch (error) {
      console.log(error)
      alert(t.updateFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title & Edit toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            {t.myProfile}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-[15px]">
            Manage your personal profile and system translation configurations.
          </p>
        </div>

        {!editing && (
          <Button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition"
          >
            ✏️ {t.editProfile}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Profile Info Column */}
        <div className="lg:col-span-2">
          <Card className="glass-panel p-6 md:p-8">
            <form onSubmit={updateProfile} className="space-y-6">
              
              {/* Profile image on mobile / simple layout inside form */}
              <div className="flex flex-col items-center sm:hidden pb-6 border-b border-slate-100 dark:border-white/5">
                <div className="relative group rounded-full overflow-hidden w-28 h-28 border-4 border-blue-500/20 shadow-lg">
                  <img
                    src={preview || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="profile-mobile"
                    className="w-full h-full object-cover"
                  />
                  {editing && (
                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer">
                      Change
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            setImage(file)
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              setPreview(reader.result)
                              localStorage.setItem("profileImage", reader.result)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Name (Disabled) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t.name}
                </label>
                <input
                  type="text"
                  value={profile.name}
                  disabled
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 rounded-2xl outline-none text-[15px] text-slate-500 font-medium dark:text-slate-400 cursor-not-allowed"
                />
              </div>

              {/* Email (Disabled) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t.email}
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 rounded-2xl outline-none text-[15px] text-slate-500 font-medium dark:text-slate-400 cursor-not-allowed"
                />
              </div>

              {/* Phone (Editable) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t.phoneNumber}
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  disabled={!editing}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className={`w-full p-4 rounded-2xl border text-[15px] font-medium outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    !editing
                      ? "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 dark:text-slate-200"
                  }`}
                />
              </div>

              {/* Language (Editable) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t.preferredLanguage}
                </label>
                <select
                  value={profile.language}
                  disabled={!editing}
                  onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                  className={`w-full p-4 rounded-2xl border text-[15px] font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    !editing
                      ? "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-white/10 dark:text-slate-200"
                  }`}
                >
                  <option>English</option>
                  <option>Telugu</option>
                  <option>Hindi</option>
                  <option>Tamil</option>
                </select>
              </div>

              {/* Buttons */}
              {editing && (
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditing(false)
                      fetchProfile()
                    }}
                    className="flex-1 rounded-2xl py-4"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      t.saveChanges
                    )}
                  </Button>
                </div>
              )}

            </form>
          </Card>
        </div>

        {/* Right Columns: Premium Image Hover Card */}
        <div className="hidden sm:block">
          <Card className="glass-panel p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-6">
            <h3 className="font-bold text-slate-500 uppercase tracking-widest text-xs">
              Avatar Image
            </h3>
            
            <div className="relative group rounded-full overflow-hidden w-40 h-40 border-4 border-blue-500/20 shadow-xl transition-all duration-300 hover:scale-105">
              <img
                src={preview || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="profile-desktop"
                className="w-full h-full object-cover"
              />
              {editing && (
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer">
                  <span className="text-xl mb-1">📷</span>
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        setImage(file)
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setPreview(reader.result)
                          localStorage.setItem("profileImage", reader.result)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                </label>
              )}
            </div>

            <div className="text-sm">
              <h4 className="font-bold text-slate-800 dark:text-slate-200">{profile.name || user.name}</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">AI Form Companion Profile</p>
            </div>
          </Card>
        </div>

      </div>

    </div>
  )
}

export default Profile
