import { Article, User } from '@/types/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

type Comment = {
  id?: Readonly<string>;
  userId: string;
  postId: string;
  content: object | any;
};

type Like = {
  postId?: string;
  userId?: string;
};

type Saved = {
  postId: string;
  userId: string;
};

type UpdateUserData = {
  userId: string;
  username?: string;
  bio?: string;
  socialLinks?: {
    site_name: string;
    link: string;
  }[];
};

const token = Cookies.get('token');

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: '/ex_api/v1',
    prepareHeaders(headers, api) {
      headers.set('authorization', token ?? '');
      return headers;
    },
  }),
  tagTypes: [
    'User',
    'Article',
    'Search',
    'Comment',
    'Like',
    'Saved',
    'Follower',
    'Following',
  ],
  endpoints: (builder) => {
    return {
      updateUserProfile: builder.mutation<User, UpdateUserData>({
        query: (updatedData) => ({
          url: `/users/profile/${updatedData.userId}/update`,
          method: 'PATCH',
          body: updatedData,
        }),
        invalidatesTags: [{ type: 'User', id: 'LIST' }],
      }),

      getUserProfileById: builder.query<User, string>({
        query: (userId) => `users/me/${userId}`,
        providesTags: [{ type: 'User', id: 'LIST' }],
      }),

      getArticle: builder.query<Article[], void>({
        query: () => `/articles/`,
        providesTags: [{ type: 'Article', id: 'List' }],
      }),
      searchArticles: builder.query<Article[], string>({
        query: (query) => `/articles/search/${query}`,
        providesTags: [{ type: 'Search', id: 'LIST' }],
      }),
      createArticle: builder.mutation<Article, Partial<Article>>({
        query: (data) => ({
          url: '/article/create/',
          method: 'POST',
          body: {
            data,
            tags: [{ name: 'webdev' }, { name: 'code' }, { name: 'news' }],
          },
        }),
        invalidatesTags: [{ type: 'Article', id: 'LIST' }],
      }),
      retrieveArticle: builder.query<Article, string>({
        query: (slug) => `/article/${slug}`,
        providesTags: [{ type: 'Article', id: 'LIST' }],
      }),
      retrieveArticleByAuthor: builder.query<Article[], string>({
        query: (authorId) => `/article/for/${authorId}`,
        providesTags: [{ type: 'Article', id: 'LIST' }],
      }),

      countPostView: builder.mutation<
        any,
        { postId?: string; userId?: string }
      >({
        query: ({ postId, userId }) => ({
          url: `/post_view_count/`,
          method: 'POST',
          body: { postId, userId },
        }),
      }),
      createBookmark: builder.mutation<any, Saved>({
        query: (saved) => ({
          url: `/users/saved`,
          method: 'POST',
          body: { saved },
        }),
        invalidatesTags: [{ type: 'Saved', id: 'LIST' }],
      }),

      getSavedBookmark: builder.query<any, string>({
        query: (userId) => `/users/saved-for/${userId}`,
      }),

      getBookmark: builder.query<string[], string>({
        query: (userId) => `/users/saved/ids/${userId}`,
        providesTags: [{ type: 'Saved', id: 'LIST' }],
      }),
      // feedback configs
      addNewComment: builder.mutation<any, Comment>({
        query: (comment) => ({
          url: `/feedback/comments/`,
          method: 'POST',
          body: { comment },
        }),
        invalidatesTags: [{ type: 'Comment', id: 'LIST' }],
      }),
      likeDislike: builder.mutation<any, Like>({
        query: (like) => ({
          url: `feedback/likes-dislikes/`,
          method: 'POST',
          body: { like },
        }),
        invalidatesTags: [{ type: 'Like', id: 'LIST' }],
      }),
      getLikedArticleByUser: builder.query<string[], string>({
        query: (userId) => `users/liked/for/${userId}`,
        providesTags: [{ type: 'Like', id: 'LIST' }],
      }),

      // follow system
      xFollow: builder.mutation<any, { fedId: string; fingId: string }>({
        query: (xfollow) => ({
          url: `/users/xfollow`,
          method: 'POST',
          body: xfollow,
        }),
        invalidatesTags: [{ type: 'Follower', id: 'LIST' }],
      }),
      myFollowers: builder.query<string[], string>({
        query: (followingId) => `/users/follows/to/${followingId}`,
        providesTags: [{ type: 'Following', id: 'LIST' }],
      }),
      whoIFollow: builder.query<string[], string>({
        query: (followerId) => `/users/follows/for/${followerId}`,
        providesTags: [{ type: 'Follower', id: 'LIST' }],
      }),
    };
  },
});

export const {
  useWhoIFollowQuery,
  useXFollowMutation,
  useGetArticleQuery,
  useMyFollowersQuery,
  useGetBookmarkQuery,
  useLikeDislikeMutation,
  useSearchArticlesQuery,
  useRetrieveArticleQuery,
  useCreateArticleMutation,
  useAddNewCommentMutation,
  useCountPostViewMutation,
  useGetSavedBookmarkQuery,
  useCreateBookmarkMutation,
  useGetUserProfileByIdQuery,
  useUpdateUserProfileMutation,
  useGetLikedArticleByUserQuery,
  // useGetCommentsByPostIdQuery,
  useRetrieveArticleByAuthorQuery,
} = apiSlice;
