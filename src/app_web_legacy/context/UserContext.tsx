import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "PRIMARY" | "SECONDARY";
export type UserGender = "female" | "male" | "neutral";

interface UserData {
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  meterNumber?: string;
  address?: string;
  householdId?: string;
  role?: UserRole;
  gender?: UserGender;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData) => void;
  clearUser: () => void;
  isPrimary: () => boolean;
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
    localStorage.removeItem("householdUsers");
  };

  const isPrimary = () => {
    return user?.role === "PRIMARY";
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, isPrimary }}>
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
