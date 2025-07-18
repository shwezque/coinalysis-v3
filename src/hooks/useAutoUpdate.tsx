import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AutoUpdateContextValue {
  isAutoUpdateEnabled: boolean;
  updateInterval: number; // in seconds
  toggleAutoUpdate: () => void;
  setUpdateInterval: (interval: number) => void;
}

const AutoUpdateContext = createContext<AutoUpdateContextValue | undefined>(undefined);

const DEFAULT_UPDATE_INTERVAL = 30; // 30 seconds

export const AutoUpdateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAutoUpdateEnabled, setIsAutoUpdateEnabled] = useState(() => {
    const saved = localStorage.getItem('autoUpdateEnabled');
    return saved ? JSON.parse(saved) : false;
  });

  const [updateInterval, setUpdateInterval] = useState(() => {
    const saved = localStorage.getItem('updateInterval');
    return saved ? parseInt(saved, 10) : DEFAULT_UPDATE_INTERVAL;
  });

  useEffect(() => {
    localStorage.setItem('autoUpdateEnabled', JSON.stringify(isAutoUpdateEnabled));
  }, [isAutoUpdateEnabled]);

  useEffect(() => {
    localStorage.setItem('updateInterval', updateInterval.toString());
  }, [updateInterval]);

  const toggleAutoUpdate = () => {
    setIsAutoUpdateEnabled((prev: boolean) => !prev);
  };

  const handleSetUpdateInterval = (interval: number) => {
    if (interval >= 10 && interval <= 300) { // Between 10 seconds and 5 minutes
      setUpdateInterval(interval);
    }
  };

  return (
    <AutoUpdateContext.Provider 
      value={{ 
        isAutoUpdateEnabled, 
        updateInterval, 
        toggleAutoUpdate, 
        setUpdateInterval: handleSetUpdateInterval 
      }}
    >
      {children}
    </AutoUpdateContext.Provider>
  );
};

export const useAutoUpdate = () => {
  const context = useContext(AutoUpdateContext);
  if (!context) {
    throw new Error('useAutoUpdate must be used within an AutoUpdateProvider');
  }
  return context;
};