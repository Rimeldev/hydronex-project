import { useState, useEffect, useRef, useCallback } from "react";
import ParameterCard from "../components/ParameterCard";
import ParameterChart from "../components/ParameterChart";
import HeaderDashboard from "../components/HeaderDashboard";
import MapSection from "../components/MapSection";
import ToastNotification from "../components/ToastNotification";

import salinityIcon from "../assets/icons/salinity.png";
import temperatureIcon from "../assets/icons/temperature.png";
import phIcon from "../assets/icons/ph.png";
import turbidityIcon from "../assets/icons/turbidity.png";

import { fetchRealTimeData, fetchHistoricalData, fetchLastAlert } from "../services/api";

// 🔧 FONCTION UTILITAIRE pour convertir UTC en heure locale
function convertUTCToLocal(utcTimeString, format = "full") {
  if (!utcTimeString) return format === "full" ? "-" : "";
  
  try {
    // Ajouter 'Z' si ce n'est pas déjà présent pour forcer l'interprétation UTC
    let utcString = utcTimeString;
    if (!utcString.endsWith('Z') && !utcString.includes('+') && utcString.includes('T')) {
      utcString += 'Z';
    }
    
    const utcDate = new Date(utcString);
    
    if (isNaN(utcDate.getTime())) {
      return format === "full" ? utcTimeString : "";
    }
    
    // Toujours retourner HH:MM maintenant
    return utcDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error('Erreur lors de la conversion UTC:', error);
    return format === "full" ? utcTimeString : "";
  }
}

export default function Dashboard() {
  const [filters, setFilters] = useState({
    dispositifId: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [recentAlert, setRecentAlert] = useState(null);

  useEffect(() => {
    const getAlert = async () => {
      try {
        const alert = await fetchLastAlert();
        if (alert) setRecentAlert(alert);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'alerte :", error);
      }
    };
    getAlert();
  }, []);

  const [parameterData, setParameterData] = useState({
    temperature: null,
    salinity: null,
    pH: null,
    turbidity: null,
  });

  const [batteryLevel, setBatteryLevel] = useState(null);
  const [chartData, setChartData] = useState([]);
  const intervalRef = useRef(null);

  const { dispositifId, date } = filters;

  const isToday = (dateStr) => {
    const today = new Date();
    const selected = new Date(dateStr);
    return selected.toDateString() === today.toDateString();
  };

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const loadRealtimeData = useCallback(async () => {
    if (!dispositifId) return;
    try {
      const data = await fetchRealTimeData(dispositifId);
      if (!data) return;

      setParameterData({
        temperature: data.temperature,
        salinity: data.salinity,
        pH: data.ph,
        turbidity: data.turbidity,
      });

      setBatteryLevel(data.battery_level ?? null);

      // ✅ Convertir UTC vers heure locale (HH:MM pour les deux composants)
      const timeConverted = convertUTCToLocal(data.created_at);

      setChartData((prev) => {
        const updated = [...prev, { 
          ...data, 
          time: timeConverted,        // Pour ParameterChart ET LiveSensorFeed: "12:33"
        }];
        return updated.slice(-100); // ✅ Garde les 100 derniers points au lieu de 20
      });
    } catch (error) {
      console.error("Erreur temps réel :", error);
    }
  }, [dispositifId]);

  const loadHistoricalData = useCallback(async () => {
    if (!dispositifId || !date) return;
    try {
      const data = await fetchHistoricalData(dispositifId, date);
      if (!data || data.length === 0) return;

      const total = data.length;
      const sum = data.reduce(
        (acc, item) => {
          acc.temperature += item.temperature ?? 0;
          acc.salinity += item.salinity ?? 0;
          acc.pH += item.ph ?? 0;
          acc.turbidity += item.turbidity ?? 0;
          return acc;
        },
        { temperature: 0, salinity: 0, pH: 0, turbidity: 0 }
      );

      setParameterData({
        temperature: +(sum.temperature / total).toFixed(2),
        salinity: +(sum.salinity / total).toFixed(2),
        pH: +(sum.pH / total).toFixed(2),
        turbidity: +(sum.turbidity / total).toFixed(2),
      });

      setBatteryLevel(null);

      // ✅ Convertir toutes les données historiques (HH:MM pour les deux composants)
      const formatted = data.map((item) => {
        const utcTime = item.timestamp || item.created_at;
        return {
          ...item,
          time: convertUTCToLocal(utcTime)        // Pour ParameterChart ET LiveSensorFeed: "12:33"
        };
      });

      setChartData(formatted);
    } catch (error) {
      console.error("Erreur historique :", error);
    }
  }, [dispositifId, date]);

  useEffect(() => {
    if (!dispositifId) {
      setParameterData({ temperature: null, salinity: null, pH: null, turbidity: null });
      setChartData([]);
      setBatteryLevel(null);
      clearTimer();
      return;
    }

    clearTimer();

    if (isToday(date)) {
      loadRealtimeData();
      intervalRef.current = setInterval(loadRealtimeData, 5000); // ✅ Plus rapide: toutes les 3 secondes
    } else {
      loadHistoricalData();
    }

    return () => clearTimer();
  }, [dispositifId, date, loadRealtimeData, loadHistoricalData]);

  const handleFilterChange = useCallback(({ dispositifId, date }) => {
    setFilters({ dispositifId, date });
  }, []);



  return (
    <div className="space-y-6">
      <ToastNotification alert={recentAlert} />
      <HeaderDashboard onFilterChange={handleFilterChange} batteryLevel={batteryLevel} />
  

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ParameterCard
          icon={salinityIcon}
          value={parameterData.salinity ?? "-"}
          unit="psu"
          label="Salinity"
          gradientFrom="#ffe259"
          gradientTo="#ffa751"
        />
        <ParameterCard
          icon={temperatureIcon}
          value={parameterData.temperature ?? "-"}
          unit="°C"
          label="Temperature"
          gradientFrom="#FA656AFF"
          gradientTo="#ff9a9e"
        />
        <ParameterCard
          icon={phIcon}
          value={parameterData.pH ?? "-"}
          label="pH"
          gradientFrom="#6EFAB2FF"
          gradientTo="#a1ffce"
        />
        <ParameterCard
          icon={turbidityIcon}
          value={parameterData.turbidity ?? "-"}
          unit="NTU"
          label="Turbidity"
          gradientFrom="#89f7fe"
          gradientTo="#66a6ff"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ParameterChart data={chartData} />
        {/* Passer le dispositif sélectionné à la carte */}
        <MapSection selectedDeviceId={filters.dispositifId} />
      </div>
    </div>
  );
}