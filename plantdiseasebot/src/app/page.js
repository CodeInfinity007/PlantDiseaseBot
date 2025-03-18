'use client';
import { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
    // Simulate a bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: 'Hello! How can I help you?', sender: 'bot' },
      ]);
    }, 500);
  };

  return (
    <div className="relative min-h-screen flex items-stretch justify-center bg-gray-100 p-6">
      {/* Left Panel */}
      <div
        className="flex flex-col w-1/4 bg-[#121b22] rounded-2xl shadow-lg p-6 mr-2"
        style={{ marginRight: '10px' }}
      >
        <h2 className="text-3xl font-bold mb-4 text-center text-white">Menu</h2>
        <ul className="flex flex-col gap-2 text-white">
          <li className="p-3 rounded-lg hover:bg-gray-300 cursor-pointer text-center">Home</li>
          <li className="p-3 rounded-lg hover:bg-gray-300 cursor-pointer text-center">About</li>
          <li className="p-3 rounded-lg hover:bg-gray-300 cursor-pointer text-center">Help</li>
          <li className="p-3 rounded-lg hover:bg-gray-300 cursor-pointer text-center">Settings</li>
        </ul>
      </div>

      {/* Chatbot Panel */}
      {/* Chatbot Panel */}
      <div
        className="flex flex-col w-3/4 bg-white rounded-2xl shadow-lg p-6"
        style={{
          backgroundImage: "url('/bgr.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="text-4xl font-bold text-center mb-4 text-[#1f2c34]">PlantDiseaseBot</div>
        <div
          className="flex-1 bg-transparent rounded-lg p-4 mb-4 overflow-y-auto"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 my-2 rounded-lg max-w-max ${msg.sender === 'user'
                  ? 'self-start bg-blue-500 text-white text-left'
                  : 'self-end bg-gray-300 text-black text-right'
                }`}
            >
              {msg.text}
            </div>
          ))}
        </div>


        {/* Input Box and Send Button */}
        <div className="flex gap-2 bg-transparent p-3 rounded-lg">
          <input
            type="text"
            className="flex-grow p-3 text-xl text-black bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
}
