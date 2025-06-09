import { useState } from "react";
import chartView from './Chat'
import './index.css';


function App() {
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState(null);

  const apiKey = import.meta.env.VITE_API_KEY

  const enteredInput = () => {
    if (input.trim() === '') {
      getOpenAiData();
      setInput('')
    }
  }
 
  const getOpenAiData = async() => {
    if(!input)return;
    try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer <OPENROUTER_API_KEY>",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "deepseek/deepseek-r1",
    messages: [{ role: "user", content: "Your question here" }]
  })
});
 
    const data = await response.json();  
    
    if (data.cod === 200) {
      setAnswer(data);
    } else {
      alert('Invalid Input')
    }

    } catch (error) {
      console.error("An Error occured:", error);
    }

  }


  return (
    <>
    <h2>CHAT-GPT ClONE</h2>
      <input
        type="text"
        placeholder="Ask Anything"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={enteredInput}>Submit</button>
      {chartView && <chartView data={answer}/>}
    </>
  );
}

export default App;
