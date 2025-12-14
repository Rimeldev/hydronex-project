// DeviceDetailsModal.jsx
import { X, MapPin, Battery } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchRealTimeData } from "../services/api";

export default function DeviceDetailsModal({ device, onClose }) {
  const [parameters, setParameters] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!device?.id) return;

    const loadData = async () => {
      try {
        const data = await fetchRealTimeData(device.id);
        setParameters({
          pH: data.ph,
          temperature: data.temperature,
          salinity: data.salinity,
          turbidity: data.turbidity,
          battery_level: data.battery_level,
        });
      } catch (err) {
        console.error("❌ Erreur chargement temps réel :", err);
        setError("Impossible de charger les données temps réel.");
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000); // Recharge toutes les 5s

    return () => clearInterval(interval);
  }, [device]);

  if (!device) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-brightness-90 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-1">{device.nom}</h2>

        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          {device.localisation}
        </div>

        {error ? (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        ) : parameters ? (
          <>
            <div className="mb-4 text-gray-600">
              <div className="flex items-center gap-2 mb-1">
                <Battery className="w-4 h-4 shrink-0" />
                <span className="font-medium">Batterie :</span>
                <span className="font-semibold">{parameters.battery_level}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-green-500 rounded"
                  style={{ width: `${parameters.battery_level}%` }}
                />
              </div>
            </div>

            <p className="text-sm font-semibold mb-1">Paramètres surveillés :</p>
            <div className="flex flex-wrap gap-2">
              {["pH", "temperature", "salinity", "turbidity"].map((key) => (
                <span
                  key={key}
                  className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded"
                >
                  {key} : {parameters[key]}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">Chargement des données...</p>
        )}
      </div>
    </div>
  );
}
