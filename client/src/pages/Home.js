import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import sleepAnimation from "../assets/moon.json"; 

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center">

      {/* HERO SECTION */}
      <div className="mt-32 px-6 max-w-6xl w-full flex flex-col items-center justify-between">


        <motion.div
          className="mt-10 text-center lg:mt-0 w-80 lg:w-[150px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Lottie animationData={sleepAnimation} loop />
        </motion.div>

        {/* LEFT SIDE — Text + Logo */}
        <div className="text-center lg:text-center max-w-xl space-y-6">

          <motion.h1
            className="text-5xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Track Your Life, 
            <span className="text-blue-400"> Your progress.</span>
          </motion.h1>

          {/* LOGO */}
          <img
            src="/logo.png"
            alt="Clock Logo"
            className="mx-auto  w-90 h-90 animate-pulse"
          />

          <p className="text-gray-300 ">
            Track your sleep, mood, and daily activities effortlessly.
            Built for clarity, focus, and self-improvement.
          </p>

          <div className="flex gap-4 justify-center pt-4 pb-5">
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
          </div>

        </div>

        
        

      </div>

      {/* FEATURES */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl px-6">

        <div className="bg-white/10 p-6 rounded-xl text-center">
          <h3 className="text-xl font-bold mb-2">Track Sleep</h3>
          <p className="text-gray-300">
            Understand your nights and improve rest with smart visuals.
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl text-center">
          <h3 className="text-xl font-bold mb-2">Log Activities</h3>
          <p className="text-gray-300">
            Build healthy routines with daily activity tracking.
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl text-center">
          <h3 className="text-xl font-bold mb-2">Monitor Mood</h3>
          <p className="text-gray-300">
            Reflect on your emotional patterns over time.
          </p>
        </div>

      </div>

      <footer className="mt-auto py-6 text-gray-500">
        © 2025 urLife — Built by Tanthong ⚡
      </footer>

    </div>
  );
}
