import { useState } from "react"
import { supabase } from "../supabase/client"

export default function RequestBlood() {
  const [blood, setblood] = useState("")
  const [city, setcity] = useState("")
  const [loading, setloading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setloading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from("requests").insert({
      user_id: user.id,
      blood_group: blood,
      city
    })

    setblood("")
    setcity("")
    setloading(false)
    alert("Blood request submitted")
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white p-6 rounded-xl shadow mt-6"
    >
      <h2 className="text-xl font-bold text-red-600 mb-4">
        Request Blood
      </h2>

      <select
        className="w-full border p-3 rounded mb-3"
        value={blood}
        onChange={e => setblood(e.target.value)}
      >
        <option value="">Select Blood Group</option>
        {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b =>
          <option key={b}>{b}</option>
        )}
      </select>

      <input
        className="w-full border p-3 rounded mb-3"
        placeholder="City"
        value={city}
        onChange={e => setcity(e.target.value)}
      />

      <button
        disabled={loading}
        className="w-full bg-red-600 text-white p-3 rounded hover:bg-red-700"
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  )
}
