// ========================================
// services/mockData.js - Données fictives
// ========================================

// Générateur de données aléatoires
const randomBetween = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => Math.floor(randomBetween(min, max));

// Générateur de dates/heures
const generateTimeStamps = (hours = 24) => {
  const now = new Date();
  const timestamps = [];
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now - i * 60 * 60 * 1000);
    timestamps.push({
      full: time.toISOString(),
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });
  }
  
  return timestamps;
};

// ========================================
// MOCK DEVICES DATA
// ========================================
export const MOCK_DEVICES = [
  {
    id: "device_001",
    nom: "Sensor Alpha",
    localisation: "6.3703,2.3912", // Cotonou, Benin
    statut: "actif",
    battery_level: 85,
    last_update: new Date().toISOString()
  },
  {
    id: "device_002",
    nom: "Sensor Beta",
    localisation: "6.3833,2.4167", // Near Cotonou
    statut: "actif",
    battery_level: 62,
    last_update: new Date().toISOString()
  },
  {
    id: "device_003",
    nom: "Sensor Gamma",
    localisation: "6.3500,2.3500",
    statut: "inactif",
    battery_level: 15,
    last_update: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "device_004",
    nom: "Sensor Delta",
    localisation: "6.4000,2.4500",
    statut: "actif",
    battery_level: 95,
    last_update: new Date().toISOString()
  }
];

// ========================================
// MOCK SENSOR DATA GENERATOR
// ========================================
export const generateSensorData = (deviceId, hours = 24) => {
  const timestamps = generateTimeStamps(hours);
  
  return timestamps.map((ts, index) => ({
    id: `reading_${deviceId}_${index}`,
    device_id: deviceId,
    salinity: randomBetween(30, 40).toFixed(2),
    temperature: randomBetween(22, 28).toFixed(2),
    ph: randomBetween(6.5, 8.5).toFixed(2),
    turbidity: randomBetween(5, 25).toFixed(2),
    timestamp: ts.full,
    created_at: ts.full,
    time: ts.time
  }));
};

// ========================================
// MOCK ALERTS DATA
// ========================================
export const MOCK_ALERTS = [
  {
    id: "alert_001",
    device_id: "device_001",
    device_name: "Sensor Alpha",
    type: "warning",
    parameter: "pH",
    value: 8.7,
    threshold: 8.5,
    message: "pH level exceeds safe threshold",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "active"
  },
  {
    id: "alert_002",
    device_id: "device_002",
    device_name: "Sensor Beta",
    type: "critical",
    parameter: "turbidity",
    value: 45.2,
    threshold: 30,
    message: "High turbidity detected - water quality compromised",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: "resolved"
  },
  {
    id: "alert_003",
    device_id: "device_003",
    device_name: "Sensor Gamma",
    type: "info",
    parameter: "battery",
    value: 15,
    threshold: 20,
    message: "Low battery - maintenance required",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    status: "active"
  }
];

// ========================================
// MOCK REAL-TIME DATA
// ========================================
export const generateRealTimeData = (deviceId) => {
  const device = MOCK_DEVICES.find(d => d.id === deviceId);
  
  return {
    device_id: deviceId,
    salinity: randomBetween(30, 40).toFixed(2),
    temperature: randomBetween(22, 28).toFixed(2),
    ph: randomBetween(6.5, 8.5).toFixed(2),
    turbidity: randomBetween(5, 25).toFixed(2),
    battery_level: device?.battery_level || randomInt(20, 100),
    created_at: new Date().toISOString(),
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
};

