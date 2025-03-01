import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";

interface User {
  id: number;
  email: string;
  role: string;
  name?: string;
  mobnumber?: string;
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
      await api.post("/auth/register", userData);
      await dispatch(fetchUser());
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Ошибка регистрации"
      );
    }
  }
);
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/me");
      console.log(response.data);
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

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    userData: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await api.post("/auth/login", userData);
      await dispatch(fetchUser());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Ошибка входа");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await api.post("/auth/logout");
});

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
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
