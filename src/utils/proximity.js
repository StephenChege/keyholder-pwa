// src/utils/proximity.js
const TX_POWER = -5;           // dBm at 1 meter
const PATH_LOSS_EXPONENT = 2.5; // Indoor environment
const RSSI_STRONG = -40;        // Very close
const RSSI_WEAK = -80;          // Far away

export function calculateDistance(rssi) {
  if (rssi === 0) return 0;
  const exponent = (TX_POWER - rssi) / (10 * PATH_LOSS_EXPONENT);
  return Math.pow(10, exponent);
}

export function mapRSSIToProximity(rssi) {
  if (rssi >= RSSI_STRONG) return 100;
  if (rssi <= RSSI_WEAK) return 20;
  return 20 + ((rssi - RSSI_WEAK) / (RSSI_STRONG - RSSI_WEAK)) * 80;
}

export function decodeRSSI(buffer) {
  const bytes = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
  const value = bytes[0] | (bytes[1] << 8);
  return value > 32767 ? value - 65536 : value;
}