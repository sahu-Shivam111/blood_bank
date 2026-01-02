import { useState } from "react"
import { supabase } from "../supabase/client"
import { motion } from "framer-motion"

export default function Register() {
  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [phone, setphone] = useState("")

  async function register() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      alert(error.message)
      return
    }

    await supabase.from("profiles").insert({
      id: data.user.id,
      name,
      phone
    })

    window.location.href = "/"
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-pink-600 to-red-700 px-4 overflow-hidden">

      {/* GLASS CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-4xl w-full grid md:grid-cols-2 bg-white/20 backdrop-blur-2xl rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.25)] border border-white/30 overflow-hidden"
      >

        {/* LEFT IMAGE / BRAND */}
        <div className="hidden md:flex flex-col items-center justify-center p-10 bg-gradient-to-br from-white/20 to-white/5">
          <img
            src="/blood-donation.png"
            alt="Blood Donation"
            className="h-72 object-contain drop-shadow-2xl"
          />
          <h2 className="mt-8 text-3xl font-extrabold text-white text-center">
            Join the Life Savers
          </h2>
          <p className="mt-3 text-white/80 text-center max-w-sm">
            Register as a donor and help save lives through our secure blood bank system.
          </p>
        </div>

        {/* FORM SECTION */}
        <div className="p-10 bg-white rounded-3xl md:rounded-l-none">
          <h2 className="text-3xl font-extrabold text-red-600 text-center mb-2">
            Create Account
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Become a registered blood donor
          </p>

          <div className="flex flex-col gap-5">

            <input
              placeholder="Full Name"
              value={name}
              onChange={e => setname(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />

            <input
              placeholder="Email Address"
              value={email}
              onChange={e => setemail(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setpassword(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />

            <input
              placeholder="Phone Number"
              value={phone}
              onChange={e => setphone(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />

            <button
              onClick={register}
              className="mt-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold py-3 rounded-xl text-lg hover:scale-105 transition-transform shadow-lg"
            >
              Register Now
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-red-600 font-semibold hover:underline">
                Login
              </a>
            </p>

          </div>
        </div>
      </motion.div>
    </div>
  )
}
