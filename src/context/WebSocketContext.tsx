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

    // Set up socket connection  
    const socketUrl = 'https://crypto-bet-backend-fawn.vercel.app';  

    const newSocket = io(socketUrl, {  
      autoConnect: true,  
      transports: ['websocket'], // use WebSocket only for reliability  
      reconnection: true,  
      reconnectionAttempts: Infinity,  
      reconnectionDelay: 1000,  
      reconnectionDelayMax: 5000,  
      // specify path if backend uses a custom socket endpoint, e.g. '/socket.io'  
      // path: '/socket.io', // Uncomment if needed  
      auth: {  
        token: authToken,  
      },  
    });  

    // Connection handlers  
    const handleConnect = () => {  
      console.log('Socket connected');  
      setIsConnected(true);  
      setConnectionError(null);  
    };  

    const handleDisconnect = (reason: string) => {  
      console.log('Socket disconnected:', reason);  
      setIsConnected(false);  
      if (reason === 'io server disconnect') {  
        setConnectionError('Disconnected by server. Please refresh.');  
      }  
    };  

    const handleError = (error: Error) => {  
      console.error('Socket error:', error);  
      setIsConnected(false);  
      if (error.message.includes('Unauthorized') || error.message.includes('failed authentication')) {  
        setConnectionError('Authentication failed. Please log in again.');  
      } else {  
        setConnectionError('Connection error. Reconnecting...');  
      }  
    };  

    const handleReconnectAttempt = (attempt: number) => {  
      console.log(`Reconnect attempt: ${attempt}`);  
      setConnectionError(`Reconnection attempt ${attempt}...`);  
    };  

    const handleReconnectFailed = () => {  
      console.log('Reconnect failed');  
      setConnectionError('Failed to reconnect. Please refresh.');  
    };  

    // Register event handlers  
    newSocket.on('connect', handleConnect);  
    newSocket.on('disconnect', handleDisconnect);  
    newSocket.on('connect_error', handleError);  
    newSocket.on('reconnect_attempt', handleReconnectAttempt);  
    newSocket.on('reconnect_failed', handleReconnectFailed);  

    // Listen for your custom event  
    newSocket.on('buy_lottery', (data: LotteryUpdate) => {  
      addLotteryUpdate(data);  
    });  

    setSocket(newSocket);  

    // Cleanup on unmount  
    return () => {  
      if (newSocket) {  
        newSocket.off('connect', handleConnect);  
        newSocket.off('disconnect', handleDisconnect);  
        newSocket.off('connect_error', handleError);  
        newSocket.off('reconnect_attempt', handleReconnectAttempt);  
        newSocket.off('reconnect_failed', handleReconnectFailed);  
        newSocket.off('buy_lottery');  
        newSocket.disconnect();  
      }  
    };  
  }, [authToken]);  

  return (  
    <WebSocketContext.Provider  
      value={{  
        socket,  
        lotteryUpdates,  
        addLotteryUpdate,  
        isConnected,  
        connectionError,  
      }}  
    >  
      {children}  
    </WebSocketContext.Provider>  
  );  
};  

export const useWebSocket = () => useContext(WebSocketContext);  