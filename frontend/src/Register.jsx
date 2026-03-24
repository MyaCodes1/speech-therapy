import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const [age, setAge] = useState("")


    const handleRegister = async () => {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, email, password, age: parseInt(age) }),
        })
        if (response.ok) {
            alert("Sign up successful! Please log in.")
        }
        else {
            setError("Registration failed. Please try again.")
        }

    }

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>


            <h1 style={{ fontSize: "3rem", color: "white", textShadow: "3px 3px 0px #5c3d1e", marginBottom: "2rem", letterSpacing: "2px" }}> SOUND SAFARI </h1>

            <div style={{ background: "white", padding: "2rem", borderRadius: "20px", boxShadow: "0 8px 30px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px", position: "relative" }}>
                <h2 style={{ color: "#5c3d1e", marginBottom: "1.5rem", textAlign: "center" }}> Join the jungle! </h2>



                <input type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: "100%", padding: "12px", marginBottom: "1rem", borderRadius: "10px", border: "2px solid #d4a96a", fontSize: "1rem", outline: "none" }} />

                <input type="number"
                    placeholder="Child's Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min={3}
                    max={10}
                    style={{ width: "100%", padding: "12px", marginBottom: "1rem", borderRadius: "10px", border: "2px solid #d4a96a", fontSize: "1rem", outline: "none" }} />


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




                <button onClick={handleRegister} style={{ width: "100%", padding: "12px", background: "#5c3d1e", color: "white", border: "none", borderRadius: "10px", fontSize: "1rem", cursor: "pointer" }}>
                    Register
                </button>

                {error && <p style={{ color: "red", marginTop: "1rem", textAlign: "center" }}>{error}</p>}
                <p style={{ marginTop: "1rem", textAlign: "center", color: "#888" }}>
                    Already have an account? {" "}
                    <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#5c3d1e", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" }}>
                        Log in
                    </button>
                </p>




            </div>

        </div >


    )
}
export default Register