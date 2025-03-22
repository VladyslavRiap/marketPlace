import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";

interface User {
  id: number;
  email: string;
  role: string;
  name?: string;
  mobnumber?: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: { email: string; password: string; role?: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/register", userData);
      const userResponse = await dispatch(fetchUser()).unwrap();
      return userResponse;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Ошибка регистрации"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    userData: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/login", userData);

      await dispatch(fetchUser());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Ошибка входа");
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/me");
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return rejectWithValue("Пользователь не найден, но не разлогиниваем!");
      }
      return rejectWithValue(
        error.response?.data?.error || "Ошибка загрузки профиля"
      );
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await api.post("/auth/logout");
});

export const updateName = createAsyncThunk(
  "auth/updateName",
  async (name: string, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/users/me", { name });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Ошибка при обновлении имени");
    }
  }
);

export const updatePhone = createAsyncThunk(
  "auth/updatePhone",
  async (mobnumber: string, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/users/me/update-mobnumber", {
        mobnumber,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Ошибка при обновлении телефона");
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.put("/users/me/password", {
        oldPassword,
        newPassword,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Ошибка при обновлении пароля");
    }
  }
);

export const updateAvatar = createAsyncThunk(
  "auth/updateAvatar",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.put("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Ошибка при загрузке аватара");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })

      .addCase(updateName.fulfilled, (state, action) => {
        if (state.user) {
          state.user.name = action.payload.name;
        }
      })

      .addCase(updatePhone.fulfilled, (state, action) => {
        if (state.user) {
          state.user.mobnumber = action.payload.mobnumber;
        }
      })

      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateAvatar.fulfilled, (state, action) => {
        if (state.user) {
          state.user.avatar_url = action.payload.avatarUrl;
        }
      });
  },
});

export default authSlice.reducer;
