// ========================================
// services/mockDeviceService.js - Remplacement de deviceService
// ========================================

import { 
  MOCK_DEVICES, 
  MOCK_ALERTS, 
  generateSensorData, 
  generateRealTimeData 
} from './mockData';

// Simule un délai réseau pour plus de réalisme
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * DEVICES
 */
export const fetchDevices = async () => {
  await delay();
  return MOCK_DEVICES;
};

export const fetchDeviceLocations = async () => {
  await delay();
  return MOCK_DEVICES;
};

export const addDevice = async (deviceData) => {
  await delay();
  const newDevice = {
    id: `device_${Date.now()}`,
    ...deviceData,
    statut: "actif",
    battery_level: 100,
    last_update: new Date().toISOString()
  };
  MOCK_DEVICES.push(newDevice);
  return newDevice;
};

export const updateDevice = async (id, deviceData) => {
  await delay();
  const index = MOCK_DEVICES.findIndex(d => d.id === id);
  if (index !== -1) {
    MOCK_DEVICES[index] = { ...MOCK_DEVICES[index], ...deviceData };
    return MOCK_DEVICES[index];
  }
  throw new Error('Device not found');
};

export const deleteDevice = async (id) => {
  await delay();
  const index = MOCK_DEVICES.findIndex(d => d.id === id);
  if (index !== -1) {
    MOCK_DEVICES.splice(index, 1);
    return { success: true };
  }
  throw new Error('Device not found');
};

/**
 * SENSOR DATA
 */
export const fetchRealTimeData = async (deviceId) => {
  await delay(300);
  return generateRealTimeData(deviceId);
};

export const fetchHistoricalData = async (deviceId, date) => {
  await delay();
  // Génère 24h de données pour la date demandée
  return generateSensorData(deviceId, 24);
};

/**
 * ALERTS
 */
export const fetchAlerts = async (page = 1, perPage = 10) => {
  await delay();
  
  // Si votre composant attend directement un array
  return MOCK_ALERTS;
  
  // OU si vous voulez garder la pagination, retournez:
  // return {
  //   data: MOCK_ALERTS,
  //   total: MOCK_ALERTS.length
  // };
};

export const fetchLastAlert = async () => {
  await delay(200);
  return MOCK_ALERTS[0] || null;
};

export const markAlertAsRead = async (alertId) => {
  await delay();
  const alert = MOCK_ALERTS.find(a => a.id === alertId);
  if (alert) {
    alert.status = 'read';
    return alert;
  }
  throw new Error('Alert not found');
};

/**
 * AUTH (mock)
 */
export const loginUser = async (email, password) => {
  await delay();
  
  // Mock login - accepte n'importe quel email/password
  if (email && password) {
    return {
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        id: 'user_001',
        email: email,
        name: 'Demo User'
      }
    };
  }
  
  throw new Error('Invalid credentials');
};
