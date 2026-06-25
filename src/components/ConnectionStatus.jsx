// src/components/ConnectionStatus.jsx
export default function ConnectionStatus({ connected, loading }) {
  return (
    <div className="p-4 rounded-lg bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30">
      <p className="text-sm font-medium">
        {loading ? '🔍 Scanning for ESP32_Proximity...' : connected ? '✅ Connected to ESP32_Proximity' : '❌ Disconnected'}
      </p>
    </div>
  );
}
