'use client';

import Image from 'next/image';
import { GoCommentDiscussion } from 'react-icons/go';
import { AiOutlineLike } from 'react-icons/ai';
import {
  useGetArticleQuery,
  useLikeDislikeMutation,
  useGetBookmarkQuery,
  useWhoIFollowQuery,
  useXFollowMutation,
  useCreateBookmarkMutation,
} from '@/utils/redux/ApiSlice';
import { notsigninToast } from '@/components/editor/renderer';
import { Article, Author, User } from '@/types/types';
import ISOConvertor from '@/utils/iso_convertor';
import { calculateReadingTime } from '@/utils/readTime';
import { usePathname, useRouter } from 'next/navigation';
import { SlOptions } from 'react-icons/sl';
import Modal from '@/components/modal';
import { useState } from 'react';
import { UserInfo } from '@/types/interface';
import { twmesh } from '@/utils/twmesh';
import { BsPersonCheck, BsPersonAdd } from 'react-icons/bs';
import { enqueueSnackbar } from 'notistack';
import Auth from '@/lib/sdk/Authentication';
import { MdBookmarkAdded } from 'react-icons/md';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';

const author = {
  authorId: '12',
  name: 'author',
  email: 'jo@gmail.com',
  profileUrl: '',
};

const user = Auth.getUser();

const nearnav = [
  {
    name: 'popular',
    path: '/popular',
  },
  {
    name: 'latest',
    path: '/latest',
  },
  {
    name: 'news',
    path: '/news',
  },
];

if (user) {
  nearnav.unshift(
    {
      name: 'foryou',
      path: '/foryou',
    },
    {
      name: 'following',
      path: '/following',
    }
  );
}

export const LeftBar = (user: any) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-center gap-8">
      <div className="flex flex-col border-l border-gray-200 mt-6 space-y-1">
        {nearnav.map((data, idx) => (
          <a
            href={`${data.path.toLowerCase()}`}
            type="button"
            key={idx}
            className={twmesh(
              'capitalize py-1 pr-4 inline-flex items-center text-base whitespace-nowrap pl-2 hover:border-l-2 active:border-l-2 border-blue-600 text-gray-500 hover:pl-[6px] hover:text-blue-600',
              pathname === data.path &&
                'border-l-2 text-blue-600 px-[6px] text-semibold'
            )}
            id="vertical-tab-with-border-item-1"
            aria-controls="vertical-tab-with-border-1"
            role="tab"
          >
            {data.name}
          </a>
        ))}
      </div>
      <div className="flex flex-col space-y-2 py-4">
        <span className="font-semibold">My Tags</span>
        {[
          'Ux Design',
          'Ui Ux Design',
          'UI Design',
          'webdev',
          'code',
          'typescript',
        ].map((tag, idx) => (
          <button
            type="button"
            key={idx}
            className="capitalize inline-flex items-center gap-2 text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 before:content-['#'] before:text-base"
            id="vertical-tab-with-border-item-1"
            data-hs-tab="#vertical-tab-with-border-1"
            aria-controls="vertical-tab-with-border-1"
            role="tab"
          >
            {tag}
          </button>
        ))}
        <button className="text-indigo-600 font-bold hover:underline text-base">
          customize
        </button>
      </div>
    </div>
  );
};

const AddBookmark = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
      fill="#000"
    />
  </svg>
);

