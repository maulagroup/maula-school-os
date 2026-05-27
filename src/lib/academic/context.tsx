'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { AcademicYear } from '@/types/database';

interface AcademicContextType {
  activeAcademicYear: AcademicYear | null;
  setActiveAcademicYear: (year: AcademicYear | null) => void;
}

const AcademicContext = createContext<AcademicContextType>({
  activeAcademicYear: null,
  setActiveAcademicYear: () => {},
});

export function AcademicProvider({
  children,
  initialActiveAcademicYear,
}: {
  children: ReactNode;
  initialActiveAcademicYear: AcademicYear | null;
}) {
  const [activeAcademicYear, setActiveAcademicYear] = React.useState<AcademicYear | null>(initialActiveAcademicYear);

  return (
    <AcademicContext.Provider value={{ activeAcademicYear, setActiveAcademicYear }}>
      {children}
    </AcademicContext.Provider>
  );
}

export function useAcademic() {
  return useContext(AcademicContext);
}
