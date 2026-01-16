export default function Results() {
  return (
    <div className="min-h-screen bg-[#f7faf8] px-10 py-8">
      {/* Header */}
      <div className="mb-8">
        <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          AI ANALYSIS COMPLETE
        </span>

        <h1 className="mt-4 text-4xl font-semibold text-gray-900">
          Recommended for Your Space
        </h1>

        <p className="mt-2 max-w-2xl text-gray-600">
          Based on your low-light environment, 40–50% humidity levels,
          and weekly care schedule.
        </p>
      </div>

      {/* Tabs + Action */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex gap-6 text-sm">
          <button className="border-b-2 border-emerald-600 pb-2 font-medium text-emerald-600">
            Top Matches
          </button>
          <button className="text-gray-500">Low Maintenance</button>
          <button className="text-gray-500">Pet Friendly</button>
        </div>

        <button className="rounded-full border px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Refine Search
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* BEST MATCH */}
        <div className="col-span-2 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-2">
            {/* Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b"
                className="h-full w-full object-cover"
                alt="Monstera"
              />
              <span className="absolute top-4 left-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
                BEST MATCH
              </span>
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className="text-2xl font-semibold">Monstera Deliciosa</h2>
              <p className="mt-2 text-sm text-gray-600">
                The Swiss Cheese Plant is perfect for your living room corner.
                It thrives in indirect light and matches your watering habits.
              </p>

              {/* Survival */}
              <div className="mt-6">
                <div className="flex justify-between text-sm font-medium">
                  <span>Survival Probability</span>
                  <span className="text-emerald-600">98%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-gray-200">
                  <div className="h-full w-[98%] rounded-full bg-emerald-600" />
                </div>
              </div>

              {/* Tags */}
              <div className="mt-6 flex gap-3">
                <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm">
                  🌿 Moderate Care
                </span>
                <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm">
                  ☀️ Indirect Light
                </span>
              </div>

              {/* CTA */}
              <button className="mt-8 w-full rounded-xl bg-emerald-600 py-3 font-medium text-white hover:bg-emerald-700">
                Get AI Care Plan
              </button>
            </div>
          </div>
        </div>

        {/* SIDE CARDS */}
        <div className="space-y-8">
          {/* Snake Plant */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1587300003388-59208cc962cb"
              className="h-40 w-full object-cover"
              alt="Snake Plant"
            />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Snake Plant</h3>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">
                  92% MATCH
                </span>
              </div>

              <div className="mt-3 text-sm">
                <p className="text-gray-600 mb-1">Survival Probability</p>
                <div className="h-2 rounded-full bg-gray-200">
                  <div className="h-full w-[92%] rounded-full bg-emerald-600" />
                </div>
              </div>

              <button className="mt-4 w-full rounded-lg bg-gray-100 py-2 text-sm font-medium">
                View Details →
              </button>
            </div>
          </div>

          {/* Golden Pothos */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1604762524889-3c4a7aeb3f19"
              className="h-40 w-full object-cover"
              alt="Golden Pothos"
            />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Golden Pothos</h3>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">
                  88% MATCH
                </span>
              </div>

              <div className="mt-3 text-sm">
                <p className="text-gray-600 mb-1">Survival Probability</p>
                <div className="h-2 rounded-full bg-gray-200">
                  <div className="h-full w-[88%] rounded-full bg-emerald-600" />
                </div>
              </div>

              <button className="mt-4 w-full rounded-lg bg-gray-100 py-2 text-sm font-medium">
                View Details →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 flex items-center justify-between rounded-2xl bg-white p-8 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold">
            Not quite what you're looking for?
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Try adjusting your care capacity or lighting details.
          </p>
        </div>

        <div className="flex gap-4">
          <button className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white">
            Re-take Quiz
          </button>
          <button className="rounded-xl border px-6 py-3 text-sm font-medium">
            Browse All
          </button>
        </div>
      </div>
    </div>
  );
}
