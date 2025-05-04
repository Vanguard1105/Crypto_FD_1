// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { io, Socket } from 'socket.io-client';

// interface LotteryUpdate {
//   ticketId: string;
//   buyerId: string;
//   buyerName: string;
//   buyersCount: number;
// }

// interface WebSocketContextType {
//   socket: Socket | null;
//   lotteryUpdates: LotteryUpdate[];
//   addLotteryUpdate: (update: LotteryUpdate) => void;
//   isConnected: boolean;
// }

// const WebSocketContext = createContext<WebSocketContextType>({
//   socket: null,
//   lotteryUpdates: [],
//   addLotteryUpdate: () => {},
//   isConnected: false,
// });

// export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [lotteryUpdates, setLotteryUpdates] = useState<LotteryUpdate[]>([]);
//   const [isConnected, setIsConnected] = useState(false);

//   const addLotteryUpdate = (update: LotteryUpdate) => {
//     setLotteryUpdates(prev => [...prev, update]);
//   };

//   useEffect(() => {
//     const newSocket = io('https://crypto-bet-backend-fawn.vercel.app', {
//       autoConnect: true,
//       reconnection: true,
//       reconnectionAttempts: Infinity,
//       reconnectionDelay: 2000,
//     });

//     newSocket.on('connect', () => {
//         console.log('Connected to socket server:', newSocket.id);
//     });
//     newSocket.on('buy_lottery', (data) => {
//         console.log('Received buy_lottery:', data);
//         addLotteryUpdate(data);
//     });
//     newSocket.on('disconnect', () => {
//         console.log('Disconnected from socket server');
//     });
//     newSocket.on('connect_error', (error) => {
//         console.error('Connection error:', error);
//     });

//     setSocket(newSocket);

//     return () => {
//         newSocket.disconnect();
//     };
//   }, []);

//   return (
//     <WebSocketContext.Provider value={{ socket, lotteryUpdates, addLotteryUpdate, isConnected }}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// };

// export const useWebSocket = () => useContext(WebSocketContext);

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';  
import { io, Socket } from 'socket.io-client';  

// Define the shape of the updates  
interface LotteryUpdate {  
  // Define the properties based on your data structure  
  // Example:  
  id: string;  
  amount: number;  
  // Add other relevant fields here  
  [key: string]: any; // fallback to any if structure varies  
}  

// Define the context state shape  
interface WebSocketContextType {  
  socket: Socket | null;  
  lotteryUpdates: LotteryUpdate[];  
  addLotteryUpdate: (update: LotteryUpdate) => void;  
}  

// Default context value  
const WebSocketContext = createContext<WebSocketContextType>({  
  socket: null,  
  lotteryUpdates: [],  
  addLotteryUpdate: () => {},  
});  

// Define the props for provider component  
interface WebSocketProviderProps {  
  children: ReactNode;  
}  

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {  
  const [socket, setSocket] = useState<Socket | null>(null);  
  const [lotteryUpdates, setLotteryUpdates] = useState<LotteryUpdate[]>([]);  

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

    newSocket.on('buy_lottery', (data: LotteryUpdate) => {  
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

    // Cleanup on unmount  
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