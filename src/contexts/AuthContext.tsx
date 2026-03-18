import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

type UserStatus = "pending" | "approved";

interface StoredUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  status: UserStatus;
  intakeCompleted?: boolean;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus;
  isAdmin?: boolean;
  intakeCompleted?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (fullName: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  completeIntake: () => void;
  approvePatient: (email: string) => void;
  rejectPatient: (email: string) => void;
  getAllPatients: () => StoredUser[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be within AuthProvider");
  return ctx;
};

const USERS_KEY = "medaesthetics_users";
const SESSION_KEY = "medaesthetics_session";

function getStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch { return []; }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function seedDemoAccounts() {
  const users = getStoredUsers();
  const demoAccounts: StoredUser[] = [
    { firstName: "Jordan", lastName: "Lee", email: "new@demo.com", password: "demo123", status: "pending" },
    { firstName: "Sarah", lastName: "Johnson", email: "approved@demo.com", password: "demo123", status: "approved" },
  ];
  let changed = false;
  for (const demo of demoAccounts) {
    if (!users.find(u => u.email === demo.email)) {
      users.push(demo);
      changed = true;
    }
  }
  if (changed) saveUsers(users);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    seedDemoAccounts();
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.isAdmin) {
          setUser(parsed);
        } else {
          const users = getStoredUsers();
          const found = users.find(u => u.email === parsed.email);
          if (found) {
            setUser({ firstName: found.firstName, lastName: found.lastName, email: found.email, status: found.status, intakeCompleted: found.intakeCompleted });
          }
        }
      } catch { /* ignore */ }
    }
  }, []);

  const login = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    if (email === "admin@medaesthetics.com" && password === "Admin123") {
      const adminUser: User = { firstName: "Admin", lastName: "", email, status: "approved", isAdmin: true };
      setUser(adminUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(adminUser));
      return { success: true };
    }
    const users = getStoredUsers();
    const found = users.find(u => u.email === email);
    if (!found || found.password !== password) {
      return { success: false, error: "Incorrect email or password. Please try again." };
    }
    const u: User = { firstName: found.firstName, lastName: found.lastName, email: found.email, status: found.status, intakeCompleted: found.intakeCompleted };
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    return { success: true };
  }, []);

  const register = useCallback((fullName: string, email: string, password: string): { success: boolean; error?: string } => {
    const users = getStoredUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, error: "An account with this email already exists." };
    }
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";
    const newUser: StoredUser = { firstName, lastName, email, password, status: "pending" };
    users.push(newUser);
    saveUsers(users);
    const u: User = { firstName, lastName, email, status: "pending" };
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const completeIntake = useCallback(() => {
    if (!user) return;
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.email === user.email);
    if (idx !== -1) {
      users[idx].intakeCompleted = true;
      saveUsers(users);
    }
    const updated = { ...user, intakeCompleted: true };
    setUser(updated);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  }, [user]);

  const approvePatient = useCallback((email: string) => {
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx !== -1) {
      users[idx].status = "approved";
      saveUsers(users);
    }
    if (user?.email === email) {
      const updated = { ...user, status: "approved" as UserStatus };
      setUser(updated);
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    }
  }, [user]);

  const rejectPatient = useCallback((email: string) => {
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx !== -1) {
      users[idx].status = "pending";
      saveUsers(users);
    }
  }, []);

  const getAllPatients = useCallback((): StoredUser[] => {
    return getStoredUsers();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, completeIntake, approvePatient, rejectPatient, getAllPatients }}>
      {children}
    </AuthContext.Provider>
  );
};
