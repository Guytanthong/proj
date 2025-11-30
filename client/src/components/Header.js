import { logout } from "../authService";
import { useNavigate } from "react-router-dom";
function Header() {

  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
}
  return (
    <div className="w-full bg-black flex items-center gap-6 px-12 h-24 fixed top-0 left-0 z-50 shadow-xl">
  <img src="/logo.png" className="w-20 h-20" />
  <h1 className="text-white text-4xl font-bold tracking-wide">
    Ur life
  </h1>
  <div className="absolute top-5 right-5">
      <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
    >
      Logout
    </button>
  </div>
  
</div>
  );
}

export default Header;