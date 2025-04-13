"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { auth } from "@/utils/firebaseConfig";
import { signOut } from "firebase/auth";
import { Home, MessageSquare, LogOut } from "lucide-react";

export default function UploadPage() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [predictions, setPredictions] = useState({
    prediction: "Predictions will appear here.",
    diseaseInfo: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelType, setModelType] = useState("fruit");
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const isActive = (route) => pathname === route;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleModelChange = (e) => {
    setModelType(e.target.value);
  };

  const handlePredictions = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("model_type", modelType);

      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const prediction = response.data.prediction;
      const diseaseInfo = response.data.diseaseInfo;

      setPredictions({ prediction, diseaseInfo });
      await navigator.clipboard.writeText(prediction);
      // setShowModal(true);
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      setError("Failed to get prediction. Please try again.");
      setPredictions(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        await fetch("http://127.0.0.1:5000/clear_chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: currentUser.uid }),
        });
      }

      await signOut(auth);
      document.cookie = "isLoggedIn=false; path=/; max-age=0";
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const goToChat = () => {
    setShowModal(false);
    router.push(`/chat?prompt=${encodeURIComponent(predictions?.prediction || "")}`);
  };

  return (
    <div className="flex min-h-screen bg-cover bg-center p-10 overflow-hidden" style={{ backgroundImage: "url(/bgr.jpg)" }}>
      {/* Sidebar */}
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
              isActive("/chat") ? "bg-[#06402B] text-white font-semibold shadow-md" : "text-gray-800 hover:bg-[#e6f2ed]"
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

      {/* Main Content */}
      <div className="flex-1 flex flex-wrap justify-center items-start gap-8">
        {/* Upload Panel */}
        <div className="bg-white p-8 rounded-2xl shadow-xl  border border-gray-200 mt-16">
          <h1 className="text-2xl font-semibold text-center mb-5 text-gray-900">Upload Image</h1>

          <label className="block text-gray-900 mb-2 font-medium">Select Model Type:</label>
          <select
            value={modelType}
            onChange={handleModelChange}
            className="w-full mb-5 p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0b744e]"
          >
            <option value="fruit">Fruit</option>
            <option value="leaf">Leaf</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full mb-5 p-3 border border-gray-300 rounded-lg text-gray-900"
          />

          {imageUrl && <img src={imageUrl} alt="Uploaded" className="w-full h-auto rounded-lg shadow-md mb-5" />}

          {error && (
            <div className="mb-4 text-red-600 font-medium bg-red-50 p-3 rounded-md border border-red-300">
              {error}
            </div>
          )}

          <button
            onClick={handlePredictions}
            className="w-full bg-[#0b744e] text-white py-3 rounded-lg hover:bg-[#06402B] transition duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Loading...
              </>
            ) : (
              "Get Predictions"
            )}
          </button>
        </div>

        {/* Predictions Panel */}
        <div className="bg-white p-8 rounded-2xl shadow-xl w-[500px] border border-gray-200 mt-16">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Prediction Results</h2>
          <div className="text-gray-700 space-y-2">
            <p><strong>🧠 Prediction:</strong> {predictions.prediction}</p>
            {predictions.diseaseInfo ? (
              <>
                {predictions.diseaseInfo.Plant && <p><strong>🌿 Plant:</strong> {predictions.diseaseInfo.Plant}</p>}
                {predictions.diseaseInfo.Disease && <p><strong>🦠 Disease:</strong> {predictions.diseaseInfo.Disease}</p>}
                {predictions.diseaseInfo.Symptom && <p><strong>🔍 Symptoms:</strong> {predictions.diseaseInfo.Symptom}</p>}
                {predictions.diseaseInfo.Comment && <p><strong>💬 Comment:</strong> {predictions.diseaseInfo.Comment}</p>}
                {predictions.diseaseInfo.Cause && <p><strong>🧪 Cause:</strong> {predictions.diseaseInfo.Cause}</p>}
                {predictions.diseaseInfo.Management && <p><strong>🛠 Management:</strong> {predictions.diseaseInfo.Management}</p>}
              </>
            ) : (
              <p className="text-sm text-gray-500">No additional disease information available.</p>
            )}
            <button
              onClick={goToChat}
              className="p-4 bg-[#0b744e] text-white py-3 rounded-lg hover:bg-[#06402B] transition duration-300 mt-5"
              disabled={loading}
            >
              {loading ? "Loading..." : "Chat with AI"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
