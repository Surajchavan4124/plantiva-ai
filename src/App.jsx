import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SplashScreen from "./components/SplashScreen";
import Home from "./pages/Home";
import PlanPlantation from "./pages/PlanPlantation";
import CareForMyPlant from "./pages/CareForMyPlant";
import MyGarden from "./pages/MyGarden";
import PlantDetails from "./pages/PlantDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Splash */}
        <Route path="/splash" element={<SplashScreen />} />
        
        {/* Redirect root to home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Main screens */}
        <Route path="/home" element={<Home />} />
        <Route path="/plan" element={<PlanPlantation />} />
        <Route path="/care" element={<CareForMyPlant />} />
        <Route path="/my-garden" element={<MyGarden />} />
        <Route path="/plants/:id" element={<PlantDetails />} />

        {/* Optional: fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
