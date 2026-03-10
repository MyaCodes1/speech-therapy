import { useState } from "react"

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")


    const handleLogin = async () => {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, email, password }),
        })
        if (response.ok) {
            alert("Sign up successful! Please log in.")
        }
        else {
            setError("Registration failed. Please try again.")
        }

    }

    return (
        <div>

            <h1>Register</h1>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />




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
            <button onClick={handleLogin}>Register</button>
            {error && <p>{error}</p>}

        </div>

    )
}
export default Register