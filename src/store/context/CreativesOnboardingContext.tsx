'use client';

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

interface FormData {
  email: string
  fullName: string
  password: string
  accountType: string
  professions: string[]
}

interface CreativesOnboardingContextProps {
  formData: FormData
  setFormData: (data: Partial<FormData>) => void
}

const CreativesOnboardingContext =
  createContext<CreativesOnboardingContextProps | null>(null);

export const CreativesOnboardingProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [formData, setFormDataState] = useState<FormData>({
    email: '',
    fullName: '',
    password: '',
    accountType: '',
    professions: [],
  });

  const setFormData = (data: Partial<FormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  };

  return (
    <CreativesOnboardingContext.Provider value={{ formData, setFormData }}>
      {children}
    </CreativesOnboardingContext.Provider>
  );
};

export const useCreativeOnboardingForm = () => {
  const context = useContext(CreativesOnboardingContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};
