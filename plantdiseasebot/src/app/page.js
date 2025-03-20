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
    <div className="relative min-h-screen gap-5 flex items-stretch justify-center bg-gray-100 p-6">
      {/* Left Panel */}
      <div
        className="flex flex-col w-1/3 bg-[#121b22] rounded-2xl shadow-lg p-6 mr-6"
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
      <div
        className="flex flex-col w-3/2 bg-white rounded-2xl shadow-lg p-6"
        style={{
          backgroundImage: "url('/bgr.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="text-4xl font-bold text-center mb-4 text-[#1f2c34]">PlantDiseaseBot</div>

        {/* Chat Messages Container with Scrollbar */}
        <div
          className="flex-1 bg-transparent rounded-lg p-4 mb-4 overflow-y-auto"
          style={{ maxHeight: '75vh' }} // Set a fixed height for the chat messages container
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 my-2 rounded-lg max-w-max ${msg.sender === 'user'
                  ? 'bg-green-800 text-white'
                  : 'bg-gray-300 text-black'
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Box and Send Button */}
        <div className="flex items-center bg-white border border-gray-300 rounded-lg p-2">
          <input
            type="text"
            className="flex-grow p-2 text-xl text-black focus:outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            className="p-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-300"
            onClick={sendMessage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}