export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobnumber?: string;
  role: "user" | "seller" | "admin";
  avatar_url?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
}

export interface ProfilePageProps {
  user: UserProfile;
}

export interface ProfileSectionProps {
  user: UserProfile;
  onUpdate: (updatedData: Partial<UserProfile>) => Promise<void>;
}

export interface PasswordChangeProps {
  onChangePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}
