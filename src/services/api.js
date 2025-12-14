import { USE_MOCK_DATA } from './apiConfig';
import * as realAPI from './deviceService';
import * as mockAPI from './mockDeviceService';

// Export conditionnel
const api = USE_MOCK_DATA ? mockAPI : realAPI;

export const {
  // Devices
  fetchDevices,
  fetchDeviceLocations,
  addDevice,
  updateDevice,
  deleteDevice,
  
  // Sensor Data
  fetchRealTimeData,
  fetchHistoricalData,
  
  // Alerts
  fetchAlerts,
  fetchLastAlert,
  markAlertAsRead,
  
  // Auth
  loginUser
} = api;

// Export par défaut
export default api;
