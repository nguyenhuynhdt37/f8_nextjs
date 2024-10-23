"use client";
import { createContext, useState, ReactNode, FC } from "react";

interface MyContextProps {
  state: number;
  setState: (value: number) => void;
}

const MyContext = createContext<MyContextProps | undefined>(undefined);

export const MyProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<number>(1);

  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContext;
