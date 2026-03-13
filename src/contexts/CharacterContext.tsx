import { createContext, useContext, useState, ReactNode } from "react";

export interface CharacterAppearance {
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  outfit: string;
}

interface CharacterContextType {
  appearance: CharacterAppearance;
  setAppearance: (a: CharacterAppearance) => void;
  updateAppearance: (partial: Partial<CharacterAppearance>) => void;
  ownedOutfits: string[];
  buyOutfit: (id: string, cost: number) => boolean;
  coins: number;
}

const defaultAppearance: CharacterAppearance = {
  skinColor: "medium",
  hairStyle: "short",
  hairColor: "black",
  outfit: "knight",
};

const CharacterContext = createContext<CharacterContextType | null>(null);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearance] = useState<CharacterAppearance>(() => {
    const saved = localStorage.getItem("characterAppearance");
    return saved ? JSON.parse(saved) : defaultAppearance;
  });
  const [ownedOutfits, setOwnedOutfits] = useState<string[]>(() => {
    const saved = localStorage.getItem("ownedOutfits");
    return saved ? JSON.parse(saved) : ["knight", "mage"];
  });
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("characterCoins");
    return saved ? parseInt(saved) : 5000;
  });

  const updateAppearance = (partial: Partial<CharacterAppearance>) => {
    setAppearance((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem("characterAppearance", JSON.stringify(next));
      return next;
    });
  };

  const buyOutfit = (id: string, cost: number): boolean => {
    if (coins < cost || ownedOutfits.includes(id)) return false;
    setCoins((c) => {
      const n = c - cost;
      localStorage.setItem("characterCoins", String(n));
      return n;
    });
    setOwnedOutfits((prev) => {
      const n = [...prev, id];
      localStorage.setItem("ownedOutfits", JSON.stringify(n));
      return n;
    });
    return true;
  };

  return (
    <CharacterContext.Provider value={{ appearance, setAppearance, updateAppearance, ownedOutfits, buyOutfit, coins }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error("useCharacter must be inside CharacterProvider");
  return ctx;
}
