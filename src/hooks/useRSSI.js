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

    let intervalId = null;

    const setupRSSI = async () => {
      try {
        const service = await device.server.getPrimaryService(SERVICE_UUID);
        const characteristic = await service.getCharacteristic(RSSI_CHARACTERISTIC_UUID);

        // Handler for notifications
        const handleRSSIChange = (event) => {
          const value = decodeRSSI(event.target.value);
          setRSSI(value);
          setDistance(calculateDistance(value));
        };

        // Add listener BEFORE starting notifications
        characteristic.addEventListener('characteristicvaluechanged', handleRSSIChange);

        try {
          // Try notifications
          await characteristic.startNotifications();
          console.log('RSSI notifications started');
          setLoading(false);
        } catch (notifError) {
          // Fallback to polling
          console.log('Notifications failed, using polling:', notifError);
          setLoading(false);

          const pollRSSI = async () => {
            try {
              const value = await characteristic.readValue();
              const rssiValue = decodeRSSI(value);
              setRSSI(rssiValue);
              setDistance(calculateDistance(rssiValue));
            } catch (err) {
              console.error('Poll failed:', err);
            }
          };

          pollRSSI();
          intervalId = setInterval(pollRSSI, 1000);
        }

        // Cleanup
        return () => {
          characteristic.removeEventListener('characteristicvaluechanged', handleRSSIChange);
          if (intervalId) clearInterval(intervalId);
          characteristic.stopNotifications().catch(() => {});
        };
      } catch (error) {
        console.error('RSSI setup failed:', error);
        setLoading(false);
      }
    };

    const cleanup = setupRSSI();
    return () => {
      cleanup?.then((fn) => fn?.());
    };
  }, [device]);

  return { rssi, distance, loading };
}