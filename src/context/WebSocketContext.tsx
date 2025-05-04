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
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });

    newSocket.on('connect', () => {
        console.log('Connected to socket server:', newSocket.id);
    });
    newSocket.on('buy_lottery', (data) => {
        console.log('Received buy_lottery:', data);
        addLotteryUpdate(data);
    });
    newSocket.on('disconnect', () => {
        console.log('Disconnected from socket server');
    });
    newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
    });

    setSocket(newSocket);

    return () => {
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