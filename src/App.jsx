import { useState } from "react";
import ChatView from './Chat';
import './index.css';

function App() {
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Your API key - make sure this is correct
  const apiKey = "PUT_YOUR_API_KEY_HERE";

  const enteredInput = () => {
    if (input.trim() !== '') {
      getOpenAiData();
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      enteredInput();
    }
  };

  const getOpenAiData = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    setAnswer(null);
    
    try {
      console.log("Making API request with input:", input);
      console.log("Using API key:", apiKey.substring(0, 10) + "...");
      
      // Try different approaches for CORS issues
      const requestOptions = {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "X-Title": "ChatGPT Clone",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1",
          messages: [{ 
            role: "user", 
            content: input.trim() 
          }],
          max_tokens: 1000,
          temperature: 0.7,
        })
      };

      console.log("Request options:", requestOptions);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", requestOptions);

      console.log("Response received:", response);
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.log("Error response data:", errorData);
          if (errorData.error) {
            errorMessage = errorData.error.message || errorMessage;
          }
        } catch (error) {
          console.log("Could not parse error response as JSON");
          const errorText = await response.text();
          console.error("Error response text:", error);
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Success! Full API Response:", data);

      // Handle different response formats
      if (data.choices && data.choices.length > 0) {
        const message = data.choices[0].message;
        if (message && message.content) {
          setAnswer(message.content);
        } else {
          console.log("Message structure:", message);
          throw new Error("No content in response message");
        }
      } else if (data.error) {
        throw new Error(`API Error: ${data.error.message || data.error}`);
      } else {
        console.log("Unexpected response structure:", data);
        throw new Error("Unexpected response format - check console for details");
      }
      
    } catch (error) {
      console.error("Detailed error:", error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      
      let userFriendlyError = error.message;
      
      // Handle specific error types
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        userFriendlyError = "Network error: Unable to connect to the API. This might be due to:\n" +
                           "1. CORS restrictions\n" +
                           "2. Network connectivity issues\n" +
                           "3. API server being down\n" +
                           "4. Ad blockers or browser security settings";
      } else if (error.message.includes('401')) {
        userFriendlyError = "Authentication failed. Please check your API key.";
      } else if (error.message.includes('429')) {
        userFriendlyError = "Rate limit exceeded. Please wait before trying again.";
      } else if (error.message.includes('403')) {
        userFriendlyError = "Access forbidden. Check your API key permissions.";
      }
      
      setError(userFriendlyError);
    } finally {
      setLoading(false);
    }
  };

  // Test function to check if API is reachable
  const testConnection = async () => {
    try {
      setError(null);
      console.log("Testing connection to OpenRouter...");
      
      const response = await fetch("https://openrouter.ai/api/v1/models", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
        }
      });
      
      console.log("Test response:", response.status);
      
      if (response.ok) {
        setError("✅ Connection successful! API key is working.");
      } else {
        setError(`❌ Connection test failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Connection test error:", error);
      setError(`❌ Connection test failed: ${error.message}`);
    }
  };

  return (
  <div className="app-container">
    <h2 className="header">CHAT-GPT CLONE</h2>

    <div className="chat-wrapper">
      <button className="test-button" onClick={testConnection}>
        Test API Connection
      </button>

      <div className="input-group">
        <input
          type="text"
          placeholder="Ask Anything (e.g., 'Hello, how are you?')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="input-field"
        />
        <button
          onClick={enteredInput}
          disabled={loading || !input.trim()}
          className={`submit-button ${loading ? 'loading' : ''}`}
        >
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </div>

      {error && (
        <div className={error.includes('✅') ? 'success-message' : 'error-message'}>
          {error}
        </div>
      )}

      {answer && (
        <div className="response-box">
          <strong>Response:</strong><br /><br />
          {answer}
        </div>
      )}

      <div className="debug-text">
        Debug: Check browser console (F12) for detailed logs
      </div>
    </div>
  </div>
);
}

export default App;
