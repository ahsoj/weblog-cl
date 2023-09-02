import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CommentContent {
  userId: string;
  postId: string;
  content: Object;
}

const FeedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    userId: '',
    postId: '',
    content: {},
  } as CommentContent,
  reducers: {
    addnewComment(state, { payload }: PayloadAction<Partial<CommentContent>>) {
      console.log(payload);
      state.userId = payload?.userId || '';
      state.postId = payload?.postId || '';
      state.content = payload?.content || {};
    },
  },
});

export const { addnewComment } = FeedbackSlice.actions;
export default FeedbackSlice.reducer;
