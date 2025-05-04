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
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  lotteryUpdates: [],
  addLotteryUpdate: () => {},
});

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lotteryUpdates, setLotteryUpdates] = useState<LotteryUpdate[]>([]);

  const addLotteryUpdate = (update: LotteryUpdate) => {
    setLotteryUpdates(prev => [...prev, update]);
  };

  useEffect(() => {
    const newSocket = io('https://crypto-bet-backend-fawn.vercel.app', {   
        transports: ['websocket'], // Optional: force websocket transport  
        autoConnect: true  
      });  

    newSocket.on('connect', () => {  
        console.log('Connected to socket server:', newSocket.id);  
    });  

    newSocket.on('buy_lottery', (data: LotteryUpdate) => {
      console.log("Received data: ", data)
      addLotteryUpdate(data);
    });

    newSocket.on('disconnect', () => {
        setTimeout(() => {
            newSocket.connect();
        }, 5000);
    });

    newSocket.on('connect_error', (error) => {
      console.log(error)
      // Handle connection error
      setTimeout(() => {
        newSocket.connect();
      }, 5000);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, lotteryUpdates, addLotteryUpdate }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);