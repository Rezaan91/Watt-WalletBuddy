import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserData {
  name: string;
  email: string;
  phone: string;
  idNumber: string;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData | null>(() => {
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : null;
  });

  const setUser = (userData: UserData) => {
    setUserState(userData);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const clearUser = () => {
    setUserState(null);
    localStorage.removeItem("userData");
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
