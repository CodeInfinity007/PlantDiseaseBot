"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/utils/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      document.cookie = "isLoggedIn=true; path=/; max-age=86400";
      router.push("/home");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Left Login Form */}
      <div className="w-3/5 flex items-center justify-center px-16 bg-white" >
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-5">Welcome Back 👋</h1>

          <label className="block text-gray-800 text-sm font-medium mb-10">Start your day right! Sign in and get the insights you need to keep your plants healthy and your farm thriving.</label>
          <label className="block text-gray-800 text-sm font-semibold mb-1">Email:</label>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border border-[#0b744e] rounded-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b744e]"
            />
            
            <label className="block text-gray-800 text-sm font-semibold mb-1">Password:</label>

            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 border border-[#0b744e] rounded-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b744e]"
            />

            <button
              type="submit"
              className="w-full bg-[#06402B] text-white py-3 rounded-lg hover:bg-[#0b744e] transition duration-300 mt-5"
            >
              Sign In
            </button>
          </form>

          {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}

          <p className="text-center text-sm text-gray-700 mt-6">
            First time using our platform?{" "}
            <a href="/register" className="text-[#06402B] font-semibold hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>

      {/* Right Side Image with Curved Left Border */}
      <div className="w-2/5 p-5 mt-5 mb-5 rounded-[60px] overflow-hidden flex items-center justify-center">
        <img
          src="/cred-img.jpg"
          alt="Visual"
          className="max-h-screen object-cover rounded-[60px] w-full"
        />
      </div>

    </div>
  );
}
