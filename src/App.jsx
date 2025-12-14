
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import HydroBot from './pages/HydroBot';
import DashboardLayout from './layouts/DashboardLayout';
import DevicesPage from './pages/DevicesPage';
import { ThemeProvider } from './contexts/ThemeContext';
import Support from './pages/Support';
import 'leaflet/dist/leaflet.css';


const alerts = [
  {
    id: 1,
    title: "Risque de turbidité élevé",
    message: "Évitez les intrants chimiques pour l’instant.",
    recommendation: "Utilisez de l’eau filtrée dans les prochaines 12h.",
    type: "alert",
    date: "2025-06-09T10:00:00Z",
  },
  {
    id: 2,
    title: "Température optimale",
    message: "La température est idéale pour le maïs.",
    recommendation: "Poursuivez l’irrigation normale.",
    type: "alert",
    date: "2025-06-08T15:30:00Z",
  },
  {
    id: 3,
    title: "Température optimale",
    message: "La température est idéale pour le maïs.",
    recommendation: "Poursuivez l’irrigation normale.",
    type: "info",
    date: "2025-06-08T15:30:00Z",
  },
  {
    id: 4,
    title: "Température optimale",
    message: "La température est idéale pour le maïs.",
    recommendation: "Poursuivez l’irrigation normale.",
    type: "info",
    date: "2025-06-08T15:30:00Z",
  },
  {
    id: 5,
    title: "Température optimale",
    message: "La température est idéale pour le maïs.",
    recommendation: "Poursuivez l’irrigation normale.",
    type: "info",
    date: "2025-06-08T15:30:00Z",
  },
  {
    id: 6,
    title: "Température optimale",
    message: "La température est idéale pour le maïs.",
    recommendation: "Poursuivez l’irrigation normale.",
    type: "info",
    date: "2025-06-08T15:30:00Z",
  },
  {
    id: 2,
    title: "Température optimale",
    message: "La température est idéale pour le maïs.",
    recommendation: "Poursuivez l’irrigation normale.",
    type: "info",
    date: "2025-06-08T15:30:00Z",
  },
  {
    id: 7,
    title: "Température optimale",
    message: "La température est idéale pour le maïs.",
    recommendation: "Poursuivez l’irrigation normale.",
    type: "info",
    date: "2025-06-08T15:30:00Z",
  },
];

function App() {
  return (
        <ThemeProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/" element={ <DashboardLayout>
             <Dashboard />
            </DashboardLayout>} />
        <Route path="/Recommendations" element={<DashboardLayout><Recommendations alerts={alerts} /></DashboardLayout>} />
          
           {/* Pages avec layout */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
             <Dashboard />
            </DashboardLayout>
          }
        />
         <Route
          path="/DevicesPage"
          element={
            <DashboardLayout>
              <DevicesPage />
            </DashboardLayout>
          }
        />

        <Route
          path="/HydroBot"
          element={
            <DashboardLayout>
              <HydroBot />
            </DashboardLayout>
          }
        />

  <Route
          path="/Support"
          element={
            <DashboardLayout>
              <Support />
            </DashboardLayout>
          }
        />
      </Routes>
</ThemeProvider>
      
  );
}

export default App;