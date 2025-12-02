import { useState } from "react";
import { signup } from "../authService";
import Header from "../components/Header";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    try {
      await signup(email, password);
      alert("Account created!");
      // Optional redirect:
      // window.location.href = "/login";
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      
      <Header />
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Sign Up
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 mb-4 text-sm">{error}</p>
        )}

        <button
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?
          <a
            href="/login"
            className="text-blue-600 ml-1 hover:underline"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
