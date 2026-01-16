import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

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
      <div className="text-center">
        {/* Logo */}
        <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-[0_0_45px_rgba(16,185,129,0.18)]">
          <img src={logo} alt="Plantiva AI" className="w-12" />
        </div>

        {/* App Name */}
        <h1 className="text-3xl font-semibold text-gray-800">
          Plantiva AI
        </h1>

        {/* Tagline */}
        <p className="mt-2 text-xs tracking-[0.28em] text-emerald-600">
          RIGHT PLANT. RIGHT CARE.
        </p>

        {/* Loader Info */}
        <div className="mx-auto mt-10 flex w-[280px] items-center justify-between text-xs text-gray-500">
          <span>Initializing botanical engine…</span>
          <span className="font-medium text-emerald-600">
            {progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mx-auto mt-2 h-1.5 w-[280px] overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-5 text-[11px] tracking-widest text-gray-400">
        ✦ NEURAL GROWTH v1.0
      </div>
    </div>
  );
}
