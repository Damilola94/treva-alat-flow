'use client';

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

interface FormData {
  onboardingType: string
  email: string
  fullName: string
  password: string
  phoneNumber: string
}

interface ClientOnboardingContextProps {
  formData: FormData
  setFormData: (data: Partial<FormData>) => void
}

const ClientOnboardingContext =
  createContext<ClientOnboardingContextProps | null>(null);

export const ClientOnboardingProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [formData, setFormDataState] = useState<FormData>({
    onboardingType: '',
    email: '',
    fullName: '',
    password: '',
    phoneNumber: '',
  });

  const setFormData = (data: Partial<FormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  };

  return (
    <ClientOnboardingContext.Provider value={{ formData, setFormData }}>
      {children}
    </ClientOnboardingContext.Provider>
  );
};

export const useClientOnboardingForm = () => {
  const context = useContext(ClientOnboardingContext);
  if (!context) {
    throw new Error('useForm must be used within a ClientOnboardingProvider');
  }
  return context;
};
