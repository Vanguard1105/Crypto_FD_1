import React, { createContext, useContext, useState } from 'react';

interface UserData {
  username: string | undefined;
  user_id: string | undefined;
  email: string | undefined;
  nickname: string | undefined;
  publicKey: string | undefined;
  has_password: boolean | undefined;
  diamond_count: number | undefined;
  solBalance: number | undefined; 
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};