import axios from 'axios';

let timeOffset = 0;
let lastSyncTime = 0;
const SYNC_INTERVAL = 60 * 60 * 1000; // Sync every hour

interface ServerTimeResponse {
  serverTime: number;
}

export const getServerTime = async (): Promise<number> => {
  try {
    const start = Date.now();
    const response = await axios.get<ServerTimeResponse>(
      'https://crypto-bet-backend-fawn.vercel.app/api/time/get-server-time',
      {
        timeout: 5000 // 5 second timeout
      }
    );

    // Validate response
    if (!response.data || typeof response.data.serverTime !== 'number') {
      throw new Error('Invalid server time response');
    }

    const end = Date.now();
    const roundTripTime = end - start;
    const serverTime = response.data.serverTime;

    // Calculate the offset (server time - (client time + half of round trip time))
    timeOffset = serverTime - (start + (roundTripTime / 2));
    lastSyncTime = Date.now();

    return serverTime;
  } catch (error) {
    console.error('Error fetching server time:', error);
    // Fallback to client time with a warning
    if (lastSyncTime > 0) {
      console.warn('Using last known time offset');
      return Date.now() + timeOffset;
    }
    console.warn('Falling back to client time');
    return Date.now();
  }
};

export const getSyncedTime = (): number => {
  // Automatically re-sync if it's been a while
  if (Date.now() - lastSyncTime > SYNC_INTERVAL) {
    getServerTime().catch(() => {
      // Ignore errors, we'll use the existing offset
    });
  }
  return Date.now() + timeOffset;
};

export const formatSyncedTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};