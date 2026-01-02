import { useState } from "react"
import { supabase } from "../supabase/client"

export default function Search() {
  const [blood, setblood] = useState("")
  const [city, setcity] = useState("")
  const [results, setresults] = useState([])
  const [loading, setloading] = useState(false)

  async function search() {
    setloading(true)

    let query = supabase
      .from("donors")
      .select("id, blood_group, city, phone, available")
      .eq("available", true)

    if (blood) query = query.eq("blood_group", blood)
    if (city) query = query.ilike("city", `%${city}%`)

    const { data, error } = await query

    if (error) {
      console.error(error)
      setresults([])
    } else {
      setresults(data || [])
    }

    setloading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-red-600">
            Find Blood Donors
          </h1>
          <p className="text-gray-600 mt-2">
            Search nearby blood donors instantly
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="border p-3 rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
              onChange={e => setblood(e.target.value)}
            >
              <option value="">Select Blood Group</option>
              {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b =>
                <option key={b} value={b}>{b}</option>
              )}
            </select>

            <input
              placeholder="Enter City"
              className="border p-3 rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
              onChange={e => setcity(e.target.value)}
            />

            <button
              onClick={search}
              className="bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-md"
            >
              Search Donors
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-600 animate-pulse">
            Searching donors...
          </p>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && (
          <p className="text-center text-gray-500">
            No donors found
          </p>
        )}

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {results.map(d => (
            <div
              key={d.id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all border-l-4 border-red-500"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-red-600">
                  {d.blood_group}
                </span>
                <span className="text-sm text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full">
                  Available
                </span>
              </div>

              <p className="text-gray-700">
                <b>City:</b> {d.city}
              </p>

              <p className="text-gray-700 mt-1">
                <b>Contact:</b> {d.phone}
              </p>

              <button
                className="mt-4 w-full bg-red-50 text-red-600 font-semibold py-2 rounded-xl hover:bg-red-100 transition"
              >
                Call Donor
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
