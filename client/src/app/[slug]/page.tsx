'use client';
import {
  useXFollowMutation,
  useWhoIFollowQuery,
  useGetBookmarkQuery,
  useLikeDislikeMutation,
  useRetrieveArticleQuery,
  useCountPostViewMutation,
  useCreateBookmarkMutation,
  useGetLikedArticleByUserQuery,
  useRetrieveArticleByAuthorQuery,
} from '@/utils/redux/ApiSlice';
import Link from 'next/link';
import axios from '@/lib/sdk/axios';
import Renderer from '@/components/editor/renderer';
import Image from 'next/image';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import CommentEditor, {
  CommentPreview,
} from '@/components/comment_editor/editor';
import { useRouter } from 'next/navigation';
import Auth from '@/lib/sdk/Authentication';
import { useEffect } from 'react';
import { MdBookmarkAdded } from 'react-icons/md';
import { GoCommentDiscussion } from 'react-icons/go';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { BsPersonCheck, BsPersonAdd } from 'react-icons/bs';
import { twmesh } from '@/utils/twmesh';
import { enqueueSnackbar } from 'notistack';
import { notsigninToast } from '@/components/editor/renderer';

const AddBookmark = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
      fill="#000"
    />
  </svg>
);

export default function Article({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const slug = params.slug.split('%26')[0] ?? params.slug;
  const {
    data: article,
    isLoading: isGetLoading,
    isSuccess: isGetSuccess,
  } = useRetrieveArticleQuery(slug);

  const [xfollows] = useXFollowMutation();

  const {
    data: thisAuthor,
    isLoading: isByAuthorLoading,
    isSuccess: isByAuthorSuccess,
  } = useRetrieveArticleByAuthorQuery(article?.authorId ?? skipToken);

  const user = Auth.getUser();

  const { data: saved, isLoading: isSavedLoading } = useGetBookmarkQuery(
    (article?.authorId as unknown as string) ?? skipToken
  );
  const { data: liked, isLoading: islikedLoading } =
    useGetLikedArticleByUserQuery(
      (article?.authorId as unknown as string) ?? skipToken
    );

  const [likeDislike, response] = useLikeDislikeMutation();

  const [createBookmark] = useCreateBookmarkMutation();

  const [countView] = useCountPostViewMutation();

  const { data: ifollowed } = useWhoIFollowQuery(
    String(user?.userId) ?? skipToken
  );

  if (isGetSuccess && params.slug.split('%26')[1]) {
    router.push(`#${params.slug.split('%26')[1]}`);
  }

  useEffect(() => {
    if (user && article) {
      countView({ postId: article.id, userId: String(user.userId) });
    }
  }, []);

  const handleLikeDislike = (postId?: string) => {
    if (user && postId) {
      const userId = String(user.userId);
      likeDislike({ postId, userId });
      console.log(response);
    }
  };

  const cred = {
    postId: article?.id as string,
    userId: user?.userId as unknown as string,
  };

  if (isGetLoading) {
    return (
      <div className="w-full max-w-lg mx-auto animate-pulse p-9">
        <div className="h-10 w-full bg-gray-300 rounded-lg" />
        <div className="flex flex-col gap-4 mt-8">
          <h1 className="h-2 bg-gray-300 rounded-lg w-4/5" />
          <p className="w-48 h-2 bg-gray-200 rounded-lg" />
          <p className="w-full h-2 bg-gray-200 rounded-lg" />
          <p className="w-full h-2 bg-gray-200 rounded-lg" />
          <p className="w-full h-2 bg-gray-200 rounded-lg" />
          <p className="w-full h-2 bg-gray-200 rounded-lg" />
          <p className="w-4/5 h-2 bg-gray-200 rounded-lg" />
          <p className="w-64 h-2 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[78rem] bg-white px-4 mx-auto">
      <div className="flex flex-col gap-4 xl:flex-row justify-center">
        <div className="py-8 lg:pr-4 md:pr-8">
          {!isGetLoading ? (
            isGetSuccess && (
              <Renderer
                title={article.title}
                imageUrl={article.imageUrl}
                raw={article.content}
                ifollowed={ifollowed}
                article={article}
                xfollows={xfollows}
                user={user}
              />
            )
          ) : (
            <h1>Loading ...</h1>
          )}
          <div className="mx-auto justify-center max-w-[52rem]">
            <div className="flex justify-end items-center gap-x-1.5">
              <div className="flex gap-4 items-center">
                <button
                  onClick={() => handleLikeDislike(article?.id)}
                  className="py-2 px-3 inline-flex justify-center items-center gap-x-1.5 sm:gap-x-2 rounded-md font-medium bg-white text-gray-700 align-middle hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-300 transition-all text-sm"
                >
                  {liked?.includes(String(article?.id)) ? (
                    <AiFillLike fontSize={20} />
                  ) : (
                    <AiOutlineLike fontSize={20} />
                  )}
                  <code>
                    {liked?.filter((like) => like === article?.id).length ??
                      '--'}
                  </code>{' '}
                  Likes
                </button>
                <div className="block h-3 border-r border-gray-300 mx-1.5 " />
                <button
                  onClick={() => {
                    if (!user) {
                      enqueueSnackbar(
                        'You must have an account to follow this user!',
                        {
                          action: notsigninToast,
                          variant: 'warning',
                        }
                      );
                    }
                    createBookmark({
                      userId: String(user?.userId),
                      postId: String(article?.id),
                    });
                  }}
                  className="p-2 inline-flex justify-center items-center gap-x-1.5 sm:gap-x-2 rounded-md font-medium bg-white text-gray-700 align-middle hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-300 transition-all text-sm "
                >
                  {isSavedLoading ? (
                    <div
                      className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
                      role="status"
                      aria-label="loading"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : saved?.includes(String(article?.id)) ? (
                    <MdBookmarkAdded fontSize={20} />
                  ) : (
                    <>{AddBookmark}</>
                  )}
                </button>
              </div>
              <div className="block h-3 border-r border-gray-300 mx-1.5 " />

              <div className="hs-dropdown relative inline-flex">
                <button
                  type="button"
                  id="blog-article-share-dropdown"
                  className="peer py-2 px-3 inline-flex justify-center items-center gap-x-1.5 sm:gap-x-2 rounded-md font-medium bg-white text-gray-700 align-middle hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-300 transition-all text-sm "
                >
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1h-2z"
                    />
                    <path
                      fillRule="evenodd"
                      d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708l3-3z"
                    />
                  </svg>
                  Share
                </button>
                <div
                  className="w-48 absolute -mt-[12rem] -ml-24 border border-slate-200 transition-[opacity,margin] duration  opacity-0 hidden mb-1 z-10 bg-white shadow-sm rounded-xl p-2 peer-focus:block peer-focus:opacity-100"
                  aria-labelledby="blog-article-share-dropdown"
                >
                  <a
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 "
                    href="#"
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                      <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                    </svg>
                    Copy link
                  </a>
                  <div className="border-t border-gray-200 my-2 "></div>
                  <a
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 "
                    href="#"
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                    </svg>
                    Share on Twitter
                  </a>
                  <a
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 "
                    href="#"
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                    </svg>
                    Share on Facebook
                  </a>
                  <a
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 "
                    href="#"
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                    </svg>
                    Share on LinkedIn
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-4 px-4">
              <h3 className="text-xl font-black">
                <code>({article?.comment?.length ?? '--'})</code> Comments
              </h3>
            </div>
            <div className="px-4 pb-6">
              <CommentEditor cred={cred} />
              {article?.comment?.map((comment: any, idx: number) => (
                <CommentPreview comment={comment} key={idx} />
              ))}
            </div>
          </div>
        </div>

        <div className="py-8 xl:max-w-[24rem] max-w-[55rem] mx-auto justify-center">
          <div className="group flex items-center gap-x-8 bg-white rounded-md p-4">
            <div className="flex items-center gap-2">
              <a className="block flex-shrink-0" href="#">
                <Image
                  width={40}
                  height={40}
                  className="rounded-full"
                  src="/user_profile.png"
                  alt="Image Description"
                />
              </a>

              <a className="group grow block" href={`/${article?.authorId}`}>
                <h5 className="group-hover:text-gray-600 text-base hover:underline font-oswald font-semibold text-gray-800 ">
                  {article?.author?.username
                    ? article?.author.username
                    : article?.author?.email.split('@')[0]}
                </h5>
                <p className="text-sm text-gray-500">UI/UX enthusiast</p>
              </a>
            </div>

            <div className="grow">
              <div className="flex justify-end">
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
                    ifollowed?.includes(article?.authorId ?? '') &&
                      'bg-gray-600'
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

          <div className="space-y-6 mt-4 bg-white p-4">
            <h3 className="text-base">
              Popular articles from:{' '}
              <strong className="capitalize font-oswald">
                {article?.author?.username
                  ? article?.author.username
                  : article?.author?.email.split('@')[0]}
              </strong>
            </h3>
            {isByAuthorLoading ? (
              <h1>Loading ...</h1>
            ) : (
              isByAuthorSuccess &&
              thisAuthor
                ?.filter((art) => art.slug !== article?.slug)
                .map((data, idx) => (
                  <a
                    key={idx}
                    className="group flex items-center gap-x-6"
                    href={`/${data?.slug}`}
                  >
                    <div className="grow">
                      <span className="text-base font-antonio font-bold text-gray-800 group-hover:text-blue-600 group-hover:underline">
                        {data?.title.length > 100
                          ? `${data?.title.slice(100)}...`
                          : data?.title}
                      </span>
                    </div>
                    <div className="flex-shrink-0 relative rounded-lg overflow-hidden w-20 h-20">
                      <img
                        className="w-full h-full absolute top-0 left-0 object-cover rounded-lg"
                        src="https://images.unsplash.com/photo-1567016526105-22da7c13161a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                        alt="Image Description"
                      />
                    </div>
                  </a>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
