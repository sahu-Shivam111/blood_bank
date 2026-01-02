import { useState, useEffect } from "react"
import { supabase } from "../supabase/client"
import { Droplet, Phone, MapPin } from "lucide-react"

export default function Donor() {
  const [bloodGroup, setbloodGroup] = useState("")
  const [city, setcity] = useState("")
  const [phone, setphone] = useState("")
  const [available, setavailable] = useState(true)
  const [profile, setprofile] = useState(null)
  const [loading, setloading] = useState(false)

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        window.location.href = "/login"
        return
      }
      setprofile(data.user)
    }
    getUser()
  }, [])

  async function registerDonor(e) {
    e.preventDefault()
    if (!bloodGroup || !city || !phone) {
      alert("Please fill all fields")
      return
    }

    setloading(true)

    const { error } = await supabase.from("donors").insert({
      user_id: profile.id,
      blood_group: bloodGroup,
      city: city.toLowerCase(),
      phone,
      available
    })

    setloading(false)

    if (!error) {
      alert("You are now registered as a donor!")
      window.location.href = "/dashboard"
    } else {
      alert(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50 px-6">

      <form
        onSubmit={registerDonor}
        className="
          w-full max-w-md
          bg-white/70 backdrop-blur-xl
          rounded-3xl
          shadow-2xl
          p-8
          space-y-6
        "
      >
        {/* HEADER */}
        <div className="text-center">
          <div className="mx-auto w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4">
            <Droplet size={28} />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-800">
            Become a Donor
          </h2>

          <p className="text-gray-500 mt-2">
            Your blood can save someone’s life
          </p>
        </div>

        {/* BLOOD GROUP */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Blood Group
          </label>

          <select
            value={bloodGroup}
            onChange={e => setbloodGroup(e.target.value)}
            className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* CITY */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            City
          </label>

          <div className="relative mt-2">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Enter your city"
              value={city}
              onChange={e => setcity(e.target.value)}
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
        </div>

        {/* PHONE */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Phone Number
          </label>

          <div className="relative mt-2">
            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Enter phone number"
              value={phone}
              onChange={e => setphone(e.target.value)}
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
        </div>

        {/* AVAILABILITY TOGGLE */}
        <div className="flex items-center justify-between bg-red-50 p-4 rounded-xl">
          <span className="font-medium text-gray-700">
            Available for donation
          </span>

          <button
            type="button"
            onClick={() => setavailable(!available)}
            className={`w-14 h-7 flex items-center rounded-full transition ${
              available ? "bg-red-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`bg-white w-6 h-6 rounded-full shadow transform transition ${
                available ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            bg-gradient-to-r from-red-600 to-pink-600
            text-white
            py-3
            rounded-xl
            font-semibold
            text-lg
            hover:scale-105
            transition
            disabled:opacity-60
          "
        >
          {loading ? "Registering..." : "Register as Donor"}
        </button>

      </form>
    </div>
  )
}
