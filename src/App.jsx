// src/components/App.jsx
import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import useBLE from '../hooks/useBLE';
import useRSSI from '../hooks/useRSSI';
import ConnectionStatus from './ConnectionStatus';
import RSSIDisplay from './RSSIDisplay';
import BrightnessCircle from './BrightnessCircle';
import LoudnessWave from './LoudnessWave';
import ControlSliders from './ControlSliders';
import SettingsPanel from './SettingsPanel';
import ProximityTone from '../utils/audio';
import { mapRSSIToProximity } from '../utils/proximity';
import '../App.css';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { device, connected, connect, disconnect } = useBLE();
  const { rssi, distance, loading } = useRSSI(device);
  
  const [brightnessCeiling, setBrightnessCeiling] = useState(80);
  const [loudnessCeiling, setLoudnessCeiling] = useState(60);
  const [showSettings, setShowSettings] = useState(false);
  const [proximityTone] = useState(() => new ProximityTone());

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('keyholder_app_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      setBrightnessCeiling(settings.brightness_ceiling || 80);
      setLoudnessCeiling(settings.loudness_ceiling || 60);
    }
  }, []);

  // Update proximity tone when RSSI or loudness ceiling changes
  useEffect(() => {
    if (connected && rssi !== 0) {
      const proximityPercent = mapRSSIToProximity(rssi);
      const frequency = 400 + proximityPercent * 16; // 400-2000 Hz
      const volume = (proximityPercent * loudnessCeiling) / 100;
      
      proximityTone.play(frequency, volume / 100);
    }
  }, [rssi, loudnessCeiling, connected, proximityTone]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      brightness_ceiling: brightnessCeiling,
      loudness_ceiling: loudnessCeiling,
      theme: theme
    };
    localStorage.setItem('keyholder_app_settings', JSON.stringify(settings));
  }, [brightnessCeiling, loudnessCeiling, theme]);

  const handleBrightnessChange = (value) => {
    setBrightnessCeiling(value);
  };

  const handleLoudnessChange = (value) => {
    setLoudnessCeiling(value);
  };

  const handleResetSettings = () => {
    setBrightnessCeiling(80);
    setLoudnessCeiling(60);
    localStorage.removeItem('keyholder_app_settings');
  };

  const handleDisconnect = () => {
    proximityTone.stop();
    disconnect();
  };

  const proximityPercent = rssi !== 0 ? mapRSSIToProximity(rssi) : 0;
  const actualBrightness = (proximityPercent * brightnessCeiling) / 100;
  const actualLoudness = (proximityPercent * loudnessCeiling) / 100;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} px-4 py-4 flex justify-between items-center`}>
        <h1 className="text-2xl font-bold">Keyholder Finder</h1>
        <button
          onClick={toggleTheme}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Connection Status */}
        <ConnectionStatus connected={connected} loading={loading} />

        {error && (
          <div className="p-4 rounded-lg bg-red-500 bg-opacity-10 border border-red-500 text-red-400">
            <p className="text-sm">Error: {error}</p>
          </div>
        )}

        {/* RSSI & Distance Display */}
        {connected && <RSSIDisplay rssi={rssi} distance={distance} />}

        {/* Brightness Circle */}
        <BrightnessCircle brightness={actualBrightness} proximityPercent={proximityPercent} theme={theme} />

        {/* Loudness Wave */}
        <LoudnessWave loudness={actualLoudness} proximityPercent={proximityPercent} theme={theme} />

        {/* Control Sliders */}
        <ControlSliders
          brightnessCeiling={brightnessCeiling}
          loudnessCeiling={loudnessCeiling}
          onBrightnessChange={handleBrightnessChange}
          onLoudnessChange={handleLoudnessChange}
          theme={theme}
        />

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!connected ? (
            <button
              onClick={connect}
              className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
              Connect to ESP32
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              Disconnect
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`px-4 py-3 font-semibold rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
            title="Settings"
          >
            ⚙️
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel
            brightnessCeiling={brightnessCeiling}
            loudnessCeiling={loudnessCeiling}
            theme={theme}
            onReset={handleResetSettings}
            onClose={() => setShowSettings(false)}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
