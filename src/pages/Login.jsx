import { useState } from "react"
import { supabase } from "../supabase/client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function Login() {
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [loading, setloading] = useState(false)
  const [error, seterror] = useState("")

  async function login(e) {
    e.preventDefault()
    setloading(true)
    seterror("")

    const { data: { user }, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password
      })

    if (signInError) {
      setloading(false)
      seterror(signInError.message)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    setloading(false)

    if (profileError) {
      seterror("Failed to fetch user profile")
      return
    }

    if (profile.role === "admin") {
      window.location.href = "/admin-dashboard"
    } else {
      window.location.href = "/dashboard"
    }
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-pink-600 to-red-700 px-4 overflow-hidden">

      {/* GLASS CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white/20 backdrop-blur-2xl rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.25)] border border-white/30 overflow-hidden"
      >
        <div className="bg-white p-10 rounded-3xl">

          <h1 className="text-3xl font-extrabold text-center text-red-600 mb-2">
            Welcome Back
          </h1>

          <p className="text-center text-gray-500 mb-8">
            Sign in to continue to BloodBank+
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-5 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={login} className="space-y-5">

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                onChange={e => setemail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                onChange={e => setpassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-xl text-lg font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-red-600 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
