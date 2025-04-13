"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Left Register Form */}
      <div className="w-3/5 flex items-center justify-center px-16 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-5">Create Account 🌱</h1>

          <label className="block text-gray-800 text-sm font-medium mb-10">
            Join our farming community and start tracking your plants, getting insights, and growing better every day.
          </label>

          <form onSubmit={handleRegister}>
            <label className="block text-gray-800 text-sm font-semibold mb-1">Email:</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border border-[#0b744e] rounded-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b744e]"
              required
            />

            <label className="block text-gray-800 text-sm font-semibold mb-1">Password:</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 border border-[#0b744e] rounded-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b744e]"
              required
            />

            <label className="block text-gray-800 text-sm font-semibold mb-1">Confirm Password:</label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mb-4 border border-[#0b744e] rounded-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b744e]"
              required
            />

            <button
              type="submit"
              className="w-full bg-[#06402B] text-white py-3 rounded-lg hover:bg-[#0b744e] transition duration-300 mt-5"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}

          <p className="text-center text-sm text-gray-700 mt-6">
            Been here before? {" "}
            <a href="/login" className="text-[#06402B] font-semibold hover:underline">
              Login
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
