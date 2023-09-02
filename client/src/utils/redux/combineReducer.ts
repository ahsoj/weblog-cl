import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './ApiSlice';
import Slicekit from './toolKitSlice';
import FeedbackSlice from './feedbackSlice';
import ProfileSlice from './OnProfileSlice';

export const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  sliceToolkit: Slicekit,
  feedbackSlice: FeedbackSlice,
  onProfileSlice: ProfileSlice,
});
