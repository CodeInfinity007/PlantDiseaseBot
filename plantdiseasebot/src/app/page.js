'use client';
import { useState } from 'react';
// using useState hook to manage state
// useState returns an array with two elements - the current state value and a function that lets you update it
// The initial state is passed as an argument to useState
// The function is used to update the state
// The state is then used to render the UI
export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
//Sample Bot Response
    const sendMessage = () => {
        if (input.trim() === '') return;
        setMessages([...messages, { text: input, sender: 'user' }]);
        setInput('');
        setTimeout(() => {
            setMessages((prev) => [...prev, { text: 'Hello Master!! How can I serve you', sender: 'bot' }]);
        }, 500);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">PlantDiseaseBot</h2>
                <div className="h-64 overflow-y-auto mb-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`p-2 my-1 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white text-right' : 'bg-gray-300 text-black text-left'}`}> {msg.text} </div>
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
    );
}
