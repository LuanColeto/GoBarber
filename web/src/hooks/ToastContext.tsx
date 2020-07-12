import React, { createContext, useContext } from 'react'


interface ToastContextData {
  type?: 'success' | 'error' | 'info';
  hasDescription: boolean;
}


const ToastContext = createContext<ToastContextData>({} as ToastContextData);


export const ToastProvider: React.FC = ({children}) => {
  return (
    <ToastContext.Provider  value={{}}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error()
  }
}
