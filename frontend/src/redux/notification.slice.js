import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unReadCount: 0,
  },
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload;
      state.unReadCount = action.payload.filter(
        (notification) => !notification.isRead
      ).length;
    },

    addNotification(state, action) {
      state.notifications = [action.payload, ...state.notifications];
      state.unReadCount += 1; // Increment unread count
    },
    markAsRead(state, action) {
      const notificationId = action.payload;
      const notificationIndex = state.notifications.findIndex(
        (notification) => notification._id === notificationId
      );

      if (
        notificationIndex !== -1 &&
        state.notifications[notificationIndex].isRead === false
      ) {
        state.notifications[notificationIndex].isRead = true;
        state.unReadCount -= 1;
      }
    },
  },
});

export const { addNotification, markAsRead, setNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
