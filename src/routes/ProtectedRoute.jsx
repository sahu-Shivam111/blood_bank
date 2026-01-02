import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../supabase/client"

export default function ProtectedRoute({ children }) {
  const [loading, setloading] = useState(true)
  const [session, setsession] = useState(null)

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      setsession(data.session)
      setloading(false)
    }

    init()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking login...
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}
