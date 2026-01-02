import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../supabase/client"

export default function AdminRoute({ children }) {
  const [loading, setloading] = useState(true)
  const [isadmin, setisadmin] = useState(false)

  useEffect(() => {
    checkadmin()
  }, [])

  async function checkadmin() {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) {
      setloading(false)
      return
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()

    if (!error && data?.role === "admin") {
      setisadmin(true)
    }

    setloading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Verifying admin access...
      </div>
    )
  }

  if (!isadmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
