import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"


function Home() {

    const [exercises, setExercises] = useState([])
    const [selectedPhoneme, setSelectedPhoneme] = useState(null)
    const [userName, setUserName] = useState("")
    const navigate = useNavigate()

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
        <div>
            <h1>Hello {userName}!</h1>
            <button onClick={() => navigate("/parent")}>Parent Dashboard</button>

            <h2>Pick a sound to practice</h2>
            <button onClick={() => setSelectedPhoneme("R")}>/R/</button>
            <button onClick={() => setSelectedPhoneme("S")}>/S/</button>
            <button onClick={() => setSelectedPhoneme("TH")}>/TH/</button>

            {selectedPhoneme && (
                <div>
                    <h3>{selectedPhoneme} words</h3>
                    {filteredExercises.map(ex => (
                        <div key={ex.id}>
                            <p>{ex.word}</p>
                            <button onClick={() => navigate(`/exercises/${ex.id}/${ex.word}`)}>Practice</button>

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}


export default Home