import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Confetti from 'react-confetti'

function Exercises() {
    const { id, word } = useParams()
    const [recording, setRecording] = useState(false)
    const [result, setResult] = useState(null)
    const navigate = useNavigate()
    const [hoveredMic, setHoveredMic] = useState(false)

    const handleRecord = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)
        const chunks = []

        recorder.ondataavailable = e => chunks.push(e.data)


        recorder.onstop = async () => {
            const blob = new Blob(chunks, { type: "audio/wav" })
            const formData = new FormData()
            formData.append("audio", blob, "recording.wav")

            const response = await fetch(`/api/exercises/${id}/attempt`, {
                method: "POST",
                body: formData,
                credentials: "include",
            })
            const data = await response.json()
            setResult(data)
        }

        recorder.start()
        setRecording(true)

        setTimeout(() => {
            recorder.stop()
            setRecording(false)
            stream.getTracks().forEach(t => t.stop())
        }, 3000)

    }

    const speakWord = () => {
        const utterance = new SpeechSynthesisUtterance(word)
        utterance.rate = 0.8
        window.speechSynthesis.speak(utterance)
    }

    return (




        <div style={{ minHeight: "100vh", backgroundImage: "url('background.jpg')", backgroundSize: "cover", backgroundPosition: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

            {result && result.is_correct && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    numberOfPieces={300}
                    gravity={0.3}
                    colors={['#FFD700', '#FF1493', '#FF8C00']}
                    recycle={false}
                />
            )}
            <div style={{ background: "white", padding: "3rem", borderRadius: "30px", boxShadow: "0 1px 40px rgba(0,0,0,0.1)", textAlign: "center", width: "90%", maxWidth: "900pxs" }}>
                <h2 style={{ color: "#5c3d1e", fontSize: "2.5rem", marginBottom: "1rem" }}> Say this word!
                </h2>

                <img src={`/${word}.png`} alt={word}
                    onError={(e) => e.target.style.display = 'none'}
                    style={{ width: "250px", height: "250px", objectFit: "contain", marginBottom: "1rem" }} />

                <h1 style={{ fontSize: "4.5rem", fontWeight: "bold", color: "#5c3d1e", marginBottom: "2rem", letterSpacing: "3px" }}>
                    {word}
                </h1>

                <button onClick={speakWord}
                    style={{ background: "white", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px", fontSize: "1rem", cursor: "pointer", marginBottom: "2rem" }}>
                    Hear the word
                </button>


                <div
                    onClick={!recording ? handleRecord : undefined}
                    onMouseEnter={() => setHoveredMic(true)}
                    onMouseLeave={() => setHoveredMic(false)}
                    style={{
                        width: "120px",
                        height: "120px",
                        marginTop: "1rem",
                        margin: "0 auto",
                        borderRadius: "50%",
                        background: recording ? "#e07b39" : hoveredMic ? "#e07b39" : "#f2a365",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: recording ? "not-allowed" : "pointer",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                        transition: "all 0.3s ease"

                    }}


                >

                    <span style={{ fontSize: "4rem" }}>🎤</span>
                </div>

                <p style={{ marginTop: "1rem", color: "#888", fontSize: "2rem" }}>
                    {recording ? "Recording..." : "Click the mic and say the word!"}
                </p>

                {result && (
                    <div style={{ marginTop: "2rem", padding: "1.5rem", background: result.is_correct ? "#d4edda" : "#f8d7da", borderRadius: "15px" }}>
                        <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{result.is_correct ? "Correct! 🎉" : "Almost! 😊Try again"}</p>
                        <p style={{ color: "#5c3d1e" }}> You said: <strong>{result.transcription}</strong></p>
                        <p style={{ color: "#5c3d1e" }}> XP earned⭐️: <strong>{result.xp_earned}</strong></p>
                        <button onClick={() => navigate("/home")}
                            style={{ marginTop: "1rem", background: "#5c3d1e", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px", fontSize: "1rem", cursor: "pointer" }}>
                            Back to home
                        </button>

                        <button onClick={() => setResult(null)}
                            style={{ background: "##5c3d1e", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px", fontSize: "1rem", cursor: "pointer" }}>
                            Try again
                        </button>
                    </div>
                )}
            </div>
        </div>


    )
}

export default Exercises