export default function Foryou() {
  const router = useRouter();
  const [savedModalOpen, setSavedModalOpen] = useState();
  const {
    data: articles,
    isLoading: isGetLoading,
    isSuccess,
  } = useGetArticleQuery();

  const user = Auth.getUser();

  const closeSavedModal = () => {};

  return (
    <div className="flex gap-4 items-start mx-auto justify-center max-w-[75rem] px-1 py-4">
      <div className="items-center gap-4 sticky top-6 hidden md:block">
        <LeftBar user={user} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 divide-y">
          {isGetLoading
            ? [1, 2].map((_, idx) => (
                <div
                  key={idx}
                  className="w-[70vw] md:w-[50vw] rounded-lg animate-pulse"
                >
                  <div className="flex items-center justify-center h-32 w-full mb-4 bg-gray-300">
                    <svg
                      className="w-10 h-10 text-gray-200"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 16 20"
                    >
                      <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                      <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                    </svg>
                  </div>
                  <div className="px-4 flex items-center my-4 space-x-3">
                    <svg
                      className="w-10 h-10 text-gray-200 dark:text-gray-700"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                    </svg>
                    <div>
                      <div className="h-2.5 bg-gray-200 rounded-full w-32 mb-2"></div>
                      <div className="w-48 h-2 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                  <div className="mx-4 h-2 bg-gray-200 rounded-full mb-2.5"></div>
                  <div className="mx-4 h-2 bg-gray-200 rounded-full mb-2.5"></div>
                  <div className="mx-4 h-2 bg-gray-200 rounded-full mb-2.5"></div>
                  <span className="sr-only">Loading...</span>
                </div>
              ))
            : articles?.map((article: Article, idx: number) => {
                const [_, values] = Object.entries(article.content);
                const content_text = values
                  ? values[1][0]['content'][0]['text']
                  : ' ';
                return (
                  <div key={idx} className="group/article pt-4 max-w-2xl">
                    <div className="flex flex-col gap-2 pb-2">
                      {article.imageUrl && (
                        <img
                          src={article.imageUrl}
                          className="w-full h-64 group-hover/article:opacity-90 rounded-t-lg rounded-tr-lg object-cover"
                          alt=""
                        />
                      )}
                      <div className="flex gap-2 pt-4 px-4">
                        {article.author?.profileUrl ? (
                          <Image
                            width={48}
                            height={48}
                            className="rounded-full"
                            src={article.author?.profileUrl}
                            alt="Image Description"
                          />
                        ) : (
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-600">
                            <span className="text-base font-medium uppercase text-white leading-none">
                              {article?.author?.username[0]}
                            </span>
                          </span>
                        )}
                        <div className="flex justify-between items-center grow">
                          <div className="relative flex items-center gap-4">
                            <div className="group/profile-tooltip">
                              <h2 className="text-lg hover:underline">
                                {article?.author?.username}
                              </h2>
                              <ToolTip article={article} user={user} />
                            </div>
                            <ul className="text-xs text-gray-500">
                              <li className="inline-block relative pr-6 last:pr-0 last-of-type:before:hidden before:absolute before:top-1/2 before:right-2 before:-translate-y-1/2 before:w-1 before:h-1 before:bg-gray-600 before:rounded-full">
                                {ISOConvertor(
                                  article?.createdAt as unknown as string
                                )}
                              </li>
                              <li className="inline-block relative pr-6 last:pr-0 last-of-type:before:hidden before:absolute before:top-1/2 before:right-2 before:-translate-y-1/2 before:w-1 before:h-1 before:bg-gray-600 before:rounded-full">
                                {calculateReadingTime(
                                  article?.content,
                                  article.title
                                )}{' '}
                                min read
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 pb-2">
                        <div className="px-4">
                          <a
                            href={`/${article.slug}`}
                            className="text-xl group-hover/article:text-indigo-600 hover:underline font-oswald font-bold"
                          >
                            {article.title}
                          </a>
                          <p className="text-base font-normal group-hover/article:text-zinc-600">
                            {content_text}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4 items-center">
                            <span className="py-2 px-3 inline-flex justify-center items-center gap-x-1.5 sm:gap-x-2 rounded-md font-light bg-white text-gray-500 align-middle transition-all text-sm ">
                              <AiOutlineLike fontSize={20} />
                              <code>{article._count.like ?? '--'}</code> Likes
                            </span>
                            <a
                              href={`/${article?.slug}&comment-view-section`}
                              className="py-2 px-3 inline-flex justify-center items-center gap-x-1.5 sm:gap-x-2 rounded-md font-light bg-white text-gray-500 align-middle hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-300 transition-all text-sm "
                            >
                              <GoCommentDiscussion fontSize={20} />
                              <code>{article._count.comment ?? '--'}</code>{' '}
                              Comments
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <SavedBookmark article={article} user={user} />
                            {/* <Modal open={false} closeModal={closeSavedModal} /> */}
                            <button className="p-2 inline-flex justify-center items-center gap-x-1.5 sm:gap-x-2 rounded-md font-light bg-white text-gray-500 align-middle hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-300 transition-all text-sm ">
                              <SlOptions fontSize={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
      <Sponsored />
    </div>
  );
}

const SavedBookmark = ({
  article,
  user,
}: {
  article: Article;
  user: UserInfo | null;
}) => {
  const { data: saved, isLoading: isSavedLoading } = useGetBookmarkQuery(
    (article?.authorId as unknown as string) ?? skipToken
  );
  const [createBookmark] = useCreateBookmarkMutation();
  return (
    <button
      onClick={() => {
        if (!user) {
          enqueueSnackbar('You must have an account to follow this user!', {
            action: notsigninToast,
            variant: 'warning',
          });
        }
        createBookmark({
          userId: String(user?.userId),
          postId: String(article?.id),
        });
      }}
      className="p-2 inline-flex justify-center items-center gap-x-1.5 sm:gap-x-2 rounded-md font-medium bg-white text-gray-700 align-middle hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-300 transition-all text-sm "
    >
      <code>{article._count.saved ?? '--'}</code>{' '}
      {saved?.includes(String(article?.id)) ? (
        <MdBookmarkAdded fontSize={20} />
      ) : (
        <>{AddBookmark}</>
      )}
    </button>
  );
};

const Sponsored = () => {
  return (
    <div className="sticky top-4 min-w-[14rem] hidden md:block">
      <h2 className="font-oswald opacity-80 font-bold pb-4 text-xl text-gray-600">
        Sponsored
      </h2>
      <div className="flex flex-col w-full gap-2 items-center">
        <a
          className="group/sponsor w-full grow flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition"
          href="#"
        >
          <div className="">
            <img
              src="/demo_poster.png"
              className="w-full h-28 rounded-t-lg rounded-tr-lg object-cover"
              alt=""
            />
            <div className="flex justify-between items-center p-4">
              <div>
                <h3 className="group-hover/sponsor:text-blue-600 hover:underline font-semibold text-gray-800">
                  Management
                </h3>
                <p className="text-sm text-gray-500">4 job positions</p>
              </div>
              <div className="pl-3">
                <svg
                  className="w-3.5 h-3.5 text-gray-500"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

const ToolTip = ({
  user,
  article,
}: {
  author?: Author;
  user: UserInfo | null;
  article: Article;
}) => {
  const [xfollows] = useXFollowMutation();
  const { data: ifollowed } = useWhoIFollowQuery(
    String(user?.userId) ?? skipToken
  );
  return (
    <div
      className="absolute left-0 w-96 border border-slate-200 group-hover/profile-tooltip:opacity-100 group-hover/profile-tooltip:visible opacity-0 transition-opacity inline-block invisible z-10 max-w-xs cursor-default bg-white divide-y divide-gray-100 shadow-lg rounded-xl "
      role="tooltip"
    >
      <div className="p-4 sm:p-5">
        <div className="mb-2 flex w-full sm:items-center gap-x-5 sm:gap-x-3">
          <div className="flex-shrink-0">
            {article.author?.profileUrl ? (
              <Image
                width={48}
                height={48}
                className="rounded-full"
                src={article.author?.profileUrl}
                alt="Image Description"
              />
            ) : (
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-600">
                <span className="text-base font-medium uppercase text-white leading-none">
                  {article?.author?.username[0]}
                </span>
              </span>
            )}
          </div>

          <div className="grow">
            <p className="text-lg capitalize font-semibold text-gray-500">
              {article.author?.username}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Leyla is a Customer Success Specialist at Preline and spends her time.
        </p>
      </div>

      <div className="flex justify-between items-center px-4 py-3 sm:px-5">
        <ul className="text-xs flex flex-col space-y-1">
          <li className="inline-block">
            <span className="font-semibold text-gray-500">56</span>
            <span className="text-gray-600"> articles</span>
          </li>
          <li className="inline-block">
            <span className="font-semibold text-gray-500">1k+</span>
            <span className="text-gray-600"> followers</span>
          </li>
        </ul>
        <div>
          <button
            type="button"
            disabled={String(user?.userId) === article?.authorId}
            onClick={() => {
              if (!user) {
                enqueueSnackbar(
                  'You must have an account to follow this user!',
                  {
                    action: notsigninToast,
                    variant: 'warning',
                  }
                );
              } else if (String(user.userId) !== article?.authorId) {
                xfollows({
                  fedId: String(user?.userId),
                  fingId: String(article?.authorId),
                });
              }
            }}
            className={twmesh(
              'py-1.5 px-2.5 inline-flex justify-center items-center gap-x-1.5 rounded-md font-semibold bg-[#00a761] text-white outline-none text-base disabled:bg-gray-400 disabled:cursor-not-allowed',
              ifollowed?.includes(article?.authorId ?? '') && 'bg-gray-600'
            )}
          >
            {ifollowed?.includes(article?.authorId ?? '') ? (
              <>
                <BsPersonCheck fontSize={25} /> Following
              </>
            ) : (
              <>
                <BsPersonAdd fontSize={25} /> Follow
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
