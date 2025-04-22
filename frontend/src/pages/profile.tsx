import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import api from "@/utils/api";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/redux/hooks";
import {
  logoutUser,
  updateAvatar,
  updateName,
  updatePassword,
  updatePhone,
} from "@/redux/slices/authSlice";
import { useRouter } from "next/router";
import { useSnackbarContext } from "@/redux/context/SnackBarContext";
import { clearCartRedux, fetchCart } from "@/redux/slices/cartSlice";
import { clearFavorites, fetchFavorites } from "@/redux/slices/favoriteSlice";
import { ProfileInfoSection } from "@/components/ui/profile/ProfileInfoSection";
import { RolePanelSection } from "@/components/ui/profile/RolePanelSection";

import { LOGOUT_MODAL_ID, useModal } from "@/redux/context/ModalContext";

const ProfilePage = ({ user: initialUser }: { user: any }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showMessage } = useSnackbarContext();
  const { openModal, closeModal } = useModal();
  const [editName, setEditName] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [newName, setNewName] = useState(initialUser.name || "");
  const [newPhone, setNewPhone] = useState(initialUser.mobnumber || "");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    dispatch(fetchFavorites());
    dispatch(fetchCart());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearCartRedux());
    dispatch(clearFavorites());
    router.push("/login");
    closeModal(LOGOUT_MODAL_ID);
  };
  const handleLogoutClick = () => {
    openModal(LOGOUT_MODAL_ID, {
      onLogout: () => {
        handleLogout();
        closeModal(LOGOUT_MODAL_ID);
      },
      onClose: () => closeModal(LOGOUT_MODAL_ID),
    });
  };
  const handleUpdateName = async () => {
    if (!newName) {
      showMessage("Name cannot be empty", "error");
      return;
    }
    try {
      await dispatch(updateName(newName)).unwrap();
      setEditName(false);
      setUser((prevUser: any) => ({ ...prevUser, name: newName }));
      showMessage("Name updated successfully!", "success");
    } catch (error: any) {
      showMessage("Error updating name: " + error.message, "error");
    }
  };

  const handleUpdatePhone = async () => {
    if (!newPhone.match(/^\+?\d{10,15}$/)) {
      showMessage(
        "Phone number must contain between 10 to 15 digits, including country code",
        "error"
      );
      return;
    }

    try {
      await dispatch(updatePhone(newPhone)).unwrap();
      setEditPhone(false);
      setUser((prevUser: any) => ({ ...prevUser, mobnumber: newPhone }));
      showMessage("Phone number updated successfully!", "success");
    } catch (error: any) {
      showMessage("Error updating phone number: " + error.message, "error");
    }
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) {
      showMessage("All fields must be filled", "error");
      return;
    }
    try {
      await dispatch(updatePassword({ oldPassword, newPassword })).unwrap();
      setEditPassword(false);
      showMessage("Password updated successfully!", "success");
      router.replace(router.asPath);
    } catch (error: any) {
      showMessage("Error updating password: " + error.message, "error");
    }
  };

  const handleUploadAvatar = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files?.length) return;

    const formData = new FormData();
    formData.append("avatar", event.target.files[0]);

    setLoading(true);

    try {
      const data = await dispatch(updateAvatar(formData)).unwrap();
      setLoading(false);
      setUser({ ...user, avatar_url: data.avatarUrl });
      showMessage("Avatar updated successfully!", "success");
    } catch (error: any) {
      setLoading(false);
      showMessage("Error uploading avatar. Please try again.", "error");
    }
  };

  const handleGoToSeller = () => {
    if (user.role === "seller") {
      router.push("/seller");
    }
  };

  const handleGoToAdmin = () => {
    if (user.role === "admin") {
      router.push("/admin");
    }
  };

  return (
    <div className="py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          <ProfileInfoSection
            user={user}
            newName={newName}
            setNewName={setNewName}
            newPhone={newPhone}
            setNewPhone={setNewPhone}
            editName={editName}
            setEditName={setEditName}
            editPhone={editPhone}
            setEditPhone={setEditPhone}
            handleUpdateName={handleUpdateName}
            handleUpdatePhone={handleUpdatePhone}
            handleUploadAvatar={handleUploadAvatar}
            loading={loading}
            editPassword={editPassword}
            setEditPassword={setEditPassword}
            oldPassword={oldPassword}
            setOldPassword={setOldPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            handleUpdatePassword={handleUpdatePassword}
            onLogoutClick={handleLogoutClick}
          />

          <RolePanelSection
            user={user}
            handleGoToSeller={handleGoToSeller}
            handleGoToAdmin={handleGoToAdmin}
          />
        </div>
      </motion.div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    console.log(req.headers);
    const { data } = await api.get("/users/me", {
      headers: { cookie: req.headers.cookie || "" },
    });

    return { props: { user: data } };
  } catch (error: any) {
    if (error.response?.status === 401) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return {
      props: {
        user: null,
        error: "Failed to load user data",
      },
    };
  }
};

export default ProfilePage;
