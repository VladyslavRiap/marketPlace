import Button from "@/components/Button";
import {
  User,
  Mail,
  Phone,
  Edit,
  Check,
  X,
  Camera,
  Key,
  LogOut,
  ShoppingCart,
} from "lucide-react";

interface ProfileInfoSectionProps {
  user: any;
  newName: string;
  setNewName: (value: string) => void;
  newPhone: string;
  setNewPhone: (value: string) => void;
  editName: boolean;
  setEditName: (value: boolean) => void;
  editPhone: boolean;
  setEditPhone: (value: boolean) => void;
  handleUpdateName: () => void;
  handleUpdatePhone: () => void;
  handleUploadAvatar: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  editPassword: boolean;
  setEditPassword: (value: boolean) => void;
  oldPassword: string;
  setOldPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  handleUpdatePassword: () => void;
  onLogoutClick: () => void;
}

export const ProfileInfoSection = ({
  user,
  newName,
  setNewName,
  newPhone,
  setNewPhone,
  editName,
  setEditName,
  editPhone,
  setEditPhone,
  handleUpdateName,
  handleUpdatePhone,
  handleUploadAvatar,
  loading,
  editPassword,
  setEditPassword,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  handleUpdatePassword,
  onLogoutClick,
}: ProfileInfoSectionProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full lg:w-1/2">
      <div className="bg-gradient-to-r from-gray-600 to-slate-600 p-6 text-white">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-blue-100">Manage your account</p>
      </div>

      <div className="p-6">
        <div className="flex flex-col items-center mb-6 relative">
          <div className="relative">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white bg-blue-100 shadow-lg flex items-center justify-center">
                <User className="w-16 h-16 text-blue-600" />
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-50 transition"
            >
              <Camera className="w-5 h-5 text-blue-600" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleUploadAvatar}
                className="hidden"
              />
            </label>
          </div>
          {loading && (
            <p className="mt-2 text-sm text-gray-500">Uploading...</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          {!editName ? (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <p className="text-lg lg:w-full w-3/4">
                {user.name || "Not provided"}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditName(true)}
                className="p-1"
              >
                <Edit />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 p-3 lg:w-full w-3/4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                icon={Check}
                onClick={handleUpdateName}
                className="text-green-600 hover:text-green-800 p-2"
              >
                <Check />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={X}
                onClick={() => setEditName(false)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <X />
              </Button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-500 mr-2" />
              <p className="text-lg">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          {!editPhone ? (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-500 mr-2" />
                <p className="text-lg">{user.mobnumber || "Not provided"}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={Edit}
                onClick={() => setEditPhone(true)}
                className="p-1"
              >
                <Edit />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center">
                <Phone className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="flex-1 lg:w-full w-3/4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={Check}
                onClick={handleUpdatePhone}
                className="text-green-600 hover:text-green-800 p-2"
              >
                <Check />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={X}
                onClick={() => setEditPhone(false)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <X />
              </Button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <ShoppingCart className="w-5 h-5 text-gray-500 mr-2" />
              <p className="text-lg capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Button
            variant="primary"
            size="lg"
            icon={Key}
            fullWidth
            onClick={() => setEditPassword(!editPassword)}
          >
            {editPassword ? "Cancel password change" : "Change password"}
          </Button>

          {editPassword && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={handleUpdatePassword}
              >
                Save new password
              </Button>
            </div>
          )}
        </div>

        <Button
          variant="secondary"
          size="lg"
          icon={LogOut}
          fullWidth
          onClick={onLogoutClick}
        >
          Log out
        </Button>
      </div>
    </div>
  );
};
