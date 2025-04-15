import React, { createContext, ReactNode, useContext } from "react";
import { useSnackbar, VariantType } from "notistack";

interface SnackbarContextType {
  showMessage: (message: string, variant: VariantType) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

interface SnackbarProviderWithContextProps {
  children: ReactNode;
}

export const SnackbarProviderWithContext: React.FC<
  SnackbarProviderWithContextProps
> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  const showMessage = (message: string, variant: VariantType) => {
    enqueueSnackbar(message, {
      variant,

      autoHideDuration: 2000,

      preventDuplicate: true,
    });
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbarContext = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error(
      "useSnackbarContext must be used within a SnackbarProviderWithContext"
    );
  }
  return context;
};
