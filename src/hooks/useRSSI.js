// src/hooks/useRSSI.js
import { useState, useEffect } from 'react';
import { SERVICE_UUID, RSSI_CHARACTERISTIC_UUID } from '../utils/ble';
import { calculateDistance, decodeRSSI } from '../utils/proximity';

export default function useRSSI(device) {
  const [rssi, setRSSI] = useState(0);
  const [distance, setDistance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!device?.server) {
      setLoading(true);
      return;
    }

    const getRSSICharacteristic = async () => {
      try {
        const service = await device.server.getPrimaryService(SERVICE_UUID);
        const characteristic = await service.getCharacteristic(RSSI_CHARACTERISTIC_UUID);

        // Try notifications first
        try {
          characteristic.addEventListener('characteristicvaluechanged', (event) => {
            const value = decodeRSSI(event.target.value);
            setRSSI(value);
            setDistance(calculateDistance(value));
          });
          await characteristic.startNotifications();
          setLoading(false);
        } catch {
          // Fall back to polling
          console.log('Notifications not supported, using polling');
          setLoading(false);
          
          const pollRSSI = async () => {
            try {
              const value = await characteristic.readValue();
              const rssiValue = decodeRSSI(value);
              setRSSI(rssiValue);
              setDistance(calculateDistance(rssiValue));
            } catch (err) {
              console.error('RSSI poll failed:', err);
            }
          };

          pollRSSI();
          const interval = setInterval(pollRSSI, 1000);
          return () => clearInterval(interval);
        }
      } catch (error) {
        console.error('Failed to get RSSI characteristic:', error);
        setLoading(false);
      }
    };

    getRSSICharacteristic();
  }, [device]);

  return { rssi, distance, loading };
}
