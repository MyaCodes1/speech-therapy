import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"


function ParentDashboard() {
    const [stats, setStats] = useState(null)
    const [attempts, setAttempts] = useState([])
    const navigate = useNavigate()
    const [pinVerified, setPinVerified] = useState(false)
    const [pinInput, setPinInput] = useState("")
    const [pinError, setPinError] = useState("")

    const fetchAttempts = async () => {
        const response = await fetch("/api/parent/attempts", {
            credentials: "include",
        })
        const data = await response.json()
        setAttempts(data)
    }
    const fetchStats = async () => {
        const response = await fetch("/api/parent/dashboard", {
            credentials: "include",
        })
        const data = await response.json()
        setStats(data)
    }

    useEffect(() => {
        fetchAttempts()
        fetchStats()

    }, [])

    const LineChartData = attempts.reduce((acc, attempt) => {
        const date = attempt.attempted_at.split("T")[0] // Get date part only
        const existing = acc.find(a => a.date === date)
        if (existing) {
            existing.total += 1
            if (attempt.is_correct) existing.correct += 1
            existing.percentage = Math.round((existing.correct / existing.total) * 100)
        } else {
            acc.push({ date, total: 1, correct: attempt.is_correct ? 1 : 0, percentage: attempt.is_correct ? 100 : 0 })
        }
        return acc
    }, [])

    const handlePinSubmit = async () => {
        const response = await fetch("/api/auth/verify-pin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                pin: pinInput.trim()
            }),
        })
        const data = await response.json()
        if (response.ok) {
            setPinVerified(true)
        }
        else {
            setPinError(data.detail || "Incorrect PIN. Please try again.")
        }
    }
    //pin verfieid code 





    return (
        <div style={{ minHeight: "100vh", background: "#f5efe6", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1 style={{ color: "#5c3d1e", fontSize: "2rem" }}>Parent dashboard</h1>

                <button onClick={() => navigate("/home")} style={{ background: "#5c3d1e", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px", fontSize: "1rem", cursor: "pointer" }}>
                    Back to Home </button>
            </div>

            {stats && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>

                    {[
                        { label: "Total Attempts", value: stats.total_attempts, color: "#e07b39" },
                        { label: "Correct Attempts", value: stats.correct_attempts, color: "#f2a365" },
                        { label: "Accuracy", value: `${stats.accuracy.toFixed(1)}%`, color: "#f7d794" },
                        { label: "Total XP", value: stats.xp, color: "#f7d794" },

                    ].map(({ label, value, color }) => (
                        <div key={label} style={{ background: "white", borderRadius: "15px", padding: "1.5rem", textAlign: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.08" }}>
                            <p style={{ color: "#888", marginBottom: "0.5rem", fontSize: "0.9rem" }}>{label}</p>
                            <p style={{ color, fontSize: "2rem", fontWeight: "bold" }}>{value}</p>
                        </div>
                    ))}

                </div>
            )}

            <div style={{ background: "white", borderRadius: "15px", padding: "2rem", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", marginBottom: "2rem" }}>
                <h2 style={{ color: "#5c3d1e", marginBottom: "1.5rem" }}> Correct Vs. Incorrect attempts </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={[
                                { name: "Correct", value: stats ? stats.correct_attempts : 0 },
                                { name: "Incorrect", value: stats ? stats.total_attempts - stats.correct_attempts : 0 }
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            label >
                            <Cell fill="#50C878" />
                            <Cell fill="#FF0026" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div style={{ background: "white", borderRadius: "15px", padding: "2rem", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", marginBottom: "2rem" }}>
                <h2 style={{ color: "#5c3d1e", marginBottom: "1.5rem" }}> Correct over time </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={LineChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis ticketFormatter={(value) => `${value}%`} domain={[0, 100]} />
                        <Tooltip />
                        <XAxis dataKey="date" />
                        <Line type="monotone" dataKey="percentage" strokeWidth={2} stroke="#5c3d1e" dot={{ fill: "#e07b39" }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>







            <div style={{ background: "white", borderRadius: "15px", padding: "2rem", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}>
                <h2 style={{ color: "#5c3d1e", marginBottom: "1.5rem" }}>  Attempt history </h2>
                {attempts.length === 0 ? (
                    <p style={{ color: "#888" }}>No attempts yet</p>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f5efe6" }}>
                                <th style={{ padding: "12px", textAlign: "left", color: "#5c3d1e" }}>Word</th>
                                <th style={{ padding: "12px", textAlign: "left", color: "#5c3d1e" }}>Phoneme</th>
                                <th style={{ padding: "12px", textAlign: "left", color: "#5c3d1e" }}>Result</th>
                                <th style={{ padding: "12px", textAlign: "left", color: "#5c3d1e" }}>Score</th>
                                <th style={{ padding: "12px", textAlign: "left", color: "#5c3d1e" }}>You said</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attempts.map((attempt, index) => (
                                <tr key={index} style={{ borderBottom: "1px solid #f0e6d6" }}>
                                    <td style={{ padding: "12px", color: "#5c3d1e", fontWeight: "bold" }}> {attempt.word}</td>
                                    <td style={{ padding: "12px" }}>{attempt.phoneme}</td>
                                    <td style={{ padding: "12px" }}> {attempt.is_correct ? "Correct" : "Incorrect"} </td>
                                    <td style={{ padding: "12px" }}> {attempt.score}</td>
                                    <td style={{ padding: "12px", color: "#888" }}>{attempt.transcription}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default ParentDashboard
