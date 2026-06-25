// src/components/ControlSliders.jsx
export default function ControlSliders({
  brightnessCeiling,
  loudnessCeiling,
  onBrightnessChange,
  onLoudnessChange,
  theme
}) {
  return (
    <div className="space-y-4">
      {/* Brightness Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold">Brightness Ceiling</label>
          <span className="text-sm font-bold">{brightnessCeiling}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={brightnessCeiling}
          onChange={(e) => onBrightnessChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Loudness Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold">Loudness Ceiling</label>
          <span className="text-sm font-bold">{loudnessCeiling}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={loudnessCeiling}
          onChange={(e) => onLoudnessChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
      </div>
    </div>
  );
}