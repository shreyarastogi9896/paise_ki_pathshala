import React, { useState } from "react";
import axios from "axios";

export default function LessonPage() {
  const [topic, setTopic] = useState("");
  const [lesson, setLesson] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);

  const generateLesson = async () => {
    const res = await axios.post("http://localhost:5000/api/generate", { topic });
    setLesson(res.data.lesson);

    const form = new FormData();
    form.append("text", res.data.lesson);

    const audioRes = await axios.post("http://localhost:8002/tts", form, {
      responseType: "blob"
    });
    const audioBlob = new Blob([audioRes.data], { type: "audio/mpeg" });
    setAudioUrl(URL.createObjectURL(audioBlob));
  };

  return (
    <div>
      <h1>Lesson Generator</h1>
      <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter topic (e.g., PPF)" />
      <button onClick={generateLesson}>Generate</button>
      <pre>{lesson}</pre>
      {audioUrl && <audio src={audioUrl} controls autoPlay />}
    </div>
  );
}
