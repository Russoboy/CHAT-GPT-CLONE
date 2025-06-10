import { useState } from "react";
import ChatView from './Chat';
import './index.css';

function App() {
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState(null);

  const apiKey = import.meta.env.VITE_API_KEY;

  const enteredInput = () => {
    if (input.trim() !== '') {
      getOpenAiData();
      setInput('');
    }
  }

  const getOpenAiData = async () => {
    if (!input) return;
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`, // ✅ use env variable
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1",
          messages: [{ role: "user", content: input }] // ✅ use real user input
        })
      });

      const data = await response.json();
      console.log(data); // ✅ Check this in dev tools
      setAnswer(data.choices[0].message.content);
    } catch (error) {
      console.error("An error occurred:", error);
      alert("API Error. Check console.");
    }
  }

  return (
    <>
      <h2 className="text-header">CHAT-GPT</h2>
      <div className="chatBox">
        <input
          type="text"
          placeholder="Ask Anything"
          value={input}
          className="input-Box"
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="submitBtn" onClick={enteredInput}>Submit</button>
      </div>
      {answer && <ChatView data={answer} />} {/* ✅ display only when there's an answer */}
    </>
  );
}

export default App;
