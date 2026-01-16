export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-10 py-4 border-b bg-white">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 font-semibold text-emerald-600">
          🌱 Plantiva AI
        </div>
        <nav className="flex gap-6 text-sm text-gray-600">
          <a className="font-medium text-gray-900">My Garden</a>
          <a>Encyclopedia</a>
          <a>Community</a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <input
          className="w-64 rounded-full bg-gray-100 px-4 py-2 text-sm outline-none"
          placeholder="Search plants or diseases..."
        />
        <div className="h-9 w-9 rounded-full bg-gray-200" />
      </div>
    </header>
  );
}

