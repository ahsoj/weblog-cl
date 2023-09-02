import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import slugify from 'react-slugify';

interface INewArticle {
  title: string;
  slug: string;
  content: Object;
}

const initialState = {
  title: '',
  slug: '',
  content: {},
} as unknown as INewArticle;

const Slicekit = createSlice({
  name: 'slice',
  initialState,
  reducers: {
    setNewTitle(state, { payload }: PayloadAction<string>) {
      state.title = payload;
      state.slug = slugify(payload);
    },
    setArticleContent(state, { payload }: PayloadAction<object>) {
      state.content = payload as unknown as object;
    },
  },
});

export const { setNewTitle, setArticleContent } = Slicekit.actions;
export default Slicekit.reducer;
