import { useEffect, useState } from "react"
import { supabase } from "../supabase/client"
import { Droplet, Users, LogOut } from "lucide-react"

export default function Dashboard() {
  const [profile, setprofile] = useState(null)
  const [loading, setloading] = useState(true)

  const [totalDonors, settotalDonors] = useState(0)
  const [availableBlood, setavailableBlood] = useState(0)
  const [pendingRequests, setpendingRequests] = useState(0)

  const [requestBloodGroup, setrequestBloodGroup] = useState("")
  const [requestCity, setrequestCity] = useState("")
  const [requestLoading, setrequestLoading] = useState(false)

  const [myRequests, setmyRequests] = useState([])

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  useEffect(() => {
    init()
  }, [])

  async function init() {
    const { data: auth } = await supabase.auth.getUser()

    if (!auth?.user) {
      window.location.href = "/login"
      return
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, name, role")
      .eq("id", auth.user.id)
      .single()

    if (!profileData) {
      window.location.href = "/login"
      return
    }

    if (profileData.role === "admin") {
      window.location.href = "/admin-dashboard"
      return
    }

    setprofile(profileData)

    await Promise.all([fetchStats(), fetchMyRequests()])
    setloading(false)
  }

  async function fetchStats() {
    const { count: donorsCount } = await supabase
      .from("donors")
      .select("*", { count: "exact", head: true })

    const { count: availableCount } = await supabase
      .from("donors")
      .select("*", { count: "exact", head: true })
      .eq("available", true)

    const { count: pendingCount } = await supabase
      .from("requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    settotalDonors(donorsCount || 0)
    setavailableBlood(availableCount || 0)
    setpendingRequests(pendingCount || 0)
  }

  async function fetchMyRequests() {
    const { data } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false })

    setmyRequests(data || [])
  }

  async function submitRequest(e) {
    e.preventDefault()

    if (!requestBloodGroup || !requestCity) {
      alert("Please select blood group and city")
      return
    }

    setrequestLoading(true)

    const { data: auth } = await supabase.auth.getUser()
    if (!auth?.user) return

    const { data: existing } = await supabase
      .from("requests")
      .select("id")
      .eq("user_id", auth.user.id)
      .eq("status", "pending")
      .maybeSingle()

    if (existing) {
      alert("You already have a pending request")
      setrequestLoading(false)
      return
    }

    await supabase.from("requests").insert({
      user_id: auth.user.id,
      blood_group: requestBloodGroup,
      city: requestCity.trim().toLowerCase(),
      status: "pending"
    })

    setrequestLoading(false)
    setrequestBloodGroup("")
    setrequestCity("")
    fetchStats()
    fetchMyRequests()
  }

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">
            Welcome, <span className="text-red-600">{profile?.name}</span>
          </h1>
          <p className="text-gray-500">Blood Bank User Dashboard</p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        <Stat title="Total Donors" value={totalDonors} gradient="from-red-500 to-pink-500" />
        <Stat title="Available Blood" value={availableBlood} gradient="from-green-500 to-emerald-500" />
        <Stat title="Pending Requests" value={pendingRequests} gradient="from-blue-500 to-indigo-500" />
      </div>

      {/* ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <ActionCard
          title="Become a Donor"
          desc="Register your blood details & save lives"
          link="/donor"
          icon={<Droplet size={30} />}
        />

        <ActionCard
          title="Search Blood"
          desc="Find blood donors near your city"
          link="/search"
          icon={<Users size={30} />}
        />
      </div>

      {/* REQUEST BLOOD */}
      <div className="max-w-md mx-auto bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl mb-16">
        <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">
          Request Blood
        </h2>

        <form onSubmit={submitRequest} className="space-y-4">
          <select
            value={requestBloodGroup}
            onChange={e => setrequestBloodGroup(e.target.value)}
            className="w-full p-3 border rounded-xl"
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map(b => (
              <option key={b}>{b}</option>
            ))}
          </select>

          <input
            value={requestCity}
            placeholder="Enter City"
            onChange={e => setrequestCity(e.target.value)}
            className="w-full p-3 border rounded-xl"
          />

          <button
            type="submit"
            disabled={requestLoading}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white p-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            {requestLoading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>

      {/* MY REQUESTS */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6">My Requests</h2>

        {myRequests.length === 0 && (
          <p className="text-gray-500">No requests yet</p>
        )}

        {myRequests.map(r => (
          <div key={r.id} className="border-b py-4">
            <p className="font-semibold">
              {r.blood_group} — {r.city}
            </p>
            <p className="text-sm text-gray-500 capitalize">
              Status: {r.status}
            </p>
          </div>
        ))}
      </div>

    </div>
  )
}

/* ================= COMPONENTS ================= */

function Stat({ title, value, gradient }) {
  return (
    <div className={`p-6 rounded-2xl text-white shadow-xl bg-gradient-to-r ${gradient}`}>
      <h3 className="text-sm opacity-90">{title}</h3>
      <p className="text-4xl font-extrabold mt-2">{value}</p>
    </div>
  )
}

function ActionCard({ title, desc, link, icon }) {
  return (
    <button
      onClick={() => window.location.href = link}
      className="group bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition flex items-center gap-6 text-left"
    >
      <div className="bg-red-100 text-red-600 p-5 rounded-2xl group-hover:scale-110 transition">
        {icon}
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-800">
          {title}
        </h3>
        <p className="text-gray-500 mt-1">
          {desc}
        </p>
      </div>
    </button>
  )
}
