import { logout } from "../authService";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="w-full bg-black flex items-center gap-6 px-12 h-24 fixed top-0 left-0 z-50 shadow-xl">
      <img
        src="/logo.png"
        className="w-20 h-20 cursor-pointer"
        alt="logo"
        onClick={() => navigate("/")}
      />
      <h1 className="text-white text-4xl font-bold tracking-wide">
        Ur life
      </h1>

      {/* ❗ Only show right side if logged in */}
      {user && (
        <div className="absolute top-5 right-5 flex items-center gap-3">
          <span className="text-white text-sm opacity-80">
            Logged in as
          </span>
          <div className="w-6 h-6 bg-gray-700 rounded-full"></div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
