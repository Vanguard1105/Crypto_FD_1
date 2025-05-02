import React, { createContext, useContext, useEffect, useState } from 'react';

interface LotteryUpdate {
  ticketId: string;
  buyerId: string;
  buyerName: string;
  buyersCount: number;
}

interface WebSocketContextType {
  socket: WebSocket | null;
  lotteryUpdates: LotteryUpdate[];
  addLotteryUpdate: (update: LotteryUpdate) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  lotteryUpdates: [],
  addLotteryUpdate: () => {},
});

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lotteryUpdates, setLotteryUpdates] = useState<LotteryUpdate[]>([]);

  const addLotteryUpdate = (update: LotteryUpdate) => {
    setLotteryUpdates(prev => [...prev, update]);
  };

  useEffect(() => {
    const ws = new WebSocket('wss://crypto-bet-backend-fawn.vercel.app');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'lottery:update') {
        addLotteryUpdate(message.data);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Implement reconnection logic if needed
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, lotteryUpdates, addLotteryUpdate }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);