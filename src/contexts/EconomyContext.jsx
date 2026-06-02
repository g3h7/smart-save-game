import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { EventBus } from '../game/EventBus';

const EconomyContext = createContext();

export const useEconomy = () => useContext(EconomyContext);

export const EconomyProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    saldo: 0,
    cdi: 0,
    cofre: 0,
    fii: 0,
    lucro: 0,
    xp: 0,
    level: 1,
    // Capital original aplicado (sem rendimentos) para cálculo de lucro por ativo
    cdiPrincipal: 0,
    cofrePrincipal: 0
  });

  const stateRef = useRef(globalState);

  // Mantém a ref sincronizada com o state para o setInterval
  useEffect(() => {
    stateRef.current = globalState;
  }, [globalState]);

  const carregarDados = () => {
    try {
      const saldo = parseFloat(localStorage.getItem('eduCash_saldo')) || 0;
      const cdi = parseFloat(localStorage.getItem('eduCash_cdi')) || 0;
      const cofre = parseFloat(localStorage.getItem('eduCash_cofre')) || 0;
      const fii = parseInt(localStorage.getItem('eduCash_fii'), 10) || 0;
      const lucro = parseFloat(localStorage.getItem('eduCash_lucro')) || 0;
      const xp = parseInt(localStorage.getItem('eduCash_xp'), 10) || 0;
      const level = parseInt(localStorage.getItem('eduCash_level'), 10) || 1;
      const cdiPrincipal = parseFloat(localStorage.getItem('eduCash_cdiPrincipal')) || 0;
      const cofrePrincipal = parseFloat(localStorage.getItem('eduCash_cofrePrincipal')) || 0;

      setGlobalState({ saldo, cdi, cofre, fii, lucro, xp, level, cdiPrincipal, cofrePrincipal });
    } catch (e) {
      console.error('Failed to load economy data', e);
    }
  };

  const salvarDados = (newState) => {
    try {
      localStorage.setItem('eduCash_saldo', newState.saldo.toString());
      localStorage.setItem('eduCash_cdi', newState.cdi.toString());
      localStorage.setItem('eduCash_cofre', newState.cofre.toString());
      localStorage.setItem('eduCash_fii', newState.fii.toString());
      localStorage.setItem('eduCash_lucro', newState.lucro.toString());
      localStorage.setItem('eduCash_xp', (newState.xp ?? 0).toString());
      localStorage.setItem('eduCash_level', (newState.level ?? 1).toString());
      localStorage.setItem('eduCash_cdiPrincipal', (newState.cdiPrincipal ?? 0).toString());
      localStorage.setItem('eduCash_cofrePrincipal', (newState.cofrePrincipal ?? 0).toString());
    } catch (e) {
      console.error('Failed to save economy data', e);
    }
  };

  // XP necessário para o próximo nível: 100 * nível atual
  const xpParaProximoNivel = (level) => level * 100;

  // Concede XP ao jogador, promovendo ao próximo nível se necessário
  const gainXp = (amount) => {
    setGlobalState(prev => {
      let newXp = (prev.xp ?? 0) + amount;
      let newLevel = prev.level ?? 1;
      const xpNecessario = xpParaProximoNivel(newLevel);

      if (newXp >= xpNecessario) {
        newXp = newXp - xpNecessario;
        newLevel = newLevel + 1;
        EventBus.emit('level-up', newLevel);
      }

      const newState = { ...prev, xp: newXp, level: newLevel };
      salvarDados(newState);
      return newState;
    });
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

    // --- Motor de Rendimento Temporal ---
    // 300000 ms = 5 minutos
    const yieldTimer = setInterval(() => {
      const current = stateRef.current;
      
      // Apenas processa se houver valor investido para poupar recálculos vazios
      if (current.cdi > 0 || current.cofre > 0) {
        // Taxas estipuladas:
        // CDI (Tesouro Selic no mockup) = 1.1%  (Wait, user said: "0.85% para o Cofrinho/CDB e 1.1% para o CDI")
        const taxaCDI = 0.011; // 1.1%
        const taxaCofre = 0.0085; // 0.85%

        const rendimentoCDI = current.cdi * taxaCDI;
        const rendimentoCofre = current.cofre * taxaCofre;
        const totalRendimento = rendimentoCDI + rendimentoCofre;

        if (totalRendimento > 0) {
          const newState = {
            ...current,
            cdi: current.cdi + rendimentoCDI,
            cofre: current.cofre + rendimentoCofre,
            lucro: current.lucro + totalRendimento
          };
          
          setGlobalState(newState);
          salvarDados(newState);
          
          // Dispara evento para a UI
          EventBus.emit('yield-applied', totalRendimento);
        }
      }
    }, 300000); // 5 minutos

    return () => {
      EventBus.off('farm-money', handleFarm);
      clearInterval(yieldTimer);
    };
  }, []);

  return (
    <EconomyContext.Provider value={{ globalState, updateEconomyState, carregarDados, salvarDados, gainXp, xpParaProximoNivel }}>
      {children}
    </EconomyContext.Provider>
  );
};

