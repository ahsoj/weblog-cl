'use client';

import React, { useEffect, useState } from 'react';
import Auth from '@/lib/sdk/Authentication';
import Image from 'next/image';
import {
  useGetUserProfileByIdQuery,
  useRetrieveArticleByAuthorQuery,
} from '@/utils/redux/ApiSlice';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { Metadata } from 'next';
import { CurrentCount, RcTabsProps, UserInfo } from '@/types/interface';
import { RcTabs } from '@/components/rc-components/tabs';
import ISOConvertor from '@/utils/iso_convertor';
import { User } from '@/types/types';
import { RootState } from '@/utils/redux/store';
import { useAppDispatch, useTypedSelector } from '@/utils/redux/hooks';
import {
  setFollowerCount,
  setFollowingCount,
} from '@/utils/redux/OnProfileSlice';

const spin = (
  <svg
    aria-hidden="true"
    className="inline w-4 h-4 text-gray-200 animate-spin fill-blue-600"
    viewBox="0 0 100 101"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
      fill="currentColor"
    />
    <path
      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
      fill="currentFill"
    />
  </svg>
);

type FollowsProps = {
  userProfile?: User;
};

type ArticleProps = {
  user: UserInfo | null;
  id: string;
};

const OnPArticles: React.FC<ArticleProps> = ({ user, id }) => {
  const { data: articleByAuthor } = useRetrieveArticleByAuthorQuery(
    id ?? skipToken
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setFollowingCount(articleByAuthor?.length ?? 0));
  }, []);
  return (
    <div className="divide-y space-y-4">
      {articleByAuthor?.map((article, idx) => (
        <div key={idx} className="group/authorArticle py-2">
          <div className="flex gap-2 items-center">
            <span className="text-[12px]">
              {ISOConvertor(article?.createdAt as unknown as string)}
            </span>
            {article.authorId === String(user?.userId) && (
              <>
                <button className="border border-blue-300 bg-blue-100 text-blue-600 rounded-sm text-[10px] px-1">
                  update
                </button>
                <button className="border border-red-300 bg-red-100 text-red-600 rounded-sm text-[10px] px-1">
                  Delete
                </button>
              </>
            )}
          </div>
          <a
            href={`/${article.slug}`}
            className="group-hover/authorArticle:text-indigo-500 text-base font-semibold hover:underline"
          >
            {article.title}
          </a>
        </div>
      ))}
    </div>
  );
};

const OnPFollowers: React.FC<FollowsProps> = ({ userProfile }) => {
  return (
    <div className="flex flex-col space-y-6">
      {userProfile?.followers.map((follower, idx) => (
        <div className="flex justify-between items-center" key={idx}>
          <div className="items-center flex gap-2">
            {follower.profileUrl ? (
              <Image
                width={80}
                height={80}
                className="rounded-full my-0"
                src={follower.profileUrl}
                alt=""
              />
            ) : (
              <span className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-600">
                <span className="text-lg font-medium uppercase text-white leading-none">
                  {/* {follower.username[0]} */}Q
                </span>
              </span>
            )}
            <h3>{follower.username}</h3>
          </div>
          <button>Follow</button>
        </div>
      ))}
    </div>
  );
};

const OnPFollowings: React.FC<FollowsProps> = ({ userProfile }) => {
  return <h1>{JSON.stringify(userProfile?.followings)}</h1>;
};

const ProfilePageView = ({ params }: { params: { id: string } }) => {
  const [activeTabKey, setActiveTabKey] = useState<number>(1);
  const user = Auth.getUser();
  // const Current_Count = {
  //   articles: 0,
  //   followings: 0,
  //   followers: 0,
  // };

  const { data: userProfile } = useGetUserProfileByIdQuery(
    params.id ?? skipToken
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userProfile && (userProfile.followings || userProfile.followers)) {
      dispatch(setFollowingCount(userProfile.followings?.length ?? 0));
      dispatch(setFollowerCount(userProfile.followers?.length ?? 0));
    }
  }, []);

  console.log(userProfile);

  const currentCount = useTypedSelector(
    (state: RootState) => state.onProfileSlice
  );

  const Articles = <OnPArticles user={user} id={params.id} />;
  const Followings = <OnPFollowings userProfile={userProfile} />;
  const Followers = <OnPFollowers userProfile={userProfile} />;

  const items: RcTabsProps['items'] = [
    {
      key: 1,
      label: `Articles ${userProfile?._count?.post ?? '•'}`,
      path: 'articles',
      children: Articles,
    },
    {
      key: 2,
      label: `Followings ${userProfile?._count?.following ?? '•'}`,
      path: 'followings',
      children: Followings,
    },
    {
      key: 3,
      label: `Followers ${userProfile?._count?.followers ?? '•'}`,
      path: 'followers',
      children: Followers,
    },
  ];

  const handleActiveTab = (activeKey: number) => {
    setActiveTabKey(activeKey);
  };

  return (
    <div className="my-6 max-w-2xl min-h-screen mx-auto justify-center items-center relative isolate before:absolute before:inset-x-0 before:h-12 before:bg-sky-950 before:-z-10">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            {userProfile?.profileUrl ? (
              <Image
                width={96}
                height={96}
                className="rounded-full border-2 border-white"
                src={userProfile?.profileUrl}
                alt="Image Description"
              />
            ) : (
              <span className="inline-flex border-2 border-white items-center justify-center h-24 w-24 rounded-full bg-gray-600">
                <span className="text-base font-medium uppercase text-white leading-none">
                  {'A'}
                </span>
              </span>
            )}
            <h3 className="font-bold text-xl">Joshua</h3>
          </div>
          <div className="flex items-center gap-4">
            {userProfile?.id === String(user?.userId) ? (
              <button className="text-white rounded-md bg-indigo-500 border-0 px-4 py-1 mt-1">
                Update
              </button>
            ) : (
              <button className="text-white rounded-md bg-indigo-500 border-0 px-4 py-1 mt-1">
                Follow
              </button>
            )}
          </div>
        </div>
        <p className="text-center">{userProfile?.bio ?? 'No Bio'}</p>
        <RcTabs
          activeKey={activeTabKey}
          items={items}
          handleActiveTabKey={handleActiveTab}
        />
      </div>
    </div>
  );
};

export default ProfilePageView;
