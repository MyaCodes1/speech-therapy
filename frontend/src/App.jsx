import { useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import Register from "./Register"
import Home from "./Home"
import Exercises from "./Exercises"
import ParentDashboard from "./ParentDashboard"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()


  const handleLogin = async () => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
    if (response.ok) {
      navigate("/home")
    }
    else {
      setError("Invalid email or password")
    }

  }


  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>


      <h1 style={{ fontSize: "3rem", color: "white", textShadow: "3px 3px 0px #5c3d1e", marginBottom: "2rem", letterSpacing: "2px" }}> SOUND SAFARI </h1>

      <div style={{ background: "white", padding: "2rem", borderRadius: "20px", boxShadow: "0 8px 30px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px", position: "relative" }}>
        <h2 style={{ color: "#5c3d1e", marginBottom: "1.5rem", textAlign: "center" }}> Welcome Back! </h2>

        <input type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "1rem", borderRadius: "10px", border: "2px solid #d4a96a", fontSize: "1rem", outline: "none" }} />

        <input type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "1rem", borderRadius: "10px", border: "2px solid #d4a96a", fontSize: "1rem", outline: "none" }} />

        <button onClick={handleLogin} style={{ width: "100%", padding: "12px", background: "#5c3d1e", color: "white", border: "none", borderRadius: "10px", fontSize: "1rem", cursor: "pointer" }}>
          Log In
        </button>

        {error && <p style={{ color: "red", marginTop: "1rem", textAlign: "center" }}>{error}</p>}
        <p style={{ marginTop: "1rem", textAlign: "center", color: "#888" }}>
          Don't have an account? {" "}
          <button onClick={() => navigate("/register")} style={{ background: "none", border: "none", color: "#5c3d1e", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>
            Register
          </button>
        </p>


      </div>

    </div>


  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/exercises/:id/:word" element={<Exercises />} />
      <Route path="/parent" element={<ParentDashboard />} />
    </Routes>
  )
}
export default App