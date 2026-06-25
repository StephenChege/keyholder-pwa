// src/hooks/useBLE.js
import { useState, useCallback } from 'react';
import { SERVICE_UUID } from '../utils/ble';

export default function useBLE() {
  const [device, setDevice] = useState(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(async () => {
    try {
      const deviceFromBLE = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'ESP32_Proximity' }],
        optionalServices: [SERVICE_UUID],
      });

      const server = await deviceFromBLE.gatt.connect();
      setDevice({ device: deviceFromBLE, server });
      setConnected(true);

      // Handle disconnect
      deviceFromBLE.addEventListener('gattserverdisconnected', () => {
        setConnected(false);
        setDevice(null);
      });
    } catch (error) {
      console.error('BLE connection failed:', error);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (device?.device?.gatt?.connected) {
      device.device.gatt.disconnect();
    }
    setConnected(false);
    setDevice(null);
  }, [device]);

  return { device, connected, connect, disconnect };
}
