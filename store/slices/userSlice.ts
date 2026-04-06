import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  profileImage: string | null;
}

const initialState: UserState = {
  profileImage: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfileImage(state, action: PayloadAction<string | null>) {
      state.profileImage = action.payload;
    },
    clearProfileImage(state) {
      state.profileImage = null;
    },
  },
});

export const { setProfileImage, clearProfileImage } = userSlice.actions;
export default userSlice.reducer;
