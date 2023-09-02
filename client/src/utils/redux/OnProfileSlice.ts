import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface InitialStateProsp {
  articles: number;
  followings: number;
  followers: number;
}

const initialState = {
  articles: 0,
  followings: 0,
  followers: 0,
} as InitialStateProsp;

const ProfileSlice = createSlice({
  name: 'profileSlice',
  initialState,
  reducers: {
    setArticleCount(state, { payload }: PayloadAction<number>) {
      state.articles = payload;
    },
    setFollowingCount(state, { payload }: PayloadAction<number>) {
      state.followings = payload;
    },
    setFollowerCount(state, { payload }: PayloadAction<number>) {
      state.followers = payload;
    },
  },
});

export const { setArticleCount, setFollowingCount, setFollowerCount } =
  ProfileSlice.actions;
export default ProfileSlice.reducer;
