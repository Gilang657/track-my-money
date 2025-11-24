import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { financeService } from '../services/financeService';

interface UserContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (newProfile: UserProfile) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const data = await financeService.getUserSettings();
      setProfile(data);
    } catch (error) {
      console.error("Failed to load user profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const updateProfile = async (newProfile: UserProfile) => {
    if (!profile) return;

    try {
      // Handle Currency Conversion Logic Centrally
      if (profile.currency !== newProfile.currency) {
        await financeService.convertDataCurrency(profile.currency, newProfile.currency);
      }

      // Save to Backend/Storage
      const updated = await financeService.updateUserSettings(newProfile);
      
      // Update State
      setProfile(updated);
    } catch (error) {
      console.error("Failed to update profile", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ profile, loading, updateProfile, refreshProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
