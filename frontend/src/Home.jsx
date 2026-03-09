import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"


function Home() {

    const [exercises, setExercises] = useState([])
    const [selectedPhoneme, setSelectedPhoneme] = useState(null)
    const [userName, setUserName] = useState("")
    const navigate = useNavigate()
    const [hoveredPhoneme, setHoveredPhoneme] = useState(null)

    const fetchExercises = async () => {
        const response = await fetch("/api/exercises", {
            method: "GET",
            credentials: "include",
        })
        const data = await response.json()
        setExercises(data)

    }

    const fetchUser = async () => {
        const response = await fetch("/api/auth/me", {
            method: "GET",
            credentials: "include",
        })
        const data = await response.json()
        setUserName(data.name)
    }

    useEffect(() => {
        fetchExercises()
        fetchUser()

    }, [])

    const filteredExercises = selectedPhoneme
        ? exercises.filter(ex => ex.phoneme === selectedPhoneme)
        : []

    return (
        <div style={{ minHeight: "100vh", backgroundImage: "url('background.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2rem" }}>
                <h2 style={{ color: "white", textShadow: "3px 3px 0px #5c3d1e", border: "none", borderRadius: "10px", padding: "10 px 20px", fontSize: "2rem", cursor: "pointer" }}>
                    Hello {userName}!</h2>

                <button onClick={() => navigate("/parent")} style={{ background: "#f7d794", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px", fontSize: "1rem", cursor: "pointer" }}>
                    Parent Dashboard
                </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "4rem" }}>
                <h2 style={{ color: "white", textShadow: "2px 2px 0px #5c3d1e", fontSize: "2rem", marginBottom: "2rem" }}> Select a phoneme to practice </h2>
                <div style={{ display: "flex", gap: "3rem" }}>
                    {[
                        { phoneme: "R", color: "#e07b39", label: "R sounds" },
                        { phoneme: "S", color: "#f2a365", label: "S sounds" },
                        { phoneme: "TH", color: "#f7d794", label: "TH sounds" },
                    ].map(({ phoneme, color, label }) => (
                        <div
                            key={phoneme}
                            onClick={() => setSelectedPhoneme(phoneme)}
                            onMouseEnter={() => setHoveredPhoneme(phoneme)}
                            onMouseLeave={() => setHoveredPhoneme(null)}
                            style={{
                                width: "150px",
                                height: "150px",
                                borderRadius: "50%",
                                background: color,
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                                alignItems: "center",
                                cursor: "pointer",
                                transform: hoveredPhoneme === phoneme ? "scale(1.5)" : "scale(1)",
                                transition: "transform 0.3s ease",
                                boxShadow: hoveredPhoneme === phoneme ? "0 8px 30px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.1)",
                                border: selectedPhoneme === phoneme ? "4px solid white" : "4px solid transparent",
                            }}
                        >
                            <span style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white" }}>{phoneme}</span>
                            <span style={{ fontSize: "0.9rem", color: "white", marginTop: "5px" }}>{label}</span>
                        </div>

                    ))}
                </div>

                {selectedPhoneme && (
                    <div style={{ marginTop: "3rem", background: "rgba(255, 255, 255, 0.9)", borderRadius: "20px", padding: "2rem", width: "90%", maxWidth: "600px" }}>
                        <h3 style={{ color: "#5c3d1e", marginBottom: "1.5rem", textAlign: "center", fontSize: "1.5rem" }}>{selectedPhoneme} Words</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
                            {filteredExercises.map(ex => (
                                <div key={ex.id} style={{ background: "white", borderRadius: "15px", padding: "1rem", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                                    <p style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#5c3d1e", marginBottom: "0.5rem" }}>{ex.word}</p>
                                    <button onClick={() => navigate(`/exercises/${ex.id}/${ex.word}`)}
                                        style={{ background: "#5c3d1e", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "0.9rem", cursor: "pointer" }}>
                                        Practice
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )








}


export default Home