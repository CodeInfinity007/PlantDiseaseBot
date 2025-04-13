"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/utils/firebaseConfig";
import { signOut } from "firebase/auth";
import { Home, MessageSquare, LogOut } from "lucide-react";
import { useRef } from "react";

  

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (route) => pathname === route;
  const promptHandled = useRef(false);

  useEffect(() => {
    let formatted = [];
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
  
        const sessionId = currentUser.uid; // session_id based on user
  
        // Load history
        fetch("http://127.0.0.1:5000/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        })
          .then((res) => res.json())
          .then((history) => {
            formatted = history.map((msg) => ({
              text: msg.message,
              sender: msg.sender,
            }));
  
            // Set message history
            setMessages(formatted);
            
            console.log(messages.length);
  
            // Then show welcome message
            return fetch("http://127.0.0.1:5000/get_message");
          })
          .then((res) => res.json())
          .then((data) => {
            // Only show welcome if history is empty
            if (formatted.length === 0) {
              setMessages((prev) => [...prev, { text: data.message, sender: "bot" }]);
            }
  
            const prompt = searchParams.get("prompt");
            if (prompt && !promptHandled.current) {
              promptHandled.current = true;
              setInput(prompt);
              sendMessageAuto(prompt, sessionId);
            }
          })
          .catch((err) => console.error("Error loading chat history:", err));
      }
    });
  
    return () => unsubscribe();
  }, [router, searchParams]);
  


  const sendMessage = async () => {
    if (input.trim() === "" || !user) return;
    const sessionId = user.uid;
  
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
  
    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, session_id: sessionId }),
      });
  
      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error connecting to server:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error: Couldn't connect to server", sender: "bot" },
      ]);
    }
  
    setInput("");
  };
  
  const sendMessageAuto = async (autoInput, sessionId) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: autoInput, session_id: sessionId }),
      });
  
      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error connecting to server:", error);
      setMessages((prev) => [...prev, { text: "Error: Couldn't connect to server", sender: "bot" }]);
    }
  
    setInput("");
  };
  
  

  const handleLogout = async () => {
    try {
      // Get the user ID
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        // Clear chat history on backend
        await fetch("http://127.0.0.1:5000/clear_chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: currentUser.uid }),
        });
      }
  
      // Sign out from Firebase
      await signOut(auth);
  
      // Clear login cookie
      document.cookie = "isLoggedIn=false; path=/; max-age=0";
  
      // Redirect
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-stretch justify-center bg-gray-100 p-10 gap-15 overflow-hidden">
      {/* Sidebar Menu */}
      <div className="flex flex-col w-80 bg-white shadow-lg rounded-2xl p-6 m-4 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Menu</h2>
        <ul className="flex flex-col gap-4">
          <li
            className={`flex items-center gap-3 p-3 rounded-lg text-lg cursor-pointer transition duration-200 ${
              isActive("/home") ? "bg-[#0b744e] text-white font-semibold shadow-md" : "text-gray-800 hover:bg-[#e6f2ed]"
            }`}
            onClick={() => router.push("/home")}
          >
            <Home size={22} />
            Home (Predictions)
          </li>
          <li
            className={`flex items-center gap-3 p-3 rounded-lg text-lg cursor-pointer transition duration-200 ${
              isActive("/chat") ? "bg-[#0b744e] text-white font-semibold shadow-md" : "text-gray-800 hover:bg-[#e6f2ed]"
            }`}
            onClick={() => router.push("/chat")}
          >
            <MessageSquare size={22} />
            Chatbot
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 mt-6 bg-red-600 hover:bg-red-700 text-white py-3 px-5 rounded-lg transition-colors duration-300 shadow-md"
        >
          <LogOut size={22} />
          Logout
        </button>
      </div>

      {/* Chat Window */}
      <div className="relative flex flex-col w-3/4  bg-white rounded-2xl shadow-lg p-6 overflow-hidden">
        <div
          className="absolute inset-0 z-0 rounded-2xl"
          style={{
            backgroundImage: "url('/plant-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50 rounded-2xl"></div>
        </div>

        <div className="relative z-10 flex flex-col flex-1">
          <div className="text-4xl font-bold text-center mb-4 text-white">PlantDiseaseBot</div>

          <div className="flex-1 overflow-y-auto p-4 mb-4 rounded-lg" style={{ maxHeight: "75vh" }}>
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`p-3 my-2 rounded-lg max-w-max ${
                    msg.sender === "user" ? "bg-green-800 text-white" : "bg-gray-300 text-black mr-40"
                  }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="bg-white border border-gray-300 rounded-lg p-2 flex items-center sticky bottom-0">
            <input
              type="text"
              className="flex-grow p-2 text-xl text-black focus:outline-none"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="p-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-300"
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
