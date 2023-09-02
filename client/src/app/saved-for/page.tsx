'use client';
import React from 'react';
import Auth from '@/lib/sdk/Authentication';
import ISOConvertor from '@/utils/iso_convertor';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetSavedBookmarkQuery } from '@/utils/redux/ApiSlice';

const SavedArticle = () => {
  const user = Auth.getUser();
  const { data: bookmarks, isLoading } = useGetSavedBookmarkQuery(
    (user?.userId as unknown as string) ?? skipToken
  );
  if (isLoading) return <h1>Loading ...</h1>;
  console.log(bookmarks);
  return (
    <div className="flex items-center justify-center max-w-xl mx-auto">
      <div className="divide-y space-y-4">
        {!bookmarks ? (
          <h2>ono saved articles</h2>
        ) : (
          bookmarks.map((bookmark: any, idx: any) => (
            <div key={idx} className="group/authorArticle py-2">
              <a
                href={`/${bookmark.post.slug}`}
                className="group-hover/authorArticle:text-indigo-500 text-lg font-semibold hover:underline"
              >
                {bookmark.post.title}
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedArticle;
