import ProductModal from "@/components/ui/modals/ProductModal";
import ReviewModal from "@/components/ui/modals/ReviewModal";
import AddsModal from "@/components/ui/modals/AddsModal";
import { createContext, ReactNode, useContext, useState } from "react";
import ConfirmCancelModal from "@/components/ui/modals/ConfirmCancelModal";
import ConfirmStatusModal from "@/components/ui/modals/ConfirmStatusModal";
import ClearCartModal from "@/components/ui/modals/ClearCartModal";
import LogoutModal from "@/components/ui/profile/LogoutModal";

export const PRODUCT_MODAL_ID = "productModal";
export const REVIEW_MODAL_ID = "reviewModal";
export const ADD_AD_MODAL_ID = "addsModal";
export const CLEAR_CART_MODAL = "checkoutModal";
export const CONFIRM_CANCEL_MODAL_ID = "confirmCancelModal";
export const CONFIRM_STATUS_MODAL_ID = "confirmStatusModal";
export const LOGOUT_MODAL_ID = "logoutModal";
export const modalsLookUp: { [key: string]: React.FC<any> } = {
  [PRODUCT_MODAL_ID]: ProductModal,
  [REVIEW_MODAL_ID]: ReviewModal,
  [ADD_AD_MODAL_ID]: AddsModal,
  [CLEAR_CART_MODAL]: ClearCartModal,
  [CONFIRM_CANCEL_MODAL_ID]: ConfirmCancelModal,
  [CONFIRM_STATUS_MODAL_ID]: ConfirmStatusModal,
  [LOGOUT_MODAL_ID]: LogoutModal,
};

interface ModalContextValue {
  modal: { name: string; options: Record<string, any> }[];
  openModal: (name: string, options: Record<string, any>) => void;
  closeModal: (name: string) => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modal, setModal] = useState<ModalContextValue["modal"]>([]);

  const openModal = (name: string, options: Record<string, any>) => {
    setModal((prev) => {
      return prev
        .filter((modal) => modal.name !== name)
        .concat({ name, options });
    });
  };

  const closeModal = (name: string) => {
    setModal((prev) => prev.filter((modal) => modal.name !== name));
  };

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
      {modal.map((modal, index) => {
        const ModalComponent = modalsLookUp[modal.name];
        return (
          <div
            id="overlay"
            key={index}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModal(modal.name);
              }
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10001,
            }}
          >
            <ModalComponent
              onClose={() => closeModal(modal.name)}
              {...modal.options}
            />
          </div>
        );
      })}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
