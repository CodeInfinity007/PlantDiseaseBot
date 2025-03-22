'use client';
import { useState, useEffect } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Fetch initial message from Flask when component loads
  useEffect(() => {
    fetch("http://127.0.0.1:5000/get_message")
      .then((res) => res.json())
      .then((data) => {
        setMessages([{ text: data.message, sender: 'bot' }]);
      })
      .catch((err) => console.error("Error fetching message:", err));
  }, []);

  // Send user message to Flask and get response
  const sendMessage = async () => {
    if (input.trim() === '') return;
  
    setMessages([...messages, { text: input, sender: 'user' }]);  // Add user message
  
    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {  // Call Flask API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),  // Send user input as JSON
      });
  
      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, sender: 'bot' }]);  // Add bot response
    } catch (error) {
      console.error("Error connecting to server:", error);
      setMessages((prev) => [...prev, { text: "Error: Couldn't connect to server", sender: 'bot' }]);
    }
  
    setInput('');
  };
  

  return (
    <div className="relative min-h-screen gap-5 flex items-stretch justify-center bg-gray-100 p-6">
      {/* Left Panel (Sidebar) */}
      <div className="flex flex-col w-1/3 bg-[#121b22] rounded-2xl shadow-lg p-6 mr-6">
        <h2 className="text-3xl font-bold mb-4 text-center text-white">Menu</h2>
        <ul className="flex flex-col gap-2 text-white">
          <li className="p-3 rounded-lg hover:bg-gray-300 cursor-pointer text-center">Home</li>
          <li className="p-3 rounded-lg hover:bg-gray-300 cursor-pointer text-center">About</li>
          <li className="p-3 rounded-lg hover:bg-gray-300 cursor-pointer text-center">Help</li>
          <li className="p-3 rounded-lg hover:bg-gray-300 cursor-pointer text-center">Settings</li>
        </ul>
      </div>

      {/* Chatbot Panel */}
      <div className="relative flex flex-col w-3/2 bg-white rounded-2xl shadow-lg p-6 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 rounded-2xl"
          style={{
            backgroundImage: "url('/plant-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black opacity-50 rounded-2xl"></div>
        </div>

        {/* Chat Content (Above Background) */}
        <div className="relative z-10 flex flex-col flex-1">
          <div className="text-4xl font-bold text-center mb-4 text-white">PlantDiseaseBot</div>

          {/* Chat Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 mb-4 rounded-lg" style={{ maxHeight: '75vh' }}>
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 my-2 rounded-lg max-w-max ${msg.sender === 'user' ? 'bg-green-800 text-white' : 'bg-gray-300 text-black'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box (Fixed at Bottom) */}
          <div className="bg-white border border-gray-300 rounded-lg p-2 flex items-center sticky bottom-0">
            <input
              type="text"
              className="flex-grow p-2 text-xl text-black focus:outline-none"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button className="p-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-300" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
