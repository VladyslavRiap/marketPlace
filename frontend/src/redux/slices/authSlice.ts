import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import axios from "axios";

interface User {
  id: number;
  email: string;
  role: string;
  name?: string;
  mobnumber?: string;
  avatar_url?: string;
}
interface ApiError {
  message: string;
  status?: number;
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
        error.response?.data?.error || "Registration error"
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
      const response = await axios.post("/api/auth/login", userData, {
        withCredentials: true,
      });

      await dispatch(fetchUser());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Login error");
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
      return rejectWithValue({
        message: error.response?.data?.error || "Profile loading error",
        status: error.response?.status,
      } as ApiError);
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
      return rejectWithValue(error.message || "Error updating name");
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
      return rejectWithValue(error.message || "Error updating phone number");
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
      return rejectWithValue(error.message || "Error updating password");
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
      return rejectWithValue(error.message || "Error uploading avatar");
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
        state.error = (action.payload as ApiError).message;
        state.user = null;

        if ((action.payload as ApiError).status === 401) {
          api.defaults.headers.common["Authorization"] = "";
        }
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
