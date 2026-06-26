import { useState, useEffect } from 'react';
import { SERVICE_UUID, RSSI_CHARACTERISTIC_UUID } from '../utils/ble';
import { calculateDistance, decodeRSSI } from '../utils/proximity';

export default function useRSSI(device) {
  const [rssi, setRSSI] = useState(0);
  const [distance, setDistance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!device?.server) {
      setLoading(true);
      return;
    }

    const setupRSSI = async () => {
      try {
        console.log('Getting service:', SERVICE_UUID);
        const service = await device.server.getPrimaryService(SERVICE_UUID);
        console.log('Service found:', service);

        console.log('Getting characteristic:', RSSI_CHARACTERISTIC_UUID);
        const characteristic = await service.getCharacteristic(RSSI_CHARACTERISTIC_UUID);
        console.log('Characteristic found:', characteristic);
        console.log('Characteristic properties:', characteristic.properties);

        // Read initial value
        const initialValue = await characteristic.readValue();
        const initialRSSI = decodeRSSI(initialValue);
        console.log('Initial RSSI read:', initialRSSI);
        setRSSI(initialRSSI);
        setDistance(calculateDistance(initialRSSI));

        // Setup notification listener
        const handleChange = (event) => {
          try {
            const value = decodeRSSI(event.target.value);
            console.log('RSSI notification:', value);
            setRSSI(value);
            setDistance(calculateDistance(value));
          } catch (err) {
            console.error('Decode error:', err);
          }
        };

        characteristic.addEventListener('characteristicvaluechanged', handleChange);
        await characteristic.startNotifications();
        console.log('Notifications started');
        
        setLoading(false);
        setError(null);

        return () => {
          characteristic.removeEventListener('characteristicvaluechanged', handleChange);
          characteristic.stopNotifications().catch(() => {});
        };
      } catch (err) {
        console.error('RSSI setup error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    const cleanup = setupRSSI();
    return () => cleanup?.then((fn) => fn?.());
  }, [device]);

  if (error) {
    return { rssi: 0, distance: 0, loading: false, error };
  }

  return { rssi, distance, loading };
}