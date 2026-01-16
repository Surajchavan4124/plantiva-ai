export default function DailyReport() {
  return (
    <div className="min-h-screen bg-[#f7faf8]">
      {/* Navbar */}
      <header className="flex items-center justify-between px-10 py-4 border-b bg-white">
        <div className="flex items-center gap-2 font-semibold text-emerald-600">
          🌱 Plantiva AI
        </div>

        <nav className="flex items-center gap-8 text-sm text-gray-600">
          <span>Dashboard</span>
          <span>My Plants</span>
          <span className="text-emerald-600 font-medium">Care Guides</span>
          <div className="h-9 w-9 rounded-full bg-gray-200" />
        </nav>
      </header>

      {/* Page Content */}
      <main className="px-10 py-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900">
              Your Plant’s Daily Report
            </h1>
            <p className="mt-2 max-w-2xl text-gray-600">
              AI-powered insights for your <b>Fiddle Leaf Fig</b> based on sensor
              data and photo analysis.
            </p>
          </div>

          <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700">
            ⚠ Medium Risk
          </span>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-3 gap-8">
          {/* Plant Overview */}
          <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex gap-6">
              {/* Image */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1598880940080-ff9a29891b85"
                  alt="Fiddle Leaf Fig"
                  className="h-44 w-36 rounded-xl object-cover"
                />
                <button className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white shadow text-sm">
                  📷
                </button>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">Fiddle Leaf Fig</h2>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">
                    INDOOR
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-600">
                  <b className="text-yellow-600">
                    Moderate dehydration
                  </b>{" "}
                  detected. Lower leaves are beginning to curl, suggesting
                  inconsistent moisture.
                </p>

                {/* Survival */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Survival Probability</span>
                    <span className="text-emerald-600">72%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-gray-200">
                    <div className="h-full w-[72%] rounded-full bg-emerald-600" />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Steady improvement of +5% over the last 7 days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Attention Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 text-2xl">
                !
              </div>
              <h3 className="font-semibold text-lg">Needs Attention</h3>
              <p className="mt-2 text-sm text-gray-600">
                Low humidity (34%) and soil moisture depletion in the upper
                2 inches.
              </p>
            </div>

            <button className="mt-6 rounded-full bg-emerald-600 py-3 text-white font-medium hover:bg-emerald-700">
              Today’s Care Actions
            </button>
          </div>
        </div>

        {/* Care Actions */}
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">💧 WATERING</p>
            <h3 className="mt-1 font-semibold">500ml Filtered</h3>
            <p className="mt-2 text-sm text-gray-600">
              Water slowly at the base. Ensure room temperature to avoid root
              shock.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">☀️ SUNLIGHT</p>
            <h3 className="mt-1 font-semibold">6 Hours Indirect</h3>
            <p className="mt-2 text-sm text-gray-600">
              Rotate 90° clockwise today to ensure even growth.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">🧹 MAINTENANCE</p>
            <h3 className="mt-1 font-semibold">Dust Leaves</h3>
            <p className="mt-2 text-sm text-gray-600">
              Wipe leaves gently to help the plant breathe better.
            </p>
          </div>
        </div>

        {/* AI Rationale */}
        <div className="mt-10 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50 p-8 flex justify-between gap-6">
          <div>
            <h3 className="font-semibold mb-2">✨ AI Rationale & Pro Tip</h3>
            <p className="text-sm text-gray-700">
              Increased transpiration detected due to dry indoor air. Hydration
              is the priority. Consider adding a pebble tray or humidifier.
            </p>
            <p className="mt-3 text-sm font-medium">
              Pro Tip:
              <span className="font-normal">
                {" "}
                Repot into a slightly larger vessel in ~8 weeks for optimal
                spring growth.
              </span>
            </p>

            <div className="mt-4 flex gap-2 text-xs">
              <span className="rounded-full bg-white px-3 py-1">
                #FiddleLeafHealth
              </span>
              <span className="rounded-full bg-white px-3 py-1">
                #HumidityAlert
              </span>
            </div>
          </div>

          <button className="h-fit rounded-full border px-5 py-2 text-sm font-medium bg-white">
            ✔ Mark as Completed
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t pt-6 text-center text-sm text-gray-400">
          © 2024 Plantiva AI. Your digital gardener companion.
        </footer>
      </main>
    </div>
  );
}
