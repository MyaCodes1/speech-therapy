import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

function Exercises() {
    const { id, word } = useParams()
    const [recording, setRecording] = useState(false)
    const [result, setResult] = useState(null)
    const navigate = useNavigate()

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
    return (
        <div>
            <h1>Say this word: </h1>
            <h2>{word}</h2>
            <button onClick={handleRecord} disabled={recording}>
                {recording ? "Recording..." : "Press to Record"}
            </button>
            {result && (
                <div>
                    <p>You said: {result.transcription}</p>
                    <p>{result.is_correct ? "Correct!!!" : "Try again!"} </p>
                    <p>XP earned: {result.xp_earned}</p>
                    <button onClick={() => navigate("/home")}>Back to Home</button>
                </div>
            )}
        </div>
    )
}

export default Exercises