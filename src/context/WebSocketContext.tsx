import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface LotteryUpdate {
  ticketId: string;
  buyerId: string;
  buyerName: string;
  buyersCount: number;
}

interface WebSocketContextType {
  socket: Socket | null;
  lotteryUpdates: LotteryUpdate[];
  addLotteryUpdate: (update: LotteryUpdate) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  lotteryUpdates: [],
  addLotteryUpdate: () => {},
  isConnected: false,
});

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lotteryUpdates, setLotteryUpdates] = useState<LotteryUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const addLotteryUpdate = (update: LotteryUpdate) => {
    setLotteryUpdates(prev => [...prev, update]);
  };

  useEffect(() => {
    const newSocket = io('https://crypto-bet-backend-fawn.vercel.app', {
      withCredentials: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
    });

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onConnectError = (error: Error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    };

    newSocket.on('connect', onConnect);
    newSocket.on('disconnect', onDisconnect);
    newSocket.on('connect_error', onConnectError);
    newSocket.on('buy_lottery', (data: LotteryUpdate) => {
      addLotteryUpdate(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.off('connect', onConnect);
      newSocket.off('disconnect', onDisconnect);
      newSocket.off('connect_error', onConnectError);
      newSocket.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, lotteryUpdates, addLotteryUpdate, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);