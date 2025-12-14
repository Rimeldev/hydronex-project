import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchDevices } from '../services/api'; // Import de votre service

// Pour corriger l'icône des marqueurs par défaut
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Icônes personnalisées pour différents statuts
const createCustomIcon = (color) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5],
    popupAnchor: [0, -12.5],
  });
};

const activeIcon = createCustomIcon('#10B981'); // Vert
const inactiveIcon = createCustomIcon('#EF4444'); // Rouge
const selectedIcon = createCustomIcon('#3B82F6'); // Bleu pour le dispositif sélectionné

// Composant pour gérer le centrage automatique de la carte
function MapController({ selectedDeviceId, markers }) {
  const map = useMap();
  
  useEffect(() => {
    if (!markers || markers.length === 0) return;

    if (selectedDeviceId) {
      // Centrer sur le dispositif sélectionné
      const selectedDevice = markers.find(m => m.id === selectedDeviceId);
      if (selectedDevice) {
        map.setView([selectedDevice.lat, selectedDevice.lng], 15, {
          animate: true,
          duration: 1
        });
        return;
      }
    }

    // Si pas de sélection ou plusieurs marqueurs, ajuster la vue pour tous
    if (markers.length > 1) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { 
        padding: [20, 20],
        animate: true,
        duration: 1
      });
    } else if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 13, {
        animate: true,
        duration: 1
      });
    }
  }, [selectedDeviceId, markers, map]);

  return null;
}

export default function MapSection({ selectedDeviceId = null }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  // Fonction pour récupérer les dispositifs
  const loadDevices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Utilisation de votre service existant avec gestion d'erreur améliorée
      const data = await fetchDevices();
      
      // Vérifier que data est bien un array
      if (!Array.isArray(data)) {
        console.error('fetchDevices a retourné des données invalides:', data);
        throw new Error('Format de données invalide reçu de l\'API');
      }
      
      // Filtrer seulement les dispositifs qui ont des coordonnées valides
      const validDevices = data.filter(device => 
        device.localisation && 
        typeof device.localisation === 'string' && 
        device.localisation.includes(',')
      );
      
      console.log(`${validDevices.length} dispositifs avec coordonnées valides trouvés sur ${data.length} total`);
      setDevices(validDevices);
      
    } catch (err) {
      console.error('Erreur lors du chargement des dispositifs:', err);
      
      // Messages d'erreur plus explicites
      let errorMessage = 'Impossible de charger les dispositifs';
      if (err.message.includes('JSON')) {
        errorMessage = 'Erreur d\'authentification ou de connexion à l\'API';
      } else if (err.response?.status === 401) {
        errorMessage = 'Token d\'authentification expiré';
      } else if (err.response?.status === 403) {
        errorMessage = 'Accès non autorisé aux dispositifs';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Erreur serveur, veuillez réessayer plus tard';
      }
      
      setError(errorMessage);

      // Réinitialiser les dispositifs en cas d'erreur
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  // Préparer les marqueurs à partir des dispositifs
  const markers = devices
    .filter(device => {
      // Double vérification de la validité des coordonnées
      if (!device.localisation || typeof device.localisation !== 'string') return false;
      
      const coords = device.localisation.split(',');
      if (coords.length !== 2) return false;
      
      const lat = parseFloat(coords[0]);
      const lng = parseFloat(coords[1]);
      
      // Vérifier que les coordonnées sont des nombres valides
      return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    })
    .map(device => {
      const [lat, lng] = device.localisation.split(',').map(Number);
      return {
        ...device,
        lat,
        lng,
        isSelected: selectedDeviceId === device.id
      };
    });

  // Calculer le centre initial de la carte
  const getInitialCenter = () => {
    if (markers.length === 0) {
      return [6.3703, 2.3912]; // Cotonou par défaut
    }

    // Calculer le centre géographique de tous les marqueurs
    const avgLat = markers.reduce((sum, m) => sum + m.lat, 0) / markers.length;
    const avgLng = markers.reduce((sum, m) => sum + m.lng, 0) / markers.length;
    return [avgLat, avgLng];
  };

  const getInitialZoom = () => {
    return markers.length <= 1 ? 13 : 10;
  };

  // Fonction pour obtenir l'icône appropriée
  const getDeviceIcon = (device) => {
    if (selectedDeviceId === device.id) {
      return selectedIcon; // Bleu pour le dispositif sélectionné
    }
    return device.statut === 'actif' ? activeIcon : inactiveIcon;
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-md w-full h-[320px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Carte des dispositifs</h3>
        </div>
        <div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
          <div className="text-gray-500">Chargement de la carte...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full h-[320px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Device map
          <span className="text-sm text-gray-500 ml-2">({markers.length} device{markers.length > 1 ? 's' : ''})</span>
        </h3>
        
        {/* Légende */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Inactive</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Selected</span>
          </div>
        </div>
      </div>

      {/* Carte interactive */}
      <div className="w-full h-full rounded-lg overflow-hidden">
        {error && (
          <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-600 text-sm">
            <div className="text-center">
              <div className="mb-2">{error}</div>
              <button 
                onClick={loadDevices}
                className="text-xs bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        {!error && (
          <MapContainer
            ref={mapRef}
            center={getInitialCenter()}
            zoom={getInitialZoom()}
            scrollWheelZoom={false}
            style={{ height: '240px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            
            {/* Composant pour gérer le centrage automatique */}
            <MapController selectedDeviceId={selectedDeviceId} markers={markers} />
            
            {markers.map(device => (
              <Marker
                key={device.id}
                position={[device.lat, device.lng]}
                icon={getDeviceIcon(device)}
              >
                <Popup>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {device.nom}
                    </h4>
                  
                    <div className="flex items-center justify-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedDeviceId === device.id
                          ? 'bg-blue-100 text-blue-800'
                          : device.statut === 'actif' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedDeviceId === device.id ? 'Sélectionné' : device.statut}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {device.lat.toFixed(4)}, {device.lng.toFixed(4)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}