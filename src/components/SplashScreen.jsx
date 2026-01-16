import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate("/home");
          }, 300);
          return 100;
        }
        return p + 1;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-[#f7faf8] font-sans">
      <div className="text-center p-8 max-w-md mx-auto">
        {/* App Name */}
        <h1 className="text-5xl font-bold text-emerald-800 mb-4">
          Plantiva AI
        </h1>

        {/* Tagline */}
        <p className="text-xl text-gray-600 mb-8">
          Right Plant. Right Care.
        </p>
        
        {/* Plant Icon */}
        <div className="text-8xl mb-8">🌱</div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-md mx-auto mb-4">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-emerald-700 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Loader Info */}
        <div className="text-sm text-gray-500">
          {progress < 50 
            ? "Initializing Plantiva AI..." 
            : progress < 80 
              ? "Preparing your plant care journey..."
              : "Almost there..."}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-5 text-[11px] tracking-widest text-gray-400">
        ✦ NEURAL GROWTH v1.0
      </div>
    </div>
  );
}
