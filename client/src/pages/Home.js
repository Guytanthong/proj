import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import sleepAnimation from "../assets/moon.json";
import { auth } from "../firebase";
import { logout } from "../authService";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {

  const navigate = useNavigate();

  // 🔥 Reactively track user login state
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);  // updates UI instantly
    });
    return () => unsub();
  }, []);

  // Logout handler
  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">

      {/* FULL-PAGE FIXED BACKGROUND */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg_aurora.jpg')" }}
      ></div>

      {/* DARK OVERLAY */}
      <div className="fixed inset-0 bg-black/20"></div>

      {/* ALL CONTENT */}
      <div className="relative z-10">

        {/* OVAL GLOW */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[1100px] rounded-full 
                        bg-black blur-3xl pointer-events-none z-0"></div>

        {/* MAIN CONTENT WRAPPER */}
        <div className="mt-32 px-6 max-w-6xl mx-auto relative">

          {/* LEFT FLOATING FEATURE CARDS */}
          <div className="hidden md:flex flex-col gap-10 absolute left-0 -ml-[250px] top-1/2 -translate-y-1/2 z-20">

            {/* Card 1 */}
            <div className="group relative w-80 p-6 rounded-2xl bg-white/10 backdrop-blur-xl 
                            border border-white/20 shadow-xl transition-all duration-300 
                            hover:shadow-2xl hover:scale-[1.03] hover:bg-white/15">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br 
                              from-blue-500/20 via-purple-500/20 to-pink-500/20 
                              opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
              <img src="/icons/sleep.png" alt="" className="w-12 h-12 mb-4 opacity-90" />
              <h3 className="text-2xl font-semibold mb-2">Track Sleep</h3>
              <p className="text-gray-200 text-sm leading-relaxed">
                Understand your nights with premium insights and restful visual analytics.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group relative w-80 p-6 rounded-2xl bg-white/10 backdrop-blur-xl 
                            border border-white/20 shadow-xl transition-all duration-300 
                            hover:shadow-2xl hover:scale-[1.03] hover:bg-white/15">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br 
                              from-blue-500/20 via-purple-500/20 to-pink-500/20 
                              opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
              <img src="/icons/sleep.png" alt="" className="w-12 h-12 mb-4 opacity-90" />
              <h3 className="text-2xl font-semibold mb-2">Log Activities</h3>
              <p className="text-gray-200 text-sm leading-relaxed">
                Build healthy routines with seamless activity tracking.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group relative w-80 p-6 rounded-2xl bg-white/10 backdrop-blur-xl 
                            border border-white/20 shadow-xl transition-all duration-300 
                            hover:shadow-2xl hover:scale-[1.03] hover:bg-white/15">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br 
                              from-blue-500/20 via-purple-500/20 to-pink-500/20 
                              opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
              <img src="/icons/sleep.png" alt="" className="w-12 h-12 mb-4 opacity-90" />
              <h3 className="text-2xl font-semibold mb-2">Monitor Mood</h3>
              <p className="text-gray-200 text-sm leading-relaxed">
                Reflect on your emotional balance over time.
              </p>
            </div>

          </div>

          {/* CENTER HERO */}
          <div className="flex flex-col items-center text-center">

            <motion.div
              className="w-80 lg:w-[150px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <Lottie animationData={sleepAnimation} loop />
            </motion.div>

            <motion.h1
              className="text-5xl font-bold leading-tight mt-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Track UR Life, <br />
              <span className="block text-blue-400 ml-[50px]">Your progress.</span>
            </motion.h1>

            <img
              src="/logo.png"
              alt="Clock Logo"
              className="mx-auto w-90 h-90 mt-6"
            />

            <p className="text-gray-200 mt-4 max-w-md">
              Track your sleep, mood, and daily activities effortlessly.
              Built for clarity, focus, and self-improvement.
            </p>

            {/* BUTTON SECTION */}
            <div className="flex gap-4 justify-center pt-4 pb-5">

              {currentUser ? (
                <>
                  {/* Logged in */}
                  <Link
                    to="/dashboard"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                  >
                    Go to Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Logged out */}
                  <Link
                    to="/signup"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                  >
                    Get Started
                  </Link>

                  <Link
                    to="/login"
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold"
                  >
                    Log In
                  </Link>
                </>
              )}

            </div>

          </div>

          {/* FOOTER */}
          <footer className="py-6 text-gray-300 text-center">
            © 2025 urLife — Built by Tanthong ⚡
          </footer>

        </div>
      </div>
    </div>
  );
}
