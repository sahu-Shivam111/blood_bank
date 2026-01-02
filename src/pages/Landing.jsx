import { useEffect, useState } from "react"
import { supabase } from "../supabase/client"
import { motion } from "framer-motion"
import { Droplet, ShieldCheck, Settings } from "lucide-react"

export default function Landing() {
  const [campnotice, setcampnotice] = useState("Loading camp notice...")

  useEffect(() => {
    async function fetchCampNotice() {
      const { data } = await supabase
        .from("camp_notice")
        .select("notice")
        .eq("id", 1)
        .single()

      setcampnotice(
        data?.notice || "🩸 Mega Blood Donation Camp on 25 Sept at City Hospital"
      )
    }
    fetchCampNotice()
  }, [])

  return (
    <div className="w-full text-gray-800 overflow-x-hidden scroll-smooth">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl shadow z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-red-600 tracking-wide">
            BloodBank+
          </h1>
          <div className="space-x-6 font-medium hidden md:block">
            <a href="#home" className="hover:text-red-600">Home</a>
            <a href="#about" className="hover:text-red-600">About</a>
            <a href="#camp" className="hover:text-red-600">Camps</a>
            <a href="#contact" className="hover:text-red-600">Contact</a>
            <a href="/login" className="bg-red-600 text-white px-4 py-2 rounded-xl">Login</a>
            <a href="/register" className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-xl">Register</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="pt-32 min-h-screen relative flex items-center">

        {/* BACKGROUND SLIDER */}
        <div className="absolute inset-0 z-0">
          {["slide1.png", "slide2.png", "slide3.png"].map((img, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 bg-cover bg-center mt-17 w-full"
              style={{ backgroundImage: `url("/images/${img}")` }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 12, repeat: Infinity, delay: i * 4 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl font-extrabold leading-tight">
              Donate Blood, <span className="text-red-400">Save Lives</span>
            </h2>
            <p className="mt-6 text-lg text-white-800 max-w-xl">
              A modern, secure platform connecting blood donors with patients instantly.
            </p>
            <div className="mt-10 flex gap-4">
              <a href="/register" className="bg-red-600 px-6 py-3 rounded-xl text-lg hover:scale-105 transition">
                Become a Donor
              </a>
              <a href="#camp" className="border border-white px-6 py-3 rounded-xl text-lg hover:bg-white hover:text-red-600 transition">
                View Camps
              </a>
            </div>
          </motion.div>

          <motion.img
            src="/blood-hero.png"
            className="rounded-3xl shadow-2xl "
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          />
        </div>
      </section>

      {/* CAMP NOTICE */}
      <section id="camp" className="py-24 bg-gradient-to-r from-red-600 to-pink-600">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-white/20 backdrop-blur-xl text-white p-10 rounded-3xl shadow-2xl text-center"
        >
          <h3 className="text-4xl font-extrabold mb-6">📢 Donation Camp Alert</h3>
          <p className="text-2xl font-medium">{campnotice}</p>
        </motion.div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-extrabold text-red-600 mb-16">
            Why Choose Us?
          </h3>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Fast Search", icon: <Droplet />, text: "Find donors instantly by blood group and city." },
              { title: "Secure System", icon: <ShieldCheck />, text: "Supabase authentication with RLS security." },
              { title: "Admin Control", icon: <Settings />, text: "Complete admin panel to manage camps & donors." }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10, scale: 1.05 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="p-10 rounded-3xl shadow-xl bg-gray-50"
              >
                <div className="text-red-600 text-5xl mb-6 flex justify-center">
                  {item.icon}
                </div>
                <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
                <p className="text-gray-600">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-28 bg-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-center text-red-600 mb-14">
            Contact Us
          </h3>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl grid md:grid-cols-2 gap-6"
          >
            <input className="p-4 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none" placeholder="Your Name" />
            <input className="p-4 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none" placeholder="Your Email" />
            <textarea rows="5" className="p-4 rounded-xl border md:col-span-2 focus:ring-2 focus:ring-red-500 outline-none" placeholder="Your Message"></textarea>
            <button className="md:col-span-2 bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-xl text-lg hover:scale-105 transition">
              Send Message
            </button>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        © 2025 BloodBank+ | Save Lives Together
      </footer>
    </div>
  )
}
