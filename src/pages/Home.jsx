import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* App Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-emerald-800 mb-4">
            Plantiva AI
          </h1>
          <p className="text-xl text-gray-600">
            Right Plant. Right Care.
          </p>
        </div>

        {/* Main Options */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan a Plantation */}
          <div 
            onClick={() => navigate("/plan")}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer transform hover:-translate-y-1"
          >
            <div className="h-48 bg-emerald-100 flex items-center justify-center">
              <div className="text-8xl">🌿</div>
            </div>
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Plan a Plantation</h2>
              <button className="w-full max-w-xs mx-auto bg-emerald-600 text-white py-3 px-6 rounded-full font-medium hover:bg-emerald-700 transition-colors">
                Get Started
              </button>
            </div>
          </div>

          {/* Care for My Plant */}
          <div 
            onClick={() => navigate("/care")}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer transform hover:-translate-y-1"
          >
            <div className="h-48 bg-emerald-50 flex items-center justify-center">
              <div className="text-8xl">💧</div>
            </div>
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Care for My Plant</h2>
              <button className="w-full max-w-xs mx-auto bg-emerald-500 text-white py-3 px-6 rounded-full font-medium hover:bg-emerald-600 transition-colors">
                Get Care Tips
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
