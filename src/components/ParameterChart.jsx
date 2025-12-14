import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { useState } from "react";
import { Activity } from "lucide-react";

const PARAM_CONFIG = {
  salinity: {
    label: "Salinity",
    color: "#3b82f6",
    yDomain: [0, 50],
    unit: "psu"
  },
  temperature: {
    label: "Temperature",
    color: "#f97316",
    yDomain: [0, 40],
    unit: "°C"
  },
  pH: {
    label: "pH Level",
    color: "#10b981",
    yDomain: [0, 14],
    unit: ""
  },
  turbidity: {
    label: "Turbidity",
    color: "#8b5cf6",
    yDomain: [0, 100],
    unit: "NTU"
  }
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const config = PARAM_CONFIG[payload[0].dataKey];
    
    // Convertir en nombre si c'est une string
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-semibold text-gray-900">
          {!isNaN(numValue) ? numValue.toFixed(2) : value} {config.unit}
        </p>
      </div>
    );
  }
  return null;
};

const ParameterChart = ({ data }) => {
  const [selectedParam, setSelectedParam] = useState("salinity");
  const [chartType, setChartType] = useState("line");

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No data available</p>
        <p className="text-sm text-gray-400 mt-1">Data will appear once sensors start reporting</p>
      </div>
    );
  }

  const config = PARAM_CONFIG[selectedParam];

  // Calculate statistics
  const values = data.map(d => d[selectedParam]).filter(v => v != null);
  const avgValue = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : "-";
  const minValue = values.length > 0 ? Math.min(...values).toFixed(2) : "-";
  const maxValue = values.length > 0 ? Math.max(...values).toFixed(2) : "-";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {config.label} Evolution
          </h3>
          <p className="text-sm text-gray-500 mt-1">24-hour monitoring period</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Parameter Selector */}
          <select
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedParam}
            onChange={(e) => setSelectedParam(e.target.value)}
          >
            {Object.keys(PARAM_CONFIG).map((param) => (
              <option key={param} value={param}>
                {PARAM_CONFIG[param].label}
              </option>
            ))}
          </select>

          {/* Chart Type Toggle */}
          <div className="inline-flex rounded-lg border border-gray-300 bg-white">
            <button
              onClick={() => setChartType("line")}
              className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                chartType === "line" 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType("area")}
              className={`px-3 py-2 text-sm font-medium rounded-r-lg border-l border-gray-300 transition-colors ${
                chartType === "area" 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Area
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg px-4 py-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Average</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {avgValue} <span className="text-sm font-normal text-gray-500">{config.unit}</span>
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg px-4 py-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Min</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {minValue} <span className="text-sm font-normal text-gray-500">{config.unit}</span>
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg px-4 py-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Max</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {maxValue} <span className="text-sm font-normal text-gray-500">{config.unit}</span>
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                stroke="#d1d5db"
              />
              <YAxis 
                domain={config.yDomain} 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                stroke="#d1d5db"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={selectedParam}
                stroke={config.color}
                strokeWidth={2}
                dot={{ r: 3, fill: config.color }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          ) : (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${selectedParam}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                stroke="#d1d5db"
              />
              <YAxis 
                domain={config.yDomain} 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                stroke="#d1d5db"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={selectedParam}
                stroke={config.color}
                strokeWidth={2}
                fill={`url(#gradient-${selectedParam})`}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Displaying {data.length} data points
      </p>
    </div>
  );
};

export default ParameterChart;