import React, { createContext, useContext, useState } from 'react';

interface Lottery {
  _id: string;
  buyTicketTime: number;
  startTime: number;
  endTime: number;
  buyersLength: number;
  currencyType: string;
  totalValue: number;
  price: number;
}

interface LotteryContextType {
  lotteries: Lottery[];
  setLotteries: React.Dispatch<React.SetStateAction<Lottery[]>>;
  addLottery: (lottery: Lottery) => void;
  updateLottery: (id: string, updatedData: Partial<Lottery>) => void;
  getLotteryById: (id: string) => Lottery | undefined;
}

const LotteryContext = createContext<LotteryContextType>({
  lotteries: [],
  setLotteries: () => {},
  addLottery: () => {},
  updateLottery: () => {},
  getLotteryById: () => undefined,
});

export const LotteryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);

  const addLottery = (lottery: Lottery) => {
    setLotteries(prev => [...prev, lottery]);
  };

  const updateLottery = (id: string, updatedData: Partial<Lottery>) => {
    setLotteries(prev =>
      prev.map(lottery =>
        lottery._id === id ? { ...lottery, ...updatedData } : lottery
      )
    );
  };

  const getLotteryById = (id: string) => {
    return lotteries.find(lottery => lottery._id === id);
  };

  return (
    <LotteryContext.Provider value={{
      lotteries,
      setLotteries,
      addLottery,
      updateLottery,
      getLotteryById,
    }}>
      {children}
    </LotteryContext.Provider>
  );
};

export const useLottery = () => useContext(LotteryContext);