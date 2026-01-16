import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";
import RecentScanCard from "../components/RecentScanCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7faf8]">
      <Navbar />

      <main className="px-10 py-8">
        {/* Greeting */}
        <h1 className="text-4xl font-semibold text-gray-900">
          Good morning, Gardener.
        </h1>
        <p className="mt-2 text-gray-600">
          Your AI-powered companion for a thriving, sustainable garden.
        </p>

        {/* Feature Cards */}
        <div className="mt-10 grid grid-cols-2 gap-8">
          <FeatureCard
            title="Plan a Plantation"
            desc="Tell us about your space and we'll suggest the perfect plants."
            cta="Start Planning"
            image="/images/plan.jpg"
          />
          <FeatureCard
            title="Care for My Plant"
            desc="Identify issues, get watering schedules, track health."
            cta="Check Health"
            image="/images/care.jpg"
          />
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="col-span-2 rounded-2xl bg-emerald-50 p-6">
            <p className="text-sm font-medium text-gray-800">
              🌱 Daily Care Tip
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Tomatoes need 20% more water this week due to heatwave.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Local Weather</p>
            <h3 className="mt-1 text-2xl font-semibold">24°C ☀️</h3>
            <p className="mt-2 text-sm text-gray-600">
              Perfect conditions for repotting.
            </p>
          </div>
        </div>

        {/* Recent Scans */}
        <div className="mt-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Scans</h2>
            <button className="text-sm text-emerald-600">
              View all history
            </button>
          </div>

          <div className="mt-4 flex gap-6">
            <RecentScanCard name="Fiddle Leaf Fig" image="/images/fig.jpg" />
            <RecentScanCard name="Monstera" image="/images/monstera.jpg" />
            <RecentScanCard name="Lavender" image="/images/lavender.jpg" />
            <RecentScanCard name="Aloe Vera" image="/images/aloe.jpg" />
            <RecentScanCard name="Snake Plant" image="/images/snake.jpg" />
          </div>
        </div>
      </main>
    </div>
  );
}
