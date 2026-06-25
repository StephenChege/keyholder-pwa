// src/components/LoudnessWave.jsx
export default function LoudnessWave({ loudness, proximityPercent, theme }) {
  const numBars = 5;
  const bars = Array.from({ length: numBars }, (_, i) => {
    const delay = i * 0.1;
    const scale = 0.3 + (loudness / 100) * (0.8 - 0.3);
    return (
      <div
        key={i}
        className="w-2 bg-gradient-to-t from-green-500 to-green-400 rounded-full transition-all duration-100"
        style={{
          height: `${30 + scale * 70}px`,
          animation: `wave 1.5s ease-in-out ${delay}s infinite`,
        }}
      />
    );
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-semibold text-opacity-80">Loudness Level</p>
      <div className={`flex items-end justify-center gap-2 h-32 px-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {bars}
      </div>
      <p className="text-lg font-bold">{Math.round(loudness)}%</p>
    </div>
  );
}