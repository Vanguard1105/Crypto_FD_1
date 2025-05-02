import axios from 'axios';

let timeOffset = 0;

export const getServerTime = async () => {
  try {
    const start = Date.now();
    const response = await axios.get('https://crypto-bet-backend-fawn.vercel.app/api/time/get-server-time');
    const end = Date.now();
    
    // Calculate the round-trip time and server time
    const roundTripTime = end - start;
    const serverTime = new Date(response.data.time).getTime();
    
    // Calculate the offset (server time - (client time + half of round trip time))
    timeOffset = serverTime - (start + (roundTripTime / 2));
    
    return serverTime;
  } catch (error) {
    console.error('Error fetching server time:', error);
    return Date.now(); // Fallback to client time
  }
};

export const getSyncedTime = () => {
  return Date.now() + timeOffset;
};

export const formatSyncedTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};