'use client';

import { Provider } from 'react-redux';
import { store } from '@/utils/redux/store';
import Navigation from '@/components/navigation';
import { UserInfo } from '@/types/interface';
import { useState, useEffect } from 'react';
import Auth from '@/lib/sdk/Authentication';
import Link from 'next/link';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sessionData, setSessionData] = useState<UserInfo | null>(null);
  const [sessionLoad, setSessionLoad] = useState<boolean>(true);
  useEffect(() => {
    // setSessionLoad(true);
    const user = Auth.getUser();
    setSessionData(user);
    setSessionLoad(false);
  }, []);
  return (
    <Provider store={store}>
      <html lang="en">
        <head>
          <title>Weblog | Home</title>
        </head>
        <body>
          {sessionLoad ? (
            <PlaceHolder />
          ) : (
            <Navigation>
              {sessionData ? (
                <Authenticated sessionData={sessionData} />
              ) : (
                <Unauthenticated />
              )}
            </Navigation>
          )}
          {children}
        </body>
      </html>
    </Provider>
  );
}

const WriteIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-label="Write"
  >
    <path
      d="M14 4a.5.5 0 0 0 0-1v1zm7 6a.5.5 0 0 0-1 0h1zm-7-7H4v1h10V3zM3 4v16h1V4H3zm1 17h16v-1H4v1zm17-1V10h-1v10h1zm-1 1a1 1 0 0 0 1-1h-1v1zM3 20a1 1 0 0 0 1 1v-1H3zM4 3a1 1 0 0 0-1 1h1V3z"
      fill="currentColor"
    ></path>
    <path
      d="M17.5 4.5l-8.46 8.46a.25.25 0 0 0-.06.1l-.82 2.47c-.07.2.12.38.31.31l2.47-.82a.25.25 0 0 0 .1-.06L19.5 6.5m-2-2l2.32-2.32c.1-.1.26-.1.36 0l1.64 1.64c.1.1.1.26 0 .36L19.5 6.5m-2-2l2 2"
      stroke="currentColor"
    ></path>
  </svg>
);

const NotifyIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-label="Notifications"
  >
    <path
      d="M15 18.5a3 3 0 1 1-6 0"
      stroke="currentColor"
      stroke-linecap="round"
    ></path>
    <path
      d="M5.5 10.53V9a6.5 6.5 0 0 1 13 0v1.53c0 1.42.56 2.78 1.57 3.79l.03.03c.26.26.4.6.4.97v2.93c0 .14-.11.25-.25.25H3.75a.25.25 0 0 1-.25-.25v-2.93c0-.37.14-.71.4-.97l.03-.03c1-1 1.57-2.37 1.57-3.79z"
      stroke="currentColor"
      stroke-linejoin="round"
    ></path>
  </svg>
);

const Unauthenticated = () => {
  return (
    <div className="flex">
      <Link
        href="/signin"
        className="px-4 py-2 rounded-md text-indigo-600 bg-white whitespace-nowrap font-bold border border-indigo-500"
      >
        Sign In
      </Link>
    </div>
  );
};

const PlaceHolder = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex justify-between items-center gap-4  px-4 py-2 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-12 h-8 rounded-md bg-zinc-300" />
          <div className="w-32 h-8 rounded-md bg-zinc-300" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-8 rounded-md bg-zinc-300" />
          <div className="w-8 h-8 rounded-full bg-zinc-300" />
          <div className="w-8 h-8 rounded-full bg-zinc-300" />
        </div>
      </div>
    </div>
  );
};

const Authenticated = ({ sessionData }: { sessionData: UserInfo | null }) => {
  const profileTab = [
    {
      path: `u/${sessionData?.userId}`,
      label: 'Profile',
    },
    {
      path: 'saved-for',
      label: 'Saved',
    },
    {
      path: 'new-article',
      label: 'write',
    },
    {
      path: '',
      label: 'Settings',
    },
  ];
  console.log(sessionData);
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/new-article"
        className="p-2 flex items-center rounded-md text-zinc-700 hover:text-indigo-600 whitespace-nowrap font-semibold"
      >
        {WriteIcon}
        Write
      </Link>
      <button>{NotifyIcon}</button>
      <button className=" dark:bg-gray-600"></button>
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? '' : 'text-opacity-90'}
                group relative inline-flex items-center outline-none border-0 justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full`}
            >
              <span className="font-medium text-gray-600">LJ</span>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-50 right-0 mt-3 w-60 max-w-md">
                <div className="bg-white divide-y divide-gray-100 overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-3 text-sm text-gray-900">
                    <div>{sessionData?.username}</div>
                    <div className="font-medium truncate">
                      {sessionData?.email}
                    </div>
                  </div>
                  <ul
                    className="py-2 text-sm text-gray-700"
                    aria-labelledby="avatarButton"
                  >
                    {profileTab.map((tab, idx) => (
                      <li key={idx}>
                        <a
                          href={`/${tab.path}`}
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          {tab.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <div className="py-1">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </a>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};