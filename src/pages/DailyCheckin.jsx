export default function DailyCheckin() {
  return (
    <div className="min-h-screen bg-[#f7faf8]">
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-10 py-4 border-b bg-white">
        <div className="flex items-center gap-2 font-semibold text-emerald-600">
          🌱 Plantiva AI
        </div>

        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <span className="cursor-pointer">My Garden</span>
          <span className="cursor-pointer">AI Assistant</span>
          <div className="h-9 w-9 rounded-full bg-gray-200" />
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative flex flex-col items-center justify-center px-4 py-20">
        {/* Decorative Circle (left) */}
        <div className="absolute left-16 top-32 h-40 w-40 rounded-full border-2 border-dashed border-emerald-200" />

        {/* Heading */}
        <h1 className="text-4xl font-semibold text-gray-900">
          Daily Check-in
        </h1>
        <p className="mt-3 max-w-md text-center text-gray-600">
          Tell us how your plant is doing today for a tailored care routine.
        </p>

        {/* Card */}
        <div className="mt-12 w-full max-w-xl rounded-2xl bg-white p-8 shadow-sm">
          {/* Plant Name */}
          <label className="text-xs font-semibold text-gray-500">
            PLANT NAME
          </label>
          <div className="mt-2 flex items-center rounded-xl border px-4 py-3">
            <input
              className="w-full text-sm outline-none"
              placeholder="Which plant are we tending to? (e.g. Monstera)"
            />
            <span className="ml-2 text-emerald-500">🌿</span>
          </div>

          {/* Days Since Planted */}
          <label className="mt-6 block text-xs font-semibold text-gray-500">
            DAYS SINCE PLANTED
          </label>
          <div className="mt-2 flex items-center rounded-xl border px-4 py-3">
            <input
              className="w-full text-sm outline-none"
              placeholder="How long has it been growing?"
            />
            <span className="ml-2 text-emerald-500">📅</span>
          </div>

          {/* CTA */}
          <button className="mt-8 w-full rounded-full bg-emerald-600 py-4 font-medium text-white hover:bg-emerald-700">
            Get Today’s Care ✨
          </button>

          {/* Info Box */}
          <div className="mt-6 flex gap-3 rounded-xl border border-dashed bg-gray-50 p-4 text-sm text-gray-600">
            <span className="text-emerald-600">✔</span>
            <p>
              Your plant data helps our AI grow with you. We use this to
              calculate specific watering, light exposure, and humidity needs
              for your exact climate.
            </p>
          </div>
        </div>

        {/* Quote */}
        <p className="mt-10 max-w-md text-center text-sm italic text-gray-500">
          “Plants grow at their own pace. Patience is the best fertilizer.”
        </p>

        {/* Footer */}
        <p className="mt-16 text-xs tracking-widest text-gray-400">
          PLANTIVA AI © 2024 · GROWTH THROUGH INTELLIGENCE
        </p>
      </main>
    </div>
  );
}
