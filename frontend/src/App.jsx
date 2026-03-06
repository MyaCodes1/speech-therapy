import { useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import Register from "./Register"
import Home from "./Home"
import Exercises from "./Exercises"


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
    <div>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
      <p>
        Don't have an account?{" "}
        <button onClick={() => navigate("/register")}>Register</button> </p>
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
    </Routes>
  )
}
export default App