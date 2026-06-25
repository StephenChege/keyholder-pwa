// src/components/BrightnessCircle.jsx
export default function BrightnessCircle({ brightness, proximityPercent, theme }) {
  // Color gradient: cool blue (far) → warm orange (close)
  const hue = 200 - proximityPercent * 1.5; // 200 (blue) to ~50 (orange) as proximity increases
  const saturation = 60 + proximityPercent * 0.4;
  const lightness = 50 + (1 - proximityPercent / 100) * 20; // Brighter when far, dimmer when close
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-semibold text-opacity-80">Brightness Level</p>
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full opacity-30 blur-lg"
          style={{ backgroundColor: color }}
        />
        {/* Main circle */}
        <div
          className="absolute inset-0 rounded-full shadow-lg transition-all duration-300"
          style={{
            backgroundColor: color,
            opacity: Math.min(brightness / 100, 1),
          }}
        />
        {/* Center display */}
        <div className="relative z-10 text-center">
          <p className="text-4xl font-bold">{Math.round(brightness)}%</p>
          <p className="text-xs opacity-70">brightness</p>
        </div>
      </div>
    </div>
  );
}
