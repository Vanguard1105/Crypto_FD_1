import React, { createContext, useContext, useEffect, useState } from 'react';
import { getServerTime } from '../utils/timeSync';

interface TimeSyncContextType {
  syncedTime: number;
  isSyncing: boolean;
  syncError: boolean;
}

const TimeSyncContext = createContext<TimeSyncContextType>({
  syncedTime: Date.now(),
  isSyncing: true,
  syncError: false,
});

export const TimeSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [syncedTime, setSyncedTime] = useState<number>(Date.now());
  const [isSyncing, setIsSyncing] = useState<boolean>(true);
  const [syncError, setSyncError] = useState<boolean>(false);
  const [timeOffset, setTimeOffset] = useState<number>(0);

  useEffect(() => {
    const syncTime = async () => {
      try {
        // Get server time once and calculate the offset
        const serverTime = await getServerTime();
        const clientTime = Date.now();
        setTimeOffset(serverTime - clientTime);
        setIsSyncing(false);
        setSyncError(false);

        // Start local timer to increment the time
        const interval = setInterval(() => {
          setSyncedTime(Date.now() + timeOffset);
        }, 1000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Time synchronization failed:', error);
        setIsSyncing(false);
        setSyncError(true);
        // Fallback to client time
        const interval = setInterval(() => {
          setSyncedTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
      }
    };

    syncTime();

    // Optional: Re-sync periodically (e.g., every hour)
    const resyncInterval = setInterval(syncTime, 60 * 60 * 1000);
    return () => clearInterval(resyncInterval);
  }, [timeOffset]);

  return (
    <TimeSyncContext.Provider value={{ syncedTime, isSyncing, syncError }}>
      {children}
    </TimeSyncContext.Provider>
  );
};

export const useTimeSync = () => useContext(TimeSyncContext);