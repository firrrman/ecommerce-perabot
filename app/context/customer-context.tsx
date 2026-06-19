"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentCustomer, customerLogoutAction } from "../actions/customer";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
};

type CustomerContextType = {
  customer: Customer | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
};

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomer = async () => {
    try {
      const data = await getCurrentCustomer();
      setCustomer(data);
    } catch (error) {
      console.error("Failed to load customer profile:", error);
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const logout = async () => {
    setIsLoading(true);
    try {
      await customerLogoutAction();
      setCustomer(null);
    } catch (error) {
      console.error("Failed to logout customer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCustomer = async () => {
    setIsLoading(true);
    await fetchCustomer();
  };

  return (
    <CustomerContext.Provider
      value={{ customer, isLoading, logout, refreshCustomer }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
}
