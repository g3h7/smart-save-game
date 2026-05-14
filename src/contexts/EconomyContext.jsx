import React, { createContext, useState, useEffect, useContext } from 'react';
import { EventBus } from '../game/EventBus';

const EconomyContext = createContext();

export const useEconomy = () => useContext(EconomyContext);

export const EconomyProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    saldo: 0,
    investimentoCDI: 0,
    cotasFII: 0
  });

  const carregarDados = () => {
    try {
      const data = localStorage.getItem('educash_economy');
      if (data) {
        setGlobalState(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load economy data', e);
    }
  };

  const salvarDados = (newState) => {
    try {
      localStorage.setItem('educash_economy', JSON.stringify(newState));
    } catch (e) {
      console.error('Failed to save economy data', e);
    }
  };

  const updateEconomyState = (updates) => {
    setGlobalState(prev => {
      const newState = { ...prev, ...updates };
      salvarDados(newState);
      return newState;
    });
  };

  useEffect(() => {
    carregarDados();

    const handleFarm = (amount) => {
      setGlobalState(prev => {
        const newState = { ...prev, saldo: prev.saldo + amount };
        salvarDados(newState);
        return newState;
      });
    };

    EventBus.on('farm-money', handleFarm);

    return () => {
      EventBus.off('farm-money', handleFarm);
    };
  }, []);

  return (
    <EconomyContext.Provider value={{ globalState, updateEconomyState, carregarDados, salvarDados }}>
      {children}
    </EconomyContext.Provider>
  );
};
