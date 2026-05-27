'use client';

import React, { createContext, useContext, ReactNode, useEffect } from 'react';

export interface BrandingConfig {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoText?: string;
  tagline?: string;
}

interface BrandingContextType {
  branding: BrandingConfig;
  setBranding: (config: BrandingConfig) => void;
}

const defaultBranding: BrandingConfig = {
  primaryColor: '#3b82f6',
  secondaryColor: '#f97316',
  logoText: 'MAULA SCHOOL',
};

const BrandingContext = createContext<BrandingContextType>({
  branding: defaultBranding,
  setBranding: () => {},
});

function applyBrandingStyles(branding: BrandingConfig) {
  const root = document.documentElement;
  
  if (branding.primaryColor) {
    root.style.setProperty('--branding-primary', branding.primaryColor);
  }
  
  if (branding.secondaryColor) {
    root.style.setProperty('--branding-secondary', branding.secondaryColor);
  }
}

export function BrandingProvider({
  children,
  initialBranding = defaultBranding,
}: {
  children: ReactNode;
  initialBranding?: BrandingConfig;
}) {
  const [branding, setBranding] = React.useState<BrandingConfig>(initialBranding);

  useEffect(() => {
    applyBrandingStyles(branding);
  }, [branding]);

  return (
    <BrandingContext.Provider value={{ branding, setBranding }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  return useContext(BrandingContext);
}
