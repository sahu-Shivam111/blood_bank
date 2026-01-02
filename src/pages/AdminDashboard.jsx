import { useEffect, useState } from "react"
import { supabase } from "../supabase/client"

export default function AdminDashboard() {
  const [loading, setloading] = useState(true)
  const [error, seterror] = useState("")
  const [campNotice, setcampNotice] = useState("")

  const [users, setusers] = useState([])
  const [donors, setdonors] = useState([])
  const [requests, setrequests] = useState([])

  useEffect(() => {
    verifyadmin()
  }, [])

  async function verifyadmin() {
    const { data: auth } = await supabase.auth.getUser()

    if (!auth?.user) {
      window.location.href = "/login"
      return
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", auth.user.id)
      .single()

    if (error || data.role !== "admin") {
      window.location.href = "/dashboard"
      return
    }

    fetchAll()
  }

  async function fetchAll() {
    setloading(true)
    seterror("")

    try {
      await Promise.all([
        fetchUsers(),
        fetchDonors(),
        fetchRequests(),
        fetchCampNotice()
      ])
    } catch (err) {
      seterror(err.message)
    }

    setloading(false)
  }

  async function deleteDonor(id) {
    if (!window.confirm("Delete this donor?")) return
    await supabase.from("donors").delete().eq("id", id)
    fetchDonors()
  }

  async function fetchUsers() {
    const { data } = await supabase
      .from("profiles")
      .select("id, name, phone, role")
    setusers(data || [])
  }

  async function fetchDonors() {
    const { data: donorsData } = await supabase.from("donors").select("*")
    if (!donorsData) return

    const userids = donorsData.map(d => d.user_id)

    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, name, phone")
      .in("id", userids)

    setdonors(
      donorsData.map(d => ({
        ...d,
        user: profilesData?.find(p => p.id === d.user_id)
      }))
    )
  }

  async function fetchRequests() {
    const { data } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false })

    if (!data) return

    const userids = data.map(r => r.user_id)

    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, name, phone")
      .in("id", userids)

    setrequests(
      data.map(r => ({
        ...r,
        user: profilesData?.find(p => p.id === r.user_id)
      }))
    )
  }

  async function fetchCampNotice() {
    const { data } = await supabase.from("camp_notice").select("*").single()
    setcampNotice(data?.notice || "")
  }

  async function updateCampNotice() {
    const notice = prompt("Update camp notice", campNotice)
    if (!notice) return
    await supabase.from("camp_notice").upsert({ id: 1, notice })
    setcampNotice(notice)
  }

  async function updateRequest(id, status) {
    await supabase.from("requests").update({ status }).eq("id", id)
    fetchRequests()
  }

  async function toggleDonor(id, available) {
    await supabase.from("donors").update({ available }).eq("id", id)
    fetchDonors()
  }

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading Admin Dashboard...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-red-600">
          Admin Dashboard
        </h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 shadow"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* CAMP NOTICE */}
      <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow mb-8 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">📢 Camp Notice</p>
          <p className="font-semibold text-lg">
            {campNotice || "No notice available"}
          </p>
        </div>
        <button
          onClick={updateCampNotice}
          className="bg-red-600 text-white px-4 py-2 rounded-xl"
        >
          Edit
        </button>
      </div>

      {/* REQUESTS */}
      <Section title="Blood Requests">
        {requests.length === 0 && <Empty text="No requests found" />}
        {requests.map(r => (
          <Card key={r.id}>
            <p className="font-semibold text-lg">
              {r.blood_group} • {r.city}
            </p>
            <p className="text-sm text-gray-600">
              {r.user?.name} ({r.user?.phone})
            </p>
            <StatusBadge status={r.status} />

            {r.status === "pending" && (
              <div className="mt-3 flex gap-2">
                <Btn green onClick={() => updateRequest(r.id, "approved")}>
                  Approve
                </Btn>
                <Btn red onClick={() => updateRequest(r.id, "rejected")}>
                  Reject
                </Btn>
              </div>
            )}
          </Card>
        ))}
      </Section>

      {/* DONORS */}
      <Section title="Donors">
        {donors.map(d => (
          <Card key={d.id}>
            <p className="font-semibold">
              {d.user?.name} ({d.user?.phone})
            </p>
            <p className="text-sm text-gray-600">
              {d.blood_group} • {d.city}
            </p>

            <div className="mt-3 flex gap-2">
              <Btn
                yellow={d.available}
                green={!d.available}
                onClick={() => toggleDonor(d.id, !d.available)}
              >
                {d.available ? "Disable" : "Enable"}
              </Btn>

              <Btn red onClick={() => deleteDonor(d.id)}>
                Delete
              </Btn>
            </div>
          </Card>
        ))}
      </Section>

      {/* USERS */}
      <Section title="Users">
        {users.map(u => (
          <Card key={u.id}>
            {u.name} • {u.phone}
            <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">
              {u.role}
            </span>
          </Card>
        ))}
      </Section>

    </div>
  )
}

/* ================= UI COMPONENTS ================= */

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  )
}

function Card({ children }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
      {children}
    </div>
  )
}

function Empty({ text }) {
  return <p className="text-gray-500">{text}</p>
}

function StatusBadge({ status }) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700"
  }
  return (
    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${colors[status]}`}>
      {status}
    </span>
  )
}

function Btn({ children, onClick, green, red, yellow }) {
  let color = "bg-gray-600"
  if (green) color = "bg-green-600"
  if (red) color = "bg-red-600"
  if (yellow) color = "bg-yellow-600"

  return (
    <button
      onClick={onClick}
      className={`${color} text-white px-4 py-2 rounded-xl hover:opacity-90`}
    >
      {children}
    </button>
  )
}
