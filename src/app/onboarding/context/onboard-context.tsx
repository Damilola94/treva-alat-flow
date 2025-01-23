'use client';

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode
} from 'react'

interface FormData {
  email: string
  fullName: string
  password: string
  accountType: string
  professions: string[]
}

interface FormContextProps {
  formData: FormData
  setFormData: (data: Partial<FormData>) => void
}

const FormContext = createContext<FormContextProps | null>(null);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormDataState] = useState<FormData>({
    email: '',
    fullName: '',
    password: '',
    accountType: '',
    professions: []
  });

  const setFormData = (data: Partial<FormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }))
  };

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider')
  }
  return context;
};
