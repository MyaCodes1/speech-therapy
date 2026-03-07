import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"


function ParentDashboard() {
    const [stats, setStats] = useState(null)
    const [attempts, setAttempts] = useState([])
    const navigate = useNavigate()

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

    return (
        <div>
            <h1>Parent Dashboard</h1>
            <button onClick={() => navigate("/home")}>Back</button>
            {
                stats && (
                    <div>
                        <h2>Hello, {stats.name}'s parent!</h2>
                        <p>Total Attempt: {stats.total_attempts}</p>
                        <p>Correct Attempts: {stats.correct_attempts}</p>
                        <p>Accuracy: {stats.accuracy.toFixed(1)}%</p>
                        <p>Total XP: {stats.xp}</p>
                    </div>
                )
            }

            <h2>Attempt History</h2>
            {
                attempts.length == 0 ? (
                    <p>No attempts yet</p>
                ) : (
                    attempts.map((attempt, index) => (
                        <div key={index}>
                            <p>Word: {attempt.word} ({attempt.phoneme})</p>
                            <p>You said: {attempt.transcription}</p>
                            <p>{attempt.is_correct ? "Correct" : " Incorrect "}</p>
                            <p>Score: {attempt.score}</p>
                        </div>
                    ))
                )
            }
        </div >
    )

}

export default ParentDashboard
