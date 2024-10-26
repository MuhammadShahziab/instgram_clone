import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    // In your authSlice.js
    addFollowing: (state, action) => {
      if (
        state.user &&
        !state.user.followers.find(
          (followedId) => followedId === action.payload
        )
      ) {
        state.user.followers.push(action.payload);
      }
    },
    addRequest: (state, action) => {
      if (state.user) {
        state.userProfile.followRequests = [
          ...state.userProfile.followRequests,
          action.payload,
        ];
      }
    },

    removeFollowing: (state, action) => {
      if (state.user && state.user.following.includes(action.payload)) {
        state.user.following = state.user.following.filter(
          (followedId) => followedId !== action.payload
        );
      }
    },

    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    addFollower: (state, action) => {
      if (state.userProfile) {
        state.userProfile.followers = [
          ...state.userProfile.followers,
          action.payload,
        ];
      }
    },
    removeFollower: (state, action) => {
      if (state.userProfile) {
        state.userProfile.followers = state.userProfile.followers.filter(
          (followerId) => followerId._id !== action.payload
        );
      }
    },
  },
});

export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  addFollower,
  removeFollower,
  addFollowing,
  removeFollowing,
  addRequest,
} = authSlice.actions;
export default authSlice.reducer;
