// src/components/RSSIDisplay.jsx
import { calculateDistance } from '../utils/proximity';

export default function RSSIDisplay({ rssi, distance }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white text-center">
        <p className="text-xs opacity-80">Signal Strength</p>
        <p className="text-3xl font-bold">{rssi}</p>
        <p className="text-xs opacity-80">dBm</p>
      </div>
      <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white text-center">
        <p className="text-xs opacity-80">Approximate Distance</p>
        <p className="text-3xl font-bold">{distance.toFixed(1)}</p>
        <p className="text-xs opacity-80">meters</p>
      </div>
    </div>
  );
}