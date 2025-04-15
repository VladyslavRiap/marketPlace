import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { NotificationsState, Notification } from "../../../types/notification";

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<Notification[]>("/notifications");
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<{ count: number }>(
        "/notifications/unread-count"
      );
      console.log(data);
      return data.count;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch unread count"
      );
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.put(`/notifications/${id}/read`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark as read"
      );
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete notification"
      );
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUnreadCount.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(markAsRead.fulfilled, (state, action) => {
        const id = action.payload;
        const notification = state.items.find((n) => n.id === id);
        if (notification) {
          notification.is_read = true;
        }
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })

      .addCase(deleteNotification.fulfilled, (state, action) => {
        const id = action.payload;
        const notification = state.items.find((n) => n.id === id);
        if (notification && !notification.is_read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.items = state.items.filter((n) => n.id !== id);
      });
  },
});

export default notificationsSlice.reducer;
