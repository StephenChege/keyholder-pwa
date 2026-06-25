// src/components/SettingsPanel.jsx
export default function SettingsPanel({
  brightnessCeiling,
  loudnessCeiling,
  theme,
  onReset,
  onClose
}) {
  return (
    <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Settings</h3>
        <button
          onClick={onClose}
          className="text-sm opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-xs opacity-70">Brightness Ceiling Default</p>
          <p className="font-bold">{brightnessCeiling}%</p>
        </div>
        <div>
          <p className="text-xs opacity-70">Loudness Ceiling Default</p>
          <p className="font-bold">{loudnessCeiling}%</p>
        </div>
        <div>
          <p className="text-xs opacity-70">Theme</p>
          <p className="font-bold">{theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm"
      >
        Reset to Default Settings
      </button>
    </div>
  );
}
