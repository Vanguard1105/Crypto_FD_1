import React, { createContext, useContext, useEffect, useState } from 'react';
import { getServerTime, getSyncedTime } from '../utils/timeSync';

interface TimeSyncContextType {
  syncedTime: number;
  isSyncing: boolean;
}

const TimeSyncContext = createContext<TimeSyncContextType>({
  syncedTime: Date.now(),
  isSyncing: true,
});

export const TimeSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [syncedTime, setSyncedTime] = useState<number>(Date.now());
  const [isSyncing, setIsSyncing] = useState<boolean>(true);

  useEffect(() => {
    const syncTime = async () => {
      try {
        await getServerTime();
        setIsSyncing(false);
        
        // Update synced time every second
        const interval = setInterval(() => {
          setSyncedTime(getSyncedTime());
        }, 1000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Time synchronization failed:', error);
        setIsSyncing(false);
      }
    };

    syncTime();
  }, []);

  return (
    <TimeSyncContext.Provider value={{ syncedTime, isSyncing }}>
      {children}
    </TimeSyncContext.Provider>
  );
};

export const useTimeSync = () => useContext(TimeSyncContext);