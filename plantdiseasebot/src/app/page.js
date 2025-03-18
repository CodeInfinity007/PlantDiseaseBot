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
            setMessages((prev) => [...prev, { text: 'Hello! How can I help you?', sender: 'bot' }]);
        }, 500);
    };

    return (
        <div className="relative min-h-screen">
            <div className="fixed top-0 w-full p-10 bg-[#1f2c34] text-white text-4xl font-bold text-center">PlantDiseaseBot</div>
            <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/bgr.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 mt-20">
                    <div className="h-64 overflow-y-auto mb-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`p-2 my-1 rounded-lg ${msg.sender === 'user' ? 'bg-green-700 text-white text-right' : 'bg-gray-300 text-black text-left'}`}> {msg.text} </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none"
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
        </div>
    );
}
