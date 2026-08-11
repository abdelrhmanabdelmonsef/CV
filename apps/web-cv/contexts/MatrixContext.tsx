'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type MatrixContextValue = {
  matrixActive: boolean;
  toggleMatrix: () => void;
};

const MatrixContext = createContext<MatrixContextValue | null>(null);

export function MatrixProvider({ children }: { children: ReactNode }) {
  const [matrixActive, setMatrixActive] = useState(false);

  const toggleMatrix = useCallback(() => {
    setMatrixActive((prev) => !prev);
  }, []);

  return (
    <MatrixContext.Provider value={{ matrixActive, toggleMatrix }}>
      {children}
    </MatrixContext.Provider>
  );
}

export function useMatrix() {
  const ctx = useContext(MatrixContext);
  if (!ctx) throw new Error('useMatrix must be used within MatrixProvider');
  return ctx;
}
