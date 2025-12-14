import { useState, useEffect } from "react";
import {
  ExclamationTriangleIcon,
  BellAlertIcon,
  InformationCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { fetchAlerts, fetchDevices } from "../services/api";
import NewsletterForm from "../components/NewsletterForm";

export default function Recommandations() {
  const [alerts, setAlerts] = useState([]);
  const [showHistory, setShowHistory] = useState(true);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [alertData, deviceData] = await Promise.all([
          fetchAlerts(null, 1, 100),
          fetchDevices(),
        ]);

        const enrichedAlerts = alertData.map((a) => {
          const device = deviceData.find((d) => d.id === a.dispositif_id);
          return {
            id: a.id,
            title: a.alerte,
            message: a.recommandation,
            recommendation: a.recommandation,
            type: "alert",
            date: a.created_at,
            deviceName: device ? device.nom : `Dispositif ${a.dispositif_id}`,
          };
        });

        setAlerts(enrichedAlerts);
      } catch (err) {
        console.error("Erreur lors du chargement des alertes ou dispositifs", err);
      }
    };

    loadData();

    // ✅ Afficher le popup après 1 seconde à chaque rechargement
    const timer = setTimeout(() => {
      setIsNewsletterOpen(true);
    }, 5000);

    return () => clearTimeout(timer); // Nettoyage propre du timer
  }, []);

  const handleCloseNewsletter = () => {
    setIsNewsletterOpen(false);
  };

  const sortedAlerts = [...alerts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const recentAlert = sortedAlerts[0] || null;
  const history = sortedAlerts.slice(1);

  const getAlertStyle = (type) => {
    switch (type) {
      case "warning":
        return {
          color: "bg-yellow-100 border-yellow-400 text-yellow-800",
          icon: <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />,
        };
      case "alert":
        return {
          color: "bg-red-100 border-red-400 text-red-800",
          icon: <BellAlertIcon className="w-6 h-6 text-red-500" />,
        };
      case "info":
        return {
          color: "bg-green-100 border-green-400 text-green-800",
          icon: <InformationCircleIcon className="w-6 h-6 text-green-500" />,
        };
      default:
        return {
          color: "bg-gray-100 border-gray-300 text-gray-800",
          icon: <InformationCircleIcon className="w-6 h-6 text-gray-500" />,
        };
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10 min-h-screen flex flex-col">
      {/* Recommandation récente */}
      <div>
        <h1 className="text-3xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
          Alerte récente
        </h1>
        {recentAlert ? (
          <div
            className={`transition-transform transform hover:scale-[1.01] border-l-4 p-6 rounded-xl shadow-md flex gap-4 items-start ${getAlertStyle(recentAlert.type).color}`}
          >
            <div className="mt-1">{getAlertStyle(recentAlert.type).icon}</div>
            <div>
              <h2 className="text-lg font-semibold">{recentAlert.title}</h2>
              <p className="text-sm text-gray-700">
                🔧 Dispositif : <span className="font-semibold">{recentAlert.deviceName}</span>
              </p>
              <p className="mt-1 text-sm">{recentAlert.message}</p>
              <p className="mt-2 text-sm italic text-gray-700">
                💡 {recentAlert.recommendation}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                📅 {new Date(recentAlert.date).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="italic text-gray-500">Aucune alerte enregistrée.</p>
        )}
      </div>

      {/* Historique des alertes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center gap-3">
            <ArrowPathIcon className="w-8 h-8 text-purple-600" />
            Historique des alertes
          </h2>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showHistory ? (
              <>
                <ChevronUpIcon className="w-5 h-5 mr-1" />
                Masquer
              </>
            ) : (
              <>
                <ChevronDownIcon className="w-5 h-5 mr-1" />
                Afficher
              </>
            )}
          </button>
        </div>

        {showHistory && history.length > 0 ? (
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent transition-all duration-300">
            {history.map((alert) => (
              <div
                key={alert.id}
                className={`transition-transform transform hover:scale-[1.01] border-l-4 p-4 rounded-lg shadow-sm flex items-start gap-3 ${getAlertStyle(alert.type).color}`}
              >
                <div className="mt-1">{getAlertStyle(alert.type).icon}</div>
                <div>
                  <h3 className="font-semibold">{alert.title}</h3>
                  <p className="text-sm text-gray-700">
                    🔧 Dispositif : <span className="font-semibold">{alert.deviceName}</span>
                  </p>
                  <p className="text-sm">{alert.message}</p>
                  <p className="italic text-xs text-gray-700 mt-1">{alert.recommendation}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    📅 {new Date(alert.date).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : showHistory ? (
          <p className="italic text-gray-500">Aucun historique disponible.</p>
        ) : null}
      </section>

      {/* Newsletter modal */}
     {isNewsletterOpen && (
  <div
    role="dialog"
    aria-modal="true"
   
    className="fixed inset-0 z-50 bg-black/50 backdrop-brightness-90 flex justify-center items-center"
  >
    <NewsletterForm onClose={handleCloseNewsletter} />
  </div>
)}
    </div>
  );
}
