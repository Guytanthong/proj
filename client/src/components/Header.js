function Header() {
  return (
    <div className="w-full bg-black flex items-center gap-6 px-12 h-24 fixed top-0 left-0 z-50 shadow-xl">
  <img src="/logo.png" className="w-20 h-20" />
  <h1 className="text-white text-4xl font-bold tracking-wide">
    Ur life
  </h1>
</div>
  );
}

export default Header;