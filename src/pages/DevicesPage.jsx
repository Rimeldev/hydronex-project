import { useEffect, useState } from "react";
import { Eye, Plus, RotateCcw, Pencil } from "lucide-react";
import { toast } from "react-toastify";

import DeviceDetailsModal from "../components/DeviceDetailsModal";
import DeviceFormModal from "../components/DeviceFormModal";
import PasswordPromptModal from "../components/PasswordPromptModal";
import LoadingMessage from "../components/Spinner";
import LocationDisplay from "../components/LocationDisplay";

import { fetchDevices, addDevice, updateDevice } from "../services/api";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDevices();
      setDevices(data);
      if (data.length === 0) toast.info("No devices found.");
    } catch (err) {
      console.error("Error loading devices:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error && !loading) {
      toast.error("Error: Unable to load devices!");
    }
  }, [error, loading]);

  const handleClickAddDispositif = () => {
    setIsEditMode(false);
    setSelectedDevice(null);
    if (isAuthenticated) {
      setShowAddModal(true);
    } else {
      setShowPasswordModal(true);
    }
  };

  const handleClickEditDevice = (device) => {
    setSelectedDevice(device);
    setIsEditMode(true);
    if (isAuthenticated) {
      setShowAddModal(true);
    } else {
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSuccess = () => {
    setIsAuthenticated(true);
    setShowPasswordModal(false);
    setShowAddModal(true);
  };

  const handleViewClick = (device) => {
    setSelectedDevice(device);
    setShowModal(true);
  };

  const handleAddDevice = async (newDevice) => {
    try {
      await addDevice(newDevice);
      await loadDevices();
      setShowAddModal(false);
      toast.success("Device added successfully!");
    } catch (err) {
      console.error("Error adding device:", err);
      toast.error(err.response?.data?.message || "Error adding device.");
    }
  };

  const handleEditSubmit = async (updatedDevice) => {
    if (!selectedDevice) return;
    try {
      await updateDevice(selectedDevice.id, {
        ...updatedDevice,
        id: selectedDevice.id,
      });
      await loadDevices();
      setShowAddModal(false);
      setIsEditMode(false);
      setSelectedDevice(null);
      toast.success("Device updated successfully!");
    } catch (err) {
      console.error("Error updating device:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Error updating device.");
    }
  };

  const activeDevices = devices.filter(d => d.statut === "actif").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Devices</h1>
            <p className="text-sm text-gray-500 mt-1">
              {devices.length} total · {activeDevices} active
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDevices}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={handleClickAddDispositif}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add Device
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12">
              <LoadingMessage />
            </div>
          ) : devices.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">No devices found</p>
              <p className="text-sm text-gray-400 mt-1">Add your first device to get started</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {devices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          device.statut === "actif" ? "bg-green-500" : "bg-gray-300"
                        }`} />
                        <span className="text-sm font-medium text-gray-900">
                          {device.nom}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <LocationDisplay 
                        coordinates={device.localisation} 
                        maxLength={45}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        device.statut === "actif"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {device.statut === "actif" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {!isAuthenticated && (
                        <button
                          onClick={() => handleViewClick(device)}
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      )}

                      {isAuthenticated && (
                        <button
                          onClick={() => handleClickEditDevice(device)}
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modals */}
        {showModal && selectedDevice && (
          <DeviceDetailsModal
            device={selectedDevice}
            onClose={() => {
              setShowModal(false);
              setSelectedDevice(null);
            }}
          />
        )}

        {showPasswordModal && (
          <PasswordPromptModal
            onClose={() => setShowPasswordModal(false)}
            onSuccess={handlePasswordSuccess}
          />
        )}

        {showAddModal && (
          <DeviceFormModal
            device={isEditMode ? selectedDevice : null}
            isEdit={isEditMode}
            onClose={() => {
              setShowAddModal(false);
              setIsEditMode(false);
              setSelectedDevice(null);
            }}
            onSubmit={isEditMode ? handleEditSubmit : handleAddDevice}
          />
        )}
      </div>
    </div>
  );
}