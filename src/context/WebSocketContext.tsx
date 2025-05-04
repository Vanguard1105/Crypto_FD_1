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
  connectionError: string | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  lotteryUpdates: [],
  addLotteryUpdate: () => {},
  isConnected: false,
  connectionError: null,
});

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const authToken = localStorage.getItem('authToken');

  const [socket, setSocket] = useState<Socket | null>(null);
  const [lotteryUpdates, setLotteryUpdates] = useState<LotteryUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const addLotteryUpdate = (update: LotteryUpdate) => {
    setLotteryUpdates(prev => [...prev, update]);
  };

  useEffect(() => {
    if (!authToken) {
      setConnectionError('Authentication required');
      return;
    }

    const newSocket = io('https://crypto-bet-backend-fawn.vercel.app', {
      withCredentials: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      autoConnect: true,
      auth: {
        token: authToken,
      },
    });

    const onConnect = () => {
      setIsConnected(true);
      setConnectionError(null);
    };

    const onDisconnect = (reason: string) => {
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        setConnectionError('Disconnected by server. Please refresh the page.');
      }
    };

    const onConnectError = (error: Error) => {
      setIsConnected(false);
      if (error.message.includes('Session ID unknown')) {
        setConnectionError('Authentication failed. Please log in again.');
      } else {
        setConnectionError('Connection error. Attempting to reconnect...');
      }
    };

    const onReconnectAttempt = (attempt: number) => {
      setConnectionError(`Reconnection attempt ${attempt}...`);
    };

    const onReconnectFailed = () => {
      setConnectionError('Failed to reconnect. Please refresh the page.');
    };

    newSocket.on('connect', onConnect);
    newSocket.on('disconnect', onDisconnect);
    newSocket.on('connect_error', onConnectError);
    newSocket.on('reconnect_attempt', onReconnectAttempt);
    newSocket.on('reconnect_failed', onReconnectFailed);
    newSocket.on('buy_lottery', (data: LotteryUpdate) => {
      addLotteryUpdate(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.off('connect', onConnect);
      newSocket.off('disconnect', onDisconnect);
      newSocket.off('connect_error', onConnectError);
      newSocket.off('reconnect_attempt', onReconnectAttempt);
      newSocket.off('reconnect_failed', onReconnectFailed);
      newSocket.disconnect();
    };
  }, [authToken]);

  return (
    <WebSocketContext.Provider value={{ 
      socket, 
      lotteryUpdates, 
      addLotteryUpdate, 
      isConnected,
      connectionError
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);